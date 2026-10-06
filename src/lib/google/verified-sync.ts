import type { SupabaseClient } from "@supabase/supabase-js";
import { alertMaxAgeMs, sendNegativeReviewAlert, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
import { newNegativeReviewIds, syncFromGoogleBusiness, type GbpSyncResult } from "./gbp-sync";

/**
 * Business rule (regras-negocio-reviews, section 14): verified customers (connected to Google
 * Business Profile) are updated through Google's official API — free and in seconds — never by
 * the reader. Also sends the usual alert for new 1–3★ reviews (never on a first import).
 */
export async function syncVerifiedBusiness(client: SupabaseClient, businessId: string, options: { deadlineMs?: number } = {}): Promise<GbpSyncResult> {
  const { data: business } = await client.from("review_businesses").select(`${syncTargetColumns}, full_synced_at`).eq("id", businessId).maybeSingle<SyncTarget & { full_synced_at: string | null }>();
  const firstImport = !business?.full_synced_at;
  const result = await syncFromGoogleBusiness(client, businessId, firstImport ? "full" : "update", options);
  if (!result.ok || firstImport || !business?.alert_email) return result;

  const ids = newNegativeReviewIds(result.inserted);
  if (!ids.length) return result;
  const { data } = await client
    .from("google_reviews")
    .select("rating, published_at, text")
    .eq("business_id", businessId)
    .in("review_id", ids.slice(0, 100))
    .gte("published_at", new Date(Date.now() - alertMaxAgeMs).toISOString());
  if (data?.length) await sendNegativeReviewAlert(business, data).catch((error: unknown) => console.error("[google] alert failed:", error));
  return result;
}

/** Verified customers not synced today (Lisbon day is decided by the caller). */
export async function verifiedBusinessIds(client: SupabaseClient): Promise<{ id: string; last_synced_at: string | null }[]> {
  const { data, error } = await client.from("review_businesses").select("id, last_synced_at").eq("google_link_status", "connected").limit(5000);
  if (error) throw new Error(error.message);
  return data ?? [];
}
