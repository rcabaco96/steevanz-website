/**
 * Side effects of the scheduler tick (decisions in src/lib/reviews/tick.ts). Shared by
 * /api/cron/tick (pg_cron every 15 minutes) and the older routes /api/cron/competition and
 * /api/cron/sync-reviews, so every path plans the same way and marks the same scheduler_state.
 * Everything is queued for the free Steevanz reader (the only source; no paid provider).
 * Private folder (_scheduler): not a route.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOwnerEmail } from "@/lib/booking/email";
import { syncVerifiedBusiness } from "@/lib/google/verified-sync";
import { checkReaderHeartbeat, enqueueJobs, handRetiredJobsToReader, loadPlanInputs, planCompetitionSlot, planDailyJobs } from "@/lib/reviews/reader-queue";
import { lisbonDay } from "@/lib/reviews/sync-rules";
import { schedulerKeys, type SchedulerState } from "@/lib/reviews/tick";
import { siteUrl } from "@/lib/site";

type Client = SupabaseClient;
export type PlanInputs = Awaited<ReturnType<typeof loadPlanInputs>>;

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// --- scheduler_state -------------------------------------------------------------------------------

export async function loadSchedulerState(client: Client): Promise<SchedulerState> {
  const { data, error } = await client.from("scheduler_state").select("key, value").in("key", Object.values(schedulerKeys));
  if (error) throw new Error(error.message);
  const value = (key: string) => (data ?? []).find((row) => row.key === key)?.value ?? null;
  return { competitionSlot: value(schedulerKeys.competitionSlot), customerDay: value(schedulerKeys.customerDay) };
}

/** True only for the first caller that moves `key` to `value` (atomic, scheduler_claim in the database). */
export async function claimSchedulerKey(client: Client, key: string, value: string): Promise<boolean> {
  const { data, error } = await client.rpc("scheduler_claim", { p_key: key, p_value: value });
  if (error) throw new Error(error.message);
  return data === true;
}

/** Puts a claimed key back after a failure, so the next tick tries again. */
export async function restoreSchedulerKey(client: Client, key: string, value: string | null): Promise<void> {
  const { error } = await client.from("scheduler_state").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) console.error(`[scheduler] could not restore ${key}:`, error.message);
}

// --- Competition slot (10:00 and 19:00 Portuguese time) --------------------------------------------

export interface CompetitionSlotResult {
  competitor: number;
  competitorReplies: number;
  queue: { queued: number; alreadyActive: number } | null;
}

/**
 * Plans the competitor work of a slot for the reader: one "competitor" read per distinct place not
 * read since the slot (numbers, recent reviews and replies), and the one-off 12-month reads of
 * places never measured.
 */
export async function runCompetitionSlot(client: Client, options: { now: Date; dryRun: boolean; inputs: PlanInputs; deadline: number }): Promise<CompetitionSlotResult> {
  const { now, dryRun, inputs } = options;
  const jobs = planCompetitionSlot(inputs.businesses, inputs.competitors, inputs.readerPlaces, now);
  return {
    competitor: jobs.filter((job) => job.kind === "competitor").length,
    competitorReplies: jobs.filter((job) => job.kind === "competitor_replies").length,
    queue: dryRun ? null : await enqueueJobs(client, jobs, now),
  };
}

// --- Customers' daily routine (22:00 Portuguese time) ----------------------------------------------

export interface CustomerRoutineResult {
  full: string[];
  update: string[];
  queue: { queued: number; alreadyActive: number } | null;
}

/** Daily jobs of non-verified customers: first import "full", else "update" if not updated that day. */
export async function runCustomerJobs(client: Client, options: { now: Date; dryRun: boolean; inputs: PlanInputs }): Promise<CustomerRoutineResult> {
  const { now, dryRun, inputs } = options;
  const jobs = planDailyJobs(inputs.businesses, now);
  const slugs = new Map(inputs.businesses.map((business) => [business.id, business.slug]));
  const slugsOf = (kind: string) => jobs.filter((job) => job.kind === kind).map((job) => slugs.get(job.business_id!) ?? job.business_id!);
  return { full: slugsOf("full"), update: slugsOf("update"), queue: dryRun ? null : await enqueueJobs(client, jobs, now) };
}

export interface VerifiedSyncResult {
  due: number;
  synced: { slug: string; ok: boolean; newReviews: number }[];
  left: number;
}

/** Verified customers (Google Business Profile, official API, free) not synced that Portuguese day, within a time budget. */
export async function runVerifiedSyncs(client: Client, options: { now: Date; dryRun: boolean; inputs: PlanInputs; deadline: number }): Promise<VerifiedSyncResult> {
  const { now, dryRun, inputs, deadline } = options;
  const today = lisbonDay(now);
  const due = inputs.businesses.filter((business) => business.google_link_status === "connected" && (!business.last_synced_at || lisbonDay(business.last_synced_at) !== today));
  const synced: VerifiedSyncResult["synced"] = [];
  for (const business of dryRun ? [] : due) {
    if (Date.now() > deadline) break;
    try {
      const result = await syncVerifiedBusiness(client, business.id, { deadlineMs: 60_000 });
      synced.push({ slug: business.slug, ok: result.ok, newReviews: result.newReviews });
    } catch (error) {
      console.error(`[scheduler] verified sync failed for ${business.slug}:`, message(error));
      synced.push({ slug: business.slug, ok: false, newReviews: 0 });
    }
  }
  return { due: due.length, synced, left: dryRun ? due.length : due.length - synced.length };
}

/** Emails the owner when the reader (the only source of reviews) has been silent for 12+ hours, at most once a day. */
export async function runReaderAlert(client: Client, options: { now: Date; dryRun: boolean }) {
  try {
    return await checkReaderHeartbeat(client, { send: sendOwnerEmail, adminUrl: `${siteUrl}/admin/reviews`, now: options.now, dryRun: options.dryRun });
  } catch (error) {
    return { error: message(error) };
  }
}

// --- Every tick ------------------------------------------------------------------------------------

/**
 * Jobs still queued (or left "running") for a provider that no longer exists go back to the reader:
 * nothing else would ever pick them up, and while they wait no new job can be queued for the same
 * target.
 */
export async function runRetiredJobsHandover(client: Client, options: { dryRun: boolean }) {
  if (options.dryRun) return { dryRun: true };
  return { handedToReader: await handRetiredJobsToReader(client) };
}
