import { createServiceClient } from "@/lib/supabase/service";
import { kindFromCategory, slugify, type BusinessKind } from "./kinds";
import { listOwnerEstablishments } from "./store";
import type { EstablishmentRow } from "./types";

/** Products that run inside an establishment (they need one to work). */
export const establishmentProducts = ["waitlist", "loyalty", "bookings"] as const;

// Opening hours a new establishment starts with (editable straight away).
export const startingHours: Record<BusinessKind, { weekdays: number[]; intervals: [string, string][] }> = {
  restaurant: { weekdays: [2, 3, 4, 5, 6, 0], intervals: [["12:00", "15:00"], ["19:00", "23:00"]] },
  salon: { weekdays: [2, 3, 4, 5, 6], intervals: [["09:00", "19:00"]] },
  clinic: { weekdays: [1, 2, 3, 4, 5], intervals: [["09:00", "13:00"], ["14:00", "19:00"]] },
  retail: { weekdays: [1, 2, 3, 4, 5, 6], intervals: [["09:00", "19:00"]] },
};

/** Adds the starting opening hours of its kind to a new establishment. */
export async function addStartingHours(establishmentId: string, kind: BusinessKind): Promise<void> {
  const plan = startingHours[kind];
  const hours = plan.weekdays.flatMap((weekday) => plan.intervals.map(([opens, closes]) => ({ establishment_id: establishmentId, weekday, opens, closes })));
  const { error } = await createServiceClient().from("establishment_hours").insert(hours);
  if (error) console.error("[establishments] starting hours failed:", error.message);
}

/** A free address for the public pages: "the-sea-wolf", then "the-sea-wolf-2", … */
async function freeSlug(name: string): Promise<string> {
  const base = slugify(name).slice(0, 55) || "espaco";
  const { data, error } = await createServiceClient().from("establishments").select("slug").like("slug", `${base}%`);
  if (error) throw new Error(error.message);
  const taken = new Set((data ?? []).map((row: { slug: string }) => row.slug));
  if (!taken.has(base)) return base;
  for (let n = 2; ; n += 1) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

/**
 * The client's first establishment, created on its own when a waitlist, loyalty card or booking
 * product is activated: for most clients the business *is* the establishment (one restaurant, one
 * barbershop). Name, kind, phone and map come from their review panel when they have one, otherwise
 * from the account. Does nothing when the client already has one.
 */
export async function ensureFirstEstablishment(ownerId: string): Promise<void> {
  const client = createServiceClient();
  const { count, error: countError } = await client.from("establishments").select("id", { count: "exact", head: true }).eq("owner_id", ownerId);
  if (countError) throw new Error(countError.message);
  if (count) return;
  const [{ data: profile }, { data: panel }] = await Promise.all([
    client.from("profiles").select("full_name, business_name, phone, email").eq("id", ownerId).maybeSingle(),
    client.from("review_businesses").select("name, category, contact_phone").eq("owner_id", ownerId).order("created_at").limit(1).maybeSingle(),
  ]);
  if (!profile) return;
  const name = (panel?.name || profile.business_name || profile.full_name || profile.email.split("@")[0]).slice(0, 120);
  const kind = kindFromCategory(panel?.category);
  const { data, error } = await client
    .from("establishments")
    .insert({ owner_id: ownerId, name, kind, slug: await freeSlug(name), phone: panel?.contact_phone || profile.phone || null })
    .select("id")
    .single<{ id: string }>();
  if (error) {
    // Created at the same moment by another request: fine.
    if (error.code === "23505") return;
    throw new Error(error.message);
  }
  await addStartingHours(data.id, kind);
}

/**
 * The client's establishments for a module page. Clients who had the product before establishments
 * were created on their own get their first one here, the first time the module is opened.
 */
export async function moduleEstablishments(ownerId: string): Promise<EstablishmentRow[]> {
  const establishments = await listOwnerEstablishments(ownerId);
  if (establishments.length) return establishments;
  await ensureFirstEstablishment(ownerId);
  return listOwnerEstablishments(ownerId);
}
