import { getProduct, isProductId } from "@/content/products";
import type { ClientProductRow, OrderRow } from "@/lib/accounts/types";
import { establishmentProducts } from "@/lib/establishments/provision";

/** Products charged once per space (the waitlist, the loyalty card and bookings). */
export const perSpace = (productId: string) => (establishmentProducts as readonly string[]).includes(productId);

export interface ClientRevenue {
  /** Recurring revenue today: active monthly products × their spaces, at catalogue price. */
  monthlyCents: number;
  /** Everything billed so far (estimate): one-off amounts of accepted orders + months of each active product. */
  totalCents: number;
}

function monthsSince(iso: string, now: number): number {
  const start = new Date(iso);
  const end = new Date(now);
  return Math.max(1, (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()) + (end.getUTCDate() >= start.getUTCDate() ? 1 : 0));
}

/** What a client brings in, from the catalogue prices (estimate, before discounts). */
export function clientRevenue(rows: Pick<ClientProductRow, "product_id" | "status" | "spaces" | "activated_at">[], orders: Pick<OrderRow, "status" | "totals">[], now = Date.now()): ClientRevenue {
  let monthlyCents = 0;
  let recurringSoFar = 0;
  for (const row of rows) {
    if (row.status !== "active" || !isProductId(row.product_id)) continue;
    const product = getProduct(row.product_id);
    if (product.priceBilling !== "monthly") continue;
    const cents = product.priceFrom * 100 * (perSpace(row.product_id) ? Math.max(1, row.spaces ?? 1) : 1);
    monthlyCents += cents;
    recurringSoFar += cents * monthsSince(row.activated_at, now);
  }
  const oneOff = orders.filter((order) => order.status === "accepted").reduce((sum, order) => sum + (order.totals?.oneTimeCents ?? 0), 0);
  return { monthlyCents, totalCents: oneOff + recurringSoFar };
}

export const euros = (cents: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
