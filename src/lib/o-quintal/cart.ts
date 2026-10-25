// O Quintal's cart, in the visitor's browser (localStorage, its own key: the Steevanz cart is untouched).
// Only ids, choices and quantities are kept; prices are always read again from the catalogue.
// Relative imports with extensions keep this module runnable by `node --test`.
import { findOQuintalProduct, oQuintalUnitPrice } from "../../content/o-quintal/products.ts";

export const cartStorageKey = "o-quintal-carrinho";
export const cartMaxQuantity = 99;
export const cartMaxLines = 40;

export interface OQuintalCartLine {
  id: string;
  choice: string | null;
  quantity: number;
}

export function clampCartQuantity(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(cartMaxQuantity, Math.max(1, Math.round(n)));
}

/** Whatever was stored (possibly tampered with, or from an older catalogue) → valid, purchasable lines only. */
export function sanitizeCart(raw: unknown): OQuintalCartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: OQuintalCartLine[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { id, choice, quantity } = entry as Record<string, unknown>;
    if (typeof id !== "string") continue;
    const item = findOQuintalProduct(id);
    const chosen = typeof choice === "string" ? choice : null;
    if (!item || oQuintalUnitPrice(item, chosen) === null) continue;
    const existing = out.find((line) => line.id === id && line.choice === chosen);
    if (existing) existing.quantity = clampCartQuantity(existing.quantity + clampCartQuantity(quantity));
    else out.push({ id, choice: chosen, quantity: clampCartQuantity(quantity) });
    if (out.length >= cartMaxLines) break;
  }
  return out;
}

export function addToCart(lines: readonly OQuintalCartLine[], id: string, choice: string | null, quantity: number): OQuintalCartLine[] {
  const existing = lines.find((line) => line.id === id && line.choice === choice);
  if (existing) return lines.map((line) => (line === existing ? { ...line, quantity: clampCartQuantity(line.quantity + quantity) } : line));
  if (lines.length >= cartMaxLines) return [...lines];
  return [...lines, { id, choice, quantity: clampCartQuantity(quantity) }];
}

export function cartCount(lines: readonly OQuintalCartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Subtotal in cents, from the catalogue (lines that can't be bought count as 0; sanitizeCart removes them). */
export function cartSubtotal(lines: readonly OQuintalCartLine[]): number {
  return lines.reduce((sum, line) => {
    const item = findOQuintalProduct(line.id);
    const price = item ? oQuintalUnitPrice(item, line.choice) : null;
    return sum + (price ?? 0) * line.quantity;
  }, 0);
}
