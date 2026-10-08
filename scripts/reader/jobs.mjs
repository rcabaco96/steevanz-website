// What each kind of job does (contract: supabase/migrations/20261004130000_reader_queue.sql).
// Business rules (.claude/skills/regras-negocio-reviews): never the name, photo or profile of who
// wrote a review; for competitors only aggregates (rating, totals, distribution, reply rate), never texts.
import {
  fullBatchReviews,
  fullFirstPhaseReviews,
  log,
  sleep,
  UserError,
} from "./config.mjs";
import {
  openPlace,
  overviewFacts,
  readPages,
  searchPlaces,
  SignInRequiredError,
  sortByNewest,
} from "./maps-page.mjs";
import { isNegative } from "../../src/lib/reviews/analytics.ts";
import {
  competitorLimit,
  competitorRadiusKm,
  distributionAverage,
  googleMapsPlaceUrl,
  paceFromDates,
  replyRateFrom,
  selectCompetitors,
} from "../../src/lib/reviews/competitors.ts";
import { previousCompetitionUpdate } from "../../src/lib/reviews/competition-schedule.ts";
import { placeIdFromFid } from "../../src/lib/reviews/maps-link.ts";
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
    : new UserError(
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
 * First import of a customer: every review Google shows a visitor without a session (newest first
 * when Google lets the list be sorted), in two phases: the first ~50 page by page (the panel is
 * useful within seconds), the rest in batches. When Google shows only part of the history, what it
 * showed is kept and the job says how much. Then, for a customer without competitors, the zone
 * search (discover).
 */
async function full(job, tab, store) {
  const business = await customer(job, store);
  if (business.google_link_status === "connected") return { note: linkedNote };
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
  // A first open sometimes gets no review at all from Google (seen while another tab opened the same
  // place): the place is opened again once before giving up.
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) {
      log("  nenhuma review na 1.ª tentativa; a abrir o negócio outra vez");
      await sleep(4000 + Math.random() * 3000);
    }
    shown = await openPlace(tab, business.google_maps_url);
    if (attempt === 1) {
      await store.jobProgress(job.id, { reviews_expected: shown.total });
      // The comparison shows the customer as soon as its rating and total are known.
      await store.updateBusiness(business.id, { ...(shown.rating ? { rating_total: shown.rating } : {}), ...(shown.total ? { reviews_total: shown.total } : {}) });
      log(
        `  ${shown.total ?? "?"} reviews no Google (${shown.rating ?? "?"}★)`,
      );
    }
    if (shown.noReviews) break;
    const sorted = await sortByNewest(tab, shown.watch);
    log(
      sorted
        ? "  ordenado por mais recentes"
        : "  o Google não deixou ordenar por mais recentes (sem sessão); a ler pela ordem do Google",
    );
    try {
      await readPages(tab, shown.watch, {
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
    } catch (error) {
      // Google's sign-in gate ends what it shows a visitor without a session: keep what was read.
      if (!(error instanceof SignInRequiredError)) throw error;
    } finally {
      // What was read is kept even when Google stops answering halfway.
      await flush();
    }
    if (seen.size || !shown.total) break;
  }
  if (!seen.size && shown.total)
    throw new UserError(
      "O Google não mostrou nenhuma review deste negócio. Tente outra vez daqui a pouco.",
    );

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
  if (shown.noReviews) {
    log("  o negócio ainda não tem reviews no Google");
    return { note: noReviewsNote };
  }
  log(`  concluída: ${seen.size} reviews em ${pace.pages} páginas`);
  if (shown.total !== null && seen.size < shown.total * 0.98) {
    return {
      note: `O Google só mostra ${seen.size} de ${shown.total} reviews a quem não tem sessão iniciada; guardámos as ${seen.size}.`,
    };
  }
}

/**
 * "discover": the competitor search of a customer without competitors, in its own tab while the
 * customer's reviews are read. Category from the place's overview, then the zone search; queues the
 * reads of every chosen place and of the customer's own place (its row in the comparison).
 */
async function discoverJob(job, tab, store) {
  const business = await customer(job, store);
  if (business.competitors_refreshed_at)
    return { note: "Este negócio já tem concorrentes; nada a procurar." };
  log(`procura de concorrentes: ${business.name}`);
  // The customer's own import opens the same place right now in another tab: start a little later,
  // so the two do not load the same page at the same moment.
  await sleep(15000 + Math.random() * 5000);
  const facts = (await overviewFacts(tab, business.google_maps_url).catch(
    () => null,
  )) ?? { lat: null, lng: null, category: null, fid: null };
  const current = await discover(tab, store, business, facts);
  // The customer's own row in the comparison: reused when read recently, else read.
  if (current.place_id) {
    const fresh = await store.freshPlaceIds(
      [current.place_id],
      previousCompetitionUpdate(new Date()),
    );
    if (fresh.size) await store.reuseSnapshots([current.place_id]);
    else await store.queuePlaceReads([current.place_id]);
  }
}

/**
 * The customer's competitors from a Google Maps search of its category around it, as any visitor
 * sees it (no paid provider): same rules as before (within 10 km, same category first, at most 30).
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
  if (!coords)
    throw new UserError(
      "Não foi possível saber onde fica o negócio no Google Maps.",
    );
  const fid = business.google_fid ?? facts.fid;
  let category = facts.category ?? business.category;
  let self = null;
  if (!category)
    throw new UserError(
      "Não foi possível ler a categoria do negócio no Google Maps.",
    );
  log(
    `  a procurar concorrentes: «${category}» num raio de ${competitorRadiusKm} km`,
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
  const found = await searchPlaces(tab, category, coords.lat, coords.lng);
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
  let chosen = selectCompetitors(origin, candidates);
  const broader = category.split(" ")[0];
  if (chosen.length < competitorLimit && broader && broader !== category) {
    await sleep(2000 + Math.random() * 1500);
    candidates = [
      ...candidates,
      ...others(await searchPlaces(tab, broader, coords.lat, coords.lng)).map(
        (place) => asCandidate(place, broader),
      ),
    ];
    chosen = selectCompetitors(origin, candidates);
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
    competitors_snapshot_at: null,
  });
  // Supabase first: places read since the last update (for any customer) are reused, not read again.
  const placeIds = chosen.map((candidate) => candidate.placeId);
  const fresh = await store.freshPlaceIds(
    placeIds,
    previousCompetitionUpdate(new Date()),
  );
  if (fresh.size) await store.reuseSnapshots([...fresh]);
  const queued = await store.queuePlaceReads(
    placeIds.filter((placeId) => !fresh.has(placeId)),
  );
  log(
    `  ${chosen.length} concorrentes escolhidos; ${fresh.size} reaproveitados (já lidos desde a última atualização); ${queued} leituras na fila`,
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
  if (business.google_link_status === "connected") return { note: linkedNote };
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
  const shown = await openPlace(tab, business.google_maps_url);
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
    throw new UserError(
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
    return;
  }
  const previous = await store.readerPlaceRow(placeId);
  log(`concorrente ${placeId} (${competitors.length} comparação/ões)`);
  const shown = await openPlace(tab, googleMapsPlaceUrl(placeId));
  if (shown.total === null)
    throw new UserError(
      "O Google não mostrou o número de reviews deste local.",
    );
  await saveSnapshots(store, competitors, shown);
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
    return { note: shown.noReviews ? noReviewsNote : noSortNote };
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
    return;
  }
  log(
    `respostas do concorrente ${placeId} (${competitors.length} comparação/ões)`,
  );
  const shown = await openPlace(tab, googleMapsPlaceUrl(placeId));
  if (shown.noReviews || !(await sortByNewest(tab, shown.watch))) {
    if (shown.total !== null) await saveSnapshots(store, competitors, shown);
    await store.readerPlace(placeId, {
      replies_read_on: today,
      last_error: null,
    });
    return { note: shown.noReviews ? noReviewsNote : noSortNote };
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
}

export const handlers = {
  full,
  update,
  competitor,
  competitor_replies: competitorReplies,
  discover: discoverJob,
};
