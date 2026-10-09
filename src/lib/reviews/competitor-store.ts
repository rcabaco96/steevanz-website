import type { PlaceProfile } from "./maps-reader";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  competitorRadiusKm,
  computeCompetition,
  discoveryDue,
  googleMapsLink,
  paceFromDates,
  paceFromSnapshots,
  replyRateFrom,
  shownReplyRate,
  withinRadius,
  type Competition,
  type CompetitorEntry,
  type DiscoveryState,
  competitionTrend,
  entryMonthAgo,
  trendDays,
} from "./competitors";
import { jobPriority, type JobRequester } from "./reader-queue";
import type { GoogleReview } from "./types";

const rediscoverAfterDays = 90;

export interface CompetitorRow {
  id: string;
  place_id: string;
  name: string;
  category: string | null;
  distance_m: number | null;
  is_self: boolean;
  excluded: boolean;
  pace_per_month: number | null;
  pace_measured_at: string | null;
  reply_rate: number | null;
  reply_sample: number | null;
}

interface SnapshotRow {
  competitor_id: string;
  taken_on: string;
  rating: number | null;
  average: number | null;
  reviews_count: number;
  profile: PlaceProfile | null;
}

/**
 * The search of competitors is the free reader's "discover" job (scripts/reader/jobs.mjs), never a
 * paid provider (discoveryDue: never searched, or the radius changed). A new search every 90 days is
 * manual, from the admin. Ratings, star distributions, new reviews and reply rates are read by the
 * reader too (reader-queue.ts), once per Google place for every customer that compares with it.
 */
export function needsDiscovery(business: DiscoveryState): boolean {
  return discoveryDue(business);
}

/** When a new competitor search is suggested in the admin (manual). */
export function rediscoveryDue(business: { competitors_refreshed_at?: string | null }, now = new Date()): boolean {
  return !business.competitors_refreshed_at || now.getTime() - Date.parse(business.competitors_refreshed_at) > rediscoverAfterDays * 86_400_000;
}

/**
 * Queues the reader's competitor search ("discover", free) for one customer. The reader reads the
 * customer's radius when the job starts. False when a search is already queued or running.
 */
export async function queueCompetitorDiscovery(
  client: SupabaseClient,
  businessId: string,
  requestedBy: JobRequester,
  priority: number = jobPriority.firstImport,
): Promise<boolean> {
  const { error } = await client.from("review_import_jobs").insert({ business_id: businessId, kind: "discover", priority, requested_by: requestedBy, provider: "reader" });
  if (error && error.code !== "23505") throw new Error(error.message);
  return !error;
}

/** Everything the dashboard needs, from stored rows only: never reads Google. */
export async function loadCompetition(
  client: SupabaseClient,
  businessId: string,
  ownReviews: GoogleReview[],
  now = new Date(),
  own: { name: string; placeId: string | null; rating: number | null; reviewsTotal: number | null } | null = null,
  radiusKm: number = competitorRadiusKm,
): Promise<Competition | null> {
  const { data, error } = await client
    .from("competitors")
    .select("id, place_id, name, category, distance_m, is_self, excluded, pace_per_month, pace_measured_at, reply_rate, reply_sample")
    .eq("business_id", businessId)
    .eq("excluded", false);
  if (error) throw new Error(error.message);
  // After an admin shrinks the radius, places outside it stop showing at once (the reader's new
  // search then replaces the list; nothing of the shared place data is deleted here).
  const competitors = ((data ?? []) as CompetitorRow[]).filter((row) => row.is_self || withinRadius(row.distance_m, radiusKm));
  if (!competitors.length) return null;
  // Nothing to compare before the competitor search (the customer's own row alone is no competition).
  if (!competitors.some((row) => !row.is_self)) return null;

  const since = new Date(now.getTime() - 100 * 86_400_000).toISOString().slice(0, 10);
  // Up to 100 places with ~14 weekly snapshots each exceeds one 1000-row page, so read in pages.
  const history: SnapshotRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data: page, error: snapshotError } = await client
      .from("competitor_snapshots")
      .select("competitor_id, taken_on, rating, average, reviews_count, profile")
      .in(
        "competitor_id",
        competitors.map((row) => row.id),
      )
      .gte("taken_on", since)
      .order("taken_on")
      .order("id")
      .range(from, from + 999);
    if (snapshotError) throw new Error(snapshotError.message);
    history.push(...((page ?? []) as SnapshotRow[]));
    if (!page || page.length < 1000) break;
  }

  const rows = competitors;
  const ownPace = paceFromDates(
    ownReviews.map((review) => review.publishedAt),
    now,
    Number.POSITIVE_INFINITY,
  );
  // Same rule as for competitors (newest 60, 7 days to 12 months old), from the imported reviews.
  const ownReplies = ownReviews.length
    ? replyRateFrom(
        ownReviews.map((review) => ({ publishedAt: review.publishedAt, replied: Boolean(review.ownerReply?.trim()) })),
        now,
      )
    : null;
  const entries: CompetitorEntry[] = rows.flatMap((row) => {
    const own = history.filter((snapshot) => snapshot.competitor_id === row.id);
    const latest = own[own.length - 1];
    if (!latest) return [];
    const measured = paceFromSnapshots(own.map((snapshot) => ({ takenOn: snapshot.taken_on, reviewsCount: snapshot.reviews_count })), now);
    const replySample = row.is_self ? (ownReplies?.sample ?? null) : row.reply_sample;
    const replyRate = row.is_self ? (ownReplies?.rate ?? null) : row.reply_rate === null ? null : Number(row.reply_rate);
    return [
      {
        id: row.id,
        name: row.name,
        isSelf: row.is_self,
        mapsUrl: googleMapsLink(row.place_id, row.name),
        distanceM: row.distance_m,
        rating: latest.rating === null ? null : Number(latest.rating),
        average: latest.average === null ? null : Number(latest.average),
        reviewsCount: latest.reviews_count,
        pacePerMonth: row.is_self ? (ownReviews.length ? ownPace : null) : (measured ?? (row.pace_per_month === null ? null : Number(row.pace_per_month))),
        replyRate: shownReplyRate(replyRate, replySample),
        replySample,
        // From the newest read that had it (a page without it keeps the last known values).
        profile: own.filter((snapshot) => snapshot.profile !== null).at(-1)?.profile ?? null,
      },
    ];
  });
  // The customer's own row from its import (rating and total Google shows) until its first snapshot.
  // A customer whose import found no review at all (total 0) is in the comparison too, last.
  if (own && (own.rating !== null || own.reviewsTotal === 0) && !entries.some((entry) => entry.isSelf)) {
    const selfRow = rows.find((row) => row.is_self);
    entries.push({
      id: selfRow?.id ?? `self:${businessId}`,
      name: own.name,
      isSelf: true,
      mapsUrl: googleMapsLink(selfRow?.place_id ?? own.placeId ?? "", own.name),
      distanceM: 0,
      rating: own.rating,
      average: null,
      reviewsCount: own.reviewsTotal ?? 0,
      pacePerMonth: ownReviews.length ? ownPace : null,
      replyRate: shownReplyRate(ownReplies?.rate ?? null, ownReplies?.sample ?? null),
      replySample: ownReplies?.sample ?? null,
    });
  }
  const competition = computeCompetition(entries, history.length ? history[history.length - 1].taken_on : null);
  // Arrows in "Na sua zona": each place a month ago against today. A snapshot that old when there
  // is one (exact); otherwise from the reviews (entryMonthAgo).
  if (competition) {
    const sinceMs = now.getTime() - trendDays * 86_400_000;
    const trendSince = new Date(sinceMs).toISOString().slice(0, 10);
    const recentRatings = ownReviews.filter((review) => Date.parse(review.publishedAt) > sinceMs).map((review) => review.rating);
    const then = entries.map((entry) => {
      const old = history.filter((snapshot) => snapshot.competitor_id === entry.id && snapshot.taken_on <= trendSince).at(-1);
      if (!old) return entryMonthAgo(entry, entry.isSelf ? recentRatings : null);
      return {
        ...entry,
        rating: old.rating === null ? null : Number(old.rating),
        average: old.average === null ? null : Number(old.average),
        reviewsCount: old.reviews_count,
      };
    });
    competition.trend = competitionTrend(entries, then, trendSince);
  }
  return competition;
}
