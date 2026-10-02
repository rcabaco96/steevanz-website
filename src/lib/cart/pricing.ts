import { getProduct, isProductId, type PriceBilling } from "@/content/products";
import type { ProductId } from "@/content/types";
import type { Locale } from "@/lib/i18n";

export const vatRate = 23;
export const maxQuantity = 99;
export const maxCartLines = 20;

export interface CartLineOptions {
  format: string;
  logo: boolean;
  text: string;
}

export interface CartLine {
  id: string;
  productId: ProductId;
  quantity: number;
  options?: CartLineOptions;
}

export type CartGroupId = "oneTime" | "monthly";

export const cartGroups: CartGroupId[] = ["oneTime", "monthly"];

export interface PricedLine extends CartLine {
  billing: PriceBilling;
  unitCents: number;
  subtotalCents: number;
}

export interface GroupTotals {
  lines: PricedLine[];
  quantity: number;
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
}

export function groupForBilling(billing: PriceBilling): CartGroupId {
  return billing === "monthly" ? "monthly" : "oneTime";
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(maxQuantity, Math.max(1, Math.round(value)));
}

export function defaultOptions(productId: ProductId): CartLineOptions | undefined {
  const customization = getProduct(productId).customization;
  return customization ? { format: customization.formats[0].id, logo: false, text: "" } : undefined;
}

export function sanitizeOptions(productId: ProductId, input: unknown): CartLineOptions | undefined {
  const customization = getProduct(productId).customization;
  if (!customization) return undefined;
  const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const format = customization.formats.some((candidate) => candidate.id === raw.format)
    ? String(raw.format)
    : customization.formats[0].id;
  const text = typeof raw.text === "string" ? raw.text.slice(0, customization.textMaxLength) : "";
  return { format, logo: raw.logo === true, text };
}

export function sameOptions(a: CartLineOptions | undefined, b: CartLineOptions | undefined): boolean {
  if (!a || !b) return a === b;
  return a.format === b.format && a.logo === b.logo && a.text.trim() === b.text.trim();
}

export function sanitizeLines(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  const lines: CartLine[] = [];
  const ids = new Set<string>();
  for (const [index, item] of input.entries()) {
    if (lines.length >= maxCartLines) break;
    if (!item || typeof item !== "object") continue;
    const { id, productId, quantity, options } = item as Record<string, unknown>;
    if (typeof productId !== "string" || !isProductId(productId)) continue;
    if (typeof quantity !== "number") continue;
    const lineId = typeof id === "string" && id.length <= 40 && !ids.has(id) ? id : `${productId}-${index}`;
    ids.add(lineId);
    lines.push({ id: lineId, productId, quantity: clampQuantity(quantity), options: sanitizeOptions(productId, options) });
  }
  return lines;
}

export function unitCentsFor(line: Pick<CartLine, "productId" | "options">): number {
  const product = getProduct(line.productId);
  const extra = line.options?.logo && product.customization ? product.customization.logoExtra : 0;
  return (product.priceFrom + extra) * 100;
}

function totalsFor(lines: PricedLine[]): GroupTotals {
  const subtotalCents = lines.reduce((sum, line) => sum + line.subtotalCents, 0);
  const vatCents = Math.round((subtotalCents * vatRate) / 100);
  return {
    lines,
    quantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalCents,
    vatCents,
    totalCents: subtotalCents + vatCents,
  };
}

export function priceCart(lines: CartLine[]): Record<CartGroupId, GroupTotals> {
  const priced: PricedLine[] = lines.map((line) => {
    const unitCents = unitCentsFor(line);
    return { ...line, billing: getProduct(line.productId).priceBilling, unitCents, subtotalCents: unitCents * line.quantity };
  });
  return {
    oneTime: totalsFor(priced.filter((line) => groupForBilling(line.billing) === "oneTime")),
    monthly: totalsFor(priced.filter((line) => groupForBilling(line.billing) === "monthly")),
  };
}

export function formatCents(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
