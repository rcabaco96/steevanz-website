import type { NextRequest } from "next/server";
import { nextCompetitionUpdate, previousCompetitionUpdate } from "@/lib/reviews/competition-schedule";
import { loadPlanInputs } from "@/lib/reviews/reader-queue";
import { schedulerKeys } from "@/lib/reviews/tick";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { claimSchedulerKey, loadSchedulerState, restoreSchedulerKey, runCompetitionSlot } from "../_scheduler/routines";

export const maxDuration = 120;

/**
 * Update slot of the shared competition base (10:00 and 19:00 Portuguese time), on demand. The
 * scheduler tick (/api/cron/tick, pg_cron every 15 minutes) normally runs it; this route remains
 * for the local reader service and manual runs. Same planning as the tick (zone snapshots + reply
 * checks per distinct place) and the same scheduler_state, so a slot is never planned twice:
 * when the tick already handled it, nothing happens unless `?force=1`. Never reads Google itself.
 * `?dry=1` returns the plan without side effects.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });
  const dryRun = request.nextUrl.searchParams.get("dry") === "1" || process.env.READER_QUEUE_DRY_RUN === "1";
  const force = request.nextUrl.searchParams.get("force") === "1";
  const now = new Date();
  const slot = previousCompetitionUpdate(now).toISOString();
  const base = { slot, next: nextCompetitionUpdate(now).toISOString(), dryRun };
  try {
    const run = async () => runCompetitionSlot(client, { now, dryRun, inputs: await loadPlanInputs(client), deadline: Date.now() + 90_000 });
    if (dryRun) return Response.json({ ...base, ...(await run()) });
    const previous = (await loadSchedulerState(client)).competitionSlot;
    if (!(await claimSchedulerKey(client, schedulerKeys.competitionSlot, slot)) && !force) return Response.json({ ...base, alreadyHandled: true });
    try {
      return Response.json({ ...base, ...(await run()) });
    } catch (error) {
      await restoreSchedulerKey(client, schedulerKeys.competitionSlot, previous);
      throw error;
    }
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
