// Relative imports with extensions keep this module runnable by `node --test` (tests/cart-pricing.test.mjs).
import { getProduct, isProductId } from "../../content/products.ts";

/** Products sold per space (each space pays the same price): ordering again adds spaces. */
export const perSpaceProducts = ["waitlist", "loyalty", "bookings"] as const;

export const isPerSpace = (productId: string) => (perSpaceProducts as readonly string[]).includes(productId);

/** A product active on the account, with how many spaces it covers. */
export interface OwnedProduct {
  productId: string;
  spaces: number;
}

/**
 * Already active and nothing more to buy: a monthly product that isn't sold per space (one-off
 * products, like plates, can always be bought again; per-space products add spaces).
 */
export function alreadyActive(productId: string, owned: OwnedProduct[]): boolean {
  if (!isProductId(productId) || isPerSpace(productId)) return false;
  return getProduct(productId).priceBilling === "monthly" && owned.some((item) => item.productId === productId);
}

/** Spaces the account already has for a per-space product (0 when it doesn't have it). */
export function ownedSpaces(productId: string, owned: OwnedProduct[]): number {
  if (!isPerSpace(productId)) return 0;
  return owned.find((item) => item.productId === productId)?.spaces ?? 0;
}
