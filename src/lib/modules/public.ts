import { cache } from "react";
import { getEstablishmentBySlug, ownerHasProduct } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import type { ModuleProduct } from "@/lib/establishments/access";

/**
 * The establishment behind a public module page, only while its owner has that product active
 * (a suspended or cancelled product takes the public page down too).
 */
export const publicEstablishment = cache(async (slug: string, product: ModuleProduct): Promise<EstablishmentRow | null> => {
  const establishment = await getEstablishmentBySlug(slug);
  if (!establishment) return null;
  return (await ownerHasProduct(establishment.owner_id, product)) ? establishment : null;
});
