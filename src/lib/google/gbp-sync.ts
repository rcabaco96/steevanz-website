/**
 * Reviews and owner replies from the official Google Business Profile API (free, no scraping).
 *
 * - "update": pages of 50 ordered by updateTime desc, stopping at the first page that reaches
 *   reviews not touched since google_connections.last_sync_at − 1 day (margin for Google's
 *   delays). Because the order is by update time, new replies and edits on old reviews come too.
 * - "full": every page (whole history).
 *
 * Reviews already stored from Google Maps (review_id = Maps id) are matched first by
 * gbp_review_id, else by same rating + published_at within ±2 s; the match gets gbp_review_id.
 * Reviews we did not have are inserted with review_id `gbp:<reviewId>`.
 *
 * Never stores reviewer names or photos (business rule: no personal data of reviewers).
 * Only relative imports and type imports, so the pure parts can be tested with node --test.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { isNegative } from "../reviews/analytics.ts";
import { accessTokenFor, describeGoogleError, listReviews, needsReconnect, v4LocationPath, type GbpReview, type StarRating } from "./gbp-api.ts";
import { googleOAuthConfig } from "./oauth.ts";

export type GbpSyncMode = "update" | "full";

const dayMs = 86_400_000;
/** "update" re-reads one day before the last sync: Google can show changes late. */
export const updateMarginMs = dayMs;
/** Same review on Maps and in the API: same rating and creation time within 2 seconds. */
export const matchToleranceMs = 2_000;
/** Only reviews published in the last 7 days alert the customer (same rule as store.ts). */
export const alertMaxAgeMs = 7 * dayMs;
const pageSize = 50;
/** 10 000 reviews; far beyond any customer, just a guard against endless paging. */
const maxPages = 200;

const starValues: Record<StarRating, number | null> = { STAR_RATING_UNSPECIFIED: null, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export function starRatingValue(rating: string | undefined | null): number | null {
  return rating ? (starValues[rating as StarRating] ?? null) : null;
}

/**
 * Google adds machine translations to the comment:
 * "(Translated by Google) <translation>\n\n(Original)\n<original>" or
 * "<original>\n\n(Translated by Google)\n<translation>". Keeps only the customer's original words.
 */
export function stripGoogleTranslation(comment: string | undefined | null): string | null {
  if (!comment) return null;
  let text = comment;
  const original = text.indexOf("(Original)");
  if (original >= 0) text = text.slice(original + "(Original)".length);
  else {
    const translated = text.indexOf("(Translated by Google)");
    if (translated >= 0) text = text.slice(0, translated);
  }
  return text.trim() || null;
}

/** What Steevanz keeps of an API review: no reviewer name, no photo. */
export interface MappedReview {
  gbpReviewId: string;
  rating: number;
  text: string | null;
  publishedAt: string;
  ownerReply: string | null;
  ownerRepliedAt: string | null;
  updateTime: string;
}

export function mapGbpReview(review: GbpReview): MappedReview | null {
  const rating = starRatingValue(review.starRating);
  if (!review.reviewId || rating === null || !review.createTime || Number.isNaN(Date.parse(review.createTime))) return null;
  const reply = review.reviewReply?.comment ? stripGoogleTranslation(review.reviewReply.comment) : null;
  return {
    gbpReviewId: review.reviewId,
    rating,
    text: stripGoogleTranslation(review.comment),
    publishedAt: new Date(review.createTime).toISOString(),
    ownerReply: reply,
    ownerRepliedAt: reply && review.reviewReply?.updateTime ? new Date(review.reviewReply.updateTime).toISOString() : null,
    updateTime: review.updateTime ?? review.createTime,
  };
}

/** Oldest update time an "update" sync still needs; null = read everything. */
export function updateCutoff(lastSyncAt: string | null | undefined): number | null {
  if (!lastSyncAt) return null;
  const time = Date.parse(lastSyncAt);
  return Number.isNaN(time) ? null : time - updateMarginMs;
}

/** Pages come newest-update first: once a page holds a review older than the cutoff, stop. */
export function reachedCutoff(pageUpdateTimes: string[], cutoff: number | null): boolean {
  if (cutoff === null) return false;
  return pageUpdateTimes.some((time) => Date.parse(time) < cutoff);
}

export interface StoredReview {
  review_id: string;
  rating: number;
  published_at: string;
  gbp_review_id: string | null;
}

/**
 * Index of the business's stored reviews for matching. `match` returns the stored row an API
 * review belongs to (or null = new review) and claims it, so one Maps row never takes two reviews.
 */
export class ReviewMatcher {
  private readonly byGbpId = new Map<string, StoredReview>();
  private readonly unlinked: StoredReview[] = [];

  constructor(stored: StoredReview[]) {
    for (const row of stored) this.add(row);
  }

  add(row: StoredReview) {
    if (row.gbp_review_id) this.byGbpId.set(row.gbp_review_id, row);
    else this.unlinked.push(row);
  }

  match(review: Pick<MappedReview, "gbpReviewId" | "rating" | "publishedAt">): StoredReview | null {
    const linked = this.byGbpId.get(review.gbpReviewId);
    if (linked) return linked;
    const time = Date.parse(review.publishedAt);
    let best = -1;
    let bestDistance = Infinity;
    this.unlinked.forEach((row, index) => {
      if (row.rating !== review.rating) return;
      const distance = Math.abs(Date.parse(row.published_at) - time);
      if (distance <= matchToleranceMs && distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    if (best < 0) return null;
    const [row] = this.unlinked.splice(best, 1);
    const claimed = { ...row, gbp_review_id: review.gbpReviewId };
    this.byGbpId.set(review.gbpReviewId, claimed);
    return claimed;
  }
}

/** A review the sync inserted (we did not have it). */
export interface NewReview {
  reviewId: string;
  rating: number;
  publishedAt: string;
  text: string | null;
}

export interface GbpSyncResult {
  ok: boolean;
  /** Reviews read from Google and saved (new + updated). */
  imported: number;
  /** Reviews we did not have before. */
  newReviews: number;
  /** The new reviews, so callers can alert (see newNegativeReviewIds). */
  inserted: NewReview[];
  error?: string;
}

/**
 * Ids of new negative reviews (1–3★) published in the last 7 days: the ones worth an alert.
 * Callers should skip alerts on a business's very first import (that is history, not news).
 */
export function newNegativeReviewIds(inserted: NewReview[], nowMs: number = Date.now()): string[] {
  return inserted.filter((review) => isNegative(review.rating) && nowMs - Date.parse(review.publishedAt) < alertMaxAgeMs).map((review) => review.reviewId);
}

/** Row written for a review we already had: keeps Maps-only data (likes, local guide, language). */
export function updateRow(businessId: string, stored: StoredReview, review: MappedReview, fetchedAt: string) {
  return {
    review_id: stored.review_id,
    business_id: businessId,
    rating: review.rating,
    published_at: stored.published_at,
    text: review.text,
    owner_reply: review.ownerReply,
    owner_replied_at: review.ownerRepliedAt,
    gbp_review_id: review.gbpReviewId,
    fetched_at: fetchedAt,
  };
}

export function insertRow(businessId: string, review: MappedReview, fetchedAt: string) {
  return {
    review_id: `gbp:${review.gbpReviewId}`,
    business_id: businessId,
    rating: review.rating,
    text: review.text,
    language: null,
    published_at: review.publishedAt,
    owner_reply: review.ownerReply,
    owner_replied_at: review.ownerRepliedAt,
    reviewer_review_count: null,
    reviewer_is_local_guide: false,
    likes: 0,
    gbp_review_id: review.gbpReviewId,
    fetched_at: fetchedAt,
  };
}

async function loadStored(client: SupabaseClient, businessId: string): Promise<StoredReview[]> {
  const rows: StoredReview[] = [];
  for (let from = 0; from < 50_000; from += 1000) {
    const { data, error } = await client
      .from("google_reviews")
      .select("review_id, rating, published_at, gbp_review_id")
      .eq("business_id", businessId)
      .order("published_at", { ascending: false })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as StoredReview[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

interface SyncConnection {
  account_name: string | null;
  location_name: string | null;
  last_sync_at: string | null;
}

/**
 * Imports reviews and owner replies of a connected business from the Business Profile API.
 * Never throws; failures are saved in google_connections.last_error (Portuguese). A revoked
 * authorization marks the link as "error" so the panel asks the customer to connect again.
 * `deadlineMs`: stop paging after this long (Vercel functions end at 300 s); a "full" sync cut
 * short does not count as a full read.
 */
export async function syncFromGoogleBusiness(client: SupabaseClient, businessId: string, mode: GbpSyncMode, options: { deadlineMs?: number } = {}): Promise<GbpSyncResult> {
  const started = Date.now();
  const deadline = started + (options.deadlineMs ?? 240_000);
  const config = googleOAuthConfig();
  if (!config) return { ok: false, imported: 0, newReviews: 0, inserted: [], error: "A ligação ao Google não está configurada." };

  try {
    const [business, connection] = await Promise.all([
      client.from("review_businesses").select("google_link_status").eq("id", businessId).maybeSingle<{ google_link_status: string }>(),
      client.from("google_connections").select("account_name, location_name, last_sync_at").eq("business_id", businessId).maybeSingle<SyncConnection>(),
    ]);
    if (business.error) throw new Error(business.error.message);
    if (connection.error) throw new Error(connection.error.message);
    const link = connection.data;
    if (business.data?.google_link_status !== "connected" || !link?.account_name || !link.location_name) {
      return { ok: false, imported: 0, newReviews: 0, inserted: [], error: "O Perfil da Empresa no Google não está ligado." };
    }

    const accessToken = await accessTokenFor(client, config, businessId);
    const locationPath = v4LocationPath(link.account_name, link.location_name);
    const cutoff = mode === "update" ? updateCutoff(link.last_sync_at) : null;
    const matcher = new ReviewMatcher(await loadStored(client, businessId));

    const inserted: NewReview[] = [];
    let imported = 0;
    let totals: { rating: number | null; count: number | null } | null = null;
    let complete = false;
    let pageToken: string | undefined;

    for (let page = 0; page < maxPages; page++) {
      const answer = await listReviews(locationPath, { accessToken, pageToken, orderBy: "updateTime desc", pageSize });
      totals ??= {
        rating: typeof answer.averageRating === "number" ? Math.round(answer.averageRating * 10) / 10 : null,
        count: typeof answer.totalReviewCount === "number" ? answer.totalReviewCount : null,
      };
      const fetchedAt = new Date().toISOString();
      const mapped = (answer.reviews ?? []).map(mapGbpReview).filter((review) => review !== null);
      const updates = [];
      const inserts = [];
      for (const review of mapped) {
        const stored = matcher.match(review);
        if (stored) updates.push(updateRow(businessId, stored, review, fetchedAt));
        else {
          const row = insertRow(businessId, review, fetchedAt);
          inserts.push(row);
          matcher.add({ review_id: row.review_id, rating: row.rating, published_at: row.published_at, gbp_review_id: row.gbp_review_id });
          inserted.push({ reviewId: row.review_id, rating: row.rating, publishedAt: row.published_at, text: row.text });
        }
      }
      // Two writes: rows we had keep their Maps-only columns; new rows get every column.
      if (updates.length) {
        const { error } = await client.from("google_reviews").upsert(updates, { onConflict: "review_id" });
        if (error) throw new Error(error.message);
      }
      if (inserts.length) {
        const { error } = await client.from("google_reviews").upsert(inserts, { onConflict: "review_id" });
        if (error) throw new Error(error.message);
      }
      imported += mapped.length;

      pageToken = answer.nextPageToken;
      if (!pageToken) {
        complete = true;
        break;
      }
      if (reachedCutoff((answer.reviews ?? []).map((review) => review.updateTime ?? review.createTime), cutoff)) {
        complete = true;
        break;
      }
      if (Date.now() > deadline) break;
    }

    const now = new Date().toISOString();
    // A first sync (no last_sync_at) reads the whole history, so it counts as a full read.
    const fullRead = complete && cutoff === null;
    const { error: businessError } = await client
      .from("review_businesses")
      .update({
        last_synced_at: now,
        last_sync_error: null,
        ...(fullRead ? { full_synced_at: now } : {}),
        ...(totals?.rating !== null && totals?.rating !== undefined ? { rating_total: totals.rating } : {}),
        ...(totals?.count !== null && totals?.count !== undefined ? { reviews_total: totals.count } : {}),
      })
      .eq("id", businessId);
    if (businessError) throw new Error(businessError.message);
    const { error: connectionError } = await client
      .from("google_connections")
      // Only a sync that reached its end moves the "update" starting point forward.
      .update({ ...(complete ? { last_sync_at: new Date(started).toISOString() } : {}), last_error: null, updated_at: now })
      .eq("business_id", businessId);
    if (connectionError) throw new Error(connectionError.message);

    return { ok: true, imported, newReviews: inserted.length, inserted };
  } catch (error) {
    const message = describeGoogleError(error);
    console.error(`[google] sync failed for ${businessId}:`, error instanceof Error ? error.message : error);
    await client
      .from("google_connections")
      .update({ last_error: message, updated_at: new Date().toISOString() })
      .eq("business_id", businessId)
      .then(() => undefined, () => undefined);
    if (needsReconnect(error)) {
      await client
        .from("review_businesses")
        .update({ google_link_status: "error", google_linked_at: null })
        .eq("id", businessId)
        .then(() => undefined, () => undefined);
    }
    return { ok: false, imported: 0, newReviews: 0, inserted: [], error: message };
  }
}
