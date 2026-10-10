import type { NextRequest } from "next/server";
import { needsDiscovery, queueCompetitorDiscovery } from "@/lib/reviews/competitor-store";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { runReaderAlert } from "../_scheduler/routines";

export const maxDuration = 300;

/**
 * Daily (vercel.json, 06:00 UTC). Queues the free reader's competitor search ("discover") for every
 * customer that needs one: never searched (competitors_refreshed_at null), searched with another
 * radius than the one an admin chose (5, 10, 20 or 30 km per customer), or chosen with an older selection
 * rule (competitorRuleVersion: the category rule of 2026-10-09). The reader reads each customer's
 * radius when the job starts, then queues the reads of the places it chose; the scheduler tick keeps
 * them current. Nothing here reads Google or calls a paid provider. A new search every 90 days is
 * manual, from the admin. Also emails the owner when the local reader has been offline for 12+ hours,
 * only while jobs still use it.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });
  const dryRun = request.nextUrl.searchParams.get("dry") === "1" || process.env.READER_QUEUE_DRY_RUN === "1";

  const reader = await runReaderAlert(client, { now: new Date(), dryRun });

  const { data, error } = await client
    .from("review_businesses")
    .select("id, slug, competitors_refreshed_at, competitor_radius_km, competitors_search_radius_km, competitors_rule_version")
    .order("created_at")
    .range(0, 999);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const pending = (data ?? []).filter(needsDiscovery);
  if (dryRun) return Response.json({ dryRun: true, discover: pending.map((business) => business.slug), reader });

  const results: { slug: string; queued?: boolean; error?: string }[] = [];
  for (const business of pending) {
    try {
      results.push({ slug: business.slug, queued: await queueCompetitorDiscovery(client, business.id, "cron") });
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : String(failure);
      console.error(`[competitors] queuing the search failed for ${business.slug}:`, message);
      results.push({ slug: business.slug, error: message });
    }
  }
  return Response.json({ results, reader });
}
