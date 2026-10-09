import type { PlaceProfile } from "./maps-reader.ts";
import type { GooglePlace, StarDistribution } from "./place-types.ts";

/**
 * Business rule (regras-negocio-reviews, rule 5): competitors are searched within 5 or 10 km, chosen
 * per customer by an admin (review_businesses.competitor_radius_km); 10 km by default.
 */
export const competitorRadiusOptions = [5, 10] as const;
export type CompetitorRadiusKm = (typeof competitorRadiusOptions)[number];
export const competitorRadiusKm: CompetitorRadiusKm = 10;
export const competitorLimit = 30;

/** A stored or submitted radius as one of the options (anything else: the default, 10 km). */
export function toRadiusKm(value: unknown): CompetitorRadiusKm {
  const radius = Number(value);
  return competitorRadiusOptions.find((option) => option === radius) ?? competitorRadiusKm;
}

/** "10 km", "5 km". */
export function radiusLabel(radiusKm: number): string {
  return `${String(radiusKm).replace(".", ",")} km`;
}

/**
 * Zoom of the reader's Google Maps zone search: Maps lists the places of the area on screen, so a
 * smaller radius needs a closer view (13z ≈ 10 km around the point, 14z ≈ 5 km).
 */
export function searchZoomFor(radiusKm: number): number {
  return radiusKm <= 5 ? 14 : 13;
}

/** Whether a compared place is within the customer's radius (unknown distance: kept). */
export function withinRadius(distanceM: number | null, radiusKm: number): boolean {
  return distanceM === null || distanceM <= radiusKm * 1000;
}

/** What decides whether a customer's competitors must be searched (again). */
export interface DiscoveryState {
  competitors_refreshed_at: string | null;
  /** Radius chosen by an admin (5 or 10 km). */
  competitor_radius_km?: number | null;
  /** Radius the current list was searched with (null: before radii existed, i.e. 10 km). */
  competitors_search_radius_km?: number | null;
}

/**
 * The competitor search (the free reader's "discover" job) is due for a customer that never had
 * competitors searched, or whose radius an admin changed since the last search.
 */
export function discoveryDue(business: DiscoveryState): boolean {
  if (!business.competitors_refreshed_at) return true;
  return toRadiusKm(business.competitors_search_radius_km ?? competitorRadiusKm) !== toRadiusKm(business.competitor_radius_km);
}

/** How many recent reviews per place are read once to estimate the monthly pace. */
export const paceSampleSize = 60;
const dayMs = 86_400_000;

export interface PlacePoint {
  lat: number;
  lng: number;
}

export function distanceMeters(a: PlacePoint, b: PlacePoint): number {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}

/** The exact average behind Google's rounded rating, from the per-star counts. */
export function distributionAverage(distribution: StarDistribution | null | undefined): number | null {
  if (!distribution) return null;
  const counts = [distribution.oneStar, distribution.twoStar, distribution.threeStar, distribution.fourStar, distribution.fiveStar].map((value) => value ?? 0);
  const total = counts.reduce((sum, value) => sum + value, 0);
  if (!total) return null;
  return counts.reduce((sum, value, index) => sum + value * (index + 1), 0) / total;
}

export interface CompetitorCandidate {
  placeId: string;
  name: string;
  category: string | null;
  address: string | null;
  url: string | null;
  lat: number;
  lng: number;
  distanceM: number;
  reviewsCount: number;
}

/**
 * Picks the places a customer would be compared with: same Google category first (the most
 * reviewed, i.e. the most visible), then places Google matched to the category search, then the
 * rest of the broader search, until the limit is reached.
 */
export function selectCompetitors(
  self: { placeId: string; category: string; lat: number; lng: number },
  places: GooglePlace[],
  radiusKm = competitorRadiusKm,
  limit = competitorLimit,
): CompetitorCandidate[] {
  const seen = new Set<string>([self.placeId]);
  const candidates: { candidate: CompetitorCandidate; rank: number }[] = [];
  for (const place of places) {
    if (!place.placeId || seen.has(place.placeId) || !place.location || !place.title) continue;
    if (place.permanentlyClosed || place.temporarilyClosed || !place.reviewsCount) continue;
    const distanceM = distanceMeters(self, place.location);
    if (distanceM > radiusKm * 1000) continue;
    seen.add(place.placeId);
    candidates.push({
      // 0: same Google category, 1: matched to the category search, 2: the broader search (e.g. "Restaurante").
      rank: place.categoryName === self.category ? 0 : place.searchString === self.category ? 1 : 2,
      candidate: {
        placeId: place.placeId,
        name: place.title.trim(),
        category: place.categoryName ?? null,
        address: place.address ?? null,
        url: place.url ?? null,
        lat: place.location.lat,
        lng: place.location.lng,
        distanceM: Math.round(distanceM),
        reviewsCount: place.reviewsCount,
      },
    });
  }
  return candidates
    .sort((a, b) => a.rank - b.rank || b.candidate.reviewsCount - a.candidate.reviewsCount)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/**
 * Reviews per month from the newest review dates of a place. When the sample is full, the
 * pace is measured over the time the sample spans; otherwise over the last 90 days.
 */
export function paceFromDates(dates: string[], now: Date, sampleSize = paceSampleSize): number {
  const times = dates.map((date) => Date.parse(date)).filter((time) => Number.isFinite(time) && time <= now.getTime());
  if (!times.length) return 0;
  const windowStart = now.getTime() - 90 * dayMs;
  if (times.length >= sampleSize) {
    const oldest = Math.min(...times);
    if (oldest > windowStart) return (times.length / Math.max(1, (now.getTime() - oldest) / dayMs)) * 30;
  }
  return times.filter((time) => time >= windowStart).length / 3;
}

/** Reply rate: reviews younger than this are left out, so owners have had time to answer. */
export const replyGraceDays = 7;
/** Reply rate: only reviews from the last 12 months count, so it reflects current habits. */
export const replyWindowDays = 365;
/** Below this many counted reviews the reply rate is not shown. */
export const replyMinSample = 5;

export interface ReplySampleItem {
  publishedAt: string;
  replied: boolean;
}

export interface ReplyRate {
  /** Share of the counted reviews with an owner reply (0–1); null when none was counted. */
  rate: number | null;
  /** Reviews counted. */
  sample: number;
  /** Publication day (YYYY-MM-DD) of the oldest review counted. */
  since: string | null;
}

/**
 * Share of a place's recent Google reviews that have an owner reply. Takes the newest reviews
 * (as many as the pace sample, which is what competitors are measured with) and counts those
 * published between 12 months and 7 days ago. The customer's own reviews go through the same
 * rule, so the comparison is fair. Only this aggregate is kept: never review texts.
 */
export function replyRateFrom(reviews: ReplySampleItem[], now: Date, sampleSize = paceSampleSize): ReplyRate {
  const nowMs = now.getTime();
  const counted = reviews
    .map((review) => ({ time: Date.parse(review.publishedAt), replied: review.replied }))
    .filter((review) => Number.isFinite(review.time) && review.time <= nowMs)
    .sort((a, b) => b.time - a.time)
    .slice(0, sampleSize)
    .filter((review) => review.time <= nowMs - replyGraceDays * dayMs && review.time >= nowMs - replyWindowDays * dayMs);
  if (!counted.length) return { rate: null, sample: 0, since: null };
  return {
    rate: counted.filter((review) => review.replied).length / counted.length,
    sample: counted.length,
    since: new Date(counted[counted.length - 1].time).toISOString().slice(0, 10),
  };
}

/** The reply rate as shown: hidden when it was not measured or rests on too few reviews. */
export function shownReplyRate(rate: number | null, sample: number | null): number | null {
  return rate === null || sample === null || sample < replyMinSample ? null : rate;
}

export interface SnapshotPoint {
  takenOn: string;
  reviewsCount: number;
}

/** Reviews per month from weekly snapshots, once they cover at least three weeks. */
export function paceFromSnapshots(snapshots: SnapshotPoint[], now: Date): number | null {
  const recent = snapshots
    .filter((snapshot) => now.getTime() - Date.parse(`${snapshot.takenOn}T12:00:00Z`) <= 95 * dayMs)
    .sort((a, b) => a.takenOn.localeCompare(b.takenOn));
  if (recent.length < 2) return null;
  const first = recent[0];
  const last = recent[recent.length - 1];
  const days = (Date.parse(`${last.takenOn}T12:00:00Z`) - Date.parse(`${first.takenOn}T12:00:00Z`)) / dayMs;
  if (days < 21) return null;
  return (Math.max(0, last.reviewsCount - first.reviewsCount) / days) * 30;
}

export interface CompetitorEntry {
  id: string;
  name: string;
  isSelf: boolean;
  /** Google Maps page of the place. */
  mapsUrl: string;
  distanceM: number | null;
  rating: number | null;
  average: number | null;
  reviewsCount: number;
  pacePerMonth: number | null;
  /** Share of recent reviews with an owner reply; null when not measured or under `replyMinSample`. */
  replyRate: number | null;
  /** Reviews the reply rate was measured on; null when not measured yet. */
  replySample: number | null;
  /** Filled profile fields, from the place's page (null until read). */
  profile?: PlaceProfile | null;
  /**
   * «Perfil verificado» (business rule 14): the place belongs to a Steevanz customer whose Google
   * Business Profile is connected (google_link_status = connected). Never set by hand; missing = no.
   */
  verified?: boolean;
}

export interface Competition {
  entries: CompetitorEntry[];
  /** Places in the comparison, the customer included when known. */
  total: number;
  /** Competitors with numbers (the customer excluded). */
  competitors: number;
  /** Null while the customer's own numbers are not known yet. */
  ratingRank: number | null;
  reviewsRank: number | null;
  paceRank: number | null;
  /** The place right above the customer on each ranking, and how far it is. */
  /** 5-star reviews the customer needs for an exact average above the place right above. */
  ratingGap: { name: string; averageDiff: number; fiveStarsToPass: number | null } | null;
  reviewsGap: { name: string; reviewsDiff: number } | null;
  paceLeader: { name: string; pacePerMonth: number } | null;
  lastSnapshotOn: string | null;
  /** Movement since about a month ago (null until there is an old enough snapshot). */
  trend: RankTrend | null;
}

export interface RankTrend {
  /** Day of the comparison point (yyyy-mm-dd). */
  since: string;
  /** Places climbed since then (positive = up), among the places compared on both days. */
  ratingRankChange: number | null;
  reviewsRankChange: number | null;
  /** Relative change of the customer's own number (0.012 = +1,2%). */
  ratingChange: number | null;
  reviewsChange: number | null;
}

/** Age of the comparison point of the arrows. */
export const trendDays = 30;

/**
 * A place's numbers about a month ago when no snapshot is that old (owner rule: the history is the
 * reviews). The customer: today's numbers minus its reviews of the last month (`recentRatings`),
 * which the import always has. A competitor: today's total minus its monthly pace (measured on its
 * recent review dates), with today's rating (its old stars are not known).
 */
export function entryMonthAgo(entry: CompetitorEntry, recentRatings: number[] | null): CompetitorEntry {
  if (entry.isSelf && recentRatings) {
    const count = entry.reviewsCount - recentRatings.length;
    const exact = entry.average ?? entry.rating;
    const average =
      exact === null || count <= 0 ? null : Math.min(5, Math.max(1, (exact * entry.reviewsCount - recentRatings.reduce((sum, value) => sum + value, 0)) / count));
    return { ...entry, reviewsCount: Math.max(0, count), average, rating: average === null ? null : Math.round(average * 10) / 10 };
  }
  return { ...entry, reviewsCount: Math.max(0, entry.reviewsCount - Math.round(entry.pacePerMonth ?? 0)) };
}

/**
 * Movement of the customer between two comparisons of the same places (then and now). Ranks are
 * compared only among places present on both days, so new competitors do not fake a fall.
 */
export function competitionTrend(now: CompetitorEntry[], then: CompetitorEntry[], since: string): RankTrend | null {
  const both = new Set(then.map((entry) => entry.id).filter((id) => now.some((entry) => entry.id === id)));
  const current = computeCompetition(now.filter((entry) => both.has(entry.id)), null);
  const previous = computeCompetition(then.filter((entry) => both.has(entry.id)), null);
  const selfNow = now.find((entry) => entry.isSelf);
  const selfThen = then.find((entry) => entry.isSelf);
  if (!current || !previous || !selfNow || !selfThen) return null;
  const change = (a: number | null, b: number | null) => (a === null || b === null ? null : a - b);
  const relative = (value: number | null, base: number | null) => (value === null || base === null || base === 0 ? null : (value - base) / base);
  return {
    since,
    ratingRankChange: change(previous.ratingRank, current.ratingRank),
    reviewsRankChange: change(previous.reviewsRank, current.reviewsRank),
    ratingChange: relative(selfNow.average ?? selfNow.rating, selfThen.average ?? selfThen.rating),
    reviewsChange: relative(selfNow.reviewsCount, selfThen.reviewsCount),
  };
}

/**
 * Smallest number of new 5-star reviews that lifts an exact average above `target`:
 * (average·count + 5k) / (count + k) > target. Null when only a perfect 5.0 would beat it.
 */
export function fiveStarsToBeat(average: number, count: number, target: number): number | null {
  if (target >= 5 || count <= 0) return null;
  if (average > target) return 0;
  return Math.floor((count * (target - average)) / (5 - target) + 1e-9) + 1;
}

const byRating = (a: CompetitorEntry, b: CompetitorEntry) => (b.average ?? b.rating ?? 0) - (a.average ?? a.rating ?? 0) || b.reviewsCount - a.reviewsCount;

/**
 * The comparison, shown as soon as anyone has numbers: the customer alone, or competitors while the
 * customer's own numbers are still coming (its positions are then null). Null with nobody.
 */
export function computeCompetition(entries: CompetitorEntry[], lastSnapshotOn: string | null): Competition | null {
  if (!entries.length) return null;
  const self = entries.find((entry) => entry.isSelf) ?? null;
  const exact = (entry: CompetitorEntry) => entry.average ?? entry.rating;
  // Positions only once there is someone to be compared with ("1.º de 1" would mislead).
  const ranked = self !== null && entries.some((entry) => !entry.isSelf);

  const rated = entries.filter((entry) => entry.average !== null || entry.rating !== null).sort(byRating);
  // A customer with no review yet has no rating to sort by: it is last, not "loading".
  const selfWithoutReviews = self !== null && exact(self) === null && self.reviewsCount === 0;
  const ratingIndex = !ranked ? -1 : selfWithoutReviews ? rated.length : rated.findIndex((entry) => entry.isSelf);
  const byReviews = [...entries].sort((a, b) => b.reviewsCount - a.reviewsCount);
  const reviewsIndex = ranked ? byReviews.findIndex((entry) => entry.isSelf) : -1;
  const paced = entries.filter((entry) => entry.pacePerMonth !== null).sort((a, b) => b.pacePerMonth! - a.pacePerMonth!);
  const paceIndex = !ranked ? -1 : paced.findIndex((entry) => entry.isSelf);

  const aboveRating = ratingIndex > 0 ? rated[ratingIndex - 1] : null;
  const aboveReviews = reviewsIndex > 0 ? byReviews[reviewsIndex - 1] : null;
  const paceTop = paced[0];

  return {
    entries: [...entries].sort(byRating),
    total: entries.length,
    competitors: entries.filter((entry) => !entry.isSelf).length,
    ratingRank: ratingIndex >= 0 ? ratingIndex + 1 : null,
    reviewsRank: reviewsIndex >= 0 ? reviewsIndex + 1 : null,
    paceRank: paceIndex >= 0 ? paceIndex + 1 : null,
    ratingGap:
      aboveRating && self && exact(self) !== null && exact(aboveRating) !== null
        ? {
            name: aboveRating.name,
            averageDiff: exact(aboveRating)! - exact(self)!,
            fiveStarsToPass: fiveStarsToBeat(exact(self)!, self.reviewsCount, exact(aboveRating)!),
          }
        : null,
    reviewsGap: aboveReviews && self ? { name: aboveReviews.name, reviewsDiff: aboveReviews.reviewsCount - self.reviewsCount + 1 } : null,
    paceLeader: paceTop && !paceTop.isSelf && self ? { name: paceTop.name, pacePerMonth: paceTop.pacePerMonth! } : null,
    lastSnapshotOn,
    trend: null,
  };
}

export function googleMapsPlaceUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}
