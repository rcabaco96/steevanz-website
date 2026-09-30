import { isProductId } from "@/content/products";
import { addDaysToDate, zonedDateTimeToUtc } from "@/lib/booking/slots";
import { isLeadKind, isPipelineStatus, type BookingRow, type LeadKind, type LeadRow, type PipelineStatus } from "@/lib/booking/types";
import { site } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/service";

export type AdminSearchParams = Record<string, string | string[] | undefined>;

export interface ListFilters {
  status: PipelineStatus | "";
  product: string;
  kind: LeadKind | "";
  from: string;
  to: string;
  q: string;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const listLimit = 300;
const exportLimit = 10000;

function first(params: AdminSearchParams, key: string): string {
  const value = params[key];
  return ((Array.isArray(value) ? value[0] : value) ?? "").trim();
}

export function parseFilters(params: AdminSearchParams | URLSearchParams): ListFilters {
  const get = (key: string) =>
    params instanceof URLSearchParams ? (params.get(key) ?? "").trim() : first(params, key);
  const status = get("status");
  const kind = get("kind");
  const product = get("product");
  const from = get("from");
  const to = get("to");
  return {
    status: isPipelineStatus(status) ? status : "",
    kind: isLeadKind(kind) ? kind : "",
    product: product === "none" || isProductId(product) ? product : "",
    from: datePattern.test(from) ? from : "",
    to: datePattern.test(to) ? to : "",
    q: get("q").slice(0, 80),
  };
}

export function filtersToQuery(filters: ListFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function sanitizeSearch(term: string): string {
  return term.replace(/[%_,().*\\:"']/g, " ").replace(/\s+/g, " ").trim();
}

function dayStart(date: string): string {
  return zonedDateTimeToUtc(date, 0, site.timeZone).toISOString();
}

interface FilterQuery extends PromiseLike<{ data: unknown[] | null; error: { message: string } | null }> {
  eq(column: string, value: string): FilterQuery;
  is(column: string, value: null): FilterQuery;
  gte(column: string, value: string): FilterQuery;
  lt(column: string, value: string): FilterQuery;
  or(filters: string): FilterQuery;
  order(column: string, options: { ascending: boolean }): FilterQuery;
  limit(count: number): FilterQuery;
}

function applyFilters(query: FilterQuery, filters: ListFilters, dateColumn: string, withKind: boolean): FilterQuery {
  let next = query;
  if (filters.status) next = next.eq("status", filters.status);
  if (filters.product === "none") next = next.is("product_id", null);
  else if (filters.product) next = next.eq("product_id", filters.product);
  if (withKind && filters.kind) next = next.eq("kind", filters.kind);
  if (filters.from) next = next.gte(dateColumn, dayStart(filters.from));
  if (filters.to) next = next.lt(dateColumn, dayStart(addDaysToDate(filters.to, 1)));
  const term = sanitizeSearch(filters.q);
  if (term) {
    const pattern = `%${term}%`;
    next = next.or(
      ["name", "email", "phone", "business_name", "message"].map((column) => `${column}.ilike.${pattern}`).join(","),
    );
  }
  return next;
}

export async function listBookings(filters: ListFilters, forExport = false): Promise<BookingRow[]> {
  const client = createServiceClient();
  const query = applyFilters(client.from("bookings").select("*") as unknown as FilterQuery, filters, "slot_start", false)
    .order("slot_start", { ascending: false })
    .limit(forExport ? exportLimit : listLimit);
  const { data, error } = await query;
  if (error) throw new Error(`listBookings: ${error.message}`);
  return (data ?? []) as BookingRow[];
}

export async function listLeads(filters: ListFilters, forExport = false): Promise<LeadRow[]> {
  const client = createServiceClient();
  const query = applyFilters(client.from("leads").select("*") as unknown as FilterQuery, filters, "created_at", true)
    .order("created_at", { ascending: false })
    .limit(forExport ? exportLimit : listLimit);
  const { data, error } = await query;
  if (error) throw new Error(`listLeads: ${error.message}`);
  return (data ?? []) as LeadRow[];
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return uuidPattern.test(value);
}

export async function getBooking(id: string): Promise<BookingRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("bookings").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getBooking: ${error.message}`);
  return data as BookingRow | null;
}

export async function getLead(id: string): Promise<LeadRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getLead: ${error.message}`);
  return data as LeadRow | null;
}

type StatusCounts = Record<PipelineStatus, number>;

export interface DashboardStats {
  bookings: { total: number; last7: number; last30: number; byStatus: StatusCounts };
  leads: { total: number; last7: number; last30: number; byStatus: StatusCounts; waitlist: number };
  byProduct: { productId: string | null; bookings: number; leads: number }[];
  upcoming: BookingRow[];
  recentLeads: LeadRow[];
}

function emptyCounts(): StatusCounts {
  return { new: 0, contacted: 0, scheduled: 0, closed: 0, lost: 0, cancelled: 0 };
}

export async function dashboardStats(now = new Date()): Promise<DashboardStats> {
  const client = createServiceClient();
  const [bookingsResult, leadsResult, upcomingResult, recentLeadsResult] = await Promise.all([
    client.from("bookings").select("status, product_id, created_at").limit(exportLimit),
    client.from("leads").select("status, product_id, kind, created_at").limit(exportLimit),
    client
      .from("bookings")
      .select("*")
      .gte("slot_start", now.toISOString())
      .neq("status", "cancelled")
      .order("slot_start", { ascending: true })
      .limit(6),
    client.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
  ]);
  const firstError = bookingsResult.error ?? leadsResult.error ?? upcomingResult.error ?? recentLeadsResult.error;
  if (firstError) throw new Error(`dashboardStats: ${firstError.message}`);

  const day = 86_400_000;
  const since7 = now.getTime() - 7 * day;
  const since30 = now.getTime() - 30 * day;
  const productMap = new Map<string | null, { bookings: number; leads: number }>();
  const bump = (productId: string | null, key: "bookings" | "leads") => {
    const entry = productMap.get(productId) ?? { bookings: 0, leads: 0 };
    entry[key] += 1;
    productMap.set(productId, entry);
  };

  const bookings = { total: 0, last7: 0, last30: 0, byStatus: emptyCounts() };
  for (const row of (bookingsResult.data ?? []) as Pick<BookingRow, "status" | "product_id" | "created_at">[]) {
    const created = new Date(row.created_at).getTime();
    bookings.total += 1;
    if (created >= since7) bookings.last7 += 1;
    if (created >= since30) bookings.last30 += 1;
    bookings.byStatus[row.status] += 1;
    bump(row.product_id, "bookings");
  }

  const leads = { total: 0, last7: 0, last30: 0, byStatus: emptyCounts(), waitlist: 0 };
  for (const row of (leadsResult.data ?? []) as Pick<LeadRow, "status" | "product_id" | "kind" | "created_at">[]) {
    const created = new Date(row.created_at).getTime();
    leads.total += 1;
    if (created >= since7) leads.last7 += 1;
    if (created >= since30) leads.last30 += 1;
    leads.byStatus[row.status] += 1;
    if (row.kind === "waitlist") leads.waitlist += 1;
    bump(row.product_id, "leads");
  }

  const byProduct = [...productMap.entries()]
    .map(([productId, counts]) => ({ productId, ...counts }))
    .sort((a, b) => b.bookings + b.leads - (a.bookings + a.leads));

  return {
    bookings,
    leads,
    byProduct,
    upcoming: (upcomingResult.data ?? []) as BookingRow[],
    recentLeads: (recentLeadsResult.data ?? []) as LeadRow[],
  };
}
