import type { NextRequest } from "next/server";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { apifyToken } from "@/lib/reviews/apify";
import { discoverCompetitors, needsDiscovery } from "@/lib/reviews/competitor-store";
import { planningProvider, queueNewCompetitorReads } from "@/lib/reviews/reader-queue";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { runReaderAlert } from "../_scheduler/routines";

export const maxDuration = 300;

/** No search starts after this point, so the last one can finish before the 300 s limit. */
const startBudgetMs = 170_000;

/**
 * Daily (vercel.json, 06:00 UTC). The search of competitors for customers that never had them
 * searched (competitors_refreshed_at null): DataForSEO when configured (~1 cent), else Apify (paid).
 * The panel normally does it at the first import (competition-start.ts); this catches the rest. The new places are
 * then queued (DataForSEO, or the local reader when DataForSEO is not configured) for ratings,
 * star distributions, new reviews and reply rates; the scheduler tick keeps them current (zone
 * snapshots at 10:00 and 19:00). A new search every 90 days is manual, from the admin. Also emails
 * the owner when the local reader has been offline for 12+ hours, only while jobs still use it.
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

  const { data, error } = await client.from("review_businesses").select("id, slug, google_maps_url, competitors_refreshed_at").is("competitors_refreshed_at", null).order("created_at");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const pending = (data ?? []).filter(needsDiscovery);
  if (dryRun) return Response.json({ dryRun: true, discover: pending.map((business) => business.slug), reader });
  if (pending.length && !dataForSeoConfigured() && !apifyToken()) return Response.json({ error: "APIFY_TOKEN is not configured", pending: pending.map((business) => business.slug), reader }, { status: 500 });

  const started = Date.now();
  const results: { slug: string; found?: number; queued?: number; error?: string }[] = [];
  for (const business of pending) {
    if (Date.now() - started > startBudgetMs) break;
    try {
      const found = await discoverCompetitors(client, business);
      const { queued } = await queueNewCompetitorReads(client, business.id, "cron", planningProvider(dataForSeoConfigured()));
      results.push({ slug: business.slug, found, queued });
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : String(failure);
      console.error(`[competitors] discovery failed for ${business.slug}:`, message);
      results.push({ slug: business.slug, error: message });
    }
  }
  return Response.json({ results, reader, seconds: Math.round((Date.now() - started) / 1000) });
}
