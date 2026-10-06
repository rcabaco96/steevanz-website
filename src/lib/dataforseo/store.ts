/**
 * Supabase reads and writes shared by dispatch.ts, process.ts and collect.ts. Mirrors what the
 * local reader writes (scripts/reader/store.mjs, jobs.mjs). Never stores names, photos or profiles
 * of who wrote a review; for competitors only the ledger (place_reviews) and aggregates, never texts.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { matchStoredReviews, sameReviewToleranceMs, type MapsReview } from "@/lib/reviews/maps-reader";
import { ledgerComplete, lisbonDay, paceFromLedger, replyRateFromLedger, type LedgerRow } from "./rules";

const dayMs = 86_400_000;
const round = (value: number | null, decimals: number) => (value === null ? null : Math.round(value * 10 ** decimals) / 10 ** decimals);

/** review_import_jobs.reader_id while a DataForSEO task is pending, and while its result is being written. */
export const dfsReaderId = "dataforseo";
export const dfsProcessingId = "dataforseo-processing";

export type DfsJobKind = "full" | "update" | "competitor" | "competitor_replies";

export interface DfsJobRow {
  id: string;
  kind: DfsJobKind;
  status: "queued" | "running" | "done" | "failed";
  provider: string;
  business_id: string | null;
  place_id: string | null;
  priority: number;
  requested_at: string;
  started_at: string | null;
  dispatched_at: string | null;
  external_task_ids: string[] | null;
  reviews_new: number | null;
  pages_done: number | null;
  reader_id: string | null;
  updated_at: string | null;
}

export const dfsJobColumns =
  "id, kind, status, provider, business_id, place_id, priority, requested_at, started_at, dispatched_at, external_task_ids, reviews_new, pages_done, reader_id, updated_at";

export interface DfsBusinessRow {
  id: string;
  slug: string;
  name: string;
  google_maps_url: string;
  alert_email: string | null;
  place_id: string | null;
  google_place_id: string | null;
  google_fid: string | null;
  google_link_status: string | null;
  reviews_total: number | null;
  last_synced_at: string | null;
  full_synced_at: string | null;
}

const businessColumns = "id, slug, name, google_maps_url, alert_email, place_id, google_place_id, google_fid, google_link_status, reviews_total, last_synced_at, full_synced_at";

/** Note kept on a job of a customer linked to Google Business Profile (same as the reader's). */
export const linkedNote = "Negócio ligado ao Google Business Profile: as reviews chegam pela ligação oficial, por isso não foi lido pelo DataForSEO.";

function check(result: { error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
}

const nowIso = () => new Date().toISOString();

export async function loadJob(client: SupabaseClient, jobId: string): Promise<DfsJobRow | null> {
  const { data, error } = await client.from("review_import_jobs").select(dfsJobColumns).eq("id", jobId).maybeSingle<DfsJobRow>();
  if (error) throw new Error(error.message);
  return data;
}

export async function loadBusiness(client: SupabaseClient, businessId: string): Promise<DfsBusinessRow | null> {
  const { data, error } = await client.from("review_businesses").select(businessColumns).eq("id", businessId).maybeSingle<DfsBusinessRow>();
  if (error) throw new Error(error.message);
  return data;
}

/** Ends a job. With `lease`, only while this process holds it (a retried postback cannot finish it twice). */
export async function finishJob(
  client: SupabaseClient,
  jobId: string,
  fields: { status: "done" | "failed"; error: string | null; [key: string]: unknown },
  options: { lease?: boolean } = {},
): Promise<boolean> {
  const at = nowIso();
  let query = client
    .from("review_import_jobs")
    .update({ ...fields, finished_at: at, updated_at: at })
    .eq("id", jobId);
  query = options.lease ? query.eq("status", "running").eq("reader_id", dfsProcessingId) : query.in("status", ["queued", "running"]);
  const { data, error } = await query.select("id");
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

/** Customer's own Google place (from the competitor search or the Business Profile link). */
export function businessPlaceId(business: Pick<DfsBusinessRow, "place_id" | "google_place_id">): string | null {
  return business.place_id ?? business.google_place_id ?? null;
}

export interface PlaceRow {
  read_on: string | null;
  read_at: string | null;
  replies_read_on: string | null;
  deep_checked_on: string | null;
}

export async function readerPlaceRow(client: SupabaseClient, placeId: string): Promise<PlaceRow | null> {
  const { data, error } = await client.from("reader_places").select("read_on, read_at, replies_read_on, deep_checked_on").eq("place_id", placeId).maybeSingle<PlaceRow>();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertReaderPlace(client: SupabaseClient, placeId: string, fields: Record<string, unknown>) {
  check(await client.from("reader_places").upsert({ place_id: placeId, ...fields, updated_at: nowIso() }, { onConflict: "place_id" }));
}

export interface PlaceCompetitorRow {
  id: string;
  business_id: string;
  place_id: string;
  is_self: boolean;
  pace_per_month: number | null;
}

export async function competitorsForPlaces(client: SupabaseClient, placeIds: string[]): Promise<PlaceCompetitorRow[]> {
  const rows: PlaceCompetitorRow[] = [];
  const unique = [...new Set(placeIds)];
  for (let index = 0; index < unique.length; index += 100) {
    for (let from = 0; ; from += 1000) {
      const { data, error } = await client
        .from("competitors")
        .select("id, business_id, place_id, is_self, pace_per_month")
        .in("place_id", unique.slice(index, index + 100))
        .order("id")
        .range(from, from + 999);
      if (error) throw new Error(error.message);
      rows.push(...((data ?? []) as PlaceCompetitorRow[]));
      if (!data || data.length < 1000) break;
    }
  }
  return rows;
}

/** Latest snapshot total of a place (any customer's row), optionally taken on or before a day. */
export async function placeSnapshotTotal(client: SupabaseClient, competitorIds: string[], onOrBefore?: string): Promise<{ reviews_count: number; taken_on: string } | null> {
  if (!competitorIds.length) return null;
  let query = client.from("competitor_snapshots").select("reviews_count, taken_on").in("competitor_id", competitorIds.slice(0, 100));
  if (onOrBefore) query = query.lte("taken_on", onOrBefore);
  const { data, error } = await query.order("taken_on", { ascending: false }).limit(1).maybeSingle<{ reviews_count: number; taken_on: string }>();
  if (error) throw new Error(error.message);
  return data;
}

// --- Customers' reviews (google_reviews) --------------------------------------------------------

export type CustomerReviewRow = MapsReview & { business_id: string; fetched_at: string };

async function storedAround(client: SupabaseClient, businessId: string, rows: CustomerReviewRow[]) {
  const times = rows.map((row) => Date.parse(row.published_at));
  const from = new Date(Math.min(...times) - sameReviewToleranceMs).toISOString();
  const to = new Date(Math.max(...times) + sameReviewToleranceMs).toISOString();
  const stored: { review_id: string; rating: number; published_at: string }[] = [];
  for (let start = 0; ; start += 1000) {
    const { data, error } = await client
      .from("google_reviews")
      .select("review_id, rating, published_at")
      .eq("business_id", businessId)
      .gte("published_at", from)
      .lte("published_at", to)
      .order("published_at")
      .order("review_id")
      .range(start, start + 999);
    if (error) throw new Error(error.message);
    stored.push(...(data ?? []));
    if (!data || data.length < 1000) return stored;
  }
}

/**
 * Saves a customer's reviews read from Google and returns those we did not have (same merge as the
 * reader): a review already stored under another id (e.g. `gbp:…`, ±2 s, same stars) keeps its row
 * and only gets the owner reply when Google shows one. An owner reply we hold is never replaced by
 * "no reply" (a reply just posted may take a while to show), nor its date by an unknown date.
 */
export async function saveCustomerReviews(client: SupabaseClient, businessId: string, rows: CustomerReviewRow[]): Promise<CustomerReviewRow[]> {
  if (!rows.length) return [];
  const known = new Map<string, { owner_reply: string | null; owner_replied_at: string | null }>();
  const ids = rows.map((row) => row.review_id);
  for (let index = 0; index < ids.length; index += 100) {
    const { data, error } = await client
      .from("google_reviews")
      .select("review_id, owner_reply, owner_replied_at")
      .eq("business_id", businessId)
      .in("review_id", ids.slice(index, index + 100));
    if (error) throw new Error(error.message);
    for (const row of data ?? []) known.set(row.review_id, { owner_reply: row.owner_reply, owner_replied_at: row.owner_replied_at });
  }
  const matches = matchStoredReviews(rows, await storedAround(client, businessId, rows));
  const upserts = rows
    .filter((row) => !matches.has(row.review_id))
    .map((row) => {
      const stored = known.get(row.review_id);
      if (!stored) return row;
      if (!row.owner_reply && stored.owner_reply) return { ...row, owner_reply: stored.owner_reply, owner_replied_at: stored.owner_replied_at };
      if (row.owner_reply && !row.owner_replied_at && stored.owner_replied_at) return { ...row, owner_replied_at: stored.owner_replied_at };
      return row;
    });
  for (let index = 0; index < upserts.length; index += 500) {
    check(await client.from("google_reviews").upsert(upserts.slice(index, index + 500), { onConflict: "review_id" }));
  }
  for (const row of rows.filter((candidate) => matches.has(candidate.review_id) && candidate.owner_reply)) {
    check(
      await client
        .from("google_reviews")
        .update({ owner_reply: row.owner_reply, ...(row.owner_replied_at ? { owner_replied_at: row.owner_replied_at } : {}), fetched_at: row.fetched_at })
        .eq("review_id", matches.get(row.review_id)!),
    );
  }
  return rows.filter((row) => !known.has(row.review_id) && !matches.has(row.review_id));
}

// --- Ledger (place_reviews) -----------------------------------------------------------------------

/**
 * Upserts ledger rows (no texts). Business rule: every review read is stored and never deleted, so
 * Google is never paid twice for the same review and statistics come from Supabase. "Replied" never
 * goes back to false and a reply date is never erased: a reply just posted may take a while to show
 * on Google.
 */
export async function upsertLedger(client: SupabaseClient, rows: LedgerRow[], now = new Date()) {
  const checkedAt = now.toISOString();
  const kept = rows;
  const base = (row: LedgerRow) => ({ place_id: row.place_id, review_id: row.review_id, published_at: row.published_at, rating: row.rating, last_checked_at: checkedAt });
  const groups = [
    kept.filter((row) => row.replied && row.replied_at).map((row) => ({ ...base(row), replied: true, replied_at: row.replied_at })),
    kept.filter((row) => row.replied && !row.replied_at).map((row) => ({ ...base(row), replied: true })),
    kept.filter((row) => !row.replied).map(base),
  ];
  for (const group of groups) {
    for (let index = 0; index < group.length; index += 500) {
      check(await client.from("place_reviews").upsert(group.slice(index, index + 500), { onConflict: "place_id,review_id" }));
    }
  }
}

/** True when the place's ledger covers 12 months (see ledgerComplete). For the planner too. */
export async function placeLedgerComplete(client: SupabaseClient, placeId: string, repliesReadOn?: string | null): Promise<boolean> {
  const readOn = repliesReadOn === undefined ? ((await readerPlaceRow(client, placeId))?.replies_read_on ?? null) : repliesReadOn;
  if (!readOn) return false;
  const { data, error } = await client.from("place_reviews").select("first_seen_at").eq("place_id", placeId).order("first_seen_at", { ascending: true }).limit(1).maybeSingle<{ first_seen_at: string }>();
  if (error) throw new Error(error.message);
  return ledgerComplete(readOn, data?.first_seen_at ?? null);
}

/**
 * Exact 12-month reply rate of a place from its ledger, written to every competitors row with that
 * place_id (replies_window_days = 365). With `withPace`, also the monthly pace from the ledger
 * dates. Nothing is written while the ledger is incomplete. Returns whether it was written.
 */
export async function refreshPlaceReplyRate(client: SupabaseClient, placeId: string, now = new Date(), options: { withPace?: boolean } = {}): Promise<boolean> {
  if (!(await placeLedgerComplete(client, placeId))) return false;
  const since = new Date(now.getTime() - 365 * dayMs).toISOString();
  const rows: { published_at: string; replied: boolean }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client
      .from("place_reviews")
      .select("published_at, replied")
      .eq("place_id", placeId)
      .gte("published_at", since)
      .order("published_at", { ascending: false })
      .order("review_id")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as { published_at: string; replied: boolean }[]));
    if (!data || data.length < 1000) break;
  }
  const replies = replyRateFromLedger(rows, now);
  check(
    await client
      .from("competitors")
      .update({
        reply_rate: round(replies.rate, 3),
        reply_sample: replies.sample,
        reply_since: replies.since,
        replies_window_days: 365,
        ...(options.withPace ? { pace_per_month: round(paceFromLedger(rows, now), 2), pace_measured_at: now.toISOString() } : {}),
      })
      .eq("place_id", placeId),
  );
  return true;
}

// --- Snapshots ------------------------------------------------------------------------------------

export interface SnapshotFields {
  rating: number | null;
  average: number | null;
  reviews_count: number;
  distribution: unknown;
}

/** Today's snapshot (Portuguese day) for the given competitor rows; detailed_on when it has a distribution. */
export async function upsertSnapshots(client: SupabaseClient, rows: { competitor_id: string; snapshot: SnapshotFields }[], now = new Date()) {
  if (!rows.length) return;
  const today = lisbonDay(now);
  for (let index = 0; index < rows.length; index += 500) {
    const batch = rows.slice(index, index + 500).map(({ competitor_id, snapshot }) => ({ competitor_id, taken_on: today, ...snapshot }));
    check(await client.from("competitor_snapshots").upsert(batch, { onConflict: "competitor_id,taken_on" }));
  }
  const detailed = rows.filter((row) => row.snapshot.distribution).map((row) => row.competitor_id);
  for (let index = 0; index < detailed.length; index += 100) {
    check(await client.from("competitors").update({ detailed_on: today }).in("id", detailed.slice(index, index + 100)));
  }
}

/**
 * The customer's own row in the comparisons (is_self) from a read of its reviews: rating and total
 * only. Today's snapshot from the zone search keeps its star distribution; without one, a snapshot
 * without distribution is added (as the reader does when Google shows no bars).
 */
export async function snapshotOwnPlace(client: SupabaseClient, placeId: string, shown: { rating: number | null; total: number | null }, now = new Date()) {
  if (shown.total === null) return;
  const { data: own, error } = await client.from("competitors").select("id").eq("place_id", placeId).eq("is_self", true);
  if (error) throw new Error(error.message);
  const ids = (own ?? []).map((row) => row.id as string);
  if (!ids.length) return;
  const today = lisbonDay(now);
  const { data: existing, error: existingError } = await client.from("competitor_snapshots").select("competitor_id").in("competitor_id", ids).eq("taken_on", today);
  if (existingError) throw new Error(existingError.message);
  const has = new Set((existing ?? []).map((row) => row.competitor_id as string));
  const update = ids.filter((id) => has.has(id));
  if (update.length) {
    check(
      await client
        .from("competitor_snapshots")
        .update({ ...(shown.rating !== null ? { rating: shown.rating } : {}), reviews_count: shown.total })
        .in("competitor_id", update)
        .eq("taken_on", today),
    );
  }
  const insert = ids.filter((id) => !has.has(id));
  if (insert.length) {
    await upsertSnapshots(
      client,
      insert.map((id) => ({ competitor_id: id, snapshot: { rating: shown.rating, average: null, reviews_count: shown.total!, distribution: null } })),
      now,
    );
  }
}
