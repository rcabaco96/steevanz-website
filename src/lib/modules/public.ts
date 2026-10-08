import { cache } from "react";
import { establishmentHasProduct, getEstablishmentBySlug } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import type { ModuleProduct } from "@/lib/establishments/access";

/**
 * The establishment behind a public module page, only while its owner has that product active for
 * this space (a suspended or cancelled product, or a space beyond the ones paid for, has no page).
 */
export const publicEstablishment = cache(async (slug: string, product: ModuleProduct): Promise<EstablishmentRow | null> => {
  const establishment = await getEstablishmentBySlug(slug);
  if (!establishment) return null;
  return (await establishmentHasProduct(establishment, product)) ? establishment : null;
});
