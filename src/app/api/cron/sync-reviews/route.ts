import type { NextRequest } from "next/server";
import { loadPlanInputs } from "@/lib/reviews/reader-queue";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { runCustomerJobs, runReaderAlert, runVerifiedSyncs } from "../_scheduler/routines";

export const maxDuration = 300;

/**
 * Customers' daily routine, on demand. The scheduler tick (/api/cron/tick) runs it every day at
 * 22:00 Portuguese time; this route remains for manual runs. Never reads Google for non-verified
 * customers: it queues "full" (first import) / "update" (not updated today) jobs for the Steevanz
 * reader. Verified customers not synced today are synced through the official Google API. Then the
 * reader-offline email is checked.
 * Jobs are deduplicated, so running it twice is harmless; it does not mark the tick's routine as done.
 *
 * `?dry=1` (or READER_QUEUE_DRY_RUN=1) returns the plan without queuing anything or sending email.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });
  const dryRun = request.nextUrl.searchParams.get("dry") === "1" || process.env.READER_QUEUE_DRY_RUN === "1";

  try {
    const now = new Date();
    const inputs = await loadPlanInputs(client);
    const customers = await runCustomerJobs(client, { now, dryRun, inputs });
    const verified = await runVerifiedSyncs(client, { now, dryRun, inputs, deadline: now.getTime() + 200_000 });
    // After queuing, so a heartbeat problem never stops the day's work.
    const reader = await runReaderAlert(client, { now, dryRun });
    return Response.json({ dryRun, customers, verified, reader });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[sync-reviews] failed:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
