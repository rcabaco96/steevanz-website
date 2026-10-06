/**
 * Sends queued jobs (review_import_jobs, provider = 'dataforseo') to DataForSEO. Each job becomes
 * one Google Reviews task, newest first, with tag = job id and a postback URL signed for that job
 * (src/app/api/dataforseo/postback). Results are written by process.ts when DataForSEO posts them
 * back, or by collect.ts when a postback is lost. Contract: supabase/migrations/20261004170000_dataforseo.sql.
 *
 * Depths (src/lib/dataforseo/rules.ts):
 * - full: the whole history (up to 4490, DataForSEO's limit).
 * - update: OWNER RULE no gaps — from the last review we hold (googleTotal − stored + margin), and
 *   back to the oldest unanswered review of the reply window (7 days; 30 once a month per place).
 * - competitor: same, on the place's ledger (place_reviews); rating/total/distribution come from
 *   the zone search (dispatchZoneSnapshot), not from this task.
 * - competitor_replies: 12 months, at most 2000 reviews (once per place).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOwnerEmail } from "@/lib/booking/email";
import { siteUrl } from "@/lib/site";
import { DataForSeoError, dataForSeo, dataForSeoConfigured, dfsCodes, dfsErrorKind, dfsMaxTasksPerPost, dfsPaths, dfsUserMessage, type DfsTransport } from "./client";
import {
  cidFromFid,
  depthSinceLastStored,
  fullDepth,
  lisbonDay,
  paceEstimateDepth,
  readReachTarget,
  repliesDepth,
  replyCheckDays,
  replyWindowStart,
} from "./rules";
import {
  businessPlaceId,
  competitorsForPlaces,
  dfsJobColumns,
  dfsReaderId,
  finishJob,
  linkedNote,
  loadBusiness,
  placeSnapshotTotal,
  readerPlaceRow,
  upsertReaderPlace,
  type DfsBusinessRow,
  type DfsJobRow,
} from "./store";
import { postbackUrl, type PostbackExtras, type PostbackRef } from "./token";

const dayMs = 86_400_000;
/** Zoom of the zone search: about the 10 km competitor radius around the customer. */
export const zoneZoom = 12;
/** Places read by one zone search. */
export const zoneDepth = 100;

export type DispatchResult = "dispatched" | "skipped" | "failed";

/** Secret that signs postback URLs (CRON_SECRET). */
export function postbackSecret(): string {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) throw new DataForSeoError("not_configured", "CRON_SECRET is not set (needed to sign DataForSEO postbacks)");
  return secret;
}

/** Base URL DataForSEO posts results to: the site, or DATAFORSEO_POSTBACK_BASE (e.g. a tunnel when testing locally). */
export function postbackBase(): string {
  return (process.env.DATAFORSEO_POSTBACK_BASE?.trim() || siteUrl).replace(/\/+$/, "");
}

export function jobPostbackUrl(jobId: string, extras: PostbackExtras = {}): string {
  return postbackUrl(postbackBase(), { job: jobId }, postbackSecret(), extras);
}

type Target = { place_id: string } | { cid: string };

/** Fields shared by every reviews task (Portugal, Portuguese, newest first). Priority 2 = high (≈30 s, double price). */
export function reviewsTask(target: Target, depth: number, options: { highPriority: boolean; tag: string; postbackUrl: string }): Record<string, unknown> {
  return {
    ...target,
    location_name: "Portugal",
    language_name: "Portuguese",
    depth,
    sort_by: "newest",
    priority: options.highPriority ? 2 : 1,
    tag: options.tag,
    postback_url: options.postbackUrl,
  };
}

/** What DataForSEO reads for a customer: its place_id, else the cid from its Google feature id. */
export function customerTarget(business: DfsBusinessRow): Target | null {
  const placeId = businessPlaceId(business);
  if (placeId) return { place_id: placeId };
  const cid = cidFromFid(business.google_fid);
  return cid ? { cid } : null;
}

type Plan =
  | { action: "post"; target: Target; depth: number; extras: PostbackExtras; reviewsExpected: number | null }
  | { action: "finish"; note: string | null }
  | { action: "fail"; error: string };

async function countReviews(client: SupabaseClient, businessId: string, since?: string): Promise<number> {
  let query = client.from("google_reviews").select("review_id", { count: "exact", head: true }).eq("business_id", businessId);
  if (since) query = query.gte("published_at", since);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function firstReview(client: SupabaseClient, businessId: string, filter: { unansweredSince?: string } = {}): Promise<string | null> {
  let query = client.from("google_reviews").select("published_at").eq("business_id", businessId);
  if (filter.unansweredSince) query = query.is("owner_reply", null).gte("published_at", filter.unansweredSince);
  const { data, error } = await query.order("published_at", { ascending: Boolean(filter.unansweredSince) }).limit(1).maybeSingle<{ published_at: string }>();
  if (error) throw new Error(error.message);
  return data?.published_at ?? null;
}

/** Google's latest known total for a customer: review_businesses.reviews_total or the newest snapshot of its place. */
async function customerGoogleTotal(client: SupabaseClient, business: DfsBusinessRow): Promise<number | null> {
  const placeId = businessPlaceId(business);
  const rows = placeId ? await competitorsForPlaces(client, [placeId]) : [];
  const snapshot = await placeSnapshotTotal(
    client,
    rows.map((row) => row.id),
  );
  const totals = [business.reviews_total, snapshot?.reviews_count].filter((value): value is number => typeof value === "number");
  return totals.length ? Math.max(...totals) : null;
}

async function planCustomer(client: SupabaseClient, job: DfsJobRow, now: Date): Promise<Plan> {
  if (!job.business_id) return { action: "fail", error: "Pedido sem negócio associado." };
  const business = await loadBusiness(client, job.business_id);
  if (!business) return { action: "fail", error: "O negócio deste pedido já não existe." };
  if (business.google_link_status === "connected") return { action: "finish", note: linkedNote };
  const target = customerTarget(business);
  if (!target) return { action: "fail", error: "Falta o identificador do negócio no Google (place_id). Procure os concorrentes ou ligue o Perfil da Empresa primeiro." };
  const googleTotal = await customerGoogleTotal(client, business);
  const newest = job.kind === "update" ? await firstReview(client, business.id) : null;
  // First import (or an update with nothing stored): the whole history.
  if (job.kind === "full" || !newest) {
    return { action: "post", target, depth: fullDepth(googleTotal).depth, extras: {}, reviewsExpected: googleTotal };
  }
  const placeId = businessPlaceId(business);
  const place = placeId ? await readerPlaceRow(client, placeId) : null;
  const checkDays = replyCheckDays(place?.deep_checked_on ?? null, lisbonDay(now));
  const windowStart = new Date(replyWindowStart(now, checkDays)).toISOString();
  const unanswered = await firstReview(client, business.id, { unansweredSince: windowStart });
  const reach = readReachTarget({ newestStoredAt: newest, oldestUnansweredAt: unanswered });
  const [storedCount, storedSinceReach, recent] = await Promise.all([
    countReviews(client, business.id),
    reach === null ? Promise.resolve(0) : countReviews(client, business.id, new Date(reach).toISOString()),
    countReviews(client, business.id, new Date(now.getTime() - 90 * dayMs).toISOString()),
  ]);
  const depth = depthSinceLastStored({ googleTotal, storedCount, storedSinceReach, fallbackDepth: paceEstimateDepth(recent / 3, reach, now) });
  return { action: "post", target, depth, extras: { reach, check: checkDays }, reviewsExpected: googleTotal };
}

async function ledgerEdge(client: SupabaseClient, placeId: string, filter: { unansweredSince?: string } = {}): Promise<string | null> {
  let query = client.from("place_reviews").select("published_at").eq("place_id", placeId);
  if (filter.unansweredSince) query = query.eq("replied", false).gte("published_at", filter.unansweredSince);
  const { data, error } = await query.order("published_at", { ascending: Boolean(filter.unansweredSince) }).limit(1).maybeSingle<{ published_at: string }>();
  if (error) throw new Error(error.message);
  return data?.published_at ?? null;
}

async function countLedger(client: SupabaseClient, placeId: string, since: string): Promise<number> {
  const { count, error } = await client.from("place_reviews").select("review_id", { count: "exact", head: true }).eq("place_id", placeId).gte("published_at", since);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function planPlace(client: SupabaseClient, job: DfsJobRow, now: Date): Promise<Plan> {
  const placeId = job.place_id;
  if (!placeId) return { action: "fail", error: "Pedido sem local do Google associado." };
  const today = lisbonDay(now);
  const rows = await competitorsForPlaces(client, [placeId]);
  if (!rows.length) {
    // Nobody compares with this place any more: nothing to read (as the reader does).
    await upsertReaderPlace(client, placeId, job.kind === "competitor" ? { read_on: today, read_at: now.toISOString(), last_error: null } : { replies_read_on: today, last_error: null });
    return { action: "finish", note: null };
  }
  const ids = rows.map((row) => row.id);
  const paces = rows.map((row) => (row.pace_per_month === null ? null : Number(row.pace_per_month))).filter((value): value is number => value !== null && value > 0);
  const pace = paces.length ? Math.max(...paces) : null;
  const latest = await placeSnapshotTotal(client, ids);

  if (job.kind === "competitor_replies") {
    const depth = repliesDepth({ pacePerMonth: pace, reviewsTotal: latest?.reviews_count ?? null });
    return { action: "post", target: { place_id: placeId }, depth, extras: { reach: now.getTime() - 365 * dayMs, check: 30 }, reviewsExpected: null };
  }

  const place = await readerPlaceRow(client, placeId);
  const checkDays = replyCheckDays(place?.deep_checked_on ?? null, today);
  const windowStart = replyWindowStart(now, checkDays);
  const [newest, unanswered] = await Promise.all([ledgerEdge(client, placeId), ledgerEdge(client, placeId, { unansweredSince: new Date(windowStart).toISOString() })]);
  const reach = readReachTarget({ newestStoredAt: newest, oldestUnansweredAt: unanswered, windowStart });
  const storedSinceReach = reach === null ? 0 : await countLedger(client, placeId, new Date(reach).toISOString());
  // The ledger starts at the first read (about 12 months back), so "what we hold" is Google's total when the place was last read.
  const atLastRead = newest && place?.read_on ? await placeSnapshotTotal(client, ids, place.read_on) : null;
  const depth = depthSinceLastStored({
    googleTotal: newest ? (latest?.reviews_count ?? null) : null,
    storedCount: atLastRead?.reviews_count ?? null,
    storedSinceReach,
    fallbackDepth: paceEstimateDepth(pace, reach, now),
  });
  return { action: "post", target: { place_id: placeId }, depth, extras: { reach, check: checkDays }, reviewsExpected: latest?.reviews_count ?? null };
}

/** What a queued job becomes: a task to post, a job to close without reading, or a failure. */
export async function planJob(client: SupabaseClient, job: DfsJobRow, now = new Date()): Promise<Plan> {
  if (job.kind === "full" || job.kind === "update") return planCustomer(client, job, now);
  if (job.kind === "competitor" || job.kind === "competitor_replies") return planPlace(client, job, now);
  return { action: "fail", error: `Tipo de pedido desconhecido: ${String(job.kind)}.` };
}

async function claim(client: SupabaseClient, job: DfsJobRow, reviewsExpected: number | null, now: Date): Promise<boolean> {
  const at = now.toISOString();
  const { data, error } = await client
    .from("review_import_jobs")
    .update({
      status: "running",
      started_at: at,
      dispatched_at: at,
      reader_id: dfsReaderId,
      external_task_ids: [],
      reviews_expected: reviewsExpected,
      reviews_done: 0,
      reviews_new: 0,
      pages_done: 0,
      avg_page_ms: null,
      error: null,
      updated_at: at,
    })
    .eq("id", job.id)
    .eq("status", "queued")
    .eq("provider", "dataforseo")
    .select("id");
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

/** Back to the queue after a passing problem (network, rate limit, DataForSEO error): retried later. */
async function requeue(client: SupabaseClient, jobId: string) {
  const { error } = await client
    .from("review_import_jobs")
    .update({ status: "queued", started_at: null, dispatched_at: null, reader_id: null, updated_at: new Date().toISOString() })
    .eq("id", jobId)
    .eq("status", "running")
    .eq("reader_id", dfsReaderId);
  if (error) throw new Error(error.message);
}

/** At most one "spending stopped" email per this many hours. */
const spendAlertEveryHours = 6;
const spendAlertKey = "dataforseo_spend_alert";

/**
 * The spending guard (or DataForSEO itself) stopped a paid request: tell the owner by email, at most
 * once every 6 hours (scheduler_state keeps when). Best-effort.
 */
export async function alertSpendStopped(client: SupabaseClient, error: unknown): Promise<void> {
  if (!(error instanceof DataForSeoError) || (error.kind !== "budget" && error.kind !== "balance")) return;
  try {
    const { data } = await client.from("scheduler_state").select("value").eq("key", spendAlertKey).maybeSingle<{ value: string | null }>();
    if (data?.value && Date.now() - Date.parse(data.value) < spendAlertEveryHours * 3_600_000) return;
    await client.from("scheduler_state").upsert({ key: spendAlertKey, value: new Date().toISOString(), updated_at: new Date().toISOString() });
    await sendOwnerEmail({
      subject: "DataForSEO: pedidos parados (saldo ou limite de gastos)",
      heading: "Os pedidos ao DataForSEO estão parados",
      rows: [
        { label: "Motivo", value: dfsUserMessage(error) },
        { label: "O que fazer", value: "Veja o saldo em app.dataforseo.com (Add Funds). O mínimo de segurança e o limite diário estão em DATA_FOR_SEO_MIN_BALANCE e DATA_FOR_SEO_DAILY_LIMIT." },
      ],
      adminUrl: `${siteUrl}/admin/reviews`,
      linkLabel: "Abrir o admin",
    });
  } catch (alertError) {
    console.error("[dataforseo] spend alert failed:", alertError instanceof Error ? alertError.message : alertError);
  }
}

const transient = (error: unknown) => error instanceof DataForSeoError && (error.kind === "network" || error.kind === "rate_limit" || error.kind === "server");

interface Claimed {
  job: DfsJobRow;
  task: Record<string, unknown>;
}

/**
 * Posts claimed jobs in batches of 100 and records each task id. A passing problem puts a job back
 * in the queue for the routine, unless `failOnTransient` (someone pressed a button and is waiting:
 * the job fails with the reason and the button sends it again).
 */
async function postClaimed(client: SupabaseClient, dfs: DfsTransport, claimed: Claimed[], options: { failOnTransient?: boolean } = {}): Promise<{ dispatched: number; failed: number }> {
  const retryLater = (error: unknown) => transient(error) && !options.failOnTransient;
  let dispatched = 0;
  let failed = 0;
  for (let index = 0; index < claimed.length; index += dfsMaxTasksPerPost) {
    const batch = claimed.slice(index, index + dfsMaxTasksPerPost);
    let response;
    try {
      response = await dfs.post(
        dfsPaths.reviewsPost,
        batch.map((item) => item.task),
      );
    } catch (error) {
      console.error("[dataforseo] task_post failed:", error instanceof Error ? error.message : error);
      await alertSpendStopped(client, error);
      for (const item of batch) {
        if (retryLater(error)) await requeue(client, item.job.id);
        else await finishJob(client, item.job.id, { status: "failed", error: dfsUserMessage(error) });
      }
      failed += batch.length;
      continue;
    }
    const tasks = response.tasks ?? [];
    for (const [position, item] of batch.entries()) {
      const task = tasks.find((candidate) => candidate.data?.tag === item.job.id) ?? tasks[position];
      if (task && task.status_code === dfsCodes.created && task.id) {
        const { error } = await client
          .from("review_import_jobs")
          .update({ external_task_ids: [task.id], updated_at: new Date().toISOString() })
          .eq("id", item.job.id);
        if (error) throw new Error(error.message);
        dispatched++;
      } else {
        const code = task?.status_code ?? 0;
        const problem = new DataForSeoError(dfsErrorKind(code), `task_post ${code} ${task?.status_message ?? "missing task"}`, code);
        console.error(`[dataforseo] job ${item.job.id} refused:`, problem.message);
        if (retryLater(problem)) await requeue(client, item.job.id);
        else await finishJob(client, item.job.id, { status: "failed", error: dfsUserMessage(problem) });
        failed++;
      }
    }
  }
  return { dispatched, failed };
}

/** Plans and claims one queued job; returns what to post, or what happened instead. */
async function prepare(client: SupabaseClient, job: DfsJobRow, highPriority: boolean, now: Date): Promise<Claimed | DispatchResult> {
  if (job.status !== "queued" || job.provider !== "dataforseo") return "skipped";
  let plan: Plan;
  try {
    plan = await planJob(client, job, now);
  } catch (error) {
    console.error(`[dataforseo] planning job ${job.id} failed:`, error instanceof Error ? error.message : error);
    return "failed";
  }
  if (plan.action === "finish") {
    await finishJob(client, job.id, { status: "done", error: plan.note, reviews_done: 0, reviews_new: 0, pages_done: 0, avg_page_ms: null });
    return "skipped";
  }
  if (plan.action === "fail") {
    await finishJob(client, job.id, { status: "failed", error: plan.error });
    return "failed";
  }
  const task = reviewsTask(plan.target, plan.depth, { highPriority, tag: job.id, postbackUrl: jobPostbackUrl(job.id, plan.extras) });
  if (!(await claim(client, job, plan.reviewsExpected, now))) return "skipped";
  return { job, task };
}

async function failNotConfigured(client: SupabaseClient, jobIds: string[]) {
  const message = dfsUserMessage(new DataForSeoError("not_configured", "not configured"));
  for (const id of jobIds) await finishJob(client, id, { status: "failed", error: message });
}

function configuredOrThrow() {
  if (!dataForSeoConfigured()) throw new DataForSeoError("not_configured", "DATA_FOR_SEO_LOGIN / DATA_FOR_SEO_PASSWORD are not set");
  postbackSecret();
}

/**
 * Sends one queued job now (e.g. right after «Atualizar» queued it: highPriority = DataForSEO
 * priority 2, about 30 s instead of up to 45 min, double price). "skipped" when the job is no longer
 * queued, belongs to another provider, or needed no read (customer linked to Google, place nobody
 * compares with); "failed" when it could not be sent (the job says why, or goes back to the queue
 * after a passing problem).
 */
export async function dispatchJob(
  client: SupabaseClient,
  jobId: string,
  options: { highPriority?: boolean; failOnTransient?: boolean; dfs?: DfsTransport; now?: Date } = {},
): Promise<DispatchResult> {
  const { data: job, error } = await client.from("review_import_jobs").select(dfsJobColumns).eq("id", jobId).maybeSingle<DfsJobRow>();
  if (error) throw new Error(error.message);
  if (!job || job.status !== "queued" || job.provider !== "dataforseo") return "skipped";
  try {
    configuredOrThrow();
  } catch {
    await failNotConfigured(client, [job.id]);
    return "failed";
  }
  const prepared = await prepare(client, job, Boolean(options.highPriority), options.now ?? new Date());
  if (typeof prepared === "string") return prepared;
  const result = await postClaimed(client, options.dfs ?? dataForSeo, [prepared], { failOnTransient: options.failOnTransient });
  return result.dispatched ? "dispatched" : "failed";
}

/**
 * A panel button (Importar / Atualizar): sends the job right away on the priority queue. Whatever
 * stops it (a passing DataForSEO problem, a planning error) fails the job with the reason, so the
 * panel never waits forever and only the button sends it again: no automatic retry spends balance.
 */
export async function dispatchForPanel(client: SupabaseClient, jobId: string): Promise<DispatchResult> {
  let result: DispatchResult;
  try {
    result = await dispatchJob(client, jobId, { highPriority: true, failOnTransient: true });
  } catch (error) {
    console.error("[painel] dispatch failed:", error instanceof Error ? error.message : error);
    result = "failed";
  }
  if (result === "failed") {
    // Still queued (e.g. the plan could not be made): close it with a reason the panel shows.
    await finishJob(client, jobId, { status: "failed", error: "Não foi possível enviar o pedido ao Google. Tente outra vez." }).catch(() => false);
  }
  return result;
}

/**
 * Sends every queued DataForSEO job (lowest priority number first, then the oldest), at most
 * `maxJobs`, in POSTs of up to 100 tasks. Jobs with priority ≤ `highPriorityForPriorityAtMost`
 * (someone waiting) go with DataForSEO's high priority.
 */
export async function dispatchQueuedJobs(
  client: SupabaseClient,
  options: { maxJobs?: number; highPriorityForPriorityAtMost?: number; dfs?: DfsTransport; now?: Date; placeIds?: string[] } = {},
): Promise<{ dispatched: number; failed: number }> {
  const { maxJobs = 100, highPriorityForPriorityAtMost = 1 } = options;
  const now = options.now ?? new Date();
  let query = client.from("review_import_jobs").select(dfsJobColumns).eq("status", "queued").eq("provider", "dataforseo");
  if (options.placeIds) query = query.in("place_id", options.placeIds);
  const { data, error } = await query
    .order("priority", { ascending: true })
    .order("requested_at", { ascending: true })
    .limit(maxJobs);
  if (error) throw new Error(error.message);
  const jobs = (data ?? []) as DfsJobRow[];
  if (!jobs.length) return { dispatched: 0, failed: 0 };
  try {
    configuredOrThrow();
  } catch {
    await failNotConfigured(
      client,
      jobs.map((job) => job.id),
    );
    return { dispatched: 0, failed: jobs.length };
  }

  const claimed: Claimed[] = [];
  let failed = 0;
  // A few at a time: each plan reads Supabase several times.
  for (let index = 0; index < jobs.length; index += 5) {
    const results = await Promise.all(jobs.slice(index, index + 5).map((job) => prepare(client, job, job.priority <= highPriorityForPriorityAtMost, now)));
    for (const result of results) {
      if (result === "failed") failed++;
      else if (typeof result !== "string") claimed.push(result);
    }
  }
  const posted = await postClaimed(client, options.dfs ?? dataForSeo, claimed);
  return { dispatched: posted.dispatched, failed: failed + posted.failed };
}

/**
 * One Google Maps search around a customer (about 10 km): its postback writes today's snapshot
 * (rating, exact average from the star distribution, total, distribution) for every competitors row,
 * of any customer, whose place appears in the results (reader_places is not touched: it means
 * reviews and replies read). Returns the DataForSEO task id. `keyword` is usually the customer's Google category.
 */
export async function dispatchZoneSnapshot(
  _client: SupabaseClient,
  input: { businessId: string; keyword: string; lat: number; lng: number; zoom?: number },
  options: { highPriority?: boolean; dfs?: DfsTransport } = {},
): Promise<string> {
  configuredOrThrow();
  const ref: PostbackRef = { zone: input.businessId };
  const zoom = Math.min(21, Math.max(3, Math.round(input.zoom ?? zoneZoom)));
  const coordinate = (value: number) => String(Math.round(value * 1e7) / 1e7);
  const task = {
    keyword: input.keyword,
    location_coordinate: `${coordinate(input.lat)},${coordinate(input.lng)},${zoom}z`,
    language_code: "pt",
    depth: zoneDepth,
    priority: options.highPriority ? 2 : 1,
    tag: `zone:${input.businessId}`,
    postback_url: postbackUrl(postbackBase(), ref, postbackSecret()),
    postback_data: "advanced",
  };
  const response = await (options.dfs ?? dataForSeo).post(dfsPaths.mapsPost, [task]);
  const created = response.tasks?.[0];
  if (!created || created.status_code !== dfsCodes.created || !created.id) {
    const code = created?.status_code ?? 0;
    throw new DataForSeoError(dfsErrorKind(code), `maps task_post ${code} ${created?.status_message ?? "missing task"}`, code);
  }
  return created.id;
}
