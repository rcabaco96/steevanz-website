import type { PlaceProfile } from "./maps-reader";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchPlaceByUrl, searchPlacesNear, type ApifyPlaceItem, type StarDistribution } from "./apify";
import {
  competitorLimit,
  competitorRadiusKm,
  computeCompetition,
  distributionAverage,
  googleMapsPlaceUrl,
  paceFromDates,
  paceFromSnapshots,
  replyRateFrom,
  selectCompetitors,
  shownReplyRate,
  type Competition,
  type CompetitorEntry,
  competitionTrend,
  entryMonthAgo,
  trendDays,
} from "./competitors";
import type { GoogleReview } from "./types";
import { dataForSeoConfigured } from "../dataforseo/client";
import { fetchOwnPlace, searchZone } from "../dataforseo/discover";
import { cidFromFid } from "../dataforseo/rules";

const searchResultsPerTerm = 60;
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
  photos_count: number | null;
  profile: PlaceProfile | null;
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

/** "…!1s0xd1acdcaf56a5a53:0xd09a04caf1c7ec58!…" in a Google Maps link → the feature id. */
function fidFromMapsUrl(url: string): string | null {
  return decodeURIComponent(url).match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i)?.[1] ?? null;
}

/** Where the places come from: DataForSEO when configured (~1 cent per customer), else Apify (paid). */
async function placeSource(client: SupabaseClient, business: { id: string; google_maps_url: string }) {
  if (!dataForSeoConfigured()) {
    return {
      self: () => fetchPlaceByUrl(business.google_maps_url),
      near: (term: string, lat: number, lng: number) => searchPlacesNear([term], lat, lng, competitorRadiusKm, searchResultsPerTerm),
    };
  }
  const { data } = await client.from("review_businesses").select("place_id, google_fid").eq("id", business.id).maybeSingle<{ place_id: string | null; google_fid: string | null }>();
  const fid = data?.google_fid ?? fidFromMapsUrl(business.google_maps_url);
  return {
    self: () => fetchOwnPlace({ placeId: data?.place_id ?? null, cid: cidFromFid(fid) }),
    near: (term: string, lat: number, lng: number) => searchZone(term, lat, lng),
  };
}

/**
 * Finds the customer's own place on Google, then the most visible places of the same category
 * within the radius. Places an admin excluded stay excluded across rediscoveries.
 */
export async function discoverCompetitors(client: SupabaseClient, business: { id: string; google_maps_url: string }): Promise<number> {
  const source = await placeSource(client, business);
  const self = await source.self();
  if (!self?.placeId || !self.location || !self.categoryName) throw new Error("Não foi possível encontrar o negócio no Google Maps.");
  const origin = { placeId: self.placeId, category: self.categoryName, lat: self.location.lat, lng: self.location.lng };

  let places = await source.near(origin.category, origin.lat, origin.lng);
  let chosen = selectCompetitors(origin, places);
  const broader = origin.category.split(" ")[0];
  if (chosen.length < competitorLimit && broader && broader !== origin.category) {
    places = [...places, ...(await source.near(broader, origin.lat, origin.lng))];
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
  // DataForSEO's search brings each place's star distribution (the snapshots above are complete);
  // Apify's listing has none: the per-place reads fill it next (reader-queue.ts).
  const { error: doneError } = await client.from("review_businesses").update({ competitors_refreshed_at: now, competitors_snapshot_at: dataForSeoConfigured() ? now : null }).eq("id", business.id);
  if (doneError) throw new Error(doneError.message);
  return chosen.length;
}

/**
 * The daily cron only searches competitors (Apify, paid) for customers that never had them
 * searched. A new search every 90 days is manual, from the admin. Ratings, star
 * distributions, new reviews and reply rates are read by the free local reader (reader-queue.ts),
 * once per Google place for every customer that compares with it.
 */
export function needsDiscovery(business: { competitors_refreshed_at: string | null }): boolean {
  return !business.competitors_refreshed_at;
}

/** When a new competitor search is suggested in the admin (manual). */
export function rediscoveryDue(business: { competitors_refreshed_at?: string | null }, now = new Date()): boolean {
  return !business.competitors_refreshed_at || now.getTime() - Date.parse(business.competitors_refreshed_at) > rediscoverAfterDays * 86_400_000;
}

/** Everything the dashboard needs, from stored rows only: never calls Apify. */
export async function loadCompetition(
  client: SupabaseClient,
  businessId: string,
  ownReviews: GoogleReview[],
  now = new Date(),
  own: { name: string; placeId: string | null; rating: number | null; reviewsTotal: number | null } | null = null,
): Promise<Competition | null> {
  const { data: competitors, error } = await client
    .from("competitors")
    .select("id, place_id, name, category, distance_m, is_self, excluded, pace_per_month, pace_measured_at, reply_rate, reply_sample")
    .eq("business_id", businessId)
    .eq("excluded", false);
  if (error) throw new Error(error.message);
  if (!competitors?.length) return null;
  // Nothing to compare before the competitor search (the customer's own row alone is no competition).
  if (!competitors.some((row) => !row.is_self)) return null;

  const since = new Date(now.getTime() - 100 * 86_400_000).toISOString().slice(0, 10);
  // Up to 100 places with ~14 weekly snapshots each exceeds one 1000-row page, so read in pages.
  const history: SnapshotRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data: page, error: snapshotError } = await client
      .from("competitor_snapshots")
      .select("competitor_id, taken_on, rating, average, reviews_count, photos_count, profile")
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
        // From the newest read that had them (a page without them keeps the last known values).
        photos: own.filter((snapshot) => snapshot.photos_count !== null).at(-1)?.photos_count ?? null,
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
      mapsUrl: googleMapsPlaceUrl(selfRow?.place_id ?? own.placeId ?? ""),
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
