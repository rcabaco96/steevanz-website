import { createServiceClient } from "@/lib/supabase/service";
import type { ClosureRow, EstablishmentBundle, EstablishmentRow, HoursRow, ServiceRow, StaffRow } from "./types";

// Reads for establishments. Always through the service role: callers check access first
// (requireEstablishmentAccess) or only expose what a public page shows.

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return uuidPattern.test(value);
}

export async function getEstablishment(id: string): Promise<EstablishmentRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("establishments").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getEstablishment: ${error.message}`);
  return data as EstablishmentRow | null;
}

export async function getEstablishmentBySlug(slug: string): Promise<EstablishmentRow | null> {
  if (!slugPattern.test(slug) || slug.length > 60) return null;
  const { data, error } = await createServiceClient().from("establishments").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`getEstablishmentBySlug: ${error.message}`);
  return data as EstablishmentRow | null;
}

export async function listOwnerEstablishments(ownerId: string): Promise<EstablishmentRow[]> {
  if (!isUuid(ownerId)) return [];
  const { data, error } = await createServiceClient().from("establishments").select("*").eq("owner_id", ownerId).order("name");
  if (error) throw new Error(`listOwnerEstablishments: ${error.message}`);
  return (data ?? []) as EstablishmentRow[];
}

/** The establishment with its services, professionals, hours and closed days. */
export async function loadBundle(establishment: EstablishmentRow): Promise<EstablishmentBundle> {
  const client = createServiceClient();
  const id = establishment.id;
  const [services, staff, hours, closures] = await Promise.all([
    client.from("establishment_services").select("*").eq("establishment_id", id).order("sort").order("created_at"),
    client.from("establishment_staff").select("*").eq("establishment_id", id).order("sort").order("created_at"),
    client.from("establishment_hours").select("*").eq("establishment_id", id).order("weekday").order("opens"),
    client.from("establishment_closures").select("*").eq("establishment_id", id).gte("day", new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)).order("day"),
  ]);
  for (const result of [services, staff, hours, closures]) if (result.error) throw new Error(`loadBundle: ${result.error.message}`);
  return {
    establishment,
    services: (services.data ?? []) as ServiceRow[],
    staff: (staff.data ?? []) as StaffRow[],
    hours: (hours.data ?? []) as HoursRow[],
    closures: (closures.data ?? []) as ClosureRow[],
  };
}

/** Whether the owner has this product active (orders accepted or added by an admin). */
export async function ownerHasProduct(ownerId: string, productId: string): Promise<boolean> {
  const { data, error } = await createServiceClient()
    .from("client_products")
    .select("id")
    .eq("user_id", ownerId)
    .eq("product_id", productId)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw new Error(`ownerHasProduct: ${error.message}`);
  return Boolean(data);
}

/** "HH:MM:SS" → "HH:MM". */
export function shortTime(value: string): string {
  return value.slice(0, 5);
}
