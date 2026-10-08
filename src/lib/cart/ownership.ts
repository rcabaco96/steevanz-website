// Relative imports with extensions keep this module runnable by `node --test` (tests/cart-pricing.test.mjs).
import { getProduct, isProductId } from "../../content/products.ts";

/** Products that run inside the client's space (waitlist, loyalty card, bookings). */
export const perSpaceProducts = ["waitlist", "loyalty", "bookings"] as const;

export const isPerSpace = (productId: string) => (perSpaceProducts as readonly string[]).includes(productId);

/** A product active on the account, with how many spaces it covers. */
export interface OwnedProduct {
  productId: string;
  spaces: number;
}

/**
 * Already active and nothing more to buy: a monthly product (one client = one business for now).
 * One-off products, like plates, can always be bought again.
 */
export function alreadyActive(productId: string, owned: OwnedProduct[]): boolean {
  if (!isProductId(productId)) return false;
  return getProduct(productId).priceBilling === "monthly" && owned.some((item) => item.productId === productId);
}
