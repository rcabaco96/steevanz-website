import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchPlaceByUrl, fetchPlacesByIds, fetchRecentReviewDates, searchPlacesNear, type ApifyPlaceItem, type StarDistribution } from "./apify";
import {
  competitorLimit,
  competitorRadiusKm,
  computeCompetition,
  distributionAverage,
  googleMapsPlaceUrl,
  paceFromDates,
  paceFromSnapshots,
  paceSampleSize,
  replyRateFrom,
  selectCompetitors,
  shownReplyRate,
  type Competition,
  type CompetitorEntry,
} from "./competitors";
import type { GoogleReview } from "./types";

const searchResultsPerTerm = 60;
/** Places per detailed-snapshot call, so each Apify run stays well inside the time limit. */
const detailBatchSize = 25;
/** Places whose pace is measured per call: each reads ~60 reviews, so batches keep calls short. */
const paceBatchSize = 10;
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
}

function snapshotFrom(place: ApifyPlaceItem) {
  const distribution = place.reviewsDistribution ?? null;
  const average = distributionAverage(distribution);
  return {
    rating: place.totalScore ?? null,
    average: average === null ? null : Math.round(average * 1000) / 1000,
    reviews_count: place.reviewsCount ?? 0,
    distribution: distribution as StarDistribution | null,
  };
}

async function saveSnapshots(client: SupabaseClient, rows: { competitor_id: string; place: ApifyPlaceItem }[]) {
  if (!rows.length) return;
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await client
    .from("competitor_snapshots")
    .upsert(rows.map(({ competitor_id, place }) => ({ competitor_id, taken_on: today, ...snapshotFrom(place) })), { onConflict: "competitor_id,taken_on" });
  if (error) throw new Error(error.message);
}

/**
 * Finds the customer's own place on Google, then the most visible places of the same category
 * within the radius. Places an admin excluded stay excluded across rediscoveries.
 */
export async function discoverCompetitors(client: SupabaseClient, business: { id: string; google_maps_url: string }): Promise<number> {
  const self = await fetchPlaceByUrl(business.google_maps_url);
  if (!self?.placeId || !self.location || !self.categoryName) throw new Error("Não foi possível encontrar o negócio no Google Maps.");
  const origin = { placeId: self.placeId, category: self.categoryName, lat: self.location.lat, lng: self.location.lng };

  let places = await searchPlacesNear([origin.category], origin.lat, origin.lng, competitorRadiusKm, searchResultsPerTerm);
  let chosen = selectCompetitors(origin, places);
  const broader = origin.category.split(" ")[0];
  if (chosen.length < competitorLimit && broader && broader !== origin.category) {
    places = [...places, ...(await searchPlacesNear([broader], origin.lat, origin.lng, competitorRadiusKm, searchResultsPerTerm))];
    chosen = selectCompetitors(origin, places);
  }

  const { error: businessError } = await client
    .from("review_businesses")
    .update({ place_id: origin.placeId, lat: origin.lat, lng: origin.lng, category: origin.category })
    .eq("id", business.id);
  if (businessError) throw new Error(businessError.message);

  const rows = [
    { place_id: origin.placeId, name: self.title ?? "", category: origin.category, address: self.address ?? null, url: self.url ?? null, lat: origin.lat, lng: origin.lng, distance_m: 0, is_self: true },
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
  ].map((row) => ({ ...row, business_id: business.id }));

  const { data: saved, error } = await client.from("competitors").upsert(rows, { onConflict: "business_id,place_id" }).select("id, place_id");
  if (error) throw new Error(error.message);

  // Places that dropped out of the selection go, unless an admin excluded them on purpose.
  const keep = rows.map((row) => row.place_id);
  const { error: pruneError } = await client
    .from("competitors")
    .delete()
    .eq("business_id", business.id)
    .eq("excluded", false)
    .not("place_id", "in", `(${keep.map((id) => `"${id}"`).join(",")})`);
  if (pruneError) throw new Error(pruneError.message);

  const byPlace = new Map((saved ?? []).map((row) => [row.place_id as string, row.id as string]));
  const placeData = new Map<string, ApifyPlaceItem>([[origin.placeId, self], ...places.filter((place) => place.placeId).map((place) => [place.placeId!, place] as const)]);
  await saveSnapshots(
    client,
    keep.flatMap((placeId) => (byPlace.has(placeId) && placeData.has(placeId) ? [{ competitor_id: byPlace.get(placeId)!, place: placeData.get(placeId)! }] : [])),
  );

  const now = new Date().toISOString();
  // The listing has no star distribution: leave the snapshot date empty so details are fetched next.
  const { error: doneError } = await client.from("review_businesses").update({ competitors_refreshed_at: now, competitors_snapshot_at: null }).eq("id", business.id);
  if (doneError) throw new Error(doneError.message);
  return chosen.length;
}

/**
 * One-off per competitor, in batches: newest reviews' dates, so its pace is known before weekly
 * history exists. The same reviews give its reply rate at no extra cost; only the aggregate
 * (share, reviews counted, oldest day counted) is stored, never review or reply texts.
 */
export async function measureCompetitorPace(client: SupabaseClient, businessId: string): Promise<number> {
  const { data, error } = await client
    .from("competitors")
    .select("id, place_id")
    .eq("business_id", businessId)
    .eq("is_self", false)
    .is("pace_measured_at", null)
    .limit(paceBatchSize);
  if (error) throw new Error(error.message);
  if (!data?.length) return 0;
  const items = await fetchRecentReviewDates(
    data.map((row) => row.place_id as string),
    paceSampleSize,
  );
  const now = new Date();
  for (const row of data) {
    const reviews = items.filter((item) => item.placeId === row.place_id && item.publishedAtDate);
    const replies = replyRateFrom(
      reviews.map((item) => ({ publishedAt: item.publishedAtDate!, replied: Boolean(item.responseFromOwnerText?.trim() || item.responseFromOwnerDate) })),
      now,
    );
    const { error: updateError } = await client
      .from("competitors")
      .update({
        pace_per_month: Math.round(paceFromDates(reviews.map((item) => item.publishedAtDate!), now) * 100) / 100,
        pace_measured_at: now.toISOString(),
        reply_rate: replies.rate === null ? null : Math.round(replies.rate * 1000) / 1000,
        reply_sample: replies.sample,
        reply_since: replies.since,
      })
      .eq("id", row.id);
    if (updateError) throw new Error(updateError.message);
  }
  return data.length;
}

/**
 * Weekly, in batches: rating, review count and star distribution of compared places whose last
 * detailed snapshot is over 6 days old. Returns how many were captured; 0 means all are current.
 */
export async function snapshotCompetitors(client: SupabaseClient, businessId: string): Promise<number> {
  const staleBefore = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
  const { data, error } = await client
    .from("competitors")
    .select("id, place_id")
    .eq("business_id", businessId)
    .eq("excluded", false)
    .or(`detailed_on.is.null,detailed_on.lt.${staleBefore}`)
    .order("detailed_on", { ascending: true, nullsFirst: true })
    .limit(detailBatchSize);
  if (error) throw new Error(error.message);
  if (!data?.length) {
    const { error: dateError } = await client.from("review_businesses").update({ competitors_snapshot_at: new Date().toISOString() }).eq("id", businessId);
    if (dateError) throw new Error(dateError.message);
    return 0;
  }
  const places = await fetchPlacesByIds(data.map((row) => row.place_id as string));
  const byPlace = new Map(places.filter((place) => place.placeId).map((place) => [place.placeId!, place]));
  await saveSnapshots(
    client,
    data.flatMap((row) => (byPlace.has(row.place_id) ? [{ competitor_id: row.id as string, place: byPlace.get(row.place_id)! }] : [])),
  );
  // Marked even when Google returned nothing for a place, so one closed place cannot block the queue.
  const { error: markError } = await client
    .from("competitors")
    .update({ detailed_on: new Date().toISOString().slice(0, 10) })
    .in(
      "id",
      data.map((row) => row.id),
    );
  if (markError) throw new Error(markError.message);
  return data.length;
}

export function needsDiscovery(business: { place_id: string | null; competitors_refreshed_at: string | null }, now = new Date()): boolean {
  if (!business.place_id || !business.competitors_refreshed_at) return true;
  return now.getTime() - Date.parse(business.competitors_refreshed_at) > rediscoverAfterDays * 86_400_000;
}

/** Everything the dashboard needs, from stored rows only: never calls Apify. */
export async function loadCompetition(client: SupabaseClient, businessId: string, ownReviews: GoogleReview[], now = new Date()): Promise<Competition | null> {
  const { data: competitors, error } = await client
    .from("competitors")
    .select("id, place_id, name, category, distance_m, is_self, excluded, pace_per_month, pace_measured_at, reply_rate, reply_sample")
    .eq("business_id", businessId)
    .eq("excluded", false);
  if (error) throw new Error(error.message);
  if (!competitors?.length) return null;

  const since = new Date(now.getTime() - 100 * 86_400_000).toISOString().slice(0, 10);
  // Up to 100 places with ~14 weekly snapshots each exceeds one 1000-row page, so read in pages.
  const history: SnapshotRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data: page, error: snapshotError } = await client
      .from("competitor_snapshots")
      .select("competitor_id, taken_on, rating, average, reviews_count")
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

  const rows = competitors as CompetitorRow[];
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
        mapsUrl: googleMapsPlaceUrl(row.place_id),
        distanceM: row.distance_m,
        rating: latest.rating === null ? null : Number(latest.rating),
        average: latest.average === null ? null : Number(latest.average),
        reviewsCount: latest.reviews_count,
        pacePerMonth: row.is_self ? (ownReviews.length ? ownPace : null) : (measured ?? (row.pace_per_month === null ? null : Number(row.pace_per_month))),
        replyRate: shownReplyRate(replyRate, replySample),
        replySample,
      },
    ];
  });
  return computeCompetition(entries, history.length ? history[history.length - 1].taken_on : null);
}

/** Competitor numbers are refreshed weekly; the daily job spreads businesses across the week. */
export function needsSnapshot(business: { competitors_snapshot_at: string | null }, now = new Date()): boolean {
  return !business.competitors_snapshot_at || now.getTime() - Date.parse(business.competitors_snapshot_at) > 6 * 86_400_000;
}
