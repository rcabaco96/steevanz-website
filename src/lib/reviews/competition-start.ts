import type { SupabaseClient } from "@supabase/supabase-js";
import { needsDiscovery, queueCompetitorDiscovery } from "./competitor-store";

/**
 * Competition at the start: a customer whose competitors were never searched (or whose radius an
 * admin changed) gets the free reader's zone search ("discover") queued now, which then queues the
 * reads of each place it chooses (places other customers already share are reused, not read again).
 * False when nothing was due or a search is already waiting.
 */
export async function startCompetitionIfMissing(client: SupabaseClient, businessId: string): Promise<boolean> {
  const { data, error } = await client
    .from("review_businesses")
    .select("id, competitors_refreshed_at, competitor_radius_km, competitors_search_radius_km")
    .eq("id", businessId)
    .maybeSingle<{ id: string; competitors_refreshed_at: string | null; competitor_radius_km: number | null; competitors_search_radius_km: number | null }>();
  if (error) throw new Error(error.message);
  if (!data || !needsDiscovery(data)) return false;
  return queueCompetitorDiscovery(client, businessId, "panel");
}
