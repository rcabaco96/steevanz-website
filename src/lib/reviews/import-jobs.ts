import type { SupabaseClient } from "@supabase/supabase-js";
import { importSecondsLeft } from "./maps-reader.ts";

/**
 * Jobs of the Steevanz reader (scripts/reader, on a local computer) as seen by the panel. The
 * panel only queues jobs and reads their progress: Google is read by the reader, never by Vercel.
 * Queue contract: supabase/migrations/20261004130000_reader_queue.sql.
 */

/** The local reader counts as switched on when it reported in the last 30 seconds. */
export const readerOnlineSeconds = 30;
/** "Atualizar" reads Google at most once every 15 minutes per customer (any sync counts). */
export const updateIntervalMinutes = 15;
/** Queue priorities: someone waiting in the panel, a first import, routine work. */
export const jobPriority = { waiting: 1, firstImport: 3, routine: 5 } as const;

/** Jobs of one customer shown in the panel (competitor jobs are routine and not shown). */
export type JobKind = "full" | "update" | "discover";
export type JobStatus = "queued" | "running" | "done" | "failed";

export interface ImportJob {
  id: string;
  kind: JobKind;
  status: JobStatus;
  /** Who runs it: DataForSEO (results all at once, ~30 s on the priority queue), Apify (full import, a few minutes), Google's API or the local reader. */
  provider: "dataforseo" | "apify" | "google" | "reader";
  priority: number;
  reviewsExpected: number | null;
  reviewsDone: number;
  /** Reviews the reader saved that we did not have yet. */
  reviewsNew: number;
  pagesDone: number;
  avgPageMs: number | null;
  error: string | null;
  requestedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface ReaderStatus {
  /** Who reads Google: DataForSEO (hosted, always available) or the local reader (fallback). */
  service: "dataforseo" | "reader";
  online: boolean;
  lastSeenAt: string | null;
  /** Working on a job right now (maybe another customer's). */
  busy: boolean;
}

/** What Supabase already holds for a customer, known before and while the reader runs. */
export interface StoredReviews {
  /** Reviews saved in google_reviews. */
  count: number;
  /** Total the Google profile shows (last read), null before the first import. */
  googleTotal: number | null;
  /** Publication date of the newest saved review. */
  newestAt: string | null;
}

/** Reads of the customer's competitors since their search (rating, total and stars of each place). */
export interface CompetitionProgress {
  /** Places the customer compares with. */
  total: number;
  /** Of those, read since the search (or the read ended with an error). */
  read: number;
  /** Still waiting for the reader or being read. */
  pending: number;
}

/** Everything the panel needs about the reader for one customer (polled while a job runs). */
export interface ReaderJobsState {
  full: ImportJob | null;
  update: ImportJob | null;
  reader: ReaderStatus;
  lastSyncedAt: string | null;
  stored: StoredReviews;
  /** Null before the customer's competitors were searched. */
  competition: CompetitionProgress | null;
  /** The reader's latest competitor search for this customer (runs next to the first import). */
  discover: ImportJob | null;
}

/** Answer to "Atualizar reviews": recentMinutes is set when nothing was queued (15-minute rule). */
export type UpdateResponse =
  | (ReaderJobsState & {
      recentMinutes: number | null;
      /** Verified customers are updated straight from Google's official API (no reader job). */
      google?: { ok: boolean; newReviews: number; error?: string };
    })
  | { error: string };
export type ImportResponse = ReaderJobsState | { error: string };

export const emptyReaderJobs: ReaderJobsState = {
  full: null,
  update: null,
  reader: { service: "reader", online: false, lastSeenAt: null, busy: false },
  lastSyncedAt: null,
  stored: { count: 0, googleTotal: null, newestAt: null },
  competition: null,
  discover: null,
};

// --- Pure rules (tested in tests/import-jobs.test.mjs) ---------------------------------------------

export const isActive = (job: Pick<ImportJob, "status"> | null | undefined): boolean => job?.status === "queued" || job?.status === "running";

export function isReaderOnline(lastSeenAt: string | null, now: number): boolean {
  return Boolean(lastSeenAt && now - Date.parse(lastSeenAt) < readerOnlineSeconds * 1000);
}

/**
 * Progress of the competitor reads: per place, the newest job since the search counts (done or
 * failed = read, queued or running = pending); places without a job yet count as pending.
 */
export function competitionProgress(placeIds: string[], jobs: { place_id: string | null; status: JobStatus; requested_at: string }[]): CompetitionProgress {
  const latest = new Map<string, { status: JobStatus; requested_at: string }>();
  for (const job of jobs) {
    if (!job.place_id) continue;
    const known = latest.get(job.place_id);
    if (!known || job.requested_at > known.requested_at) latest.set(job.place_id, job);
  }
  const places = [...new Set(placeIds)];
  const read = places.filter((placeId) => {
    const status = latest.get(placeId)?.status;
    return status === "done" || status === "failed";
  }).length;
  return { total: places.length, read, pending: places.length - read };
}

/** Minutes since the last sync when it is within the 15-minute rule, else null (a new read is allowed). */
export function recentSyncMinutes(lastSyncedAt: string | null, now: number): number | null {
  if (!lastSyncedAt) return null;
  const minutes = (now - Date.parse(lastSyncedAt)) / 60_000;
  return minutes >= 0 && minutes < updateIntervalMinutes ? Math.floor(minutes) : null;
}

/** The job of this kind that went from queued/running to done/failed between two polls, if any. */
export function finishedJob(previous: ReaderJobsState, next: ReaderJobsState, kind: JobKind): ImportJob | null {
  const before = previous[kind];
  const after = next[kind];
  if (!before || !after || before.id !== after.id) return null;
  return isActive(before) && !isActive(after) ? after : null;
}

export interface ImportProgress {
  /** Reviews read by the running import, or saved in Supabase when nothing runs. */
  done: number;
  /** Reviews on Google: counted by the running import, else the last total we know. */
  total: number | null;
  left: number | null;
  ratio: number | null;
  /** Estimated seconds left (running) or for the whole import (queued); null when unknown or idle. */
  secondsLeft: number | null;
}

/**
 * Figures of the full-import card. While the reader runs they come from the job (and the last known
 * Google total until the reader has counted them); otherwise from what Supabase already holds.
 */
export function fullImportProgress(job: ImportJob | null, stored: StoredReviews): ImportProgress {
  const running = job?.status === "running";
  const total = (running ? job.reviewsExpected : null) ?? stored.googleTotal ?? job?.reviewsExpected ?? null;
  const done = running ? job.reviewsDone : stored.count;
  const left = total === null ? null : Math.max(0, total - done);
  const ratio = total ? Math.min(1, done / total) : null;
  let secondsLeft: number | null = null;
  if (running) secondsLeft = importSecondsLeft({ ...job, reviewsExpected: total });
  else if (job?.status === "queued") secondsLeft = importSecondsLeft({ reviewsExpected: total, reviewsDone: 0, pagesDone: 0, avgPageMs: null });
  return { done, total, left, ratio, secondsLeft };
}

/** "agora mesmo", "há 3 min", "há 2 h", "há 4 dias". */
export function relativeTime(iso: string, now: number): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return `há ${days} ${days === 1 ? "dia" : "dias"}`;
}

/** "45 s", "2 min", "2 min 10 s". */
export function duration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

// --- Database --------------------------------------------------------------------------------------

interface JobRow {
  id: string;
  kind: JobKind;
  status: JobStatus;
  provider: ImportJob["provider"];
  priority: number;
  reviews_expected: number | null;
  reviews_done: number;
  reviews_new: number;
  pages_done: number;
  avg_page_ms: number | null;
  error: string | null;
  requested_at: string;
  started_at: string | null;
  finished_at: string | null;
}

const jobColumns = "id, kind, status, provider, priority, reviews_expected, reviews_done, reviews_new, pages_done, avg_page_ms, error, requested_at, started_at, finished_at";

function toJob(row: JobRow): ImportJob {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    provider: row.provider ?? "reader",
    priority: row.priority,
    reviewsExpected: row.reviews_expected,
    reviewsDone: row.reviews_done,
    reviewsNew: row.reviews_new,
    pagesDone: row.pages_done,
    avgPageMs: row.avg_page_ms,
    error: row.error,
    requestedAt: row.requested_at,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
  };
}

async function latestJob(client: SupabaseClient, businessId: string, kind: JobKind): Promise<ImportJob | null> {
  const { data, error } = await client
    .from("review_import_jobs")
    .select(jobColumns)
    .eq("business_id", businessId)
    .eq("kind", kind)
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle<JobRow>();
  if (error) throw new Error(error.message);
  return data ? toJob(data) : null;
}

/** Latest full import and update of a customer, the reader's heartbeat and what is already saved. */
export async function loadReaderJobs(client: SupabaseClient, businessId: string): Promise<ReaderJobsState> {
  const [full, update, discover, reader, business, count, newest] = await Promise.all([
    latestJob(client, businessId, "full"),
    latestJob(client, businessId, "update"),
    latestJob(client, businessId, "discover"),
    client.from("review_reader_status").select("last_seen_at, busy").order("last_seen_at", { ascending: false }).limit(1).maybeSingle<{ last_seen_at: string; busy: boolean }>(),
    client
      .from("review_businesses")
      .select("last_synced_at, reviews_total, competitors_refreshed_at")
      .eq("id", businessId)
      .maybeSingle<{ last_synced_at: string | null; reviews_total: number | null; competitors_refreshed_at: string | null }>(),
    client.from("google_reviews").select("review_id", { count: "exact", head: true }).eq("business_id", businessId),
    client.from("google_reviews").select("published_at").eq("business_id", businessId).order("published_at", { ascending: false }).limit(1).maybeSingle<{ published_at: string }>(),
  ]);
  if (count.error) throw new Error(count.error.message);
  if (newest.error) throw new Error(newest.error.message);
  if (reader.error) throw new Error(reader.error.message);
  if (business.error) throw new Error(business.error.message);
  const lastSeenAt = reader.data?.last_seen_at ?? null;
  const online = isReaderOnline(lastSeenAt, Date.now());
  // Same checks as dataForSeoConfigured() and fullImportSource(), inlined to keep this module test-friendly:
  // the reader's status shows unless DataForSEO runs the imports.
  const viaDataForSeo = Boolean(process.env.DATA_FOR_SEO_LOGIN && process.env.DATA_FOR_SEO_PASSWORD) && process.env.REVIEWS_FULL_IMPORT_SOURCE?.trim().toLowerCase() === "dataforseo";
  return {
    full,
    update,
    reader: viaDataForSeo
      ? { service: "dataforseo", online: true, lastSeenAt: null, busy: false }
      : { service: "reader", online, lastSeenAt, busy: online && Boolean(reader.data?.busy) },
    lastSyncedAt: business.data?.last_synced_at ?? null,
    stored: { count: count.count ?? 0, googleTotal: business.data?.reviews_total ?? null, newestAt: newest.data?.published_at ?? null },
    competition: await loadCompetitionProgress(client, businessId, business.data?.competitors_refreshed_at ?? null),
    discover,
  };
}

async function loadCompetitionProgress(client: SupabaseClient, businessId: string, searchedAt: string | null): Promise<CompetitionProgress | null> {
  if (!searchedAt) return null;
  const { data: places, error } = await client.from("competitors").select("place_id").eq("business_id", businessId).eq("is_self", false).eq("excluded", false);
  if (error) throw new Error(error.message);
  const placeIds = ((places ?? []) as { place_id: string }[]).map((row) => row.place_id);
  if (!placeIds.length) return { total: 0, read: 0, pending: 0 };
  // Reads asked for from a minute before the search (the search queues them right after saving).
  const since = new Date(Date.parse(searchedAt) - 60_000).toISOString();
  const { data: jobs, error: jobsError } = await client
    .from("review_import_jobs")
    .select("place_id, status, requested_at")
    .in("place_id", placeIds)
    .in("kind", ["competitor", "competitor_replies"])
    .gte("requested_at", since);
  if (jobsError) throw new Error(jobsError.message);
  return competitionProgress(placeIds, (jobs ?? []) as { place_id: string | null; status: JobStatus; requested_at: string }[]);
}

/**
 * Queues a job asked for in the panel; returns the active one when the customer already has one of
 * this kind (one active job per customer and kind). A routine job someone is now waiting for moves
 * up the queue.
 */
export async function queueJob(client: SupabaseClient, businessId: string, kind: JobKind, priority: number): Promise<ImportJob> {
  const { data, error } = await client
    .from("review_import_jobs")
    .insert({ business_id: businessId, kind, priority, requested_by: "panel" })
    .select(jobColumns)
    .single<JobRow>();
  if (!error) return toJob(data);
  if (error.code !== "23505") throw new Error(error.message);
  const active = await client
    .from("review_import_jobs")
    .select(jobColumns)
    .eq("business_id", businessId)
    .eq("kind", kind)
    .in("status", ["queued", "running"])
    .maybeSingle<JobRow>();
  if (active.error || !active.data) throw new Error(active.error?.message ?? "active job not found");
  if (active.data.status === "queued" && active.data.priority > priority) {
    await client.from("review_import_jobs").update({ priority }).eq("id", active.data.id).eq("status", "queued");
  }
  return toJob(active.data);
}

/**
 * The reader's competitor search for a customer without competitors, queued next to its first import
 * (it runs in parallel, in another tab). Nothing when the customer has competitors or one is waiting.
 */
export async function queueCompetitorSearch(client: SupabaseClient, businessId: string, requestedBy: "panel" | "admin" = "panel"): Promise<boolean> {
  const { data, error } = await client.from("review_businesses").select("competitors_refreshed_at").eq("id", businessId).maybeSingle<{ competitors_refreshed_at: string | null }>();
  if (error) throw new Error(error.message);
  if (!data || data.competitors_refreshed_at) return false;
  const insert = await client.from("review_import_jobs").insert({ business_id: businessId, kind: "discover", priority: jobPriority.firstImport, requested_by: requestedBy, provider: "reader" });
  if (insert.error && insert.error.code !== "23505") throw new Error(insert.error.message);
  return !insert.error;
}

/** "Importar histórico completo". */
export const queueFullImport = (client: SupabaseClient, businessId: string) => queueJob(client, businessId, "full", jobPriority.firstImport);
/** "Atualizar reviews" / "Atualizar" (Respostas): someone is waiting for it. */
export const queueUpdate = (client: SupabaseClient, businessId: string) => queueJob(client, businessId, "update", jobPriority.waiting);
