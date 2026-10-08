import { getSession } from "@/lib/auth/session";
import type { ModuleProduct } from "./access";
import { coveredEstablishmentIds, getEstablishmentBySlug, listOwnerEstablishments } from "./store";
import type { EstablishmentRow } from "./types";

/** The products used at the counter during the day, in the order of the tabs. */
export const counterProducts: ModuleProduct[] = ["waitlist", "bookings", "loyalty"];

/** The counter products this owner has, per space (only spaces with at least one). */
export async function ownerCounterSpaces(ownerId: string): Promise<{ establishment: EstablishmentRow; products: ModuleProduct[] }[]> {
  const [establishments, ...covered] = await Promise.all([
    listOwnerEstablishments(ownerId),
    ...counterProducts.map((product) => coveredEstablishmentIds(ownerId, product)),
  ]);
  return establishments
    .map((establishment) => ({ establishment, products: counterProducts.filter((_, index) => covered[index].includes(establishment.id)) }))
    .filter((space) => space.products.length);
}

export type CounterAccess =
  | { state: "ok"; establishment: EstablishmentRow; products: ModuleProduct[]; viewer: "client" | "admin"; now: number }
  | { state: "anonymous" }
  | { state: "denied" };

/** Who may open a space's counter: admins, and the owner for the products the space has. */
export async function counterAccess(slug: string): Promise<CounterAccess> {
  const session = await getSession();
  if (session.state !== "admin" && session.state !== "client") return { state: "anonymous" };
  const establishment = /^[a-z0-9-]{1,60}$/.test(slug) ? await getEstablishmentBySlug(slug) : null;
  if (!establishment) return { state: "denied" };
  if (session.state === "client" && establishment.owner_id !== session.user.id) return { state: "denied" };
  const space = (await ownerCounterSpaces(establishment.owner_id)).find((item) => item.establishment.id === establishment.id);
  if (!space) return { state: "denied" };
  return { state: "ok", establishment, products: space.products, viewer: session.state, now: Date.now() };
}
