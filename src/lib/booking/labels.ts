import { getProductCopy } from "@/content/product-copy";
import { isProductId } from "@/content/products";
import { sectors } from "@/content/sectors";
import type { Locale } from "@/lib/i18n";
import type { LeadKind, PipelineStatus } from "./types";

export const statusLabels: Record<PipelineStatus, string> = {
  new: "Novo",
  contacted: "Contactado",
  scheduled: "Agendado",
  closed: "Fechado",
  lost: "Perdido",
  cancelled: "Cancelado",
};

export const kindLabels: Record<LeadKind, string> = {
  info_request: "Pedido de informação",
  waitlist: "Lista de espera",
};

export function productLabel(productId: string | null | undefined, locale: Locale = "pt"): string {
  if (!productId) return locale === "pt" ? "Sem produto definido" : "No product selected";
  if (!isProductId(productId)) return productId;
  return getProductCopy(productId, locale).name;
}

export function sectorLabel(sectorId: string | null | undefined, locale: Locale = "pt"): string {
  if (!sectorId) return "";
  const sector = sectors.find((candidate) => candidate.id === sectorId);
  if (sector) return sector.copy[locale].name;
  return locale === "pt" ? "Outro" : "Other";
}
