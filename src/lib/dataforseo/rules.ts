/**
 * Pure rules of the DataForSEO reads (tested in tests/dataforseo-rules.test.mjs). Business rules:
 * .claude/skills/regras-negocio-reviews. Never names, photos or profiles of who wrote a review; for
 * competitors only the per-review ledger (date, stars, replied) and aggregates, never texts.
 * Only relative imports, so node --test can load it.
 */
import type { StarDistribution } from "../reviews/apify.ts";
import { distributionAverage, paceFromDates, replyRateFrom, type ReplyRate } from "../reviews/competitors.ts";
import { daysBetween, lisbonDay, repliesMaxReviews, toStarDistribution, updateMarginDays, type MapsReview } from "../reviews/maps-reader.ts";

const dayMs = 86_400_000;

/** Daily reads re-check owner replies to the reviews of the last 7 days. */
export const REPLY_CHECK_DAYS = 7;
/** Once a month per place the re-check covers the last 30 days (late owner replies). */
export const DEEP_REPLY_CHECK_DAYS = 30;
/** Largest depth of a DataForSEO reviews task. */
export const dfsMaxDepth = 4490;
/** Depth goes in multiples of 10 (one Google page). */
export const dfsDepthStep = 10;
/** Extra reviews asked on top of the estimate (deleted reviews, late indexing). */
export const dfsDepthMargin = 10;
/** "update"/"competitor" depth when Google's total is unknown: estimate from the pace, at most this. */
export const paceEstimateMaxDepth = 200;
/** Depth when nothing tells how many reviews a place gets (only for the pace estimate). */
export const unknownPaceDepth = 20;

// --- Depths -----------------------------------------------------------------------------------------

/** Rounds up to a multiple of 10, between 10 and `max`. */
export function roundDepth(value: number, max = dfsMaxDepth): number {
  const rounded = Number.isFinite(value) ? Math.ceil(value / dfsDepthStep) * dfsDepthStep : dfsDepthStep;
  return Math.min(max, Math.max(dfsDepthStep, rounded));
}

/** "full": the whole history, newest first; DataForSEO stops at 4490 (then the read is partial). */
export function fullDepth(reviewsTotal: number | null | undefined): { depth: number; partial: boolean } {
  const total = typeof reviewsTotal === "number" && reviewsTotal > 0 ? reviewsTotal : null;
  return { depth: total === null ? dfsMaxDepth : roundDepth(total), partial: total !== null && total > dfsMaxDepth };
}

/** Reply re-check window of a read: 30 days once a month per place (or never checked), else 7. */
export function replyCheckDays(deepCheckedOn: string | null | undefined, today: string): 7 | 30 {
  if (!deepCheckedOn) return DEEP_REPLY_CHECK_DAYS;
  return daysBetween(deepCheckedOn, today) >= DEEP_REPLY_CHECK_DAYS ? DEEP_REPLY_CHECK_DAYS : REPLY_CHECK_DAYS;
}

/** Start of the reply re-check window (1 day of margin: reads do not happen at the same hour every day). */
export function replyWindowStart(now: Date, checkDays: number): number {
  return now.getTime() - (checkDays + updateMarginDays) * dayMs;
}

/**
 * How far back (publication time, epoch ms) a newest-first read must reach: the newest review we
 * already hold − 1 day (no gaps), and the oldest review of the reply window still without a reply
 * (to pick up the owner's reply). With nothing held, the start of the reply window (`windowStart`)
 * when given. Null when nothing has to be reached (read everything: first import).
 */
export function readReachTarget(input: { newestStoredAt: string | null; oldestUnansweredAt: string | null; windowStart?: number | null }): number | null {
  const candidates: number[] = [];
  if (input.newestStoredAt) candidates.push(Date.parse(input.newestStoredAt) - updateMarginDays * dayMs);
  if (input.oldestUnansweredAt) candidates.push(Date.parse(input.oldestUnansweredAt));
  if (!input.newestStoredAt && input.windowStart !== null && input.windowStart !== undefined) candidates.push(input.windowStart);
  const valid = candidates.filter(Number.isFinite);
  return valid.length ? Math.min(...valid) : null;
}

/** Depth from the pace when Google's total is unknown: reviews expected since `reach`, ×1.5, + margin. */
export function paceEstimateDepth(pacePerMonth: number | null | undefined, reach: number | null, now: Date, max = paceEstimateMaxDepth): number {
  if (pacePerMonth === null || pacePerMonth === undefined || !(pacePerMonth > 0) || reach === null) return roundDepth(unknownPaceDepth, max);
  const days = Math.max(1, (now.getTime() - reach) / dayMs);
  return roundDepth((pacePerMonth / 30) * days * 1.5 + dfsDepthMargin, max);
}

/**
 * OWNER RULE — no gaps: a read always continues from the last review we hold, never "the newest N".
 * DataForSEO reads newest → older, so the depth is what Google has that we do not
 * (googleTotal − storedCount) + the reviews we hold that are newer than the reach target (they are
 * read again on the way: newest-day margin and unanswered reviews of the reply window) + 10.
 * Between 10 and 4490. Without Google's total (or our count), the pace estimate (`fallbackDepth`).
 * If Google's total was stale and the read still stops short, nextFollowUpDepth asks for more.
 */
export function depthSinceLastStored(input: { googleTotal: number | null | undefined; storedCount: number | null | undefined; storedSinceReach: number; fallbackDepth: number }): number {
  const { googleTotal, storedCount } = input;
  if (typeof googleTotal !== "number" || typeof storedCount !== "number") return roundDepth(input.fallbackDepth);
  return roundDepth(Math.max(0, googleTotal - storedCount) + Math.max(0, input.storedSinceReach) + dfsDepthMargin);
}

/**
 * OWNER RULE — no gaps: after a read, if its oldest review is still newer than the reach target,
 * the same job asks again with a bigger depth (until it overlaps or reaches 4490). Null when done:
 * reached, nothing to reach, Google returned fewer than asked (end of the history) or already 4490.
 * The next depth extrapolates from the time span read (×1.2), at least double.
 */
export function nextFollowUpDepth(input: {
  depth: number;
  readCount: number;
  oldestReadAt: string | null;
  newestReadAt: string | null;
  reach: number | null;
  /** 4490, or 2000 for the 12-month reply read. */
  maxDepth?: number;
}): number | null {
  const { depth, readCount, reach } = input;
  const max = input.maxDepth ?? dfsMaxDepth;
  if (reach === null || !readCount || !input.oldestReadAt) return null;
  const oldest = Date.parse(input.oldestReadAt);
  if (!Number.isFinite(oldest) || oldest <= reach) return null;
  if (readCount < depth - dfsDepthStep) return null;
  if (depth >= max) return null;
  const newest = input.newestReadAt ? Date.parse(input.newestReadAt) : NaN;
  const span = newest - oldest;
  const estimate = Number.isFinite(span) && span > 0 ? (readCount * (newest - reach)) / span * 1.2 + dfsDepthMargin : 0;
  return roundDepth(Math.max(depth * 2, estimate), max);
}

/**
 * First read of a place whose pace is unknown: its dates tell how deep 12 months go, and
 * nextFollowUpDepth reads the rest. Never Google's total: that is the whole history, often 5–10
 * times 12 months (on 2026-10-04, 27 502 reviews read where 3 729 were needed).
 */
export const repliesProbeDepth = 100;

/** "competitor_replies": 12 months of reviews, at most 2000, from the pace (×1.25), else a first probe. */
export function repliesDepth(input: { pacePerMonth: number | null | undefined; reviewsTotal: number | null | undefined }): number {
  const total = typeof input.reviewsTotal === "number" && input.reviewsTotal > 0 ? roundDepth(input.reviewsTotal + dfsDepthMargin, repliesMaxReviews) : null;
  const estimate =
    typeof input.pacePerMonth === "number" && input.pacePerMonth > 0 ? roundDepth(input.pacePerMonth * 12 * 1.25 + dfsDepthMargin, repliesMaxReviews) : repliesProbeDepth;
  return total === null ? estimate : Math.min(estimate, total);
}

/** Google's numeric place id (cid) from the feature id "0x…:0x…" stored in review_businesses.google_fid. */
export function cidFromFid(fid: string | null | undefined): string | null {
  const match = fid?.trim().match(/^0x[0-9a-f]+:(0x[0-9a-f]+)$/i);
  if (!match) return null;
  try {
    return BigInt(match[1]).toString();
  } catch {
    return null;
  }
}

// --- DataForSEO items --------------------------------------------------------------------------------

export interface DfsRating {
  value?: number | null;
  votes_count?: number | null;
}

/** One review of business_data/google/reviews (profile_* fields exist but are never read). */
export interface DfsReviewItem {
  type?: string;
  review_id?: string | null;
  timestamp?: string | null;
  rating?: DfsRating | null;
  review_text?: string | null;
  original_review_text?: string | null;
  original_language?: string | null;
  owner_answer?: string | null;
  original_owner_answer?: string | null;
  owner_timestamp?: string | null;
  reviews_count?: number | null;
  local_guide?: boolean | null;
  [key: string]: unknown;
}

export interface DfsReviewsResult {
  place_id?: string | null;
  cid?: string | null;
  title?: string | null;
  rating?: DfsRating | null;
  reviews_count?: number | null;
  items_count?: number | null;
  items?: DfsReviewItem[] | null;
}

/** One place of serp/google/maps (advanced). */
export interface DfsMapsItem {
  type?: string;
  title?: string | null;
  place_id?: string | null;
  cid?: string | null;
  category?: string | null;
  rating?: DfsRating | null;
  rating_distribution?: Record<string, number | null> | null;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: unknown;
}

export interface DfsMapsResult {
  items?: DfsMapsItem[] | null;
  items_count?: number | null;
}

/** "2026-10-02 07:36:58 +00:00" → ISO (UTC). Null when it cannot be read. */
export function parseDfsTimestamp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)\s*(Z|UTC|GMT|[+-]\d{2}:?\d{2})?$/i);
  if (!match) return null;
  const zone = match[3];
  const offset = !zone || /^(z|utc|gmt)$/i.test(zone) ? "Z" : zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
  const time = Date.parse(`${match[1]}T${match[2]}${offset}`);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

const clean = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

function starRating(item: { rating?: DfsRating | null }): number | null {
  const value = item.rating?.value;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) return null;
  return value;
}

/**
 * A customer's review as stored in google_reviews (same shape as the reader's MapsReview). The
 * original text and language when Google translated it; never the name, photo or profile.
 */
export function toCustomerReview(item: DfsReviewItem): MapsReview | null {
  const id = clean(item.review_id);
  const rating = starRating(item);
  const publishedAt = parseDfsTimestamp(item.timestamp);
  if (!id || rating === null || !publishedAt) return null;
  const reply = clean(item.original_owner_answer) ?? clean(item.owner_answer);
  return {
    review_id: id,
    rating,
    text: clean(item.original_review_text) ?? clean(item.review_text),
    language: clean(item.original_language),
    published_at: publishedAt,
    owner_reply: reply,
    owner_replied_at: reply ? parseDfsTimestamp(item.owner_timestamp) : null,
    reviewer_review_count: typeof item.reviews_count === "number" ? item.reviews_count : null,
    reviewer_is_local_guide: item.local_guide === true,
  };
}

/** Ledger row (place_reviews): only the id, date, stars and whether the owner replied. Never texts. */
export interface LedgerRow {
  place_id: string;
  review_id: string;
  published_at: string;
  rating: number;
  replied: boolean;
  replied_at: string | null;
}

export function toLedgerRow(item: DfsReviewItem, placeId: string): LedgerRow | null {
  const id = clean(item.review_id);
  const rating = starRating(item);
  const publishedAt = parseDfsTimestamp(item.timestamp);
  if (!id || rating === null || !publishedAt) return null;
  const repliedAt = parseDfsTimestamp(item.owner_timestamp);
  const replied = Boolean(clean(item.owner_answer) || clean(item.original_owner_answer) || repliedAt);
  return { place_id: placeId, review_id: id, published_at: publishedAt, rating, replied, replied_at: replied ? repliedAt : null };
}

/** Keeps the first of each review id (DataForSEO may repeat one across pages). */
export function uniqueById<T extends { review_id: string }>(rows: (T | null)[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    if (!row || seen.has(row.review_id)) continue;
    seen.add(row.review_id);
    out.push(row);
  }
  return out;
}

/** Oldest and newest publication time of a read. */
export function readSpan(rows: { published_at: string }[]): { oldest: string | null; newest: string | null } {
  if (!rows.length) return { oldest: null, newest: null };
  const sorted = rows.map((row) => row.published_at).sort();
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] };
}

/** {"1": n, …, "5": n} → competitor_snapshots.distribution ({ oneStar, …, fiveStar }). Null without counts. */
export function dfsDistribution(raw: Record<string, number | null> | null | undefined): StarDistribution | null {
  if (!raw || typeof raw !== "object") return null;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let found = 0;
  for (const star of [1, 2, 3, 4, 5] as const) {
    const value = raw[String(star)];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      counts[star] = Math.round(value);
      found++;
    }
  }
  if (!found || Object.values(counts).every((value) => value === 0)) return null;
  return toStarDistribution(counts);
}

const round = (value: number | null, decimals: number) => (value === null ? null : Math.round(value * 10 ** decimals) / 10 ** decimals);

export interface PlaceSnapshot {
  rating: number | null;
  average: number | null;
  reviews_count: number;
  distribution: StarDistribution | null;
}

/** Snapshot of one place of the zone SERP (same format as the reader's and Apify's). Null without a total. */
export function snapshotFromMapsItem(item: DfsMapsItem): PlaceSnapshot | null {
  const total = item.rating?.votes_count;
  if (typeof total !== "number" || !Number.isFinite(total) || total < 0) return null;
  const rating = item.rating?.value;
  const distribution = dfsDistribution(item.rating_distribution);
  return {
    rating: typeof rating === "number" && Number.isFinite(rating) ? round(rating, 1) : null,
    average: round(distributionAverage(distribution), 3),
    reviews_count: Math.round(total),
    distribution,
  };
}

// --- Reply rate from the ledger -------------------------------------------------------------------

/**
 * 12-month reply rate, exact from the ledger: same rule as replyRateFrom (reviews published between
 * 12 months and 7 days ago, newest 2000 at most).
 */
export function replyRateFromLedger(rows: { published_at: string; replied: boolean }[], now: Date): ReplyRate {
  return replyRateFrom(
    rows.map((row) => ({ publishedAt: row.published_at, replied: row.replied })),
    now,
    repliesMaxReviews,
  );
}

/** Reviews per month from the ledger dates (same rule as the reader's competitor_replies). */
export function paceFromLedger(rows: { published_at: string }[], now: Date): number {
  return paceFromDates(
    rows.map((row) => row.published_at),
    now,
    repliesMaxReviews,
  );
}

/**
 * The ledger of a place covers 12 months once a 12-month read wrote it: replies_read_on is set and
 * some ledger row was first seen on or before that day. (The old local reader set replies_read_on
 * without writing a ledger: those places need a new competitor_replies read.)
 */
export function ledgerComplete(repliesReadOn: string | null | undefined, oldestFirstSeenAt: string | null | undefined): boolean {
  if (!repliesReadOn || !oldestFirstSeenAt) return false;
  return lisbonDay(new Date(oldestFirstSeenAt)) <= repliesReadOn;
}

export { lisbonDay };
