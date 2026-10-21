// Relative imports with extensions keep this module runnable by `node --test` (tests/cart-pricing.test.mjs).
import { getProduct, toProductId, type PriceBilling, type Product } from "../../content/products.ts";
import type { ProductId } from "../../content/types.ts";
import { numberLocale, type Locale } from "../i18n.ts";

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
  // Charged once for the whole line (logo set up once for a pack), on top of unitCents × quantity.
  lineExtraCents: number;
  // Taken off the line: the units offered on sign-up (the guest guide's 1st plate), at the line's plate price.
  offerCents: number;
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

/** Project products (websites, automation) are one project per line: the quantity stays at 1. */
export function maxQuantityFor(productId: ProductId): number {
  return getProduct(productId).priceBilling === "project" ? 1 : maxQuantity;
}

export function clampQuantity(value: number, max = maxQuantity): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(max, Math.max(1, Math.round(value)));
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
  // Format-only products (the keychain) take no logo and no text.
  if (customization.formatOnly) return { format, logo: false, text: "" };
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
    const { id, productId: rawProductId, quantity, options } = item as Record<string, unknown>;
    // Old ids (carts saved before a product was renamed) become the current ones.
    const productId = toProductId(rawProductId);
    if (!productId) continue;
    if (typeof quantity !== "number") continue;
    const lineId = typeof id === "string" && id.length <= 40 && !ids.has(id) ? id : `${productId}-${index}`;
    ids.add(lineId);
    lines.push({ id: lineId, productId, quantity: clampQuantity(quantity, maxQuantityFor(productId)), options: sanitizeOptions(productId, options) });
  }
  return lines;
}

export function unitPriceFor(product: Pick<Product, "priceFrom" | "packs">, quantity: number): number {
  const pack = product.packs?.filter((candidate) => quantity >= candidate.quantity).at(-1);
  return pack ? pack.unitPrice : product.priceFrom;
}

export function unitCentsFor(line: Pick<CartLine, "productId" | "options" | "quantity">): number {
  const product = getProduct(line.productId);
  const customization = product.customization;
  const extra = line.options?.logo && customization?.logoExtraPer === "unit" ? customization.logoExtra : 0;
  return (unitPriceFor(product, line.quantity) + extra) * 100;
}

export function lineExtraCentsFor(line: Pick<CartLine, "productId" | "options">): number {
  const customization = getProduct(line.productId).customization;
  return line.options?.logo && customization?.logoExtraPer === "line" ? customization.logoExtra * 100 : 0;
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

/**
 * `activeProductIds`: the products already active on the signed-in client's account. A product with
 * `signupFreeUnits` (the guest guide) offers them on the first line of the order that starts it, once per
 * account: a client who already has it active pays every plate. The offer covers the plate at the line's
 * price (20 € or the 15 € pack price), not the logo, which is the design work.
 */
export function priceCart(lines: CartLine[], activeProductIds: readonly string[] = []): Record<CartGroupId, GroupTotals> {
  const offered = new Set<ProductId>();
  const priced: PricedLine[] = lines.map((line) => {
    const product = getProduct(line.productId);
    const unitCents = unitCentsFor(line);
    const lineExtraCents = lineExtraCentsFor(line);
    let offerCents = 0;
    if (product.signupFreeUnits && !offered.has(line.productId) && !activeProductIds.includes(line.productId)) {
      offered.add(line.productId);
      offerCents = Math.min(product.signupFreeUnits, line.quantity) * unitPriceFor(product, line.quantity) * 100;
    }
    return {
      ...line,
      billing: product.priceBilling,
      unitCents,
      lineExtraCents,
      offerCents,
      subtotalCents: unitCents * line.quantity + lineExtraCents - offerCents,
    };
  });
  return {
    oneTime: totalsFor(priced.filter((line) => groupForBilling(line.billing) === "oneTime")),
    monthly: totalsFor(priced.filter((line) => groupForBilling(line.billing) === "monthly")),
  };
}

export function formatCents(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
