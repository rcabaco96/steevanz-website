import { createAuthClient } from "@/lib/supabase/server";
import type { ClientProductRow, OrderRow } from "./types";

// Clients may only read these columns (see the column grants in the accounts migration).
const productColumns = "id, user_id, product_id, status, order_id, activated_at, created_at, updated_at";
const orderColumns = "id, reference, user_id, name, email, phone, business_name, sector, message, locale, items, totals, status, created_at, updated_at";

export type OwnProduct = Omit<ClientProductRow, "notes">;
export type OwnOrder = Omit<OrderRow, "admin_notes">;

// Reads for the signed-in client. They go through the user's own session, so
// RLS limits every query to rows that belong to that account.

async function client() {
  const supabase = await createAuthClient();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export async function listOwnProducts(userId: string): Promise<OwnProduct[]> {
  const { data, error } = await (await client())
    .from("client_products")
    .select(productColumns)
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("activated_at", { ascending: true });
  if (error) throw new Error(`listOwnProducts: ${error.message}`);
  return (data ?? []) as OwnProduct[];
}

export async function getOwnProduct(userId: string, productId: string): Promise<OwnProduct | null> {
  const { data, error } = await (await client())
    .from("client_products")
    .select(productColumns)
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  if (error) throw new Error(`getOwnProduct: ${error.message}`);
  return data as OwnProduct | null;
}

export async function listOwnOrders(userId: string): Promise<OwnOrder[]> {
  const { data, error } = await (await client())
    .from("orders")
    .select(orderColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(`listOwnOrders: ${error.message}`);
  return (data ?? []) as OwnOrder[];
}
