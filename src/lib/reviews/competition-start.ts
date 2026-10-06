import type { SupabaseClient } from "@supabase/supabase-js";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { dispatchQueuedJobs } from "@/lib/dataforseo/dispatch";
import { discoverCompetitors, needsDiscovery } from "./competitor-store";
import { planningProvider, queueNewCompetitorReads } from "./reader-queue";

/**
 * Competition at the start: a customer that never had competitors searched gets them now (rating,
 * total and stars of every place come with the search), then the reads of each place (new reviews,
 * 12-month reply rate) go to DataForSEO right away (normal queue) instead of waiting for the next
 * 10:00/19:00 slot. Places other customers already share are not read again (newPlaceJobs).
 * Null when the customer already has competitors.
 */
export async function startCompetitionIfMissing(client: SupabaseClient, businessId: string): Promise<{ found: number; queued: number; dispatched: number } | null> {
  const { data, error } = await client
    .from("review_businesses")
    .select("id, google_maps_url, competitors_refreshed_at")
    .eq("id", businessId)
    .maybeSingle<{ id: string; google_maps_url: string; competitors_refreshed_at: string | null }>();
  if (error) throw new Error(error.message);
  if (!data || !needsDiscovery(data)) return null;
  // Never from the panel without DataForSEO: the fallback search is Apify (~1 $ per customer).
  if (!dataForSeoConfigured()) return null;

  const found = await discoverCompetitors(client, data);
  const provider = planningProvider(dataForSeoConfigured());
  const { queued } = await queueNewCompetitorReads(client, businessId, "panel", provider);
  if (provider !== "dataforseo" || !queued) return { found, queued, dispatched: 0 };

  const { data: places } = await client.from("competitors").select("place_id").eq("business_id", businessId).eq("is_self", false).eq("excluded", false);
  const placeIds = ((places ?? []) as { place_id: string }[]).map((row) => row.place_id);
  // Normal queue (half the price of the priority one, usually a few minutes): the table already has
  // rating, total and stars from the search; these reads add pace and reply rate.
  const { dispatched } = await dispatchQueuedJobs(client, { placeIds, maxJobs: 200, highPriorityForPriorityAtMost: 0 });
  return { found, queued, dispatched };
}
