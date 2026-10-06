/**
 * Writes DataForSEO results (from the postback route or the collect fallback). Same database
 * effects as the local reader (scripts/reader/jobs.mjs). Business rules: .claude/skills/regras-negocio-reviews
 * — never names, photos or profiles; competitors only as ledger rows (date, stars, replied) and
 * aggregates, never texts; alerts only for new 1–3★ reviews of the last 7 days, never on a first import.
 *
 * Idempotent: a job is written only while it is running, by the last task it waits for, under a
 * lease (review_import_jobs.reader_id = 'dataforseo-processing'); a retried postback finds the job
 * done (or the lease taken) and is ignored. Zone snapshots are plain upserts.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { isNegative } from "@/lib/reviews/analytics";
import { repliesMaxReviews } from "@/lib/reviews/maps-reader";
import { alertMaxAgeMs, sendNegativeReviewAlert } from "@/lib/reviews/store";
import { DataForSeoError, dataForSeo, dfsCodes, dfsErrorKind, dfsPaths, dfsTaskPending, dfsUserMessage, type DfsTask, type DfsTransport } from "./client";
import { customerTarget, jobPostbackUrl } from "./dispatch";
import {
  dfsMaxDepth,
  lisbonDay,
  nextFollowUpDepth,
  parseDfsTimestamp,
  readSpan,
  snapshotFromMapsItem,
  toCustomerReview,
  toLedgerRow,
  uniqueById,
  type DfsMapsResult,
  type DfsReviewItem,
  type DfsReviewsResult,
  type PlaceSnapshot,
} from "./rules";
import {
  businessPlaceId,
  competitorsForPlaces,
  dfsProcessingId,
  dfsReaderId,
  finishJob,
  loadBusiness,
  loadJob,
  refreshPlaceReplyRate,
  saveCustomerReviews,
  snapshotOwnPlace,
  upsertLedger,
  upsertReaderPlace,
  upsertSnapshots,
  type CustomerReviewRow,
  type DfsJobRow,
} from "./store";
import { parsePostbackUrl, type PostbackExtras } from "./token";

export type ProcessOutcome = "done" | "failed" | "follow_up" | "pending" | "ignored";

const round1 = (value: number) => Math.round(value * 10) / 10;

async function takeLease(client: SupabaseClient, jobId: string): Promise<boolean> {
  const { data, error } = await client
    .from("review_import_jobs")
    .update({ reader_id: dfsProcessingId, updated_at: new Date().toISOString() })
    .eq("id", jobId)
    .eq("status", "running")
    .eq("reader_id", dfsReaderId)
    .select("id");
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

async function releaseLease(client: SupabaseClient, jobId: string) {
  await client.from("review_import_jobs").update({ reader_id: dfsReaderId, updated_at: new Date().toISOString() }).eq("id", jobId).eq("reader_id", dfsProcessingId);
}

function readTimes(items: DfsReviewItem[]) {
  return readSpan(
    items.flatMap((item) => {
      const publishedAt = parseDfsTimestamp(item.timestamp);
      return publishedAt ? [{ published_at: publishedAt }] : [];
    }),
  );
}

/**
 * OWNER RULE — no gaps: the read did not reach the last review we hold (or the oldest unanswered one
 * of the reply window). Nothing is written yet (the bigger read contains this one, newest first);
 * the same job asks again with a bigger depth.
 */
async function followUp(client: SupabaseClient, dfs: DfsTransport, job: DfsJobRow, task: DfsTask, depth: number, readCount: number, extras: PostbackExtras): Promise<ProcessOutcome> {
  const data = task.data ?? {};
  let target: Record<string, string> | null = typeof data.place_id === "string" ? { place_id: data.place_id } : typeof data.cid === "string" ? { cid: data.cid } : null;
  if (!target && job.place_id) target = { place_id: job.place_id };
  if (!target && job.business_id) {
    const business = await loadBusiness(client, job.business_id);
    target = business ? customerTarget(business) : null;
  }
  const fail = async (error: unknown) => {
    await finishJob(client, job.id, { status: "failed", error: dfsUserMessage(error), reviews_done: readCount }, { lease: true });
    return "failed" as const;
  };
  if (!target) return fail(new DataForSeoError("invalid", "follow-up without a place"));
  const params = {
    ...target,
    location_name: typeof data.location_name === "string" ? data.location_name : "Portugal",
    language_name: typeof data.language_name === "string" ? data.language_name : "Portuguese",
    depth,
    sort_by: "newest",
    priority: data.priority === 2 ? 2 : 1,
    tag: job.id,
    postback_url: jobPostbackUrl(job.id, extras),
  };
  let created: DfsTask | undefined;
  try {
    created = (await dfs.post(dfsPaths.reviewsPost, [params])).tasks?.[0];
  } catch (error) {
    return fail(error);
  }
  if (!created || created.status_code !== dfsCodes.created || !created.id) {
    const code = created?.status_code ?? 0;
    return fail(new DataForSeoError(dfsErrorKind(code), `follow-up task_post ${code}`, code));
  }
  const { error } = await client
    .from("review_import_jobs")
    .update({
      external_task_ids: [...(job.external_task_ids ?? []), created.id],
      reader_id: dfsReaderId,
      reviews_done: readCount,
      pages_done: (job.pages_done ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id)
    .eq("reader_id", dfsProcessingId);
  if (error) throw new Error(error.message);
  return "follow_up";
}

async function finishCustomer(
  client: SupabaseClient,
  job: DfsJobRow,
  result: DfsReviewsResult | null,
  items: DfsReviewItem[],
  extras: PostbackExtras,
  capped: boolean,
  now: Date,
): Promise<ProcessOutcome> {
  const business = job.business_id ? await loadBusiness(client, job.business_id) : null;
  if (!business) {
    await finishJob(client, job.id, { status: "failed", error: "O negócio deste pedido já não existe." }, { lease: true });
    return "failed";
  }
  const at = now.toISOString();
  const today = lisbonDay(now);
  const rows: CustomerReviewRow[] = uniqueById(items.map(toCustomerReview)).map((review) => ({ ...review, business_id: business.id, fetched_at: at }));
  const fresh = await saveCustomerReviews(client, business.id, rows);
  // The whole history was read: first import ("full", or an update with nothing stored).
  const wholeHistory = job.kind === "full" || extras.reach === null || extras.reach === undefined;
  const total = typeof result?.reviews_count === "number" ? result.reviews_count : null;
  const rating = typeof result?.rating?.value === "number" ? round1(result.rating.value) : null;

  const placeId = businessPlaceId(business) ?? (typeof result?.place_id === "string" ? result.place_id : null);
  if (placeId) {
    // The customer's place is also a place other customers compare with: same ledger, no texts.
    await upsertLedger(
      client,
      rows.map((row) => ({
        place_id: placeId,
        review_id: row.review_id,
        published_at: row.published_at,
        rating: row.rating,
        replied: Boolean(row.owner_reply || row.owner_replied_at),
        replied_at: row.owner_replied_at,
      })),
      now,
    );
    await snapshotOwnPlace(client, placeId, { rating, total }, now);
    await upsertReaderPlace(client, placeId, {
      read_on: today,
      read_at: at,
      last_error: null,
      ...(wholeHistory || extras.check === 30 ? { deep_checked_on: today } : {}),
      ...(wholeHistory ? { replies_read_on: today } : {}),
    });
    await refreshPlaceReplyRate(client, placeId, now);
  }

  const { error } = await client
    .from("review_businesses")
    .update({
      ...(rating !== null ? { rating_total: rating } : {}),
      ...(total !== null ? { reviews_total: total } : {}),
      last_synced_at: at,
      ...(wholeHistory ? { full_synced_at: at } : {}),
      last_sync_error: null,
    })
    .eq("id", business.id);
  if (error) throw new Error(error.message);

  let note: string | null = null;
  if (wholeHistory && total !== null && total > dfsMaxDepth) {
    note = `Lidas as ${rows.length} reviews mais recentes de ${total}: o fornecedor de dados do Google lê no máximo ${dfsMaxDepth}. As mais antigas ficam como estavam.`;
  } else if (capped) {
    note = `Leitura limitada às ${dfsMaxDepth} reviews mais recentes (limite do fornecedor de dados do Google).`;
  }
  const finished = await finishJob(
    client,
    job.id,
    { status: "done", error: note, reviews_done: rows.length, reviews_new: fresh.length, pages_done: (job.pages_done ?? 0) + 1, avg_page_ms: null, reviews_expected: total },
    { lease: true },
  );

  // Never on a first import (the whole history is not news); same rule as the reader and store.ts.
  const alerts = job.kind === "update" ? !wholeHistory : Boolean(business.full_synced_at);
  if (finished && alerts && business.alert_email) {
    const negative = fresh
      .filter((row) => isNegative(row.rating) && now.getTime() - Date.parse(row.published_at) < alertMaxAgeMs)
      .sort((a, b) => b.published_at.localeCompare(a.published_at));
    if (negative.length) {
      await sendNegativeReviewAlert(business, negative).catch((alertError: unknown) =>
        console.error("[dataforseo] negative review alert failed:", alertError instanceof Error ? alertError.message : alertError),
      );
    }
  }
  return "done";
}

async function knownLedgerIds(client: SupabaseClient, placeId: string, ids: string[]): Promise<Set<string>> {
  const known = new Set<string>();
  for (let index = 0; index < ids.length; index += 100) {
    const { data, error } = await client.from("place_reviews").select("review_id").eq("place_id", placeId).in("review_id", ids.slice(index, index + 100));
    if (error) throw new Error(error.message);
    for (const row of data ?? []) known.add(row.review_id as string);
  }
  return known;
}

async function finishPlace(client: SupabaseClient, job: DfsJobRow, items: DfsReviewItem[], extras: PostbackExtras, now: Date): Promise<ProcessOutcome> {
  const placeId = job.place_id!;
  const today = lisbonDay(now);
  const rows = uniqueById(items.map((item) => toLedgerRow(item, placeId)));
  const known = await knownLedgerIds(
    client,
    placeId,
    rows.map((row) => row.review_id),
  );
  await upsertLedger(client, rows, now);
  if (job.kind === "competitor_replies") {
    // 12 months read: the ledger is complete and every reply was checked.
    await upsertReaderPlace(client, placeId, { replies_read_on: today, deep_checked_on: today, last_error: null });
  } else {
    await upsertReaderPlace(client, placeId, { read_on: today, read_at: now.toISOString(), last_error: null, ...(extras.check === 30 ? { deep_checked_on: today } : {}) });
  }
  await refreshPlaceReplyRate(client, placeId, now, { withPace: job.kind === "competitor_replies" });
  await finishJob(
    client,
    job.id,
    {
      status: "done",
      error: null,
      reviews_done: rows.length,
      reviews_new: rows.filter((row) => !known.has(row.review_id)).length,
      pages_done: (job.pages_done ?? 0) + 1,
      avg_page_ms: null,
    },
    { lease: true },
  );
  return "done";
}

/**
 * Writes the result of a job's reviews task. `extras` (reach, reply window) come from the postback
 * URL; without them, from the URL DataForSEO echoes in task.data.
 */
export async function processJobTask(
  client: SupabaseClient,
  task: DfsTask<DfsReviewsResult>,
  jobId: string,
  options: { dfs?: DfsTransport; extras?: PostbackExtras; now?: Date } = {},
): Promise<ProcessOutcome> {
  const job = await loadJob(client, jobId);
  if (!job || job.status !== "running" || job.provider !== "dataforseo") return "ignored";
  const ids = job.external_task_ids ?? [];
  // Only the task the job waits for (an earlier one may come back late after a follow-up).
  if (!ids.length || ids[ids.length - 1] !== task.id) return "ignored";
  if (dfsTaskPending(task.status_code)) return "pending";
  if (!(await takeLease(client, job.id))) return "ignored";
  const now = options.now ?? new Date();
  try {
    if (task.status_code !== dfsCodes.ok && task.status_code !== dfsCodes.noResults) {
      const problem = new DataForSeoError(dfsErrorKind(task.status_code), `${task.status_code} ${task.status_message}`, task.status_code);
      console.error(`[dataforseo] job ${job.id} task ${task.id}:`, problem.message);
      const message = dfsUserMessage(problem);
      if (job.place_id) await upsertReaderPlace(client, job.place_id, { last_error: message });
      if (job.business_id) await client.from("review_businesses").update({ last_sync_error: message }).eq("id", job.business_id);
      await finishJob(client, job.id, { status: "failed", error: message }, { lease: true });
      return "failed";
    }
    const result = task.result?.[0] ?? null;
    const items = (result?.items ?? []).filter((item): item is DfsReviewItem => Boolean(item && typeof item === "object"));
    const extras = options.extras ?? parsePostbackUrl(task.data?.postback_url).extras;
    const depth = typeof task.data?.depth === "number" ? task.data.depth : items.length;
    const span = readTimes(items);
    const maxDepth = job.kind === "competitor_replies" ? repliesMaxReviews : dfsMaxDepth;
    const reach = job.kind === "full" ? null : (extras.reach ?? null);
    const next = nextFollowUpDepth({ depth, readCount: items.length, oldestReadAt: span.oldest, newestReadAt: span.newest, reach, maxDepth });
    if (next) return await followUp(client, options.dfs ?? dataForSeo, job, task, next, items.length, extras);
    const capped = reach !== null && span.oldest !== null && Date.parse(span.oldest) > reach && depth >= maxDepth;
    if (job.kind === "full" || job.kind === "update") return await finishCustomer(client, job, result, items, extras, capped, now);
    if (!job.place_id) {
      await finishJob(client, job.id, { status: "failed", error: "Pedido sem local do Google associado." }, { lease: true });
      return "failed";
    }
    return await finishPlace(client, job, items, extras, now);
  } catch (error) {
    await releaseLease(client, job.id);
    throw error;
  }
}

/**
 * Zone search result: today's snapshot for every competitors row (any customer) whose place is in
 * the results. Upserts only, so a repeated result is harmless.
 */
export async function processZoneTask(client: SupabaseClient, task: DfsTask<DfsMapsResult>, now = new Date()): Promise<{ outcome: ProcessOutcome; places: number; snapshots: number }> {
  if (dfsTaskPending(task.status_code)) return { outcome: "pending", places: 0, snapshots: 0 };
  if (task.status_code === dfsCodes.noResults) return { outcome: "done", places: 0, snapshots: 0 };
  if (task.status_code !== dfsCodes.ok) {
    console.error(`[dataforseo] zone task ${task.id}: ${task.status_code} ${task.status_message}`);
    return { outcome: "failed", places: 0, snapshots: 0 };
  }
  const shown = new Map<string, PlaceSnapshot>();
  for (const result of task.result ?? []) {
    for (const item of result?.items ?? []) {
      const placeId = typeof item?.place_id === "string" ? item.place_id : null;
      if (!placeId || shown.has(placeId)) continue;
      const snapshot = snapshotFromMapsItem(item);
      if (snapshot) shown.set(placeId, snapshot);
    }
  }
  if (!shown.size) return { outcome: "done", places: 0, snapshots: 0 };
  const rows = await competitorsForPlaces(client, [...shown.keys()]);
  await upsertSnapshots(
    client,
    rows.map((row) => ({ competitor_id: row.id, snapshot: shown.get(row.place_id)! })),
    now,
  );
  // reader_places.read_on/read_at are left alone: they mean "reviews and replies read" (the scheduler
  // plans the competitor reads from them); the snapshot's own marker is competitor_snapshots.taken_on.
  return { outcome: "done", places: new Set(rows.map((row) => row.place_id)).size, snapshots: rows.length };
}
