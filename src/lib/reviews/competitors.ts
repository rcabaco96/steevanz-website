import type { ApifyPlaceItem, StarDistribution } from "./apify.ts";

export const competitorRadiusKm = 5;
export const competitorLimit = 30;
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
 * reviewed, i.e. the most visible), then other places Google returned for the category search.
 */
export function selectCompetitors(
  self: { placeId: string; category: string; lat: number; lng: number },
  places: ApifyPlaceItem[],
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
      // 0: same Google category, 1: other places Google matched to the category search.
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
    .filter((entry) => entry.rank < 2)
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
  distanceM: number | null;
  rating: number | null;
  average: number | null;
  reviewsCount: number;
  pacePerMonth: number | null;
}

export interface Competition {
  entries: CompetitorEntry[];
  total: number;
  ratingRank: number | null;
  reviewsRank: number;
  paceRank: number | null;
  /** The place right above the customer on each ranking, and how far it is. */
  /** 5-star reviews the customer needs for an exact average above the place right above. */
  ratingGap: { name: string; averageDiff: number; fiveStarsToPass: number | null } | null;
  reviewsGap: { name: string; reviewsDiff: number } | null;
  paceLeader: { name: string; pacePerMonth: number } | null;
  lastSnapshotOn: string | null;
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

export function computeCompetition(entries: CompetitorEntry[], lastSnapshotOn: string | null): Competition | null {
  const self = entries.find((entry) => entry.isSelf);
  if (!self || entries.length < 2) return null;

  const rated = entries.filter((entry) => entry.average !== null || entry.rating !== null).sort(byRating);
  const ratingIndex = rated.findIndex((entry) => entry.isSelf);
  const byReviews = [...entries].sort((a, b) => b.reviewsCount - a.reviewsCount);
  const reviewsIndex = byReviews.findIndex((entry) => entry.isSelf);
  const paced = entries.filter((entry) => entry.pacePerMonth !== null).sort((a, b) => b.pacePerMonth! - a.pacePerMonth!);
  const paceIndex = paced.findIndex((entry) => entry.isSelf);

  const aboveRating = ratingIndex > 0 ? rated[ratingIndex - 1] : null;
  const aboveReviews = reviewsIndex > 0 ? byReviews[reviewsIndex - 1] : null;
  const paceTop = paced[0];

  return {
    entries: [...entries].sort(byRating),
    total: entries.length,
    ratingRank: ratingIndex >= 0 ? ratingIndex + 1 : null,
    reviewsRank: reviewsIndex + 1,
    paceRank: paceIndex >= 0 ? paceIndex + 1 : null,
    ratingGap:
      aboveRating && self.average !== null && aboveRating.average !== null
        ? {
            name: aboveRating.name,
            averageDiff: aboveRating.average - self.average,
            fiveStarsToPass: fiveStarsToBeat(self.average, self.reviewsCount, aboveRating.average),
          }
        : null,
    reviewsGap: aboveReviews ? { name: aboveReviews.name, reviewsDiff: aboveReviews.reviewsCount - self.reviewsCount + 1 } : null,
    paceLeader: paceTop && !paceTop.isSelf ? { name: paceTop.name, pacePerMonth: paceTop.pacePerMonth! } : null,
    lastSnapshotOn,
  };
}
