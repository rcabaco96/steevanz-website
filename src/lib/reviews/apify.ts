const reviewsActor = "compass~google-maps-reviews-scraper";
const placesActor = "compass~crawler-google-places";

export const fullImportMaxReviews = 3000;

export interface ApifyReviewItem {
  reviewId?: string | null;
  placeId?: string | null;
  stars?: number | null;
  text?: string | null;
  originalLanguage?: string | null;
  publishedAtDate?: string | null;
  responseFromOwnerText?: string | null;
  responseFromOwnerDate?: string | null;
  reviewerNumberOfReviews?: number | null;
  isLocalGuide?: boolean | null;
  likesCount?: number | null;
  totalScore?: number | null;
  reviewsCount?: number | null;
}

export interface StarDistribution {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

export interface ApifyPlaceItem {
  title?: string | null;
  placeId?: string | null;
  url?: string | null;
  categoryName?: string | null;
  address?: string | null;
  totalScore?: number | null;
  reviewsCount?: number | null;
  reviewsDistribution?: StarDistribution | null;
  location?: { lat: number; lng: number } | null;
  permanentlyClosed?: boolean | null;
  temporarilyClosed?: boolean | null;
  searchString?: string | null;
}

export class ApifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApifyError";
  }
}

export function apifyToken(): string | null {
  return process.env.APIFY_TOKEN?.trim() || null;
}

/** Runs an actor synchronously (Apify caps this at 300 s) and returns its dataset items. */
async function runActor<T>(actor: string, input: Record<string, unknown>): Promise<T[]> {
  const token = apifyToken();
  if (!token) throw new ApifyError("APIFY_TOKEN is not configured");
  const response = await fetch(`https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?timeout=280&format=json&clean=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
    signal: AbortSignal.timeout(295_000),
  });
  if (!response.ok) throw new ApifyError(`Apify responded ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const items: unknown = await response.json();
  if (!Array.isArray(items)) throw new ApifyError("Unexpected Apify response");
  return items as T[];
}

/** Reviews of one place. Personal data (reviewer names and photos) is never requested. */
export function fetchGoogleReviews(googleMapsUrl: string, since: Date | null): Promise<ApifyReviewItem[]> {
  return runActor<ApifyReviewItem>(reviewsActor, {
    startUrls: [{ url: googleMapsUrl }],
    reviewsSort: "newest",
    reviewsOrigin: "google",
    language: "pt-PT",
    personalData: false,
    maxReviews: fullImportMaxReviews,
    ...(since ? { reviewsStartDate: since.toISOString().slice(0, 10) } : {}),
  });
}

/** Publication dates of the newest reviews of several places, to estimate their pace. */
export function fetchRecentReviewDates(placeIds: string[], perPlace: number): Promise<ApifyReviewItem[]> {
  return runActor<ApifyReviewItem>(reviewsActor, {
    placeIds,
    reviewsSort: "newest",
    reviewsOrigin: "google",
    language: "pt-PT",
    personalData: false,
    maxReviews: perPlace,
  });
}

const placeDetails = { language: "pt-PT", scrapePlaceDetailPage: true, maxReviews: 0, maxImages: 0, includeWebResults: false };

export async function fetchPlaceByUrl(googleMapsUrl: string): Promise<ApifyPlaceItem | null> {
  const items = await runActor<ApifyPlaceItem>(placesActor, { ...placeDetails, startUrls: [{ url: googleMapsUrl }], maxCrawledPlacesPerSearch: 1 });
  return items[0] ?? null;
}

/** Listing data only (rating, review count, category, location): fast and cheap for discovery. */
export function searchPlacesNear(searches: string[], lat: number, lng: number, radiusKm: number, perSearch: number): Promise<ApifyPlaceItem[]> {
  return runActor<ApifyPlaceItem>(placesActor, {
    ...placeDetails,
    scrapePlaceDetailPage: false,
    searchStringsArray: searches,
    customGeolocation: { type: "Point", coordinates: [String(lng), String(lat)], radiusKm },
    maxCrawledPlacesPerSearch: perSearch,
    skipClosedPlaces: true,
  });
}

export function fetchPlacesByIds(placeIds: string[]): Promise<ApifyPlaceItem[]> {
  return runActor<ApifyPlaceItem>(placesActor, { ...placeDetails, placeIds });
}
