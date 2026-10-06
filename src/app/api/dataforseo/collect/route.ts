import type { NextRequest } from "next/server";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { collectPending } from "@/lib/dataforseo/collect";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

/**
 * Fallback for lost DataForSEO postbacks (Authorization: Bearer CRON_SECRET): fetches the results of
 * running DataForSEO jobs dispatched more than 5 minutes ago and writes them like the postback does.
 * Reading results costs nothing at DataForSEO.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dataForSeoConfigured()) return Response.json({ error: "DataForSEO is not configured" }, { status: 500 });
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });
  try {
    return Response.json(await collectPending(client, { deadlineMs: 240_000 }));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
