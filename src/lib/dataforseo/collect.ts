/**
 * Fallback for lost postbacks: asks DataForSEO for the result of every running DataForSEO job
 * dispatched more than 5 minutes ago (task_get by the task id the job waits for; results stay
 * available for 30 days) and writes it through the same code as the postback. Also collects zone
 * searches listed as ready, frees leases left by a crashed run and closes jobs that never got an
 * answer. Called by GET /api/dataforseo/collect (and can be called by the scheduler's tick).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { dataForSeo, dfsPaths, dfsUserMessage, DataForSeoError, type DfsTransport } from "./client";
import { processJobTask, processZoneTask, type ProcessOutcome } from "./process";
import type { DfsMapsResult, DfsReviewsResult } from "./rules";
import { dfsJobColumns, dfsProcessingId, dfsReaderId, finishJob, type DfsJobRow } from "./store";

const minuteMs = 60_000;
/** A lease older than this was left by a run that died: the job can be written again. */
export const staleLeaseMinutes = 10;
/** A claimed job without a task id after this long never reached DataForSEO. */
export const lostDispatchMinutes = 30;
/** DataForSEO's standard queue answers within ~45 min; after this long the job is closed. */
export const giveUpHours = 6;

export interface CollectSummary {
  checked: number;
  outcomes: Partial<Record<ProcessOutcome, number>>;
  closed: number;
  zones: number;
  errors: string[];
}

interface ReadyTask {
  id: string;
  tag?: string | null;
}

export async function collectPending(
  client: SupabaseClient,
  options: { dfs?: DfsTransport; olderThanMinutes?: number; maxJobs?: number; deadlineMs?: number; now?: Date; jobIds?: string[]; skipZones?: boolean } = {},
): Promise<CollectSummary> {
  const dfs = options.dfs ?? dataForSeo;
  const now = options.now ?? new Date();
  const started = Date.now();
  const deadline = started + (options.deadlineMs ?? 240_000);
  const summary: CollectSummary = { checked: 0, outcomes: {}, closed: 0, zones: 0, errors: [] };
  const count = (outcome: ProcessOutcome) => (summary.outcomes[outcome] = (summary.outcomes[outcome] ?? 0) + 1);

  // Leases left by a run that died half-way.
  const { error: leaseError } = await client
    .from("review_import_jobs")
    .update({ reader_id: dfsReaderId, updated_at: now.toISOString() })
    .eq("status", "running")
    .eq("provider", "dataforseo")
    .eq("reader_id", dfsProcessingId)
    .lt("updated_at", new Date(now.getTime() - staleLeaseMinutes * minuteMs).toISOString());
  if (leaseError) summary.errors.push(leaseError.message);

  let query = client
    .from("review_import_jobs")
    .select(dfsJobColumns)
    .eq("status", "running")
    .eq("provider", "dataforseo")
    .lt("dispatched_at", new Date(now.getTime() - (options.olderThanMinutes ?? 5) * minuteMs).toISOString());
  if (options.jobIds) query = query.in("id", options.jobIds);
  const { data, error } = await query.order("dispatched_at", { ascending: true }).limit(options.maxJobs ?? 50);
  if (error) throw new Error(error.message);

  for (const job of (data ?? []) as DfsJobRow[]) {
    if (Date.now() > deadline) break;
    const age = now.getTime() - Date.parse(job.dispatched_at ?? job.started_at ?? job.requested_at);
    const taskId = job.external_task_ids?.at(-1);
    try {
      if (!taskId) {
        if (age > lostDispatchMinutes * minuteMs && (await finishJob(client, job.id, { status: "failed", error: "O pedido não chegou ao fornecedor de dados do Google. Tente outra vez." }))) summary.closed++;
        continue;
      }
      summary.checked++;
      const response = await dfs.get<DfsReviewsResult>(dfsPaths.reviewsGet(taskId));
      const task = response.tasks?.[0];
      if (!task) continue;
      const outcome = await processJobTask(client, task, job.id, { dfs, now });
      count(outcome);
      if (outcome === "pending" && age > giveUpHours * 3_600_000) {
        if (await finishJob(client, job.id, { status: "failed", error: "O fornecedor de dados do Google não respondeu a tempo. Tente outra vez." })) summary.closed++;
      }
    } catch (jobError) {
      const message = jobError instanceof Error ? jobError.message : String(jobError);
      summary.errors.push(`${job.id}: ${message}`);
      if (jobError instanceof DataForSeoError && (jobError.kind === "auth" || jobError.kind === "balance")) {
        // Every other job would fail the same way: say why in this one and stop.
        await finishJob(client, job.id, { status: "failed", error: dfsUserMessage(jobError) });
        break;
      }
    }
  }

  // Zone searches whose postback was lost (DataForSEO lists tasks not collected yet).
  if (!options.skipZones && Date.now() < deadline) {
    try {
      const ready = await dfs.get<ReadyTask>(dfsPaths.mapsReady);
      const zoneTasks = (ready.tasks ?? []).flatMap((task) => task.result ?? []).filter((task) => task?.id && task.tag?.startsWith("zone:"));
      for (const ready of zoneTasks) {
        if (Date.now() > deadline) break;
        const response = await dfs.get<DfsMapsResult>(dfsPaths.mapsGet(ready.id));
        const task = response.tasks?.[0];
        if (!task) continue;
        const result = await processZoneTask(client, task, now);
        if (result.outcome === "done") summary.zones++;
      }
    } catch (zoneError) {
      summary.errors.push(`zones: ${zoneError instanceof Error ? zoneError.message : String(zoneError)}`);
    }
  }
  return summary;
}

/** Seconds after dispatch before the panel starts asking DataForSEO itself (priority queue answers in ~30 s). */
export const panelCollectAfterSeconds = 40;
/** At most one task_get per job in this window, however often the panel polls. */
const panelCollectEveryMs = 10_000;
const lastPanelCollect = new Map<string, number>();

/**
 * Someone is waiting in the panel: fetch the results of this business's DataForSEO jobs (its own and
 * the reads of its competitors' places) without
 * waiting for the postback (which never reaches a local server and is sometimes lost). Reading
 * results is free at DataForSEO. Best-effort: errors stay for the regular collect run.
 */
export async function collectForPanel(client: SupabaseClient, businessId: string, now: Date = new Date()): Promise<void> {
  const { data: places } = await client.from("competitors").select("place_id").eq("business_id", businessId).eq("is_self", false);
  const placeIds = [...new Set(((places ?? []) as { place_id: string }[]).map((row) => row.place_id))];
  const owners = placeIds.length ? `business_id.eq.${businessId},place_id.in.(${placeIds.map((id) => `"${id}"`).join(",")})` : `business_id.eq.${businessId}`;
  const { data } = await client
    .from("review_import_jobs")
    .select("id")
    .or(owners)
    .eq("status", "running")
    .eq("provider", "dataforseo")
    .lt("dispatched_at", new Date(now.getTime() - panelCollectAfterSeconds * 1000).toISOString());
  const due = ((data ?? []) as { id: string }[]).map((row) => row.id).filter((id) => now.getTime() - (lastPanelCollect.get(id) ?? 0) >= panelCollectEveryMs);
  if (!due.length) return;
  for (const id of due) lastPanelCollect.set(id, now.getTime());
  await collectPending(client, { jobIds: due, olderThanMinutes: panelCollectAfterSeconds / 60, skipZones: true, deadlineMs: 45_000, now }).catch((error: unknown) =>
    console.error("[painel] collect failed:", error instanceof Error ? error.message : error),
  );
}

/** Writes one zone search by its task id (when the caller kept the id dispatchZoneSnapshot returned). */
export async function collectZoneSnapshot(client: SupabaseClient, taskId: string, options: { dfs?: DfsTransport; now?: Date } = {}) {
  const response = await (options.dfs ?? dataForSeo).get<DfsMapsResult>(dfsPaths.mapsGet(taskId));
  const task = response.tasks?.[0];
  if (!task) return { outcome: "pending" as ProcessOutcome, places: 0, snapshots: 0 };
  return processZoneTask(client, task, options.now);
}
