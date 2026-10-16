import "server-only";
import { randomBytes } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { serviceSupabaseConfig } from "@/lib/supabase/env";
import { isOrderingToken, sessionHours, tableChannel, type OrderStatus, type OrderingError, type TableOrderLine, type TableState } from "./ordering-rules";

export type { TableOrder, TableOrderLine, TableState } from "./ordering-rules";

// Ordering at the table: reads and changes of the tables' carts and orders (service role only: RLS
// lets nothing else in). Every change runs in one database function, which locks the table's row,
// and is then announced on the table's Realtime Broadcast channel («changed», with the new version):
// the phones fetch the state again from the server, never from the database.

/** A table's or an order's secret: 18 random bytes, 24 base64url characters. */
export function newOrderingToken(): string {
  return randomBytes(18).toString("base64url");
}

export interface OrderingTable {
  id: string;
  menuId: string;
  name: string;
  slug: string;
  business: string;
  /** The menu is active and ordering is on. */
  ordering: boolean;
  menuActive: boolean;
}

export class OrderingFailure extends Error {
  constructor(readonly code: OrderingError) {
    super(code);
    this.name = "OrderingFailure";
  }
}

const knownCodes: OrderingError[] = ["cart_full", "line_full", "note_too_long", "cart_empty", "order_too_soon", "rate_limited", "dish_missing", "table_missing"];

/** The database functions raise short codes; anything else is a real error. */
function failure(error: { message: string; code?: string }, context: string): never {
  const code = knownCodes.find((known) => error.message === known || error.message.endsWith(`: ${known}`));
  if (code) throw new OrderingFailure(code);
  // A check constraint (quantity, note) the rules above should have caught.
  if (error.code === "23514") throw new OrderingFailure("bad_request");
  throw new Error(`${context}: ${error.message}`);
}

const sessionSince = () => new Date(Date.now() - sessionHours * 3_600_000).toISOString();

/** The table of this link, with its menu; null when the token is unknown. */
export async function getTableByToken(token: string): Promise<OrderingTable | null> {
  if (!isOrderingToken(token)) return null;
  const { data, error } = await createServiceClient()
    .from("video_menu_tables")
    .select("id, menu_id, name, video_menus(slug, business_name, active, ordering_enabled)")
    .eq("token", token)
    .maybeSingle();
  if (error) failure(error, "getTableByToken");
  if (!data) return null;
  const row = data as unknown as { id: string; menu_id: string; name: string; video_menus: { slug: string; business_name: string; active: boolean; ordering_enabled: boolean } | null };
  const menu = row.video_menus;
  if (!menu) return null;
  return { id: row.id, menuId: row.menu_id, name: row.name, slug: menu.slug, business: menu.business_name, menuActive: menu.active, ordering: menu.active && menu.ordering_enabled };
}

/** What every phone at the table shows: the shared cart and this session's orders. */
export async function getTableState(tableId: string): Promise<TableState> {
  const client = createServiceClient();
  // The version first: a newer change in between only makes the phones fetch again.
  const table = await client.from("video_menu_tables").select("cart_version").eq("id", tableId).maybeSingle();
  if (table.error) failure(table.error, "getTableState");
  if (!table.data) throw new OrderingFailure("table_missing");
  const since = sessionSince();
  const [lines, orders] = await Promise.all([
    client
      .from("video_menu_cart_lines")
      .select("id, dish_id, quantity, note, video_menu_dishes(name, price_cents)")
      .eq("table_id", tableId)
      .gte("updated_at", since)
      .order("created_at")
      .order("id"),
    client
      .from("video_menu_orders")
      .select("id, number, token, status, total_cents, created_at, video_menu_order_lines(dish_name, unit_price_cents, quantity, note, position)")
      .eq("table_id", tableId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (lines.error) failure(lines.error, "getTableState lines");
  if (orders.error) failure(orders.error, "getTableState orders");
  type LineRow = { id: string; dish_id: string; quantity: number; note: string; video_menu_dishes: { name: string; price_cents: number } | null };
  type OrderRow = {
    id: string;
    number: number;
    token: string;
    status: OrderStatus;
    total_cents: number;
    created_at: string;
    video_menu_order_lines: { dish_name: string; unit_price_cents: number; quantity: number; note: string; position: number }[];
  };
  return {
    version: Number((table.data as { cart_version: number | string }).cart_version),
    lines: ((lines.data ?? []) as unknown as LineRow[]).map((line) => ({
      id: line.id,
      dish: line.dish_id,
      name: line.video_menu_dishes?.name ?? "",
      priceCents: line.video_menu_dishes?.price_cents ?? 0,
      quantity: line.quantity,
      note: line.note,
    })),
    orders: ((orders.data ?? []) as unknown as OrderRow[]).map((order) => ({
      id: order.id,
      number: order.number,
      token: order.token,
      status: order.status,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      lines: [...order.video_menu_order_lines]
        .sort((a, b) => a.position - b.position)
        .map((line) => ({ name: line.dish_name, priceCents: line.unit_price_cents, quantity: line.quantity, note: line.note })),
    })),
  };
}

/** One more of a dish; the table's new version. */
export async function cartAdd(tableId: string, dishId: string): Promise<number> {
  const { data, error } = await createServiceClient().rpc("video_menu_cart_add", { p_table: tableId, p_dish: dishId });
  if (error) failure(error, "cartAdd");
  return Number(data);
}

/** A line's quantity (0 removes it) and/or note; the table's new version. */
export async function cartSet(tableId: string, lineId: string, quantity: number | null, note: string | null): Promise<number> {
  const { data, error } = await createServiceClient().rpc("video_menu_cart_set", { p_table: tableId, p_line: lineId, p_quantity: quantity, p_note: note });
  if (error) failure(error, "cartSet");
  return Number(data);
}

export async function placeOrder(tableId: string): Promise<{ id: string; number: number; token: string; version: number }> {
  const token = newOrderingToken();
  const { data, error } = await createServiceClient().rpc("video_menu_place_order", { p_table: tableId, p_token: token });
  if (error) failure(error, "placeOrder");
  const row = ((data ?? []) as { order_id: string; order_number: number; version: number | string }[])[0];
  if (!row) throw new Error("placeOrder: no order returned");
  return { id: row.order_id, number: row.order_number, token, version: Number(row.version) };
}

/**
 * Tells the table's phones that its state changed (Realtime Broadcast, through its REST endpoint).
 * Best effort: the phones also fetch again when they come back to the page and every little while.
 */
export async function broadcastTableChange(tableId: string, version: number | null): Promise<void> {
  const config = serviceSupabaseConfig();
  if (!config) return;
  try {
    const response = await fetch(`${config.url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: { apikey: config.serviceRoleKey, Authorization: `Bearer ${config.serviceRoleKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ topic: tableChannel(tableId), event: "changed", payload: { v: version }, private: false }] }),
      cache: "no-store",
    });
    if (!response.ok) console.warn("[ordering] broadcast failed:", response.status);
  } catch (error) {
    console.warn("[ordering] broadcast failed:", error instanceof Error ? error.message : error);
  }
}

// The staff's page -----------------------------------------------------------------------------------

export interface StaffOrder {
  id: string;
  number: number;
  token: string;
  status: OrderStatus;
  tableName: string;
  totalCents: number;
  createdAt: string;
  confirmedAt: string | null;
  business: string;
  logo: string | null;
  lines: TableOrderLine[];
}

export async function getOrderByToken(token: string): Promise<StaffOrder | null> {
  if (!isOrderingToken(token)) return null;
  const { data, error } = await createServiceClient()
    .from("video_menu_orders")
    .select("id, number, token, status, table_name, total_cents, created_at, confirmed_at, video_menus(business_name, logo_url), video_menu_order_lines(dish_name, unit_price_cents, quantity, note, position)")
    .eq("token", token)
    .maybeSingle();
  if (error) failure(error, "getOrderByToken");
  if (!data) return null;
  const row = data as unknown as {
    id: string;
    number: number;
    token: string;
    status: OrderStatus;
    table_name: string;
    total_cents: number;
    created_at: string;
    confirmed_at: string | null;
    video_menus: { business_name: string; logo_url: string | null } | null;
    video_menu_order_lines: { dish_name: string; unit_price_cents: number; quantity: number; note: string; position: number }[];
  };
  return {
    id: row.id,
    number: row.number,
    token: row.token,
    status: row.status,
    tableName: row.table_name,
    totalCents: row.total_cents,
    createdAt: row.created_at,
    confirmedAt: row.confirmed_at,
    business: row.video_menus?.business_name ?? "",
    logo: row.video_menus?.logo_url ?? null,
    lines: [...row.video_menu_order_lines]
      .sort((a, b) => a.position - b.position)
      .map((line) => ({ name: line.dish_name, priceCents: line.unit_price_cents, quantity: line.quantity, note: line.note })),
  };
}

/** Marks the order confirmed and tells its table's phones. False when it was confirmed already. */
export async function confirmOrder(token: string): Promise<boolean> {
  if (!isOrderingToken(token)) return false;
  const { data, error } = await createServiceClient().rpc("video_menu_confirm_order", { p_token: token });
  if (error) failure(error, "confirmOrder");
  const row = ((data ?? []) as { table_id: string | null; version: number | null; confirmed: boolean }[])[0];
  if (!row?.confirmed) return false;
  if (row.table_id) await broadcastTableChange(row.table_id, row.version === null ? null : Number(row.version));
  return true;
}
