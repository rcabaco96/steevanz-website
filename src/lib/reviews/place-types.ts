/**
 * Shapes of the Google place data the product stores (competitor search, competitor snapshots).
 * Everything is read by the free Steevanz reader (scripts/reader); no paid provider. Only type
 * exports and pure helpers, so it can be loaded by node --test and by the reader.
 */

/** Star counts in the format stored in competitor_snapshots.distribution. */
export interface StarDistribution {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

/** A Google Maps place as found by a competitor search: only public, aggregated data. */
export interface GooglePlace {
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
