import type { Competition } from "./competitors.ts";

export interface ReviewBusiness {
  id: string;
  slug: string;
  name: string;
  googleMapsUrl: string;
  reviewUrl: string;
  platesInstalledOn: string | null;
  ratingTotal: number | null;
  reviewsTotal: number | null;
  lastSyncedAt: string | null;
  /** Steevanz product ids the customer already pays for. */
  activeServices: string[];
  /** Google Maps category, set when competitors are discovered. */
  category: string | null;
}

export interface NfcPlate {
  code: string;
  label: string;
  active: boolean;
}

export type TapSource = "nfc" | "qr";
export type TapDevice = "ios" | "android" | "other";

export interface NfcTap {
  plateCode: string;
  source: TapSource;
  device: TapDevice;
  visitorHash: string;
  tappedAt: string;
}

export interface GoogleReview {
  id: string;
  rating: number;
  text: string | null;
  publishedAt: string;
  ownerReply: string | null;
  ownerRepliedAt: string | null;
  reviewerReviewCount: number | null;
  reviewerIsLocalGuide: boolean;
  likes: number;
}


export interface DashboardSource {
  business: ReviewBusiness;
  plates: NfcPlate[];
  taps: NfcTap[];
  reviews: GoogleReview[];
  competition: Competition | null;
}

export type DashboardSyncResponse =
  | { status: "synced"; imported: number }
  | { status: "fresh" | "running" }
  | { status: "error"; message: string };

export interface ThemeReview {
  id: string;
  rating: number;
  text: string | null;
  publishedAt: string;
  replied: boolean;
}
