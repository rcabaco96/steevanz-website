import { createServiceClient } from "@/lib/supabase/service";
import { listKey, sectorOf, type SiteStatus, type Stage, type WhatsAppSettings } from "./crm";
import type { ProspectFields } from "./rules";

export interface ProspectSearchRow {
  id: string;
  query: string;
  area: string;
  max_results: number;
  status: "queued" | "running" | "done" | "failed";
  error: string | null;
  results: number | null;
  new_results: number | null;
  requested_by: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface ProspectRow extends ProspectFields {
  status: Stage;
  notes: string | null;
  next_contact: string | null;
  attempts: number;
  other_emails: string[];
  sector: string | null;
  site_status: SiteStatus | null;
  site_reasons: string[];
  site_checked_at: string | null;
  worked_at: string | null;
  worked_by: string | null;
  first_search_id: string | null;
  last_search_id: string | null;
  created_at: string;
  updated_at: string;
}

/** A business as the CRM board shows it. */
export interface CrmProspect extends Omit<ProspectRow, "latitude" | "longitude" | "first_search_id" | "last_search_id" | "created_at" | "updated_at" | "sector" | "site_checked_at"> {
  sector: string;
  /** Came in with a later search of the list, in the last two weeks. */
  fresh: boolean;
  /** Already one of our customers (reviews product). */
  customer: boolean;
}

/** A list: the businesses found by the searches done in one zone («Onde»). */
export interface CrmList {
  key: string;
  area: string;
  searchIds: string[];
  count: number;
}

export const crmColumns =
  "place_id, name, category, address, phone, website, email, rating, reviews, maps_url, status, notes, next_contact, attempts, other_emails, sector, site_status, site_reasons, worked_at, worked_by";

/** Every row of a query, a page at a time (Supabase returns at most 1000 rows per request). */
async function allRows<T>(page: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>, max = 20_000): Promise<T[]> {
  const size = 1000;
  const rows: T[] = [];
  for (let from = 0; from < max; from += size) {
    const { data, error } = await page(from, from + size - 1);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as T[]));
    if ((data ?? []).length < size) break;
  }
  return rows;
}

export async function listSearches(limit = 20): Promise<ProspectSearchRow[]> {
  const { data, error } = await createServiceClient().from("prospect_searches").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`listSearches: ${error.message}`);
  return (data ?? []) as ProspectSearchRow[];
}

/** The zones searched (or imported), oldest first, with how many businesses each has. */
export async function listCrmLists(): Promise<CrmList[]> {
  const client = createServiceClient();
  const [searches, hits] = await Promise.all([
    allRows<{ id: string; area: string }>((from, to) => client.from("prospect_searches").select("id, area").order("created_at").order("id").range(from, to)),
    allRows<{ search_id: string; place_id: string }>((from, to) => client.from("prospect_search_hits").select("search_id, place_id").order("search_id").order("place_id").range(from, to), 100_000),
  ]);
  const lists = new Map<string, CrmList & { places: Set<string> }>();
  const listOfSearch = new Map<string, string>();
  for (const search of searches) {
    const key = listKey(search.area);
    const list = lists.get(key) ?? { key, area: search.area.trim(), searchIds: [], count: 0, places: new Set<string>() };
    list.searchIds.push(search.id);
    lists.set(key, list);
    listOfSearch.set(search.id, key);
  }
  for (const hit of hits) {
    const key = listOfSearch.get(hit.search_id);
    if (key) lists.get(key)?.places.add(hit.place_id);
  }
  return [...lists.values()].map(({ places, ...list }) => ({ ...list, count: places.size })).filter((list) => list.count > 0);
}

const freshDays = 14;

/** The businesses of a list (or of every list), as the board shows them. */
export async function listCrmProspects(list: CrmList | null, now: Date = new Date()): Promise<CrmProspect[]> {
  const client = createServiceClient();
  const page = (from: number, to: number) => {
    const query = client
      .from("prospects")
      .select(list ? `${crmColumns}, first_search_id, created_at, prospect_search_hits!inner(search_id)` : `${crmColumns}, first_search_id, created_at`)
      .order("created_at")
      .order("place_id")
      .range(from, to);
    return list ? query.in("prospect_search_hits.search_id", list.searchIds) : query;
  };
  const [rows, customers] = await Promise.all([allRows<ProspectRow & { prospect_search_hits?: unknown }>(page), customerPlaceIds()]);
  const firstSearch = list?.searchIds[0];
  const freshSince = now.getTime() - freshDays * 86_400_000;
  return rows.map((row) => {
    const { first_search_id: firstFound, created_at: createdAt, ...rest } = row;
    delete rest.prospect_search_hits;
    return {
      ...rest,
      rating: rest.rating === null ? null : Number(rest.rating),
      other_emails: rest.other_emails ?? [],
      site_reasons: rest.site_reasons ?? [],
      sector: rest.sector || sectorOf(rest.category),
      fresh: Boolean(list && firstFound && firstFound !== firstSearch && list.searchIds.includes(firstFound) && Date.parse(createdAt) >= freshSince),
      customer: customers.has(row.place_id),
    };
  });
}

/** Google places that are already our customers (reviews product), so the list can say so. */
export async function customerPlaceIds(): Promise<Set<string>> {
  const { data, error } = await createServiceClient().from("review_businesses").select("place_id, google_place_id").limit(5000);
  if (error) throw new Error(`customerPlaceIds: ${error.message}`);
  return new Set(((data ?? []) as { place_id: string | null; google_place_id: string | null }[]).flatMap((row) => [row.place_id, row.google_place_id]).filter((id): id is string => Boolean(id)));
}

export const settingsColumns = "whatsapp_template, whatsapp_none, whatsapp_down, whatsapp_ai, whatsapp_outdated, whatsapp_other";

export async function getProspectSettings(): Promise<WhatsAppSettings> {
  const { data, error } = await createServiceClient().from("prospect_settings").select(settingsColumns).eq("id", true).maybeSingle();
  if (error) throw new Error(`getProspectSettings: ${error.message}`);
  return (data as WhatsAppSettings | null) ?? { whatsapp_template: "{situacao}", whatsapp_none: "", whatsapp_down: "", whatsapp_ai: "", whatsapp_outdated: "", whatsapp_other: "" };
}

export interface ProspectEvent {
  id: number;
  kind: "stage" | "no_answer" | "next_contact" | "note" | "site" | "product";
  value: string | null;
  previous: string | null;
  actor: string | null;
  created_at: string;
}

export async function listProspectEvents(placeId: string, limit = 100): Promise<ProspectEvent[]> {
  const { data, error } = await createServiceClient()
    .from("prospect_events")
    .select("id, kind, value, previous, actor, created_at")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`listProspectEvents: ${error.message}`);
  return (data ?? []) as ProspectEvent[];
}

/** «Para hoje» across every list, for the admin's start page. */
export async function countDueProspects(today: string): Promise<number> {
  const { count, error } = await createServiceClient()
    .from("prospects")
    .select("place_id", { count: "exact", head: true })
    .lte("next_contact", today)
    .not("status", "in", "(customer,lost)");
  if (error) throw new Error(`countDueProspects: ${error.message}`);
  return count ?? 0;
}
