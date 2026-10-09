import { isProductId } from "@/content/products";
import { isOrderStatus, type ClientProductRow, type OrderRow, type OrderStatus, type ProfileRow } from "@/lib/accounts/types";
import { addDaysToDate, zonedDateTimeToUtc } from "@/lib/booking/slots";
import { isLeadKind, isPipelineStatus, type BookingRow, type LeadKind, type LeadRow, type PipelineStatus } from "@/lib/booking/types";
import { readerOfflineAfterHours } from "@/lib/reviews/reader-queue";
import { site } from "@/lib/site";
import { adminEmails } from "@/lib/supabase/env";
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

/** What needs the team today, for the admin home: orders to accept, contacts to answer, the reader. */
export interface AttentionStats {
  pendingOrders: number;
  ordersLast30: number;
  activeClients: number;
  /** Hours since the reviews reader was last seen, when that is past the alert time; else null. */
  readerOfflineHours: number | null;
  /** Reader requests that failed in the last 24 hours. */
  failedReads: number;
}

export async function attentionStats(now = new Date()): Promise<AttentionStats> {
  const client = createServiceClient();
  const since30 = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const since24h = new Date(now.getTime() - 86_400_000).toISOString();
  const [pending, recentOrders, clients, reader, failed, readerJobs] = await Promise.all([
    client.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    client.from("orders").select("id", { count: "exact", head: true }).gte("created_at", since30),
    client.from("client_products").select("user_id").eq("status", "active").limit(exportLimit),
    client.from("review_reader_status").select("last_seen_at").order("last_seen_at", { ascending: false }).limit(1).maybeSingle<{ last_seen_at: string }>(),
    client.from("review_import_jobs").select("id", { count: "exact", head: true }).eq("status", "failed").gte("finished_at", since24h),
    client.from("review_import_jobs").select("id", { count: "exact", head: true }).eq("provider", "reader").in("status", ["queued", "running"]),
  ]);
  const error = pending.error ?? recentOrders.error ?? clients.error ?? reader.error ?? failed.error ?? readerJobs.error;
  if (error) throw new Error(`attentionStats: ${error.message}`);
  const hours = reader.data ? (now.getTime() - Date.parse(reader.data.last_seen_at)) / 3_600_000 : null;
  // Only worth a line when something waits for the reader and it has been quiet past the alert time.
  const readerOffline = (readerJobs.count ?? 0) > 0 && (hours === null || hours > readerOfflineAfterHours);
  return {
    pendingOrders: pending.count ?? 0,
    ordersLast30: recentOrders.count ?? 0,
    activeClients: new Set(((clients.data ?? []) as { user_id: string }[]).map((row) => row.user_id)).size,
    readerOfflineHours: readerOffline ? Math.round(hours ?? 0) : null,
    failedReads: failed.count ?? 0,
  };
}

// Client accounts and orders

export interface ClientSummary extends ProfileRow {
  activeProducts: number;
  /** Review panels this account owns. */
  panels: number;
}

export interface ClientPanel {
  id: string;
  slug: string;
  name: string;
}

function searchPattern(term: string, columns: string[]): string | null {
  const clean = sanitizeSearch(term);
  return clean ? columns.map((column) => `${column}.ilike.%${clean}%`).join(",") : null;
}

export async function listClients(q: string): Promise<ClientSummary[]> {
  const client = createServiceClient();
  let query = client.from("profiles").select("*").order("created_at", { ascending: false }).limit(listLimit);
  // Admin accounts are staff, not clients.
  const admins = adminEmails();
  if (admins.length) query = query.not("email", "in", `(${admins.map((email) => `"${email}"`).join(",")})`);
  const pattern = searchPattern(q, ["email", "full_name", "business_name", "phone", "nif"]);
  if (pattern) query = query.or(pattern);
  const { data, error } = await query;
  if (error) throw new Error(`listClients: ${error.message}`);
  const profiles = (data ?? []) as ProfileRow[];
  if (!profiles.length) return [];

  const ids = profiles.map((profile) => profile.id);
  const [{ data: owned, error: ownedError }, { data: panels, error: panelsError }] = await Promise.all([
    client.from("client_products").select("user_id").eq("status", "active").in("user_id", ids),
    client.from("review_businesses").select("owner_id").in("owner_id", ids),
  ]);
  if (ownedError) throw new Error(`listClients products: ${ownedError.message}`);
  if (panelsError) throw new Error(`listClients panels: ${panelsError.message}`);
  const tally = (rows: { key: string | null }[]) => {
    const counts = new Map<string, number>();
    for (const { key } of rows) if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  };
  const productCounts = tally(((owned ?? []) as Pick<ClientProductRow, "user_id">[]).map((row) => ({ key: row.user_id })));
  const panelCounts = tally(((panels ?? []) as { owner_id: string | null }[]).map((row) => ({ key: row.owner_id })));
  return profiles.map((profile) => ({
    ...profile,
    activeProducts: productCounts.get(profile.id) ?? 0,
    panels: panelCounts.get(profile.id) ?? 0,
  }));
}

export async function listClientPanels(userId: string): Promise<ClientPanel[]> {
  if (!isUuid(userId)) return [];
  const { data, error } = await createServiceClient().from("review_businesses").select("id, slug, name").eq("owner_id", userId).order("name");
  if (error) throw new Error(`listClientPanels: ${error.message}`);
  return (data ?? []) as ClientPanel[];
}

/** Products the account has active: what the client really bought (orders accepted or added by an admin). */
export async function listActiveProductIds(userId: string): Promise<string[]> {
  if (!isUuid(userId)) return [];
  const { data, error } = await createServiceClient().from("client_products").select("product_id").eq("user_id", userId).eq("status", "active");
  if (error) throw new Error(`listActiveProductIds: ${error.message}`);
  return ((data ?? []) as { product_id: string }[]).map((row) => row.product_id);
}

export async function getProfile(id: string): Promise<ProfileRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getProfile: ${error.message}`);
  return data as ProfileRow | null;
}

export async function findProfileByEmail(email: string): Promise<ProfileRow | null> {
  const { data, error } = await createServiceClient().from("profiles").select("*").eq("email", email.toLowerCase()).maybeSingle();
  if (error) throw new Error(`findProfileByEmail: ${error.message}`);
  return data as ProfileRow | null;
}

export async function listClientProducts(userId: string): Promise<ClientProductRow[]> {
  const { data, error } = await createServiceClient()
    .from("client_products")
    .select("*")
    .eq("user_id", userId)
    .order("activated_at", { ascending: true });
  if (error) throw new Error(`listClientProducts: ${error.message}`);
  return (data ?? []) as ClientProductRow[];
}

export async function getClientProduct(userId: string, productId: string): Promise<ClientProductRow | null> {
  if (!isUuid(userId)) return null;
  const { data, error } = await createServiceClient()
    .from("client_products")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  if (error) throw new Error(`getClientProduct: ${error.message}`);
  return data as ClientProductRow | null;
}

/** Orders placed while signed in, plus guest orders made with the same email. */
export async function listClientOrders(profile: ProfileRow): Promise<OrderRow[]> {
  const client = createServiceClient();
  const [own, guest] = await Promise.all([
    client.from("orders").select("*").eq("user_id", profile.id).limit(listLimit),
    client.from("orders").select("*").is("user_id", null).eq("email", profile.email).limit(listLimit),
  ]);
  const error = own.error ?? guest.error;
  if (error) throw new Error(`listClientOrders: ${error.message}`);
  return [...((own.data ?? []) as OrderRow[]), ...((guest.data ?? []) as OrderRow[])].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export interface OrderFilters {
  status: OrderStatus | "";
  q: string;
}

export function parseOrderFilters(params: AdminSearchParams): OrderFilters {
  const status = first(params, "status");
  return { status: isOrderStatus(status) ? status : "", q: first(params, "q").slice(0, 80) };
}

export async function listOrders(filters: OrderFilters): Promise<OrderRow[]> {
  let query = createServiceClient().from("orders").select("*").order("created_at", { ascending: false }).limit(listLimit);
  if (filters.status) query = query.eq("status", filters.status);
  const pattern = searchPattern(filters.q, ["reference", "name", "email", "phone", "business_name"]);
  if (pattern) query = query.or(pattern);
  const { data, error } = await query;
  if (error) throw new Error(`listOrders: ${error.message}`);
  return (data ?? []) as OrderRow[];
}

export async function getOrder(id: string): Promise<OrderRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getOrder: ${error.message}`);
  return data as OrderRow | null;
}

/** The account an order belongs to: the one it was placed with, or one registered with the same email. */
export async function accountForOrder(order: OrderRow): Promise<ProfileRow | null> {
  if (order.user_id) return getProfile(order.user_id);
  return findProfileByEmail(order.email);
}
