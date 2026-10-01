import type { Localized } from "@/lib/i18n";
import type { SectorId } from "./types";

export const sectorSlugs: Record<SectorId, Localized<string>> = {
  restaurants: { pt: "restaurantes", en: "restaurants" },
  beauty: { pt: "cabeleireiros-estetica", en: "salons-beauty" },
  clinics: { pt: "clinicas", en: "clinics" },
  retail: { pt: "comercio", en: "retail" },
};
