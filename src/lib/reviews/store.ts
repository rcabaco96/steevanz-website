import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOwnerEmail } from "@/lib/booking/email";
import { siteUrl } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchGoogleReviews, type ApifyReviewItem } from "./apify";
import { isNegative } from "./analytics";
import { loadCompetition } from "./competitor-store";
import type { DashboardSource, GoogleReview, ReviewBusiness } from "./types";

const pageSize = 1000;
const maxRows = 50_000;
/**
 * Business rule (see .claude/skills/regras-negocio-reviews): only import what is not stored yet.
 * - "visit" (opening the dashboard, "Atualizar"): new reviews, plus owner replies to any review
 *   still unanswered from the last 90 days, so a customer can confirm the replies just posted.
 * - "refresh" (daily job): the last 30 days, for replies and edits on recent reviews.
 * - "full" (monthly, "Verificar respostas antigas" once a day, "Reimportar tudo"): the whole
 *   history, so replies to old reviews are picked up too.
 */
export type SyncMode = "visit" | "refresh" | "full";
const dayMs = 86_400_000;
/** Safety margin behind the newest stored review: Google can index reviews late. */
const newestMarginDays = 1;
const visitReplyWindowDays = 90;
const refreshWindowDays = 30;
const fullSyncEveryDays = 30;
/** Customers can trigger a whole-history check at most this often. */
export const customerFullSyncEveryHours = 24;

export function needsFullSync(business: { full_synced_at: string | null }, now = new Date()): boolean {
  return !business.full_synced_at || now.getTime() - Date.parse(business.full_synced_at) > fullSyncEveryDays * dayMs;
}

/** Where an incremental sync starts reading; null means the whole history. */
async function syncStart(client: SupabaseClient, businessId: string, mode: SyncMode, latest: string | null): Promise<Date | null> {
  if (mode === "full" || !latest) return null;
  const newest = Date.parse(latest) - newestMarginDays * dayMs;
  if (mode === "refresh") return new Date(Math.min(newest, Date.parse(latest) - refreshWindowDays * dayMs));
  const { data, error } = await client
    .from("google_reviews")
    .select("published_at")
    .eq("business_id", businessId)
    .is("owner_reply", null)
    .gte("published_at", new Date(Date.now() - visitReplyWindowDays * dayMs).toISOString())
    .order("published_at", { ascending: true })
    .limit(1)
    .maybeSingle<{ published_at: string }>();
  if (error) throw new Error(error.message);
  return new Date(Math.min(newest, data ? Date.parse(data.published_at) - newestMarginDays * dayMs : newest));
}

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
  created_at: string;
}

const businessColumns =
  "id, slug, name, google_maps_url, review_url, plates_installed_on, rating_total, reviews_total, last_synced_at, last_sync_error, alert_email, active_services, category, created_at";

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

  const [reviews] = await Promise.all([
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
  ]);

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
  const competition = await loadCompetition(client, businessRow.id, ownReviews).catch((error: unknown) => {
    console.error("[reviews] competition load failed:", error instanceof Error ? error.message : error);
    return null;
  });

  return {
    business: toBusiness(businessRow),
    reviews: ownReviews,
    competition,
  };
}

function toReviewRow(businessId: string, item: ApifyReviewItem) {
  if (!item.reviewId || !item.publishedAtDate || !item.stars) return null;
  const rating = Math.round(item.stars);
  if (rating < 1 || rating > 5) return null;
  return {
    review_id: item.reviewId,
    business_id: businessId,
    rating,
    text: item.text?.trim() || null,
    language: item.originalLanguage ?? null,
    published_at: item.publishedAtDate,
    owner_reply: item.responseFromOwnerText?.trim() || null,
    owner_replied_at: item.responseFromOwnerDate ?? null,
    reviewer_review_count: item.reviewerNumberOfReviews ?? null,
    reviewer_is_local_guide: Boolean(item.isLocalGuide),
    likes: item.likesCount ?? 0,
    fetched_at: new Date().toISOString(),
  };
}

export interface SyncResult {
  businessId: string;
  slug: string;
  ok: boolean;
  imported: number;
  error?: string;
}

type ReviewRow = NonNullable<ReturnType<typeof toReviewRow>>;

async function unknownReviews(client: SupabaseClient, businessId: string, rows: ReviewRow[]): Promise<ReviewRow[]> {
  const known = new Set<string>();
  for (let index = 0; index < rows.length; index += 100) {
    const { data, error } = await client
      .from("google_reviews")
      .select("review_id")
      .eq("business_id", businessId)
      .in("review_id", rows.slice(index, index + 100).map((row) => row.review_id));
    if (error) throw new Error(error.message);
    for (const row of data ?? []) known.add(row.review_id);
  }
  return rows.filter((row) => !known.has(row.review_id));
}

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

async function sendNegativeReviewAlert(business: SyncTarget, reviews: ReviewRow[]) {
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

const alertMaxAgeMs = 7 * 86_400_000;

/**
 * Imports a business's reviews. The first run fetches the whole history; later runs only fetch
 * from the newest stored review onwards (see SyncMode). Reviews are upserted by id, so the
 * overlap never duplicates anything.
 */
export async function syncBusinessReviews(client: SupabaseClient, business: SyncTarget, mode: SyncMode): Promise<SyncResult> {
  try {
    const { data: latest, error: latestError } = await client
      .from("google_reviews")
      .select("published_at")
      .eq("business_id", business.id)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ published_at: string }>();
    if (latestError) throw new Error(latestError.message);
    const full = mode === "full" || !latest;
    const since = await syncStart(client, business.id, mode, latest?.published_at ?? null);

    const items = await fetchGoogleReviews(business.google_maps_url, since);
    const rows = items.map((item) => toReviewRow(business.id, item)).filter((row) => row !== null);
    // The first import is the whole history, so only later syncs can produce alerts.
    const fresh = latest && business.alert_email ? await unknownReviews(client, business.id, rows) : [];
    for (let index = 0; index < rows.length; index += 500) {
      const { error } = await client.from("google_reviews").upsert(rows.slice(index, index + 500), { onConflict: "review_id" });
      if (error) throw new Error(error.message);
    }

    const place = items.find((item) => item.totalScore !== undefined && item.totalScore !== null);
    const { error: updateError } = await client
      .from("review_businesses")
      .update({
        last_synced_at: new Date().toISOString(),
        last_sync_error: null,
        ...(full ? { full_synced_at: new Date().toISOString() } : {}),
        sync_started_at: null,
        ...(place ? { rating_total: place.totalScore, reviews_total: place.reviewsCount ?? null } : {}),
      })
      .eq("id", business.id);
    if (updateError) throw new Error(updateError.message);

    const negative = fresh.filter((row) => isNegative(row.rating) && Date.now() - Date.parse(row.published_at) < alertMaxAgeMs);
    if (negative.length) await sendNegativeReviewAlert(business, negative);
    return { businessId: business.id, slug: business.slug, ok: true, imported: rows.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[reviews] sync failed for ${business.slug}:`, message);
    await client.from("review_businesses").update({ last_sync_error: message.slice(0, 500), sync_started_at: null }).eq("id", business.id);
    return { businessId: business.id, slug: business.slug, ok: false, imported: 0, error: message };
  }
}

export type SyncStart = "started" | "fresh" | "running" | "missing";

/** Takes the per-business sync lock unless a sync is running or happened in the last `minIntervalSeconds`. */
export async function startReviewSync(client: SupabaseClient, businessId: string, minIntervalSeconds: number): Promise<SyncStart> {
  const { data, error } = await client.rpc("try_start_review_sync", { p_business_id: businessId, p_min_interval_seconds: minIntervalSeconds });
  if (error) throw new Error(error.message);
  return data as SyncStart;
}
