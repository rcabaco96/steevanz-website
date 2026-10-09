// Google Maps in one tab: open a place, its reviews tab sorted by newest, and read Maps' own review
// responses page by page. Pages can only be fetched by letting Maps load them (each request carries
// a one-time key signed by Maps), so the reader scrolls the list and reads the network responses.
import { GoogleLimitError, log, pageTimeoutMs, sleep } from "./config.mjs";
import { parseDistribution, parseMapsReviewPage, parsePlaceProfile, parseSearchResult, reviewRequestSort } from "../../src/lib/reviews/maps-reader.ts";

/** Opening attempts before giving up on Google's "limited view" (first try + 3 reloads). */
const openAttempts = 4;

export class LimitedViewError extends GoogleLimitError {}

/**
 * Google asks to sign in before sorting or loading more reviews (seen on browser profiles that are
 * not signed in, after a few reads). The reader never tries to get around it: someone signs in once
 * in the reader's browser window.
 */
export class SignInRequiredError extends GoogleLimitError {
  constructor() {
    super("O Google pediu para iniciar sessão para mostrar mais reviews. Abra a janela do navegador do leitor, inicie sessão numa conta Google e tente outra vez.");
  }
}

const signInGateScript = `[...document.querySelectorAll("[role=dialog], [aria-modal=true]")].some((el) => el.offsetParent && /Inicie sessão|Iniciar sessão|Sign in/i.test(el.textContent))`;

async function waitFor(tab, expression, timeoutMs) {
  for (let waited = 0; waited < timeoutMs; waited += 150) {
    if (await tab.evaluate(expression)) return true;
    await sleep(150);
  }
  return false;
}

/** Collects the tab's review responses (in arrival order) with the sort order each was asked in. */
function watchReviewResponses(tab) {
  const sortOf = new Map();
  const watch = { newestRequested: false, signInRequired: false, responses: [], placeRequests: new Set(), placeResponses: [] };
  tab.listeners.add((msg) => {
    // The place's own data (photos, profile fields), loaded by Maps with the page.
    if (msg.method === "Network.requestWillBeSent" && msg.params.request.url.includes("/maps/preview/place")) watch.placeRequests.add(msg.params.requestId);
    if (msg.method === "Network.loadingFinished" && watch.placeRequests.has(msg.params.requestId)) watch.placeResponses.push(msg.params.requestId);
    if (msg.method === "Network.requestWillBeSent" && /rpcids=qv9Egd/.test(msg.params.request.url)) {
      const sort = reviewRequestSort(msg.params.request.postData);
      sortOf.set(msg.params.requestId, sort);
      if (sort === "newest") watch.newestRequested = true;
    }
    if (msg.method === "Network.loadingFinished" && sortOf.has(msg.params.requestId)) {
      watch.responses.push({ requestId: msg.params.requestId, sort: sortOf.get(msg.params.requestId) });
    }
  });
  return watch;
}

/** The place's name in its page header (the first non-empty h1). */
const placeTitleScript = `[...document.querySelectorAll('h1')].map((el) => el.textContent.replace(/\\s+/g, ' ').trim()).find(Boolean) || null`;

const shownRatingScript = `(() => {
  const labels = [...document.querySelectorAll('[role=img][aria-label]')].filter((el) => el.tagName !== 'TR').map((el) => el.getAttribute('aria-label'));
  const label = labels.map((t) => t.match(/^\\s*([1-5],\\d)\\s+estrelas?/)).find(Boolean);
  if (label) return Number(label[1].replace(',', '.'));
  const big = [...document.querySelectorAll('.fontDisplayLarge')].map((el) => el.textContent.trim()).find((t) => /^[1-5],\\d$/.test(t));
  return big ? Number(big.replace(',', '.')) : null;
})()`;

const shownTotalScript = `(() => {
  const label = [...document.querySelectorAll('[aria-label]')].map((el) => el.getAttribute('aria-label').trim()).find((t) => /^[\\d\\s.\\u00a0\\u202f]+\\s+críticas?$/i.test(t));
  return label ? Number(label.replace(/[^\\d]/g, '')) : null;
})()`;

/**
 * Opens a place on Google Maps (in Portuguese) and its reviews tab. Google sometimes shows a
 * "limited view" without reviews: the page is reloaded up to 3 times with a growing pause.
 * Returns the response watcher and what the place shows: rating, total and star distribution.
 */
export async function openPlace(tab, url) {
  const watch = watchReviewResponses(tab);
  const separator = url.includes("?") ? "&" : "?";
  let opened = false;
  let title = null;
  for (let attempt = 0; attempt < openAttempts && !opened; attempt++) {
    if (attempt) {
      log(`  vista limitada do Google, a recarregar (${attempt}/${openAttempts - 1})…`);
      await sleep(2000 * attempt + Math.random() * 1000);
    }
    await tab.send("Page.navigate", { url: `${url}${separator}hl=pt-PT` });
    if (!(await waitFor(tab, "!!document.querySelector('h1')", 20000))) continue;
    await tab.evaluate(`[...document.querySelectorAll('button')].find(x => /Aceitar tudo|Accept all/i.test(x.textContent))?.click()`);
    await waitFor(tab, "!!document.querySelector('button[role=tab]')", 5000);
    // The place's own title, as Google shows it (read before the reviews list replaces the header).
    title = (await tab.evaluate(placeTitleScript).catch(() => null)) || title;
    await dismissDialogs(tab);
    opened = await tab.evaluate(
      `(() => { const b = [...document.querySelectorAll('button[role=tab]')].find(x => /Críticas|Reviews|Avalia/i.test(x.textContent)); if (!b) return false; b.click(); return true; })()`,
    );
  }
  if (!opened) {
    // No reviews tab: either Google's limited view, or a place that has no review at all. The place's
    // own data tells them apart (no rating = no review); only the latter is a normal answer.
    const facts = await placeProfile(tab, watch);
    if (facts && facts.rating === null) return { watch, title, rating: null, total: 0, distribution: null, photos: facts.photos, profile: facts.profile, category: facts.category, noReviews: true };
  }
  if (!opened) throw new LimitedViewError(`O Google mostrou a vista limitada, sem reviews, ${openAttempts} vezes seguidas. Tente outra vez daqui a pouco.`);
  // Maps sometimes shows the summary and the topics but only asks for the list once the panel is
  // scrolled (2026-10-09, King Kebab), and one scroll is sometimes not enough (the panel grows while
  // it loads): scroll every 1.5 s, like a visitor would, up to ~18 s. Still no list: Google is limiting.
  const reviewShown = "!!document.querySelector('div[data-review-id]')";
  const nudge = `(() => { let el = [...document.querySelectorAll('button')].find((b) => /^\\s*(Tudo|All)\\s*$/.test(b.textContent)) || document.querySelector('button[role=tab][aria-selected=true]'); while (el && !(el.scrollHeight > el.clientHeight + 50 && getComputedStyle(el).overflowY !== "visible")) el = el.parentElement; if (el) el.scrollTop = el.scrollHeight; })()`;
  let listed = await waitFor(tab, reviewShown, 3000);
  for (let round = 0; !listed && round < 10; round++) {
    await tab.evaluate(nudge);
    listed = await waitFor(tab, reviewShown, 1500);
  }
  if (!listed) throw new GoogleLimitError("As reviews não carregaram no Google Maps. Tente outra vez daqui a pouco.");

  const distribution = parseDistribution((await tab.evaluate(`[...document.querySelectorAll('tr[role=img]')].map(x => x.getAttribute('aria-label') ?? '')`)) ?? []);
  const distributionTotal = distribution ? Object.values(distribution).reduce((sum, count) => sum + count, 0) : null;
  const shownTotal = await tab.evaluate(shownTotalScript);
  // The count Google shows; the bars' sum when it cannot be read (or reads as something else).
  const total = shownTotal && (!distributionTotal || Math.abs(shownTotal - distributionTotal) <= distributionTotal * 0.1) ? shownTotal : distributionTotal;
  const rating = await tab.evaluate(shownRatingScript);
  const facts = await placeProfile(tab, watch);
  return { watch, title, rating: typeof rating === "number" ? rating : null, total, distribution, photos: facts?.photos ?? null, profile: facts?.profile ?? null, category: facts?.category ?? null };
}

/**
 * Photos and profile fields of the open place, from the data Maps loaded with the page (its
 * "/maps/preview/place" answer, else the same payload inline in the page). Null when neither is
 * there: the place's other numbers are still saved.
 */
async function placeProfile(tab, watch) {
  for (const requestId of [...watch.placeResponses].reverse()) {
    const body = (await tab.send("Network.getResponseBody", { requestId }).catch(() => null))?.result?.body ?? "";
    const read = parsePlaceProfile(body);
    if (read) return read;
  }
  const inline = await tab
    .evaluate(
      `(() => {
        const found = [];
        const walk = (value, depth) => {
          if (depth > 4) return;
          if (typeof value === "string" && value.startsWith(")]}'") && value.length > 2000) found.push(value);
          else if (Array.isArray(value)) value.forEach((item) => walk(item, depth + 1));
        };
        walk(window.APP_INITIALIZATION_STATE, 0);
        return found;
      })()`,
    )
    .catch(() => null);
  for (const body of inline ?? []) {
    const read = parsePlaceProfile(body);
    if (read) return read;
  }
  return null;
}

/**
 * Closes Google's "sign in" invitation (and similar dialogs): while it is open, the sort menu
 * and the review list do not respond. The reader itself never signs in (a person may, once, in its window).
 */
export async function dismissDialogs(tab) {
  return tab.evaluate(
    `(() => { const b = [...document.querySelectorAll("[role=dialog] button, [aria-modal=true] button, button")].find((x) => x.offsetParent && /^\\s*(Ignorar|Agora não|Não, obrigado|Not now|Dismiss|Skip|No thanks)\\s*$/i.test(x.textContent)); if (!b) return false; b.click(); return true; })()`,
  );
}

/**
 * Sorts the reviews by newest; retried because the menu sometimes ignores the first click.
 * When Google asks to sign in instead, `watch.signInRequired` is set and false is returned.
 */
export async function sortByNewest(tab, watch) {
  for (let attempt = 0; attempt < 3 && !watch.newestRequested; attempt++) {
    await sleep(600);
    if (await dismissDialogs(tab)) await sleep(400);
    await tab.evaluate(`[...document.querySelectorAll('button')].find(x => /Ordenar|Sort/i.test((x.getAttribute('aria-label') || '') + x.textContent))?.click()`);
    await waitFor(tab, `!![...document.querySelectorAll('[role=menuitemradio]')].find(x => /recentes|Newest/i.test(x.textContent))`, 4000);
    await tab.evaluate(`[...document.querySelectorAll('[role=menuitemradio]')].find(x => /recentes|Newest/i.test(x.textContent))?.click()`);
    for (let waited = 0; waited < 4000 && !watch.newestRequested; waited += 100) await sleep(100);
    if (!watch.newestRequested && (await tab.evaluate(signInGateScript))) {
      watch.signInRequired = true;
      await dismissDialogs(tab);
      break;
    }
  }
  return watch.newestRequested;
}

async function scroll(tab) {
  await tab.evaluate(
    `(() => { let el = document.querySelector("div[data-review-id]"); while (el && !(el.scrollHeight > el.clientHeight + 50 && getComputedStyle(el).overflowY !== "visible")) el = el.parentElement; if (el) el.scrollTop = el.scrollHeight; })()`,
  );
}

/**
 * Reads review pages in order and hands each to `onPage(page, ms)`; returning false stops the read.
 * With `newestOnly`, only responses asked for in newest-first order count (pages loaded before
 * sorting are skipped). Returns `finished` (the last page or a stop was reached) or not (Google
 * stopped answering), and how many pages were read.
 */
export async function readPages(tab, watch, { newestOnly, onPage }) {
  let read = 0;
  let pages = 0;
  let retries = 0;
  let asked = Date.now();
  const list = () => (newestOnly ? watch.responses.filter((response) => response.sort === "newest") : watch.responses);
  for (;;) {
    const deadline = Date.now() + pageTimeoutMs;
    while (read >= list().length && Date.now() < deadline) await sleep(80);
    if (read >= list().length) {
      // No new page: ask again a few times before giving up.
      if (await tab.evaluate(signInGateScript)) throw new SignInRequiredError();
      if (++retries > 3) return { finished: false, pages };
      await dismissDialogs(tab);
      await scroll(tab);
      asked = Date.now();
      continue;
    }
    retries = 0;
    const { requestId } = list()[read++];
    const body = (await tab.send("Network.getResponseBody", { requestId }).catch(() => null))?.result?.body ?? "";
    const page = parseMapsReviewPage(body);
    if (!page) continue;
    pages++;
    const keepGoing = await onPage(page, Date.now() - asked);
    if (!keepGoing || !page.next) return { finished: true, pages };
    // Keep the page light, then let Maps ask for the next page (with its own anti-bot key).
    await tab.evaluate(`[...document.querySelectorAll('div[data-review-id].jftiEf')].slice(0, -12).forEach((el) => el.remove())`);
    await scroll(tab);
    asked = Date.now();
  }
}

/**
 * What the open place page says about the place itself: category (the button under its name) and
 * feature id/coordinates from the page's link. Read before the reviews list replaces the header.
 */
export async function placeFacts(tab) {
  return tab.evaluate(`(() => {
    let href = location.href;
    try { href = decodeURIComponent(href); } catch {}
    const num = (m) => (m ? Number(m[1]) : NaN);
    const lat = num(href.match(/!3d(-?\d+(?:\.\d+)?)/) || href.match(/@(-?\d+\.\d+),/));
    const lng = num(href.match(/!4d(-?\d+(?:\.\d+)?)/) || href.match(/@-?\d+\.\d+,(-?\d+\.\d+)/));
    const category = document.querySelector('button[jsaction*="category"]')?.textContent?.trim() || null;
    return { lat: Number.isFinite(lat) ? lat : null, lng: Number.isFinite(lng) ? lng : null, category, fid: (href.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i) || [])[1] || null };
  })()`);
}

/**
 * The place's own page in its overview (where the category shows under the name): opened again
 * after the reviews were read, when the category could not be read from the reviews view.
 */
export async function overviewFacts(tab, url) {
  const separator = url.includes("?") ? "&" : "?";
  await tab.send("Page.navigate", { url: `${url}${separator}hl=pt-PT` });
  if (!(await waitFor(tab, "!!document.querySelector('h1') || /consent\\./.test(location.host)", 20000))) return null;
  await tab.evaluate(`[...document.querySelectorAll('button')].find(x => /^\\s*(Aceitar tudo|Accept all)\\s*$/i.test(x.textContent))?.click()`);
  await waitFor(tab, `!!document.querySelector('button[jsaction*="category"]')`, 10000);
  // Maps puts the coordinates in the address bar a moment after the place shows (opened by place id
  // or from the Maps app's shared link, which carry none): wait for them (2026-10-09, King Kebab).
  await waitFor(tab, String.raw`/!3d-?\d|@-?\d+\.\d+,-?\d+\.\d+/.test(decodeURIComponent(location.href))`, 10000);
  return placeFacts(tab);
}

/**
 * A Google Maps search around a point, as a visitor sees it (`zoom`: how much of the area is on
 * screen, searchZoomFor in competitors.ts): scrolls the result list (at most `max` places, human pauses) and returns the places it shows (parseSearchResult). Empty when
 * Google jumps straight to one place or shows nothing.
 */
export async function searchPlaces(tab, keyword, lat, lng, max = 60, zoom = 13) {
  await tab.send("Page.navigate", { url: `https://www.google.com/maps/search/${encodeURIComponent(keyword)}/@${lat},${lng},${zoom}z?hl=pt-PT` });
  const listed = `!!document.querySelector('div[role=feed] a[href*="/maps/place/"]')`;
  if (!(await waitFor(tab, `${listed} || !!document.querySelector('h1') || /consent\./.test(location.host)`, 20000))) return [];
  await tab.evaluate(`[...document.querySelectorAll('button')].find(x => /^\s*(Aceitar tudo|Accept all)\s*$/i.test(x.textContent))?.click()`);
  if (!(await waitFor(tab, listed, 15000))) return [];
  for (let round = 0; round < 14; round++) {
    const count = await tab.evaluate(`document.querySelectorAll('div[role=feed] a[href*="/maps/place/"]').length`);
    const end = await tab.evaluate(`/fim da lista|end of the list/i.test(document.querySelector('div[role=feed]')?.innerText || '')`);
    if (end || count >= max) break;
    await tab.evaluate(`(() => { const feed = document.querySelector('div[role=feed]'); if (feed) feed.scrollTop = feed.scrollHeight; })()`);
    await sleep(1500 + Math.random() * 800);
  }
  const raw = await tab.evaluate(`[...document.querySelectorAll('div[role=feed] a[href*="/maps/place/"]')].map((a) => {
    const card = a.closest('div[jsaction]')?.parentElement || a.parentElement;
    return { name: a.getAttribute('aria-label'), href: a.getAttribute('href'), labels: [...card.querySelectorAll('[role=img][aria-label]')].map((x) => x.getAttribute('aria-label')), text: card.innerText };
  })`);
  const seen = new Set();
  return (raw ?? []).map(parseSearchResult).filter((place) => place && !seen.has(place.placeId) && seen.add(place.placeId));
}
