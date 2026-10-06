/**
 * Side effects of the scheduler tick (decisions in src/lib/reviews/tick.ts). Shared by
 * /api/cron/tick (pg_cron every 15 minutes) and the older routes /api/cron/competition and
 * /api/cron/sync-reviews, so every path plans the same way and marks the same scheduler_state.
 * Private folder (_scheduler): not a route.
 */
import { apifyFullImportEnabled, collectApifyJobs } from "@/lib/reviews/apify-import";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOwnerEmail } from "@/lib/booking/email";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { collectPending } from "@/lib/dataforseo/collect";
import { dispatchQueuedJobs, dispatchZoneSnapshot } from "@/lib/dataforseo/dispatch";
import { syncVerifiedBusiness } from "@/lib/google/verified-sync";
import { checkReaderHeartbeat, enqueueJobs, hasActiveReaderJobs, loadPlanInputs, planCompetitionSlot, planDailyJobs, planningProvider } from "@/lib/reviews/reader-queue";
import { lisbonDay } from "@/lib/reviews/sync-rules";
import { planZoneSnapshots, schedulerKeys, tickMaxJobs, type SchedulerState } from "@/lib/reviews/tick";
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
  provider: string;
  zoneSnapshots: { planned: number; skippedNoLocation: number; dispatched?: number; errors?: string[] };
  competitor: number;
  competitorReplies: number;
  queue: { queued: number; alreadyActive: number } | null;
}

/**
 * Plans the competitor work of a slot: one zone snapshot per customer with competitors (numbers of
 * every competitor nearby in one DataForSEO request), the per-place 7-day reply checks for places
 * not read since the previous slot, and the one-off 12-month reads of places never measured.
 */
export async function runCompetitionSlot(client: Client, options: { now: Date; dryRun: boolean; inputs: PlanInputs; deadline: number }): Promise<CompetitionSlotResult> {
  const { now, dryRun, inputs, deadline } = options;
  const configured = dataForSeoConfigured();
  const provider = planningProvider(configured);
  const jobs = planCompetitionSlot(inputs.businesses, inputs.competitors, inputs.readerPlaces, now, { provider });
  const zone = configured ? planZoneSnapshots(inputs.businesses, inputs.competitors) : { snapshots: [], skipped: [] };
  const result: CompetitionSlotResult = {
    provider,
    zoneSnapshots: { planned: zone.snapshots.length, skippedNoLocation: zone.skipped.length },
    competitor: jobs.filter((job) => job.kind === "competitor").length,
    competitorReplies: jobs.filter((job) => job.kind === "competitor_replies").length,
    queue: null,
  };
  if (dryRun) return result;

  let dispatched = 0;
  const errors: string[] = [];
  for (const snapshot of zone.snapshots) {
    if (Date.now() > deadline) {
      errors.push(`time budget reached: ${zone.snapshots.length - dispatched - errors.length} snapshots not sent`);
      break;
    }
    try {
      await dispatchZoneSnapshot(client, snapshot);
      dispatched++;
    } catch (error) {
      errors.push(`${snapshot.businessId}: ${message(error)}`);
    }
  }
  result.zoneSnapshots = { ...result.zoneSnapshots, dispatched, ...(errors.length ? { errors } : {}) };
  result.queue = await enqueueJobs(client, jobs, now);
  return result;
}

// --- Customers' daily routine (22:00 Portuguese time) ----------------------------------------------

export interface CustomerRoutineResult {
  provider: string;
  full: string[];
  update: string[];
  queue: { queued: number; alreadyActive: number } | null;
}

/** Daily jobs of non-verified customers: first import "full", else "update" if not updated that day. */
export async function runCustomerJobs(client: Client, options: { now: Date; dryRun: boolean; inputs: PlanInputs }): Promise<CustomerRoutineResult> {
  const { now, dryRun, inputs } = options;
  const provider = planningProvider(dataForSeoConfigured());
  const jobs = planDailyJobs(inputs.businesses, now, provider);
  const slugs = new Map(inputs.businesses.map((business) => [business.id, business.slug]));
  const slugsOf = (kind: string) => jobs.filter((job) => job.kind === kind).map((job) => slugs.get(job.business_id!) ?? job.business_id!);
  return { provider, full: slugsOf("full"), update: slugsOf("update"), queue: dryRun ? null : await enqueueJobs(client, jobs, now) };
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

/**
 * The reader-offline email only matters while some job still runs on the local reader (DataForSEO
 * not configured, or jobs queued for the reader). Otherwise the check is skipped.
 */
export async function runReaderAlert(client: Client, options: { now: Date; dryRun: boolean }) {
  try {
    const needed = !dataForSeoConfigured() || (await hasActiveReaderJobs(client));
    if (!needed) return { skipped: "no job uses the local reader" };
    return await checkReaderHeartbeat(client, { send: sendOwnerEmail, adminUrl: `${siteUrl}/admin/reviews`, now: options.now, dryRun: options.dryRun });
  } catch (error) {
    return { error: message(error) };
  }
}

// --- Every tick ------------------------------------------------------------------------------------

/**
 * Sends queued DataForSEO jobs (panel requests first, then the routine). With DataForSEO switched
 * off, jobs still queued for it (from before it was switched off) go to the reader instead: nothing
 * else would ever pick them up, and while they wait no new job can be queued for the same place.
 */
export async function runDispatch(client: Client, options: { dryRun: boolean }) {
  if (!dataForSeoConfigured()) {
    if (options.dryRun) return { skipped: "DataForSEO is not configured" };
    const { data, error } = await client.from("review_import_jobs").update({ provider: "reader" }).eq("status", "queued").eq("provider", "dataforseo").select("id");
    return { skipped: "DataForSEO is not configured", handedToReader: error ? { error: error.message } : (data?.length ?? 0) };
  }
  if (options.dryRun) return { dryRun: true, maxJobs: tickMaxJobs };
  return dispatchQueuedJobs(client, { maxJobs: tickMaxJobs });
}

/**
 * Fallback for lost DataForSEO postbacks (same logic as GET /api/dataforseo/collect): fetches the
 * results of running jobs dispatched a while ago. Reading results costs nothing at DataForSEO.
 */
export async function runCollect(client: Client, options: { dryRun: boolean; deadlineMs: number }) {
  if (options.dryRun) return { dryRun: true };
  // Apify full imports started from the panel: status and results only (free), never a new run.
  const apify = apifyFullImportEnabled() ? await collectApifyJobs(client).catch((error: unknown) => ({ error: message(error) })) : null;
  if (!dataForSeoConfigured()) return { skipped: "DataForSEO is not configured", apify };
  return { ...(await collectPending(client, { deadlineMs: options.deadlineMs })), apify };
}
