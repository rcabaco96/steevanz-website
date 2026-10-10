// What each kind of job does (contract: supabase/migrations/20261004130000_reader_queue.sql).
// Business rules (.claude/skills/regras-negocio-reviews): never the name, photo or profile of who
// wrote a review; for competitors only aggregates (rating, totals, distribution, reply rate), never texts.
import {
  fullBatchReviews,
  fullFirstPhaseReviews,
  GoogleLimitError,
  log,
  sleep,
  UserError,
  WaitError,
} from "./config.mjs";
import {
  openPlace,
  overviewFacts,
  placeFacts,
  readPages,
  searchPlaces,
  SignInRequiredError,
  sortByNewest,
} from "./maps-page.mjs";
import { isNegative } from "../../src/lib/reviews/analytics.ts";
import {
  competitorLimit,
  discoveryDue,
  distributionAverage,
  googleMapsPlaceUrl,
  paceFromDates,
  replyRateFrom,
  searchZoomFor,
  selectCompetitors,
  toRadiusKm,
} from "../../src/lib/reviews/competitors.ts";
import { previousCompetitionUpdate } from "../../src/lib/reviews/competition-schedule.ts";
import { competitorRuleVersion, narrowerSearch } from "../../src/lib/reviews/competitor-category.ts";
import { nameFromPage, placeIdFromFid } from "../../src/lib/reviews/maps-link.ts";
import {
  competitorDailyDays,
  coordinatesFromMapsUrl,
  daysBetween,
  lisbonDay,
  pageReachesStop,
  repliesMaxReviews,
  repliesReadDone,
  repliesWindowDays,
  replySampleFrom,
  slideReplyRate,
  toStarDistribution,
  updateReplyWindowDays,
  updateStopBefore,
} from "../../src/lib/reviews/maps-reader.ts";

const dayMs = 86_400_000;
/** New negative reviews younger than this trigger an email alert (same as store.ts). */
const alertMaxAgeMs = 7 * dayMs;
const round = (value, decimals) =>
  value === null ? null : Math.round(value * 10 ** decimals) / 10 ** decimals;
const reviewRow = (businessId, review) => ({
  ...review,
  business_id: businessId,
  fetched_at: new Date().toISOString(),
});
const notSorted = (watch) =>
  watch.signInRequired
    ? new SignInRequiredError()
    : new GoogleLimitError(
        "Não foi possível ordenar as reviews do Google por mais recentes. Tente outra vez daqui a pouco.",
      );
/** Without a Google session, Google does not sort reviews (it asks to sign in): only the aggregates are read. */
const noSortNote =
  "Sem sessão iniciada, o Google não deixa ordenar as reviews: guardámos a nota, o total e as estrelas; a taxa de respostas fica por medir.";
/** A place with no review at all: Google shows no reviews tab; it is saved as 0 reviews, last in the rankings. */
const noReviewsNote = "Este negócio ainda não tem reviews no Google.";
/** Customers linked to Google Business Profile get their reviews from the official API, not from the reader. */
const linkedNote =
  "Negócio ligado ao Google Business Profile: as reviews chegam pela ligação oficial, por isso o leitor não o leu.";

/**
 * Handlers return a note and, when it matters for the reader's pacing (reader-throttle.ts):
 * `limited` when Google limited the read (the job is done with what could be saved, but it counts
 * towards a cool-down), `noGoogle` when Google was not opened at all (says nothing about limits).
 */
const skipped = (note) => ({ note, noGoogle: true });

/**
 * The customer's real name from the place's page (h1), when the stored one is that name plus an
 * address (taken from a Maps link): review_businesses.name and its own row in the comparisons.
 */
/**
 * Where the place is, saved as soon as the reader opens it for its stars and reviews (owner's idea,
 * 2026-10-09): a customer created from the Maps app's shared link has no coordinates until then, and
 * the competitor search, running next to the import, waits for them (WaitError in discover).
 */
async function rememberPlace(tab, store, business) {
  if (business.lat !== null && business.lng !== null) return;
  const facts = await placeFacts(tab).catch(() => null);
  if (facts?.lat == null || facts?.lng == null) return;
  await store.updateBusiness(business.id, { lat: facts.lat, lng: facts.lng });
  business.lat = facts.lat;
  business.lng = facts.lng;
  log(`  localização guardada: ${facts.lat}, ${facts.lng}`);
}

async function renameFromPage(store, business, shown) {
  const name = nameFromPage(business.name, shown.title);
  if (!name) return;
  log(`  nome corrigido a partir do Google: «${name}» (era «${business.name}»)`);
  await store.updateBusiness(business.id, { name });
  await store.renameOwnPlace(business.id, name);
  business.name = name;
}

/** Progress of a read, as the panel shows it. */
function progress() {
  let pages = 0;
  let pageMs = 0;
  return {
    page(ms) {
      pages++;
      pageMs += ms;
      return { pages_done: pages, avg_page_ms: Math.round(pageMs / pages) };
    },
    get pages() {
      return pages;
    },
  };
}

async function customer(job, store) {
  if (!job.business_id) throw new UserError("Pedido sem negócio associado.");
  return store.business({ id: job.business_id });
}

/**
 * The customer's place on Google Maps, opened by its place id (like the competitors): the link pasted
 * in the admin can open a variant of the page whose review list never loads (2026-10-09, King Kebab:
 * "…/place/<name, address>/…" and "?q=…&ftid=…"). The stored link only when there is no place id.
 */
const customerPlaceUrl = (business) => (business.place_id ? googleMapsPlaceUrl(business.place_id) : business.google_maps_url);

async function place(job, store) {
  if (!job.place_id)
    throw new UserError("Pedido sem local do Google associado.");
  return {
    placeId: job.place_id,
    competitors: await store.competitorsForPlace(job.place_id),
  };
}

/** Today's snapshot (rating, exact average, total, star distribution) for the given competitor rows. */
async function saveSnapshots(store, rows, shown) {
  const today = lisbonDay();
  const distribution = shown.distribution
    ? toStarDistribution(shown.distribution)
    : null;
  const snapshot = {
    taken_on: today,
    rating: shown.rating,
    average: round(distributionAverage(distribution), 3),
    reviews_count: shown.total,
    distribution,
    // Only when read: a page without them keeps the last known values.
    ...(shown.photos !== null && shown.photos !== undefined ? { photos_count: shown.photos } : {}),
    ...(shown.profile ? { profile: shown.profile } : {}),
  };
  await store.upsertSnapshots(
    rows.map((row) => ({ competitor_id: row.id, ...snapshot })),
  );
  if (distribution)
    for (const row of rows)
      await store.updateCompetitor(row.id, { detailed_on: today });
}

/** The place's Google category (from its page data) on its comparison rows that lack it or differ. */
async function saveCategory(store, placeId, rows, shown) {
  if (!shown.category || rows.every((row) => row.category === shown.category)) return;
  await store.updateCompetitors(placeId, { category: shown.category });
}

/**
 * After reading a customer: competitor jobs leave out each customer's own place, so its own row in
 * the comparisons (is_self) gets today's snapshot here, and the place counts as read today.
 */
async function snapshotOwnPlace(store, business, shown) {
  const placeId = business.place_id ?? business.google_place_id;
  if (!placeId || shown.total === null) return;
  const own = (await store.competitorsForPlace(placeId)).filter(
    (row) => row.is_self,
  );
  if (own.length) await saveSnapshots(store, own, shown);
  await store.readerPlace(placeId, {
    read_on: lisbonDay(),
    read_at: new Date().toISOString(),
    last_error: null,
  });
}

/**
 * Rule 11: once a customer's reviews are stored, the owner's replies on Google teach the AI replies
 * (one pass per job, at the end). A failure is only logged: the import itself is done.
 */
async function learnFromOwner(store, business) {
  try {
    const learned = await store.learnOwnerReplies(business.id);
    if (!learned) return;
    if (!learned.tone) log("  respostas do dono: ainda sem tom nas respostas IA; aprendem-se quando o cliente guardar as definições");
    else if (learned.replies) log(`  respostas do dono: ${learned.replies} aprendidas, ${learned.sentences} frases novas`);
  } catch (error) {
    log("  aviso: não foi possível aprender com as respostas do dono:", error instanceof Error ? error.message : error);
  }
}

/**
 * First import of a customer: every review Google shows a visitor without a session (newest first
 * when Google lets the list be sorted), in two phases: the first ~50 page by page (the panel is
 * useful within seconds), the rest in batches. 100% of the history or nothing: only a read that
 * reaches the end of Google's list counts as the import (full_synced_at). When Google stops halfway
 * (sign-in gate, no answer) the place is opened once more; if it stops again the job fails, the
 * import stays not done (the routine asks for it again) and the reviews read stay saved (upserted
 * by id, so the next import only completes them). The competitor search is its own job (discover).
 */
async function full(job, tab, store) {
  const business = await customer(job, store);
  if (business.google_link_status === "connected") return skipped(linkedNote);
  log(`importação completa: ${business.name}`);
  const seen = new Set();
  const pace = progress();
  let pending = [];
  let firstPhase = true;
  const flush = async () => {
    const rows = pending;
    pending = [];
    await store.saveReviews(business.id, rows);
  };
  let shown = null;
  /** The read reached the end of Google's list (the whole history Google shows). */
  let finished = false;
  /** Google asked to sign in before showing more. */
  let gated = false;
  // A first open sometimes gets no review at all, or Google stops halfway (seen while another tab
  // opened the same place): the place is opened again once before giving up.
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) {
      log(seen.size ? `  o Google parou ao fim de ${seen.size} reviews; a abrir o negócio outra vez` : "  nenhuma review na 1.ª tentativa; a abrir o negócio outra vez");
      await sleep(4000 + Math.random() * 3000);
      gated = false;
    }
    shown = await openPlace(tab, customerPlaceUrl(business));
    if (attempt === 1) {
      await rememberPlace(tab, store, business);
      await renameFromPage(store, business, shown);
      await store.jobProgress(job.id, { reviews_expected: shown.total });
      // The comparison shows the customer as soon as its rating and total are known.
      await store.updateBusiness(business.id, { ...(shown.rating ? { rating_total: shown.rating } : {}), ...(shown.total ? { reviews_total: shown.total } : {}) });
      log(
        `  ${shown.total ?? "?"} reviews no Google (${shown.rating ?? "?"}★)`,
      );
    }
    if (shown.noReviews) {
      finished = true;
      break;
    }
    const sorted = await sortByNewest(tab, shown.watch);
    log(
      sorted
        ? "  ordenado por mais recentes"
        : "  o Google não deixou ordenar por mais recentes (sem sessão); a ler pela ordem do Google",
    );
    try {
      const result = await readPages(tab, shown.watch, {
        newestOnly: sorted,
        onPage: async (page, ms) => {
          for (const review of page.reviews) {
            if (seen.has(review.review_id)) continue;
            seen.add(review.review_id);
            pending.push(reviewRow(business.id, review));
          }
          if (firstPhase || pending.length >= fullBatchReviews) await flush();
          if (firstPhase && seen.size >= fullFirstPhaseReviews) {
            firstPhase = false;
            await store.updateBusiness(business.id, {
              ...(shown.rating ? { rating_total: shown.rating } : {}),
              ...(shown.total ? { reviews_total: shown.total } : {}),
            });
            log(
              `  primeiras ${seen.size} reviews guardadas; a continuar até ao fim`,
            );
          }
          await store.jobProgress(job.id, {
            reviews_done: seen.size,
            ...pace.page(ms),
          });
          return true;
        },
      });
      finished = result.finished;
    } catch (error) {
      // Google's sign-in gate ends what it shows a visitor without a session: keep what was read.
      if (!(error instanceof SignInRequiredError)) throw error;
      gated = true;
    } finally {
      // What was read is kept even when Google stops answering halfway.
      await flush();
    }
    if (finished || !shown.total) break;
  }
  if (!seen.size && shown.total)
    throw new GoogleLimitError(
      "O Google não mostrou nenhuma review deste negócio. Tente outra vez daqui a pouco.",
    );
  if (!finished && shown.total) {
    // 100% of the history or nothing: not marked as imported (full_synced_at stays as it was). The
    // job goes back to the queue for later (a Google limit); the reviews read stay saved.
    const of = `${seen.size} de ${shown.total}`;
    throw new GoogleLimitError(
      gated
        ? `O Google pediu para iniciar sessão ao fim de ${of} reviews, por isso o histórico ficou incompleto e a importação não conta como feita. As reviews lidas ficaram guardadas; tente outra vez mais tarde.`
        : `O Google deixou de responder ao fim de ${of} reviews, por isso o histórico ficou incompleto e a importação não conta como feita. As reviews lidas ficaram guardadas; tente outra vez daqui a pouco.`,
    );
  }

  const now = new Date().toISOString();
  await store.updateBusiness(business.id, {
    ...(shown.rating ? { rating_total: shown.rating } : {}),
    reviews_total: shown.total ?? seen.size,
    last_synced_at: now,
    full_synced_at: now,
    last_sync_error: null,
  });
  // The competitor search is its own job ("discover"), queued next to this one.
  await snapshotOwnPlace(store, business, shown);
  await learnFromOwner(store, business);
  if (shown.noReviews) {
    log("  o negócio ainda não tem reviews no Google");
    return { note: noReviewsNote };
  }
  log(`  concluída: ${seen.size} reviews em ${pace.pages} páginas`);
  if (shown.total !== null && seen.size < shown.total) {
    // The list ended (no next page) before Google's total: Google counts reviews it does not list.
    return {
      note: `Lemos a lista de reviews do Google até ao fim: ${seen.size} reviews (o Google indica ${shown.total} no total, mas só lista estas).`,
    };
  }
}

/**
 * "discover": the competitor search of a customer without competitors (or whose radius an admin
 * changed: discoveryDue), after the customer's own reviews were read (never next to them). Category from the place's overview, then the zone search; queues the
 * reads of every chosen place and of the customer's own place (its row in the comparison).
 */
async function discoverJob(job, tab, store) {
  const business = await customer(job, store);
  if (!discoveryDue(business))
    return skipped("Este negócio já tem concorrentes; nada a procurar.");
  // Never next to a customer's own import: the reader starts it only once no customer job is queued
  // or running (gateAllows in reader-throttle.ts), spaced like the other competitor work.
  log(`procura de concorrentes: ${business.name}`);
  const facts = (await overviewFacts(tab, customerPlaceUrl(business)).catch(
    () => null,
  )) ?? { lat: null, lng: null, category: null, fid: null };
  const current = await discover(tab, store, business, facts);
  // The customer's own row in the comparison: reused when read recently, else read.
  if (current.place_id) {
    const fresh = await store.freshPlaceIds(
      [current.place_id],
      previousCompetitionUpdate(new Date()),
    );
    const reused = fresh.size ? await store.reuseSnapshots([current.place_id]) : new Set();
    if (!reused.size) await store.queuePlaceReads([current.place_id]);
  }
}

/**
 * The customer's competitors from a Google Maps search of its category around it, as any visitor
 * sees it (no paid provider): within the customer's radius (5, 10, 20 or 30 km, chosen by an admin), same
 * category first, at most 30. Rows that drop out go (admin exclusions stay); the shared per-place
 * base (reader_places, other customers' rows) is untouched.
 * Their rating, total and stars come from the reader's competitor reads, queued here.
 */
async function discover(tab, store, business, facts) {
  const coords =
    (facts.lat !== null && facts.lng !== null
      ? { lat: facts.lat, lng: facts.lng }
      : null) ??
    coordinatesFromMapsUrl(business.google_maps_url) ??
    (business.lat !== null && business.lng !== null
      ? { lat: business.lat, lng: business.lng }
      : null);
  // Not there yet: the customer's import saves it when it opens the place (rememberPlace). Try again
  // in 30 s instead of failing; the reader gives up after ~10 min.
  if (!coords) throw new WaitError("À espera da localização do negócio, que o leitor guarda ao ler as estrelas.", 30);
  const fid = business.google_fid ?? facts.fid;
  let category = facts.category ?? business.category;
  let self = null;
  if (!category)
    throw new UserError(
      "Não foi possível ler a categoria do negócio no Google Maps.",
    );
  const radiusKm = toRadiusKm(business.competitor_radius_km);
  const zoom = searchZoomFor(radiusKm);
  log(
    `  a procurar concorrentes: «${category}» num raio de ${radiusKm} km`,
  );
  const asCandidate = (place, searchString) => ({
    placeId: place.placeId,
    title: place.title,
    categoryName: place.category,
    address: null,
    url: googleMapsPlaceUrl(place.placeId),
    location: { lat: place.lat, lng: place.lng },
    totalScore: place.rating,
    // Google's order stands in for "most reviewed" when the list does not show the totals.
    reviewsCount: place.reviewsCount ?? 1,
    permanentlyClosed: place.permanentlyClosed,
    temporarilyClosed: place.temporarilyClosed,
    searchString,
  });
  // The customer itself never competes with itself: dropped by its Google feature id too.
  const others = (places) =>
    places.filter((place) => !(fid && place.fid === fid));
  const found = await searchPlaces(tab, category, coords.lat, coords.lng, 60, zoom);
  self ??= found.find((place) => fid && place.fid === fid) ?? null;
  if (!self && !business.place_id) {
    await sleep(1500 + Math.random() * 1500);
    const byName = await searchPlaces(
      tab,
      business.name,
      coords.lat,
      coords.lng,
      10,
    ).catch(() => []);
    self = byName.find((place) => fid && place.fid === fid) ?? null;
  }
  // Google's place id (ChIJ…): known, found in the search, or computed from the feature id.
  const selfPlaceId = business.place_id ?? self?.placeId ?? placeIdFromFid(fid);
  if (!selfPlaceId)
    throw new UserError(
      "Não foi possível identificar o negócio nos resultados do Google Maps.",
    );
  const origin = {
    placeId: selfPlaceId,
    category,
    lat: coords.lat,
    lng: coords.lng,
  };
  let candidates = others(found).map((place) => asCandidate(place, category));
  let chosen = selectCompetitors(origin, candidates, radiusKm);
  // Fewer than 30: a second search with the customer's meaningful words only ("doner kebab"), never a
  // generic one like "Restaurante" (rule 5: never padded with unrelated places).
  const broader = narrowerSearch(category);
  if (chosen.length < competitorLimit && broader) {
    await sleep(2000 + Math.random() * 1500);
    candidates = [
      ...candidates,
      ...others(await searchPlaces(tab, broader, coords.lat, coords.lng, 60, zoom)).map(
        (place) => asCandidate(place, broader),
      ),
    ];
    chosen = selectCompetitors(origin, candidates, radiusKm);
  }
  await store.saveCompetitors(business.id, [
    {
      place_id: selfPlaceId,
      name: business.name,
      category,
      address: null,
      url: googleMapsPlaceUrl(selfPlaceId),
      lat: coords.lat,
      lng: coords.lng,
      distance_m: 0,
      is_self: true,
    },
    ...chosen.map((candidate) => ({
      place_id: candidate.placeId,
      name: candidate.name,
      category: candidate.category,
      address: candidate.address,
      url: candidate.url,
      lat: candidate.lat,
      lng: candidate.lng,
      distance_m: candidate.distanceM,
      is_self: false,
    })),
  ]);
  await store.updateBusiness(business.id, {
    place_id: selfPlaceId,
    lat: coords.lat,
    lng: coords.lng,
    category,
    competitors_refreshed_at: new Date().toISOString(),
    competitors_search_radius_km: radiusKm,
    competitors_rule_version: competitorRuleVersion,
    competitors_snapshot_at: null,
  });
  // Supabase first: places read since the last update (for any customer) are reused, not read again.
  const placeIds = chosen.map((candidate) => candidate.placeId);
  const fresh = await store.freshPlaceIds(
    placeIds,
    previousCompetitionUpdate(new Date()),
  );
  // Only places whose numbers are still stored are reused; the others are read.
  const reused = fresh.size ? await store.reuseSnapshots([...fresh]) : new Set();
  const queued = await store.queuePlaceReads(
    placeIds.filter((placeId) => !reused.has(placeId)),
  );
  log(
    `  ${chosen.length} concorrentes escolhidos; ${reused.size} reaproveitados (já lidos desde a última atualização); ${queued} leituras na fila`,
  );
  return { ...business, place_id: selfPlaceId };
}

/**
 * New reviews and owner replies to recent unanswered ones: newest first, stopping once a page goes
 * past both the newest stored review − 1 day and the oldest unanswered review of the last 30 days
 * − 1 day. Everything read is saved. New negative reviews of the last 7 days are emailed.
 */
async function update(job, tab, store) {
  const business = await customer(job, store);
  if (business.google_link_status === "connected") return skipped(linkedNote);
  const newest = await store.newestStored(business.id);
  const unanswered = newest
    ? await store.oldestUnansweredSince(
        business.id,
        new Date(Date.now() - updateReplyWindowDays * dayMs).toISOString(),
      )
    : null;
  const stopBefore = updateStopBefore(newest, unanswered);
  log(
    `atualização: ${business.name} (até ${stopBefore ? stopBefore.toISOString().slice(0, 10) : "ao início do histórico"})`,
  );
  const shown = await openPlace(tab, customerPlaceUrl(business));
  await rememberPlace(tab, store, business);
  await renameFromPage(store, business, shown);
  if (shown.noReviews) {
    await store.updateBusiness(business.id, { reviews_total: 0, last_synced_at: new Date().toISOString(), last_sync_error: null });
    await snapshotOwnPlace(store, business, shown);
    log("  o negócio ainda não tem reviews no Google");
    return { note: noReviewsNote };
  }
  if (!(await sortByNewest(tab, shown.watch))) throw notSorted(shown.watch);

  const seen = new Set();
  const fresh = [];
  const pace = progress();
  const result = await readPages(tab, shown.watch, {
    newestOnly: true,
    onPage: async (page, ms) => {
      const rows = page.reviews
        .filter((review) => !seen.has(review.review_id))
        .map((review) => reviewRow(business.id, review));
      for (const row of rows) seen.add(row.review_id);
      fresh.push(...(await store.saveReviews(business.id, rows)));
      await store.jobProgress(job.id, {
        reviews_done: seen.size,
        reviews_new: fresh.length,
        ...pace.page(ms),
      });
      return !pageReachesStop(page.reviews, stopBefore);
    },
  });
  if (!result.finished)
    throw new GoogleLimitError(
      `O Google deixou de responder a meio (${seen.size} reviews lidas). Tente outra vez.`,
    );

  const now = new Date().toISOString();
  await store.updateBusiness(business.id, {
    ...(shown.rating ? { rating_total: shown.rating } : {}),
    ...(shown.total ? { reviews_total: shown.total } : {}),
    last_synced_at: now,
    // With nothing stored before, the whole history was read.
    ...(stopBefore ? {} : { full_synced_at: now }),
    last_sync_error: null,
  });
  await snapshotOwnPlace(store, business, shown);
  await learnFromOwner(store, business);
  log(
    `  concluída: ${seen.size} reviews lidas, ${fresh.length} novas, ${pace.pages} páginas`,
  );

  // The first read is the whole history, so only later reads can produce alerts (as in store.ts).
  if (newest && business.alert_email) {
    const negative = fresh.filter(
      (row) =>
        isNegative(row.rating) &&
        Date.now() - Date.parse(row.published_at) < alertMaxAgeMs,
    );
    if (negative.length)
      await store.postAlert(
        business.id,
        negative.map((row) => row.review_id),
      );
  }
}

/**
 * Daily, one Google place shared by every customer that compares with it: rating, total and star
 * distribution become today's snapshot of each of those competitors; the reviews of the last 30
 * days (newest first) slide the 12-month reply rate forward (see slideReplyRate: an approximation
 * until a per-review ledger exists). Only aggregates are stored, never texts.
 */
async function competitor(job, tab, store) {
  const { placeId, competitors } = await place(job, store);
  const today = lisbonDay();
  if (!competitors.length) {
    log(`concorrente ${placeId}: nenhum cliente o compara; nada a ler`);
    await store.readerPlace(placeId, {
      read_on: today,
      read_at: new Date().toISOString(),
      last_error: null,
    });
    return skipped(null);
  }
  const previous = await store.readerPlaceRow(placeId);
  log(`concorrente ${placeId} (${competitors.length} comparação/ões)`);
  const shown = await openPlace(tab, googleMapsPlaceUrl(placeId));
  if (shown.total === null)
    throw new UserError(
      "O Google não mostrou o número de reviews deste local.",
    );
  await saveSnapshots(store, competitors, shown);
  await saveCategory(store, placeId, competitors, shown);
  await store.jobProgress(job.id, { reviews_expected: shown.total });
  log(
    `  ${shown.rating ?? "?"}★, ${shown.total} reviews${shown.distribution ? "" : " (sem distribuição de estrelas)"}`,
  );

  // Reviews of the last 30 days: only the date and whether the owner replied are kept.
  if (shown.noReviews || !(await sortByNewest(tab, shown.watch))) {
    await store.readerPlace(placeId, {
      read_on: today,
      read_at: new Date().toISOString(),
      last_error: null,
    });
    return shown.noReviews ? { note: noReviewsNote } : { note: noSortNote, limited: true };
  }
  const now = new Date();
  const since = new Date(now.getTime() - competitorDailyDays * dayMs);
  const recent = new Map();
  const pace = progress();
  const result = await readPages(tab, shown.watch, {
    newestOnly: true,
    onPage: async (page, ms) => {
      const items = replySampleFrom(page.reviews);
      page.reviews.forEach((review, index) =>
        recent.set(review.review_id, items[index]),
      );
      await store.jobProgress(job.id, {
        reviews_done: recent.size,
        ...pace.page(ms),
      });
      return !pageReachesStop(page.reviews, since);
    },
  });
  const stopped = !result.finished;

  const items = [...recent.values()].filter(
    (item) => Date.parse(item.publishedAt) >= since.getTime(),
  );
  const days = previous?.read_on ? daysBetween(previous.read_on, today) : 0;
  for (const row of competitors) {
    // Only rates measured over 12 months by the reader slide; others wait for "competitor_replies".
    if (
      row.is_self ||
      row.replies_window_days !== repliesWindowDays ||
      row.reply_sample === null
    )
      continue;
    const slid = slideReplyRate(
      {
        rate: row.reply_rate === null ? null : Number(row.reply_rate),
        sample: row.reply_sample,
      },
      items,
      days,
      now,
    );
    if (slid.rate === row.reply_rate && slid.sample === row.reply_sample)
      continue;
    await store.updateCompetitor(row.id, {
      reply_rate: round(slid.rate, 3),
      reply_sample: slid.sample,
    });
  }
  await store.readerPlace(placeId, {
    read_on: today,
    read_at: new Date().toISOString(),
    last_error: null,
  });
  log(
    `  ${items.length} reviews nos últimos ${competitorDailyDays} dias, ${items.filter((item) => item.replied).length} com resposta`,
  );
  if (stopped)
    return {
      note: `O Google parou de mostrar reviews ao fim de ${recent.size} (limite sem sessão iniciada): guardámos a nota, o total e as estrelas.`,
      limited: true,
    };
}

/**
 * Once per place (when never measured): reply rate over the last 12 months (at most 2000 reviews,
 * newest first), for every customer that compares with it. Only the aggregate is kept: share,
 * reviews counted, oldest day counted, and the monthly pace from the review dates.
 */
async function competitorReplies(job, tab, store) {
  const { placeId, competitors } = await place(job, store);
  const today = lisbonDay();
  if (!competitors.length) {
    log(
      `respostas do concorrente ${placeId}: nenhum cliente o compara; nada a ler`,
    );
    await store.readerPlace(placeId, {
      replies_read_on: today,
      last_error: null,
    });
    return skipped(null);
  }
  log(
    `respostas do concorrente ${placeId} (${competitors.length} comparação/ões)`,
  );
  const shown = await openPlace(tab, googleMapsPlaceUrl(placeId));
  await saveCategory(store, placeId, competitors, shown);
  if (shown.noReviews || !(await sortByNewest(tab, shown.watch))) {
    if (shown.total !== null) await saveSnapshots(store, competitors, shown);
    await store.readerPlace(placeId, {
      replies_read_on: today,
      last_error: null,
    });
    return shown.noReviews ? { note: noReviewsNote } : { note: noSortNote, limited: true };
  }

  const now = new Date();
  // Only the date and whether the owner replied, per review id.
  const sample = new Map();
  const pace = progress();
  const result = await readPages(tab, shown.watch, {
    newestOnly: true,
    onPage: async (page, ms) => {
      const items = replySampleFrom(page.reviews);
      page.reviews.forEach((review, index) =>
        sample.set(review.review_id, items[index]),
      );
      await store.jobProgress(job.id, {
        reviews_done: sample.size,
        ...pace.page(ms),
      });
      return !repliesReadDone(sample.size, page.reviews, now);
    },
  });
  if (!result.finished && sample.size === 0) {
    await store.readerPlace(placeId, {
      replies_read_on: today,
      last_error: null,
    });
    return {
      note: "O Google não mostrou reviews deste local sem sessão iniciada; a taxa de respostas fica por medir.",
      limited: true,
    };
  }

  const items = [...sample.values()];
  const replies = replyRateFrom(items, now, repliesMaxReviews);
  const pacePerMonth = paceFromDates(
    items.map((item) => item.publishedAt),
    now,
    repliesMaxReviews,
  );
  await store.updateCompetitors(placeId, {
    reply_rate: round(replies.rate, 3),
    reply_sample: replies.sample,
    reply_since: replies.since,
    replies_window_days: repliesWindowDays,
    pace_per_month: round(pacePerMonth, 2),
    pace_measured_at: now.toISOString(),
  });
  await store.readerPlace(placeId, {
    replies_read_on: today,
    last_error: null,
  });
  log(
    `  ${sample.size} reviews lidas; respondidas ${replies.rate === null ? "?" : Math.round(replies.rate * 100) + "%"} de ${replies.sample}; ${round(pacePerMonth, 1)} reviews/mês`,
  );
  // Google stopped before 12 months / 2000 reviews: measured on what it showed, but a limit signal.
  if (!result.finished) return { limited: true };
}

export const handlers = {
  full,
  update,
  competitor,
  competitor_replies: competitorReplies,
  discover: discoverJob,
};
