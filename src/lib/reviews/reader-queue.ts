/**
 * Queue of review reads (review_import_jobs), run by the free Steevanz reader (scripts/reader), the
 * only source of reviews besides the official Google API of verified customers. Every job is
 * inserted with provider = 'reader' (the reader only claims those). Planning never reads Google: it
 * only queues jobs (contract in supabase/migrations/20261004130000_reader_queue.sql; rules in
 * .claude/skills/regras-negocio-reviews).
 *
 * Kinds: "full" (whole history of a customer), "update" (new reviews + recent replies),
 * "competitor" (one Google place, shared by every customer that has it as competitor),
 * "competitor_replies" (same place: reply rate over 12 months, max 2000 reviews).
 *
 * Pure planning functions + small DB helpers. Only relative imports and type imports, so the
 * planning can be tested with node --test.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { OwnerEmail } from "../booking/email.ts";
import { needsSlotRead, previousCompetitionUpdate } from "./competition-schedule.ts";
import { dailySyncFor, lisbonDay, needsFullSync } from "./sync-rules.ts";

export type ReaderJobKind = "full" | "update" | "competitor" | "competitor_replies" | "discover";
export type JobRequester = "panel" | "cron" | "admin";
/**
 * review_import_jobs.provider of every job queued: the reader only claims these. The column's
 * database default is still an old provider, so inserts always set it.
 */
export const readerProvider = "reader";

/**
 * Lower runs first: someone waiting in the panel/admin, then first imports, then a new customer's
 * competition (zone search and first reads of its places), then the routine. On top of this, the
 * reader never starts competitor work while any customer's own job (full/update) is queued or
 * running (gateAllows in reader-throttle.ts): the customer's history comes first and alone.
 */
export const jobPriority = { waiting: 1, firstImport: 3, competitionStart: 4, routine: 5 } as const;
/**
 * Business rule: replies are checked every day, for competitors too. The "competitor" read covers
 * the last 30 days: the place's numbers, new reviews + replies to recent ones. "competitor_replies"
 * (12 months, max 2000 reviews) runs only once per place, when its reply rate was never measured.
 */
/** At most this many first 12-month reads queued per day (each reads up to 2000 reviews). */
export const competitorRepliesPerDay = 60;
/** The owner is emailed when the reader has not reported for this long. */
export const readerOfflineAfterHours = 12;
/** ...at most once a day (20 h so the two daily crons cannot both send one). */
export const readerAlertEveryHours = 20;

const hourMs = 3_600_000;

export interface ReaderJob {
  kind: ReaderJobKind;
  business_id: string | null;
  place_id: string | null;
  priority: number;
  requested_by: JobRequester;
}

export interface PlanBusiness {
  id: string;
  last_synced_at: string | null;
  full_synced_at: string | null;
  /** The customer's own Google place (from the competitor search / from a read): other customers may compare with it. */
  place_id?: string | null;
  google_place_id?: string | null;
  /** Verified customers (connected to Google Business Profile) are synced through the official API, never by the reader. */
  google_link_status?: string | null;
  /** Centre and Google category of the customer (zone snapshot of its competitors). */
  lat?: number | null;
  lng?: number | null;
  category?: string | null;
}

export interface PlanCompetitor {
  /** Customer that compares with this place. */
  business_id?: string;
  place_id: string;
  excluded: boolean;
  is_self: boolean;
}

/** reader_places row: dates are calendar days in Portugal, written by the reader. */
export interface ReaderPlace {
  place_id: string;
  read_on: string | null;
  /** Exact time of the last read (the competition base is updated at 10:00 and 19:00). */
  read_at?: string | null;
  replies_read_on: string | null;
}

/**
 * Daily job of one customer: the first import (whole history) when it never happened, otherwise
 * an update (new reviews + replies to recent ones) unless the customer already updated today.
 */
export function customerDailyJob(business: PlanBusiness, now: Date = new Date()): ReaderJob | null {
  if (business.google_link_status === "connected") return null;
  const mode = dailySyncFor({ lastSyncedAt: business.last_synced_at, fullDue: needsFullSync(business) }, now);
  if (mode === "skip") return null;
  if (mode === "full") {
    return { kind: "full", business_id: business.id, place_id: null, priority: jobPriority.firstImport, requested_by: "cron" };
  }
  return { kind: "update", business_id: business.id, place_id: null, priority: jobPriority.routine, requested_by: "cron" };
}

/** Distinct Google places compared by at least one customer (excluded and own places left out). */
export function comparedPlaces(competitors: PlanCompetitor[]): string[] {
  return [...new Set(competitors.filter((row) => !row.excluded && !row.is_self && row.place_id).map((row) => row.place_id))].sort();
}

/**
 * Places already updated today by any path other than a competitor read: a customer whose own
 * place it is pressed "Atualizar" (or was read by the reader / a Google Business Profile sync),
 * which sets review_businesses.last_synced_at.
 */
export function placesUpdatedToday(businesses: PlanBusiness[], today: string): Set<string> {
  const places = new Set<string>();
  for (const business of businesses) {
    if (!business.last_synced_at || lisbonDay(business.last_synced_at) !== today) continue;
    if (business.place_id) places.add(business.place_id);
    if (business.google_place_id) places.add(business.google_place_id);
  }
  return places;
}

/** Places whose 12-month reply rate was never measured (first read only), capped per day. */
export function repliesDue(places: string[], readerPlaces: ReaderPlace[], _today: string, limit = competitorRepliesPerDay): string[] {
  const measured = new Set(readerPlaces.filter((row) => row.replies_read_on).map((row) => row.place_id));
  return places.filter((placeId) => !measured.has(placeId)).slice(0, limit);
}

/**
 * The customers' daily routine (22:00 Portuguese time, scheduler tick): "full" on the first import
 * only, else "update" unless the customer already updated that day. Verified customers are left out
 * (official Google API). Competitor places are planned per slot (planCompetitionSlot).
 */
export function planDailyJobs(businesses: PlanBusiness[], now: Date = new Date()): ReaderJob[] {
  return businesses
    .map((business) => customerDailyJob(business, now))
    .filter((job) => job !== null)
    .sort((a, b) => a.priority - b.priority);
}

/** Customers' own places updated since a moment (their "Atualizar", a reader read, a Google sync). */
export function placesUpdatedSince(businesses: PlanBusiness[], since: Date): Set<string> {
  const places = new Set<string>();
  for (const business of businesses) {
    if (!business.last_synced_at || Date.parse(business.last_synced_at) < since.getTime()) continue;
    if (business.place_id) places.add(business.place_id);
    if (business.google_place_id) places.add(business.google_place_id);
  }
  return places;
}

/**
 * Business rule: the shared competition base is updated twice a day, at 10:00 and 19:00 Portuguese
 * time (competition-schedule.ts). One "competitor" read per distinct place compared by any customer
 * (one read serves every customer that has it), only when nothing updated it since the reference
 * moment — neither a read of the place (reader_places.read_at) nor its own customer (last_synced_at).
 * Plus the one-off 12-month "competitor_replies" for places never measured (max 60 per slot).
 *
 * Reference moment: the slot that just passed. The reader's read is also where the star numbers
 * come from, so every place is read at every slot (30-day window).
 */
export function planCompetitionSlot(
  businesses: PlanBusiness[],
  competitors: PlanCompetitor[],
  readerPlaces: ReaderPlace[],
  now: Date = new Date(),
): ReaderJob[] {
  const places = comparedPlaces(competitors);
  const readAt = new Map(readerPlaces.map((row) => [row.place_id, row.read_at ?? (row.read_on ? `${row.read_on}T00:00:00Z` : null)]));
  const since = previousCompetitionUpdate(now);
  const updated = placesUpdatedSince(businesses, since);
  const placeJob = (kind: ReaderJobKind, placeId: string): ReaderJob => ({ kind, business_id: null, place_id: placeId, priority: jobPriority.routine, requested_by: "cron" });
  return [
    ...places.filter((placeId) => needsSlotRead(readAt.get(placeId) ?? null, since) && !updated.has(placeId)).map((placeId) => placeJob("competitor", placeId)),
    ...repliesDue(places, readerPlaces, lisbonDay(now)).map((placeId) => placeJob("competitor_replies", placeId)),
  ];
}

/** Places of newly discovered competitors that the reader should read now (sharing: skip places already read today). */
export function newPlaceJobs(placeIds: string[], readerPlaces: ReaderPlace[], requestedBy: JobRequester, now: Date = new Date()): ReaderJob[] {
  const today = lisbonDay(now);
  const places = [...new Set(placeIds)].sort();
  const known = new Map(readerPlaces.map((row) => [row.place_id, row]));
  const job = (kind: ReaderJobKind, placeId: string): ReaderJob => ({ kind, business_id: null, place_id: placeId, priority: jobPriority.competitionStart, requested_by: requestedBy });
  return [
    ...places.filter((placeId) => known.get(placeId)?.read_on !== today).map((placeId) => job("competitor", placeId)),
    ...repliesDue(places, readerPlaces, today).map((placeId) => job("competitor_replies", placeId)),
  ];
}

/** Same key as the unique "one active job per target and kind" indexes. */
export function jobKey(job: Pick<ReaderJob, "kind" | "business_id" | "place_id">): string {
  return job.business_id ? `b:${job.business_id}:${job.kind}` : `p:${job.place_id}:${job.kind}`;
}

// --- Reader heartbeat ------------------------------------------------------------------------------

/** Whether to email the owner: reader silent for 12+ h (or never seen) and no alert in the last 20 h. */
export function readerAlertDue(lastSeenAt: string | null, lastAlertAt: string | null, now: Date = new Date()): boolean {
  const offline = !lastSeenAt || now.getTime() - Date.parse(lastSeenAt) > readerOfflineAfterHours * hourMs;
  const alertedRecently = Boolean(lastAlertAt && now.getTime() - Date.parse(lastAlertAt) < readerAlertEveryHours * hourMs);
  return offline && !alertedRecently;
}

export function readerOfflineEmail(lastSeenAt: string | null, queued: number, adminUrl: string): OwnerEmail {
  const seen = lastSeenAt ? new Date(lastSeenAt).toLocaleString("pt-PT", { timeZone: "Europe/Lisbon", dateStyle: "short", timeStyle: "short" }) : "nunca";
  return {
    subject: `O leitor de reviews está desligado há mais de ${readerOfflineAfterHours} horas`,
    heading: "O leitor de reviews está desligado",
    rows: [
      { label: "Último sinal", value: seen },
      { label: "Pedidos à espera", value: String(queued) },
      { label: "O que fazer", value: "Ligue o computador do leitor e corra «npm run reader» na pasta do site. Enquanto estiver desligado, as reviews dos clientes e a concorrência não são atualizadas." },
    ],
    adminUrl,
    linkLabel: "Abrir o admin",
  };
}

// --- Database helpers ------------------------------------------------------------------------------

type Client = SupabaseClient;

async function readAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) return rows;
  }
}

/** Inputs of planDailyJobs / planCompetitionSlot / zone snapshots, read from the database (paginated: competitors exceed 1000 rows). */
export async function loadPlanInputs(client: Client) {
  const [businesses, competitors, readerPlaces] = await Promise.all([
    readAll<PlanBusiness & { slug: string }>((from, to) =>
      client.from("review_businesses").select("id, slug, last_synced_at, full_synced_at, place_id, google_place_id, google_link_status, lat, lng, category").order("id").range(from, to),
    ),
    readAll<PlanCompetitor>((from, to) => client.from("competitors").select("business_id, place_id, excluded, is_self").eq("excluded", false).eq("is_self", false).order("id").range(from, to)),
    readAll<ReaderPlace>((from, to) => client.from("reader_places").select("place_id, read_on, read_at, replies_read_on").order("place_id").range(from, to)),
  ]);
  return { businesses, competitors, readerPlaces };
}

export async function loadReaderPlaces(client: Client, placeIds: string[]): Promise<ReaderPlace[]> {
  const rows: ReaderPlace[] = [];
  for (let index = 0; index < placeIds.length; index += 200) {
    const { data, error } = await client.from("reader_places").select("place_id, read_on, replies_read_on").in("place_id", placeIds.slice(index, index + 200));
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as ReaderPlace[]));
  }
  return rows;
}

async function activeJobKeys(client: Client): Promise<Set<string>> {
  const rows = await readAll<{ kind: ReaderJobKind; business_id: string | null; place_id: string | null }>((from, to) =>
    client.from("review_import_jobs").select("kind, business_id, place_id").in("status", ["queued", "running"]).order("id").range(from, to),
  );
  const keys = new Set<string>();
  for (const row of rows) {
    if (row.business_id) keys.add(jobKey({ ...row, place_id: null }));
    if (row.place_id) keys.add(jobKey({ ...row, business_id: null }));
  }
  return keys;
}

export interface EnqueueResult {
  queued: number;
  alreadyActive: number;
}

/**
 * Queues jobs idempotently: targets that already have an active job of that kind are skipped (and
 * a unique violation from a race, 23505, is ignored). requested_at keeps the planned order.
 */
export async function enqueueJobs(client: Client, jobs: ReaderJob[], now: Date = new Date()): Promise<EnqueueResult> {
  const active = await activeJobKeys(client);
  const fresh = jobs.filter((job) => !active.has(jobKey(job)));
  const rows = fresh.map((job, index) => ({ ...job, provider: readerProvider, requested_at: new Date(now.getTime() + index).toISOString() }));
  let queued = 0;
  for (let index = 0; index < rows.length; index += 100) {
    const batch = rows.slice(index, index + 100);
    const { error } = await client.from("review_import_jobs").insert(batch);
    if (!error) {
      queued += batch.length;
      continue;
    }
    if (error.code !== "23505") throw new Error(error.message);
    // Someone queued one of these meanwhile: insert one by one, skipping the duplicates.
    for (const row of batch) {
      const single = await client.from("review_import_jobs").insert(row);
      if (!single.error) queued++;
      else if (single.error.code !== "23505") throw new Error(single.error.message);
    }
  }
  return { queued, alreadyActive: jobs.length - queued };
}

/** After a competitor search: asks the reader for the details of the customer's compared places right away. */
export async function queueNewCompetitorReads(client: Client, businessId: string, requestedBy: JobRequester): Promise<EnqueueResult> {
  const { data, error } = await client.from("competitors").select("place_id").eq("business_id", businessId).eq("excluded", false).eq("is_self", false);
  if (error) throw new Error(error.message);
  const placeIds = (data ?? []).map((row) => row.place_id as string);
  if (!placeIds.length) return { queued: 0, alreadyActive: 0 };
  return enqueueJobs(client, newPlaceJobs(placeIds, await loadReaderPlaces(client, placeIds), requestedBy, new Date()));
}

/** Queues one job; "active" when the same target already has one of that kind queued or running. */
export async function queueReaderJob(client: Client, job: ReaderJob): Promise<"queued" | "active"> {
  const { error } = await client.from("review_import_jobs").insert({ ...job, provider: readerProvider });
  if (!error) return "queued";
  if (error.code === "23505") return "active";
  throw new Error(error.message);
}

/**
 * Jobs of providers that no longer exist (the paid services removed on 2026-10-09: anything other
 * than the reader or Google's official API). Queued before (the column's database default, or old
 * code), they would wait forever: the reader only claims provider = 'reader', and while one waits no
 * new job of that kind can be queued for the same target. Hands them to the reader, back in the
 * queue (also those left "running"); only one customer's when `businessId` is given. Returns how many.
 */
export async function handRetiredJobsToReader(client: Client, businessId?: string): Promise<number> {
  let query = client
    .from("review_import_jobs")
    .update({ provider: readerProvider, status: "queued", started_at: null, reader_id: null, updated_at: new Date().toISOString() })
    .in("status", ["queued", "running"])
    .not("provider", "in", `(${readerProvider},google)`);
  if (businessId) query = query.eq("business_id", businessId);
  const { data, error } = await query.select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

/** Last time any reader reported (null when none ever did). */
export async function readerLastSeen(client: Client): Promise<string | null> {
  const { data, error } = await client.from("review_reader_status").select("last_seen_at").order("last_seen_at", { ascending: false }).limit(1).maybeSingle<{ last_seen_at: string }>();
  if (error) throw new Error(error.message);
  return data?.last_seen_at ?? null;
}

export async function queuedJobCount(client: Client): Promise<number> {
  const { count, error } = await client.from("review_import_jobs").select("id", { count: "exact", head: true }).eq("status", "queued");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Whether any queued or running job still uses the local reader (the offline alert only matters then). */
export async function hasActiveReaderJobs(client: Client): Promise<boolean> {
  const { count, error } = await client.from("review_import_jobs").select("id", { count: "exact", head: true }).eq("provider", "reader").in("status", ["queued", "running"]);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export interface HeartbeatCheck {
  lastSeenAt: string | null;
  offline: boolean;
  alerted: boolean;
}

/**
 * Emails the owner when the reader has been silent for 12+ hours, at most once a day (last alert
 * stored in review_reader_alerts). dryRun reports what would happen without sending or storing.
 */
export async function checkReaderHeartbeat(
  client: Client,
  options: { send: (email: OwnerEmail) => Promise<boolean>; adminUrl: string; now?: Date; dryRun?: boolean },
): Promise<HeartbeatCheck> {
  const now = options.now ?? new Date();
  const lastSeenAt = await readerLastSeen(client);
  const offline = !lastSeenAt || now.getTime() - Date.parse(lastSeenAt) > readerOfflineAfterHours * hourMs;
  if (!offline) return { lastSeenAt, offline, alerted: false };
  const { data, error } = await client.from("review_reader_alerts").select("sent_at").eq("id", "offline").maybeSingle<{ sent_at: string }>();
  if (error) throw new Error(error.message);
  if (!readerAlertDue(lastSeenAt, data?.sent_at ?? null, now)) return { lastSeenAt, offline, alerted: false };
  if (options.dryRun) return { lastSeenAt, offline, alerted: true };
  const sent = await options.send(readerOfflineEmail(lastSeenAt, await queuedJobCount(client), options.adminUrl));
  if (sent) {
    const { error: saveError } = await client.from("review_reader_alerts").upsert({ id: "offline", sent_at: now.toISOString() });
    if (saveError) throw new Error(saveError.message);
  }
  return { lastSeenAt, offline, alerted: sent };
}
