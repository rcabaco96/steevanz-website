import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOwnerEmail } from "@/lib/booking/email";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";
import { loadCompetition } from "./competitor-store";
import { toRadiusKm } from "./competitors";
import type { DashboardSource, GoogleReview, ReviewBusiness } from "./types";

const pageSize = 1000;
const maxRows = 50_000;

export interface BusinessRow {
  id: string;
  slug: string;
  name: string;
  google_maps_url: string;
  review_url: string;
  plates_installed_on: string | null;
  rating_total: number | null;
  reviews_total: number | null;
  last_synced_at: string | null;
  last_sync_error: string | null;
  alert_email: string | null;
  active_services: string[];
  category?: string | null;
  competitors_refreshed_at?: string | null;
  full_synced_at?: string | null;
  google_fid?: string | null;
  /** Client account that can open the panel (admins always can). */
  owner_id?: string | null;
  /** Owner's contact while there is no account (or alongside it). */
  contact_name?: string | null;
  contact_phone?: string | null;
  invite_sent_at?: string | null;
  /** Competitor search radius chosen by an admin (5 or 10 km). */
  competitor_radius_km?: number | null;
  /** Radius the current competitor list was searched with. */
  competitors_search_radius_km?: number | null;
  /** Selection rule the current competitor list was chosen with (null: the first rule). */
  competitors_rule_version?: number | null;
  created_at: string;
}

const businessColumns =
  "id, slug, name, google_maps_url, review_url, plates_installed_on, rating_total, reviews_total, last_synced_at, last_sync_error, alert_email, active_services, category, google_fid, owner_id, competitor_radius_km, created_at";

export function toBusiness(row: BusinessRow): ReviewBusiness {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    googleMapsUrl: row.google_maps_url,
    reviewUrl: row.review_url,
    platesInstalledOn: row.plates_installed_on,
    ratingTotal: row.rating_total === null ? null : Number(row.rating_total),
    reviewsTotal: row.reviews_total,
    lastSyncedAt: row.last_synced_at,
    activeServices: row.active_services ?? [],
    category: row.category ?? null,
    googleFid: row.google_fid ?? null,
    competitorRadiusKm: toRadiusKm(row.competitor_radius_km),
  };
}

async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; from < maxRows; from += pageSize) {
    const { data, error } = await build(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

/** Products the panel owner has active (client account), or null when the business has no owner. */
async function ownerServices(client: SupabaseClient, ownerId: string | null): Promise<string[] | null> {
  if (!ownerId) return null;
  const { data, error } = await client.from("client_products").select("product_id").eq("user_id", ownerId).eq("status", "active");
  if (error) throw new Error(error.message);
  return ((data ?? []) as { product_id: string }[]).map((row) => row.product_id);
}

export async function getDashboardSource(slug: string): Promise<DashboardSource | null> {
  let client: SupabaseClient;
  try {
    client = createServiceClient();
  } catch {
    return null;
  }

  const { data: businessRow, error } = await client.from("review_businesses").select(businessColumns).eq("slug", slug).maybeSingle<BusinessRow>();
  if (error) throw new Error(error.message);
  if (!businessRow) return null;

  const [reviews, owned] = await Promise.all([
    fetchAll<{
      review_id: string;
      rating: number;
      text: string | null;
      published_at: string;
      owner_reply: string | null;
      owner_replied_at: string | null;
      reviewer_review_count: number | null;
      reviewer_is_local_guide: boolean;
      likes: number;
    }>((from, to) =>
      client
        .from("google_reviews")
        .select("review_id, rating, text, published_at, owner_reply, owner_replied_at, reviewer_review_count, reviewer_is_local_guide, likes")
        .eq("business_id", businessRow.id)
        .order("published_at", { ascending: false })
        .range(from, to),
    ),
    ownerServices(client, businessRow.owner_id ?? null),
  ]);
  // With a client account, what it has active is the truth; the manual list is for businesses without one.
  if (owned) businessRow.active_services = owned;

  const ownReviews = reviews.map(
    (review): GoogleReview => ({
      id: review.review_id,
      rating: review.rating,
      text: review.text,
      publishedAt: review.published_at,
      ownerReply: review.owner_reply,
      ownerRepliedAt: review.owner_replied_at,
      reviewerReviewCount: review.reviewer_review_count,
      reviewerIsLocalGuide: review.reviewer_is_local_guide,
      likes: review.likes,
    }),
  );
  const competition = await loadCompetition(client, businessRow.id, ownReviews, new Date(), {
    name: businessRow.name,
    placeId: (businessRow as { place_id?: string | null }).place_id ?? null,
    rating: businessRow.rating_total === null ? null : Number(businessRow.rating_total),
    reviewsTotal: businessRow.reviews_total,
  }, toRadiusKm(businessRow.competitor_radius_km)).catch((error: unknown) => {
    console.error("[reviews] competition load failed:", error instanceof Error ? error.message : error);
    return null;
  });

  return {
    business: toBusiness(businessRow),
    reviews: ownReviews,
    competition,
  };
}

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

/** Review fields the negative-review email shows. */
export interface AlertReview {
  rating: number;
  published_at: string;
  text: string | null;
}

/**
 * Emails the customer about new negative reviews (1–3★). Called for the reader by
 * /api/reader/alerts and after syncs through the official Google API. Callers check `alert_email` first.
 */
export async function sendNegativeReviewAlert(business: SyncTarget, reviews: AlertReview[]) {
  const many = reviews.length > 1;
  await sendOwnerEmail({
    to: [business.alert_email!],
    subject: many ? `${reviews.length} reviews negativas novas no Google · ${business.name}` : `Nova review de ${reviews[0].rating}★ no Google · ${business.name}`,
    heading: many ? `${reviews.length} reviews negativas novas` : `Nova review de ${reviews[0].rating} estrela${reviews[0].rating === 1 ? "" : "s"}`,
    rows: [
      ...reviews.map((review) => ({
        label: `${stars(review.rating)} · ${new Date(review.published_at).toLocaleDateString("pt-PT", { timeZone: "Europe/Lisbon" })}`,
        value: review.text ?? "(sem texto)",
      })),
      { label: "Dica", value: "Responda com calma e educação, de preferência hoje. Quem lê as reviews dá muita importância às respostas." },
      { label: "Painel", value: `${siteUrl}/painel/${business.slug}` },
    ],
    adminUrl: business.google_maps_url,
    linkLabel: "Responder no Google",
  });
}

export type SyncTarget = Pick<BusinessRow, "id" | "slug" | "name" | "google_maps_url" | "alert_email">;
export const syncTargetColumns = "id, slug, name, google_maps_url, alert_email";

/** Only reviews published in the last 7 days produce an alert: older ones are history, not news. */
export const alertMaxAgeMs = 7 * 86_400_000;
