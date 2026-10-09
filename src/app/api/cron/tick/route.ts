import type { NextRequest } from "next/server";
import { runModuleRoutines } from "@/lib/modules/routines";
import { loadPlanInputs } from "@/lib/reviews/reader-queue";
import { decideTick, schedulerKeys, tickSchedule } from "@/lib/reviews/tick";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import {
  claimSchedulerKey,
  loadSchedulerState,
  restoreSchedulerKey,
  runCompetitionSlot,
  runCustomerJobs,
  runReaderAlert,
  runRetiredJobsHandover,
  runVerifiedSyncs,
  type PlanInputs,
} from "../_scheduler/routines";

export const maxDuration = 300;

/** Last moment to start new verified syncs, so the rest of the tick still fits in 300 s. */
const planningBudgetMs = 150_000;

/**
 * Scheduler tick, called every 15 minutes by Supabase pg_cron (pg_net; SQL in
 * supabase/migrations/20261004190000_scheduler.sql) and once a day by the Vercel cron as a safety
 * net. Decisions in src/lib/reviews/tick.ts (Portuguese time):
 * - 10:00 and 19:00: competitor reads of the slot for the reader (one per distinct place);
 * - 22:00: customers' daily jobs for the reader, verified customers through the official Google API,
 *   reader-offline alert;
 * - every tick: jobs left for a provider that no longer exists are handed to the reader.
 *
 * `?dry=1` (or READER_QUEUE_DRY_RUN=1) returns the decisions and plans without side effects;
 * with `?dry=1&at=<ISO>` the tick is evaluated at that moment.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });
  const params = request.nextUrl.searchParams;
  const dryRun = params.get("dry") === "1" || process.env.READER_QUEUE_DRY_RUN === "1";
  const at = dryRun && params.get("at") ? new Date(params.get("at")!) : null;
  if (at && Number.isNaN(at.getTime())) return Response.json({ error: "invalid at" }, { status: 400 });

  const started = Date.now();
  const deadline = started + planningBudgetMs;
  const now = at ?? new Date();
  const errors: string[] = [];
  const response: Record<string, unknown> = { dryRun, schedule: tickSchedule };

  try {
    const state = await loadSchedulerState(client);
    const decision = decideTick(now, state);
    response.decision = decision;
    let inputs: PlanInputs | null = null;
    const planInputs = async () => (inputs ??= await loadPlanInputs(client));

    if (decision.competition.due) {
      if (dryRun) response.competition = await runCompetitionSlot(client, { now, dryRun, inputs: await planInputs(), deadline });
      else if (await claimSchedulerKey(client, schedulerKeys.competitionSlot, decision.competition.slot)) {
        try {
          response.competition = await runCompetitionSlot(client, { now, dryRun, inputs: await planInputs(), deadline });
        } catch (error) {
          await restoreSchedulerKey(client, schedulerKeys.competitionSlot, state.competitionSlot);
          errors.push(`competition: ${errorText(error)}`);
        }
      } else response.competition = { alreadyHandled: true };
    }

    if (decision.customers.due) {
      if (dryRun) response.customers = await runCustomerJobs(client, { now, dryRun, inputs: await planInputs() });
      else if (await claimSchedulerKey(client, schedulerKeys.customerDay, decision.customers.day)) {
        try {
          response.customers = await runCustomerJobs(client, { now, dryRun, inputs: await planInputs() });
          response.reader = await runReaderAlert(client, { now, dryRun });
        } catch (error) {
          await restoreSchedulerKey(client, schedulerKeys.customerDay, state.customerDay);
          errors.push(`customers: ${errorText(error)}`);
        }
      } else response.customers = { alreadyHandled: true };
      if (dryRun) response.reader = await runReaderAlert(client, { now, dryRun });
    }

    if (decision.customers.verified) {
      try {
        response.verified = await runVerifiedSyncs(client, { now, dryRun, inputs: await planInputs(), deadline });
      } catch (error) {
        errors.push(`verified: ${errorText(error)}`);
      }
    }
  } catch (error) {
    errors.push(`plan: ${errorText(error)}`);
  }

  // Every tick, even when planning failed.
  try {
    response.retiredJobs = await runRetiredJobsHandover(client, { dryRun });
  } catch (error) {
    errors.push(`retired jobs: ${errorText(error)}`);
  }
  // Establishment modules: booking reminders (day before) and waitlist data retention.
  try {
    response.modules = await runModuleRoutines(client, { now, dryRun });
  } catch (error) {
    errors.push(`modules: ${errorText(error)}`);
  }

  response.seconds = Math.round((Date.now() - started) / 1000);
  if (errors.length) {
    console.error("[tick] failed:", errors.join(" | "));
    return Response.json({ ...response, errors }, { status: 500 });
  }
  return Response.json(response);
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
