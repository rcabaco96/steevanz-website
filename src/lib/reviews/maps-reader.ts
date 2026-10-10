/**
 * Google Maps' own review data, as read by the local reader (scripts/reader). Pure module so it can
 * be tested with node --test. Only the fields we store are extracted: never names, photos or
 * profile links of who wrote a review.
 */

import { gateAllows, isClientJob, type ClaimGate } from "./reader-throttle.ts";

export interface MapsReview {
  review_id: string;
  rating: number;
  text: string | null;
  language: string | null;
  published_at: string;
  owner_reply: string | null;
  owner_replied_at: string | null;
  reviewer_review_count: number | null;
  reviewer_is_local_guide: boolean;
}

export interface MapsReviewPage {
  reviews: MapsReview[];
  /** Token of the next page; null on the last page. */
  next: string | null;
}

/** Google Maps serves reviews 10 at a time; bigger pages are refused or cancelled. */
export const mapsPageSize = 10;

type Json = unknown;
const at = (value: Json, ...path: number[]): Json => path.reduce<Json>((node, index) => (Array.isArray(node) ? node[index] : undefined), value);
const text = (value: Json) => (typeof value === "string" && value.trim() ? value.trim() : null);
const micros = (value: Json) => (typeof value === "number" && value > 0 ? new Date(value / 1000).toISOString() : null);

/** Parses one response of Maps' review request (batchexecute, rpcid qv9Egd). Null when it is not one. */
export function parseMapsReviewPage(body: string): MapsReviewPage | null {
  const line = body.split("\n").find((candidate) => candidate.includes('"wrb.fr"') && candidate.includes("qv9Egd"));
  if (!line) return null;
  let payload: string | null;
  try {
    payload = at(JSON.parse(line), 0, 2) as string | null;
  } catch {
    return null;
  }
  if (typeof payload !== "string") return null;
  const data = JSON.parse(payload) as Json[];
  const items = Array.isArray(data[2]) ? (data[2] as Json[]) : [];
  const reviews: MapsReview[] = [];
  for (const item of items) {
    const review = at(item, 0);
    const id = at(review, 0);
    const rating = at(review, 2, 0, 0);
    const publishedAt = micros(at(review, 1, 2));
    if (typeof id !== "string" || typeof rating !== "number" || rating < 1 || rating > 5 || !publishedAt) continue;
    const reply = text(at(review, 3, 14, 0, 0));
    const reviewer = at(review, 1, 4, 5);
    const reviewerCount = at(reviewer, 5);
    reviews.push({
      review_id: id,
      rating,
      text: text(at(review, 2, 15, 0, 0)),
      language: text(at(review, 2, 14, 0)),
      published_at: publishedAt,
      owner_reply: reply,
      owner_replied_at: reply ? micros(at(review, 3, 1)) : null,
      reviewer_review_count: typeof reviewerCount === "number" ? reviewerCount : null,
      reviewer_is_local_guide: /Guia local|Local Guide/i.test(String(at(reviewer, 10, 0) ?? "")),
    });
  }
  return { reviews, next: text(data[1]) };
}

/** Star distribution from the review tab's bars, e.g. "5 estrelas,452 críticas". */
export function parseDistribution(labels: string[]): Record<1 | 2 | 3 | 4 | 5, number> | null {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let found = 0;
  for (const label of labels) {
    const match = label.match(/^\s*([1-5])\s+estrelas?,\s*([\d\s.]+)/i) ?? label.match(/^\s*([1-5])\s+stars?,\s*([\d\s.,]+)/i);
    if (!match) continue;
    counts[Number(match[1]) as 1 | 2 | 3 | 4 | 5] = Number(match[2].replace(/[^\d]/g, ""));
    found++;
  }
  return found === 5 ? counts : null;
}

/** Fixed cost of a full import before the first page (open page, reviews tab, sort by newest). */
export const importSetupMs = 4000;
/** Time per page before the reader has measured its own pace. */
export const defaultPageMs = 700;

/** Estimated seconds left for an import, from the measured time per page when there is one. */
export function importSecondsLeft(job: { reviewsExpected: number | null; reviewsDone: number; pagesDone: number; avgPageMs: number | null }): number | null {
  if (!job.reviewsExpected) return null;
  const pagesLeft = Math.max(0, Math.ceil((job.reviewsExpected - job.reviewsDone) / mapsPageSize));
  const setup = job.pagesDone === 0 ? importSetupMs : 0;
  return Math.round((setup + pagesLeft * (job.avgPageMs ?? defaultPageMs)) / 1000);
}

// --- Reader rules (pure, shared by scripts/reader and the tests) -----------------------------------

const dayMs = 86_400_000;

/** Reader slots: jobs (and Edge tabs) processed at the same time. */
export const readerSlots = 4;

/** Browser tabs the reader runs at once: READER_SLOTS (1–20), else 4 (the owner's PC; 10 on a server). */
export function readerSlotsFrom(value: string | undefined): number {
  const slots = Number(value);
  return Number.isInteger(slots) && slots >= 1 && slots <= 20 ? slots : readerSlots;
}

export type ReaderJobKind = "full" | "update" | "competitor" | "competitor_replies" | "discover";

export interface QueuedReaderJob {
  id: string;
  kind: ReaderJobKind;
  business_id: string | null;
  place_id: string | null;
  priority: number;
  requested_at: string;
  /** Not claimed before this (a job put back after a Google limit); null = now. */
  not_before?: string | null;
}

/** What a job reads: a customer (business) or a Google place. At most one job per target at a time. */
export function readerJobKey(job: Pick<QueuedReaderJob, "business_id" | "place_id"> & { kind?: string }): string {
  // The competitor search has its own key, so it runs next to the customer's import.
  if (job.kind === "discover") return `discover:${job.business_id}`;
  return job.business_id ? `business:${job.business_id}` : `place:${job.place_id}`;
}

/**
 * Next job to claim: lowest priority number first, then the oldest request. Skips targets already
 * being read. The last free slot (tab) is kept for the customers' own reviews (full/update): the
 * competitor work runs in parallel in the other tabs and never makes a customer wait (owner,
 * 2026-10-09). With a gate (reader-throttle.ts): jobs waiting for a later time stay, and competitor
 * work waits beyond the competitor slots, during a Google pause and the short gap between starts.
 */
export function pickReaderJob(queued: QueuedReaderJob[], busyKeys: ReadonlySet<string>, running: number, slots = readerSlots, gate: ClaimGate = {}): QueuedReaderJob | null {
  if (running >= slots) return null;
  const customersOnly = running >= slots - 1;
  const ordered = [...queued].sort((a, b) => a.priority - b.priority || Date.parse(a.requested_at) - Date.parse(b.requested_at));
  return ordered.find((job) => !busyKeys.has(readerJobKey(job)) && (!customersOnly || isClientJob(job.kind)) && gateAllows(job, gate)) ?? null;
}

/** "update": margin behind the newest stored review (late indexing, time zones). */
export const updateMarginDays = 1;
/** "update": unanswered reviews from this many days are re-read, to pick up the owner's replies. */
export const updateReplyWindowDays = 30;

/**
 * Where an "update" (newest first) may stop: once a page's oldest review is older than both the
 * newest stored review − 1 day and the oldest unanswered stored review of the last 30 days − 1 day.
 * Null (nothing stored) means read the whole history. Mirrors syncStart "visit" in store.ts.
 */
export function updateStopBefore(newestStored: string | null, oldestUnansweredRecent: string | null): Date | null {
  if (!newestStored) return null;
  const newest = Date.parse(newestStored) - updateMarginDays * dayMs;
  const unanswered = oldestUnansweredRecent ? Date.parse(oldestUnansweredRecent) - updateMarginDays * dayMs : newest;
  return new Date(Math.min(newest, unanswered));
}

/** True when the page (newest first) already reaches reviews older than `stopBefore`. */
export function pageReachesStop(reviews: Pick<MapsReview, "published_at">[], stopBefore: Date | null): boolean {
  if (!stopBefore || !reviews.length) return false;
  const oldest = Math.min(...reviews.map((review) => Date.parse(review.published_at)));
  return oldest < stopBefore.getTime();
}

/** "competitor_replies": reviews read at most per place. */
export const repliesMaxReviews = 2000;
/** "competitor_replies": how far back reviews are read (the reply rate's 12-month window). */
export const repliesWindowDays = 365;

/** True when a reply-rate read (newest first) has everything it needs. */
export function repliesReadDone(readCount: number, pageReviews: Pick<MapsReview, "published_at">[], now: Date): boolean {
  if (readCount >= repliesMaxReviews) return true;
  return pageReachesStop(pageReviews, new Date(now.getTime() - repliesWindowDays * dayMs));
}

/** Input of replyRateFrom (competitors.ts): only the date and whether the owner replied. */
export function replySampleFrom(reviews: Pick<MapsReview, "published_at" | "owner_reply" | "owner_replied_at">[]): { publishedAt: string; replied: boolean }[] {
  return reviews.map((review) => ({ publishedAt: review.published_at, replied: Boolean(review.owner_reply || review.owner_replied_at) }));
}

/** Star counts in the format stored in competitor_snapshots.distribution (StarDistribution in place-types.ts). */
export function toStarDistribution(counts: Record<1 | 2 | 3 | 4 | 5, number>) {
  return { oneStar: counts[1], twoStar: counts[2], threeStar: counts[3], fourStar: counts[4], fiveStar: counts[5] };
}

/** Calendar day in Portugal (YYYY-MM-DD), used for "read today" dates. */
export function lisbonDay(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/**
 * Sort order of one of Maps' review requests, from its form body: "newest" when sorted by most
 * recent (last argument [2]), "other" for any other order, null when it cannot be read.
 */
export function reviewRequestSort(postData: string | undefined): "newest" | "other" | null {
  try {
    const outer = JSON.parse(new URLSearchParams(postData ?? "").get("f.req") ?? "");
    const inner = JSON.parse(outer[0][0][1]);
    return JSON.stringify(inner.at(-1)) === "[2]" ? "newest" : "other";
  } catch {
    return null;
  }
}

/** "competitor" (daily): how far back the newest-first read goes (new reviews and recent replies). */
export const competitorDailyDays = 30;
/** Reply rate grace and window, as in replyRateFrom (competitors.ts). */
const replyGraceDaysForSlide = 7;
const replyCountedDays = repliesWindowDays - replyGraceDaysForSlide;

/**
 * APPROXIMATION, until a per-review ledger table exists. The 12-month reply rate is measured once
 * per place ("competitor_replies": up to 2000 reviews). Each daily "competitor" read then slides
 * that 12-month window forward instead of re-reading a whole year:
 * - reviews that turned 7 days old since the previous daily read (they are in the 30-day read)
 *   join the sample, with their reply status as read today;
 * - the same number of days' worth of the oldest reviews leave it: the sample is treated as spread
 *   evenly over the 358 counted days, and the leaving reviews as replied at the current rate.
 * Not seen: replies posted late to reviews already counted, and uneven review pace across the year.
 * With nothing new and no days elapsed the result is unchanged, so running twice a day is harmless.
 */
export function slideReplyRate(
  base: { rate: number | null; sample: number },
  recent: { publishedAt: string; replied: boolean }[],
  daysSinceLastRead: number,
  now: Date,
): { rate: number | null; sample: number } {
  const days = Math.min(Math.max(0, Math.floor(daysSinceLastRead)), competitorDailyDays - replyGraceDaysForSlide);
  if (!days) return base;
  const end = now.getTime() - replyGraceDaysForSlide * dayMs;
  const start = end - days * dayMs;
  const entering = recent.filter((review) => {
    const time = Date.parse(review.publishedAt);
    return time >= start && time < end;
  });
  const kept = Math.max(0, base.sample - (base.sample * days) / replyCountedDays);
  const sample = kept + entering.length;
  if (sample <= 0) return { rate: null, sample: 0 };
  const replied = (base.rate ?? 0) * kept + entering.filter((review) => review.replied).length;
  return { rate: replied / sample, sample: Math.round(sample) };
}

/** Whole days between two calendar days (YYYY-MM-DD). */
export function daysBetween(fromDay: string, toDay: string): number {
  return Math.round((Date.parse(`${toDay}T12:00:00Z`) - Date.parse(`${fromDay}T12:00:00Z`)) / dayMs);
}

/** Same review stored under another id (e.g. `gbp:…` from the Google Business Profile sync): same rating, published within ±2 s. */
export const sameReviewToleranceMs = 2000;

export interface StoredReviewKey {
  review_id: string;
  rating: number;
  published_at: string;
}

/**
 * Matches reviews read from Maps with rows already stored for the business under another id
 * (the Business Profile sync stores reviews it found first as `gbp:<id>`). A read review whose id
 * is not stored but that has a stored row with the same rating published within ±2 s is the same
 * review: the stored row keeps its id. Each stored row matches at most one read review (the closest).
 * Returns the stored id for each matched read id.
 */
export function matchStoredReviews(read: StoredReviewKey[], stored: StoredReviewKey[], toleranceMs = sameReviewToleranceMs): Map<string, string> {
  const readIds = new Set(read.map((review) => review.review_id));
  const storedIds = new Set(stored.map((row) => row.review_id));
  const candidates = stored.filter((row) => !readIds.has(row.review_id));
  const taken = new Set<string>();
  const matches = new Map<string, string>();
  for (const review of read) {
    if (storedIds.has(review.review_id)) continue;
    const time = Date.parse(review.published_at);
    let best: { id: string; distance: number } | null = null;
    for (const row of candidates) {
      if (taken.has(row.review_id) || row.rating !== review.rating) continue;
      const distance = Math.abs(Date.parse(row.published_at) - time);
      if (distance <= toleranceMs && (!best || distance < best.distance)) best = { id: row.review_id, distance };
    }
    if (best) {
      taken.add(best.id);
      matches.set(review.review_id, best.id);
    }
  }
  return matches;
}

// --- Zone search (competitor discovery without a paid provider) ---------------------------------

/** One place of a Google Maps search list, as a visitor without a session sees it. */
export interface MapsSearchPlace {
  /** Google's place id (ChIJ…), from the result's link. */
  placeId: string;
  /** Google's feature id ("0x…:0x…"). */
  fid: string | null;
  title: string;
  lat: number;
  lng: number;
  rating: number | null;
  /** Shown in some layouts only; the competitor read fills it otherwise. */
  reviewsCount: number | null;
  category: string | null;
  permanentlyClosed: boolean;
  temporarilyClosed: boolean;
}

/**
 * One result of a Maps search list (link, its aria-label, the card's image labels and text). The
 * link carries the place id (!19s), feature id (!1s) and coordinates (!3d, !4d); the card text reads
 * "<name> <rating> <category> · <address> …". Null without a place id, name or coordinates.
 */
export function parseSearchResult(raw: { name?: string | null; href?: string | null; labels?: (string | null)[] | null; text?: string | null }): MapsSearchPlace | null {
  let href = raw.href ?? "";
  try {
    href = decodeURIComponent(href);
  } catch {}
  const placeId = href.match(/!19s(ChIJ[\w-]+)/)?.[1];
  const lat = Number(href.match(/!3d(-?\d+(?:\.\d+)?)/)?.[1]);
  const lng = Number(href.match(/!4d(-?\d+(?:\.\d+)?)/)?.[1]);
  // The browser adds "·Link visitado" / "· Visited link" to the label of a place opened before.
  const title = raw.name?.replace(/\s*·\s*(Link visitado|Visited link)\s*$/i, "").trim();
  if (!placeId || !title || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const text = (raw.text ?? "").replace(/\s+/g, " ");
  const ratingLabel = (raw.labels ?? []).find((label): label is string => typeof label === "string" && /estrelas?|stars?/i.test(label)) ?? null;
  const ratingText = ratingLabel?.match(/(\d)[,.](\d)/);
  const countMatch = ratingLabel?.match(/(\d[\d\s.  ]*)\s+(críticas?|reviews?|avaliaç)/i) ?? text.match(/\d[,.]\d\s*\((\d[\d\s.  ]*)\)/);
  const count = countMatch ? Number(countMatch[1].replace(/[^\d]/g, "")) : NaN;
  const category = searchCardCategory(raw.text ?? "");
  return {
    placeId,
    fid: href.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i)?.[1] ?? null,
    title,
    lat,
    lng,
    rating: ratingText ? Number(`${ratingText[1]}.${ratingText[2]}`) : null,
    reviewsCount: Number.isFinite(count) && count > 0 ? count : null,
    category,
    permanentlyClosed: /encerrado permanentemente|fechado permanentemente|permanently closed/i.test(text),
    temporarilyClosed: /temporariamente encerrado|temporariamente fechado|temporarily closed/i.test(text),
  };
}

/** A price level as Maps shows it before the category: "€€", "€10–20", "10-20 €", "Mais de 100 €". */
const pricePrefix = /^(?:mais de\s*\d+\s*[€$£]|[€$£]{1,4}(?:\s*\d[\d.,]*(?:\s*[–-]\s*\d[\d.,]*)?\+?)?|\d[\d.,]*(?:\s*[–-]\s*\d[\d.,]*)?\s*[€$£]\+?)\s*/i;

/**
 * The Google category in a search result card's text (innerText, with its line breaks): the first
 * piece after the rating (and its "(count)") that is not a price, cut at the "·" separators and at
 * line breaks. Seen as "4,8 Restaurante japonês · R. …"; with a price, "4,6(321) · €10–20" on the
 * rating's line and the category on the next. Null when there is no rating to start from or the
 * piece looks like an address (digits).
 */
export function searchCardCategory(cardText: string): string | null {
  const rating = cardText.match(/\d[,.]\d(?:\s*\([\d\s.  ]+\))?/);
  if (!rating || rating.index === undefined) return null;
  for (const piece of cardText.slice(rating.index + rating[0].length).split(/[·⋅\n]/)) {
    const candidate = piece.replace(/\s+/g, " ").trim().replace(pricePrefix, "").trim();
    if (!candidate) continue;
    return candidate.length <= 80 && !/\d/.test(candidate) ? candidate : null;
  }
  return null;
}

/** Coordinates in a Google Maps place link ("!3d<lat>!4d<lng>", else "@<lat>,<lng>"). */
export function coordinatesFromMapsUrl(url: string | null | undefined): { lat: number; lng: number } | null {
  if (!url) return null;
  const precise = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const viewport = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const match = precise ?? viewport;
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

/** What a complete Google profile shows, in the order the panel lists what is missing. */
export const profileItems = ["claimed", "website", "phone", "hours", "description"] as const;
export type ProfileItem = (typeof profileItems)[number];
export type PlaceProfile = Record<ProfileItem, boolean>;

/**
 * The place's own data that Google Maps loads with its page (the "/maps/preview/place" answer, or
 * the same payload inline): the number of photos and which profile fields are filled in. Read
 * from the page the reader opens anyway; no review is read. Positions seen on 2026-10-05:
 * [37][1] photos, [57] owner account (claimed), [7] website, [178] phone, [203] hours,
 * [154] the owner's description, [4][7] the rating (none on a place without reviews), [13] the
 * categories (all of them, main one first; the position common Maps scrapers use, and [13][0] matches
 * the main category Google shows). Null when the payload is not a place.
 */
export function parsePlaceProfile(
  body: string,
): { rating: number | null; photos: number | null; profile: PlaceProfile; category: string | null; categories: string[] } | null {
  let data: unknown;
  try {
    data = JSON.parse(body.replace(/^\)\]\}'\s*/, ""));
  } catch {
    return null;
  }
  const place = Array.isArray(data) && Array.isArray(data[6]) ? (data[6] as unknown[]) : null;
  if (!place || typeof place[11] !== "string") return null;
  const at = (value: unknown, index: number): unknown => (Array.isArray(value) ? value[index] : undefined);
  const filled = (value: unknown) => value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && !value.length);
  const photos = at(place[37], 1);
  // [4][7] is the rating Google shows; a place without any review has no [4] at all.
  const rating = at(place[4], 7);
  // [13] the place's Google categories, the main one first (e.g. ["Treinador pessoal", "Ginásio", …]).
  const categories = placeCategories(place[13]);
  return {
    category: categories[0] ?? null,
    categories,
    rating: typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : null,
    photos: typeof photos === "number" && Number.isInteger(photos) && photos >= 0 ? photos : null,
    profile: {
      claimed: filled(at(place[57], 1)),
      website: filled(at(place[7], 0)),
      phone: filled(place[178]),
      hours: filled(place[203]),
      description: filled(place[154]),
    },
  };
}

/** The Google categories of a place's data ([13]): texts only, trimmed, no repeats, at most 10. */
function placeCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const categories: string[] = [];
  for (const item of value) {
    const text = typeof item === "string" ? item.trim() : "";
    if (!text || text.length > 80 || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    categories.push(text);
    if (categories.length >= 10) break;
  }
  return categories;
}

/** Share of the profile fields filled in (0 to 1). */
export function profileScore(profile: PlaceProfile): number {
  return profileItems.filter((item) => profile[item]).length / profileItems.length;
}
