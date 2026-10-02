import type { NextRequest } from "next/server";
import { apifyToken } from "@/lib/reviews/apify";
import { startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncResult, type SyncTarget } from "@/lib/reviews/store";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

const concurrency = 3;
const startBudgetMs = 200_000;

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
    .select(syncTargetColumns)
    .order("last_synced_at", { ascending: true, nullsFirst: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const started = Date.now();
  const queue = [...((data ?? []) as SyncTarget[])];
  const results: SyncResult[] = [];
  const worker = async () => {
    while (queue.length && Date.now() - started < startBudgetMs) {
      const business = queue.shift()!;
      if ((await startReviewSync(client, business.id, 3600)) !== "started") continue;
      results.push(await syncBusinessReviews(client, business));
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  return Response.json({ synced: results, deferred: queue.map((business) => business.slug) });
}
