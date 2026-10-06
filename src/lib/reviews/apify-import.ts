/**
 * «Importar histórico completo» on Apify (owner's choice while DataForSEO is unavailable). The
 * button starts one Apify run (the only paid step) and the job keeps its id; the panel's polling
 * then reads the run's status and item count and, once it finished, its items, and stores them like
 * every Apify sync (upsert by review id: nothing is duplicated). Nothing here starts a second run:
 * pressing the button again is the only way to pay again.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { apifyDatasetCount, apifyDatasetItems, apifyToken, getApifyRun, startGoogleReviewsRun, type ApifyReviewItem } from "./apify";
import { storeApifyReviews, syncTargetColumns, type SyncTarget } from "./store";

/** Whether the full-history button uses Apify (an APIFY_TOKEN is configured). */
export function apifyFullImportEnabled(): boolean {
  return apifyToken() !== null;
}

const failMessage = "O Apify não conseguiu ler as reviews no Google. Tente outra vez.";
/** One status check per job in this window, however often the panel polls. */
const checkEveryMs = 8_000;
const lastCheck = new Map<string, number>();

async function finish(client: SupabaseClient, jobId: string, fields: Record<string, unknown>) {
  const at = new Date().toISOString();
  await client.from("review_import_jobs").update({ ...fields, finished_at: at, updated_at: at }).eq("id", jobId).in("status", ["queued", "running"]);
}

/** Starts the Apify run for a queued full import (the button). The job says why when it cannot. */
export async function startApifyFullImport(client: SupabaseClient, jobId: string): Promise<void> {
  const { data: job } = await client.from("review_import_jobs").select("id, business_id, status").eq("id", jobId).maybeSingle<{ id: string; business_id: string | null; status: string }>();
  if (!job?.business_id || job.status !== "queued") return;
  const { data: business } = await client.from("review_businesses").select("google_maps_url, reviews_total").eq("id", job.business_id).maybeSingle<{ google_maps_url: string; reviews_total: number | null }>();
  if (!business) return;
  const at = new Date().toISOString();
  // Claim first, so a double click never starts two paid runs.
  const { data: claimed } = await client
    .from("review_import_jobs")
    .update({ provider: "apify", status: "running", started_at: at, dispatched_at: at, reviews_expected: business.reviews_total, reviews_done: 0, reviews_new: 0, error: null, updated_at: at })
    .eq("id", jobId)
    .eq("status", "queued")
    .select("id");
  if (!claimed?.length) return;
  try {
    const run = await startGoogleReviewsRun(business.google_maps_url, null);
    await client.from("review_import_jobs").update({ external_task_ids: [run.id], updated_at: new Date().toISOString() }).eq("id", jobId);
  } catch (error) {
    console.error("[apify] full import could not start:", error instanceof Error ? error.message : error);
    await finish(client, jobId, { status: "failed", error: "Não foi possível pedir as reviews ao Apify. Tente outra vez." });
  }
}

interface RunningJob {
  id: string;
  business_id: string;
  external_task_ids: string[] | null;
  started_at: string | null;
}

/** Follows one running Apify job: progress while it runs, everything stored when it finished. */
async function followJob(client: SupabaseClient, job: RunningJob): Promise<void> {
  const runId = job.external_task_ids?.[0];
  if (!runId) {
    // Claimed but the run never started (the request died half-way): close it after 2 minutes.
    if (job.started_at && Date.now() - Date.parse(job.started_at) > 120_000) await finish(client, job.id, { status: "failed", error: failMessage });
    return;
  }
  const run = await getApifyRun(runId);
  if (run.status === "READY" || run.status === "RUNNING" || run.status === "TIMING-OUT" || run.status === "ABORTING") {
    const done = await apifyDatasetCount(run.defaultDatasetId);
    await client.from("review_import_jobs").update({ reviews_done: done, updated_at: new Date().toISOString() }).eq("id", job.id).eq("status", "running");
    return;
  }
  if (run.status !== "SUCCEEDED") {
    await finish(client, job.id, { status: "failed", error: failMessage });
    return;
  }
  // Take the job before storing, so two polls never store the same run twice.
  const { data: taken } = await client
    .from("review_import_jobs")
    .update({ reader_id: "apify-storing", updated_at: new Date().toISOString() })
    .eq("id", job.id)
    .eq("status", "running")
    .is("reader_id", null)
    .select("id");
  if (!taken?.length) return;
  try {
    const { data: business, error } = await client.from("review_businesses").select(syncTargetColumns).eq("id", job.business_id).single<SyncTarget>();
    if (error || !business) throw new Error(error?.message ?? "business not found");
    const { count: before } = await client.from("google_reviews").select("review_id", { count: "exact", head: true }).eq("business_id", job.business_id);
    const items = await apifyDatasetItems<ApifyReviewItem>(run.defaultDatasetId);
    const stored = await storeApifyReviews(client, business, items, { full: true, hadReviews: Boolean(before) });
    await finish(client, job.id, { status: "done", error: null, reviews_done: stored.imported, reviews_new: stored.fresh, pages_done: 1, reader_id: null });
  } catch (error) {
    console.error("[apify] storing the full import failed:", error instanceof Error ? error.message : error);
    // Back to "running" without the lease: the next poll stores it again (the run's items stay on Apify).
    await client.from("review_import_jobs").update({ reader_id: null, updated_at: new Date().toISOString() }).eq("id", job.id).eq("status", "running");
  }
}

async function follow(client: SupabaseClient, jobs: RunningJob[]): Promise<void> {
  const now = Date.now();
  for (const job of jobs) {
    if (now - (lastCheck.get(job.id) ?? 0) < checkEveryMs) continue;
    lastCheck.set(job.id, now);
    await followJob(client, job).catch((error: unknown) => console.error("[apify] follow failed:", error instanceof Error ? error.message : error));
  }
}

const runningColumns = "id, business_id, external_task_ids, started_at";

/** The panel's polling: follows this customer's running Apify import. Starts nothing. */
export async function collectApifyForPanel(client: SupabaseClient, businessId: string): Promise<void> {
  const { data } = await client.from("review_import_jobs").select(runningColumns).eq("business_id", businessId).eq("provider", "apify").eq("status", "running");
  await follow(client, (data ?? []) as RunningJob[]);
}

/** The scheduler tick: follows every running Apify import (when nobody keeps the panel open). Starts nothing. */
export async function collectApifyJobs(client: SupabaseClient): Promise<number> {
  const { data } = await client.from("review_import_jobs").select(runningColumns).eq("provider", "apify").eq("status", "running").limit(20);
  const jobs = (data ?? []) as RunningJob[];
  await follow(client, jobs);
  return jobs.length;
}
