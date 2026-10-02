import type { NextRequest } from "next/server";
import { apifyToken } from "@/lib/reviews/apify";
import { discoverCompetitors, measureCompetitorPace, needsDiscovery, needsSnapshot, snapshotCompetitors } from "@/lib/reviews/competitor-store";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

/** No Apify call starts after this point, so the last one can finish before the 300 s limit. */
const startBudgetMs = 170_000;

/**
 * Runs daily and only touches businesses that need it, in steps: discovery (listing data),
 * then a detailed snapshot (star distributions), then the pace of new competitors in batches.
 * Whatever does not fit carries over to the next day.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!apifyToken()) return Response.json({ error: "APIFY_TOKEN is not configured" }, { status: 500 });
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data, error } = await client
    .from("review_businesses")
    .select("id, slug, google_maps_url, place_id, competitors_refreshed_at, competitors_snapshot_at")
    .order("competitors_snapshot_at", { ascending: true, nullsFirst: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const started = Date.now();
  const hasTime = () => Date.now() - started < startBudgetMs;
  const results: { slug: string; steps: string[]; error?: string }[] = [];
  for (const business of data ?? []) {
    if (!hasTime()) break;
    const steps: string[] = [];
    try {
      let snapshotDue = needsSnapshot(business);
      if (needsDiscovery(business)) {
        await discoverCompetitors(client, business);
        steps.push("discover");
        snapshotDue = true;
      }
      if (snapshotDue && hasTime()) {
        await snapshotCompetitors(client, business.id);
        steps.push("snapshot");
      }
      while (hasTime()) {
        const measured = await measureCompetitorPace(client, business.id);
        if (!measured) break;
        steps.push(`pace:${measured}`);
      }
      if (steps.length) results.push({ slug: business.slug, steps });
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : String(failure);
      console.error(`[competitors] failed for ${business.slug} after ${steps.join(",") || "start"}:`, message);
      results.push({ slug: business.slug, steps, error: message });
    }
  }
  return Response.json({ results, seconds: Math.round((Date.now() - started) / 1000) });
}
