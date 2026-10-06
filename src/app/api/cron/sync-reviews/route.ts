import type { NextRequest } from "next/server";
import { apifyToken } from "@/lib/reviews/apify";
import { needsFullSync, startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncResult, type SyncTarget } from "@/lib/reviews/store";
import { dailySyncFor } from "@/lib/reviews/sync-rules";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

const concurrency = 3;
const startBudgetMs = 200_000;

/**
 * Daily routine, at the end of the day (vercel.json): updates the customers who did not press
 * "Atualizar" that day, so nobody is read twice on the same day (see sync-rules.ts).
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
    .select(`${syncTargetColumns}, full_synced_at, last_synced_at`)
    .order("last_synced_at", { ascending: true, nullsFirst: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const started = Date.now();
  const businesses = (data ?? []) as (SyncTarget & { full_synced_at: string | null; last_synced_at: string | null })[];
  const plan = businesses.map((business) => ({ business, mode: dailySyncFor({ lastSyncedAt: business.last_synced_at, fullDue: needsFullSync(business) }) }));
  const skipped = plan.filter((item) => item.mode === "skip").map((item) => item.business.slug);
  const queue = plan.filter((item) => item.mode !== "skip");
  const results: SyncResult[] = [];
  const worker = async () => {
    while (queue.length && Date.now() - started < startBudgetMs) {
      const { business, mode } = queue.shift()!;
      if ((await startReviewSync(client, business.id, 3600)) !== "started") continue;
      // Once a month each business re-reads its whole history, so replies to old reviews show up.
      results.push(await syncBusinessReviews(client, business, mode === "full" ? "full" : "refresh"));
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  return Response.json({ synced: results, skipped, deferred: queue.map((item) => item.business.slug) });
}
