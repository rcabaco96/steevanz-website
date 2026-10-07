import Link from "next/link";
import { OrderStatusBadge } from "@/components/account/badges";
import { EmptyState } from "@/components/backoffice/ui";
import { lisbonTimestamp } from "@/lib/admin/csv";
import type { OrderRow } from "@/lib/accounts/types";
import { productLabel } from "@/lib/booking/labels";
import { formatCents } from "@/lib/cart/pricing";

type ListedOrder = Omit<OrderRow, "admin_notes">;

export function orderSummary(order: ListedOrder): string {
  const parts = [
    order.totals?.oneTimeCents ? `${formatCents(order.totals.oneTimeCents, "pt")} único` : null,
    order.totals?.monthlyCents ? `${formatCents(order.totals.monthlyCents, "pt")}/mês` : null,
  ];
  return parts.filter(Boolean).join(" + ");
}

export function orderProducts(order: ListedOrder): string {
  return [...new Set((order.items ?? []).map((item) => productLabel(item.productId)))].join(", ");
}

/** Orders list shared by the client area and the admin panel. Pass `hrefFor` to link each row. */
export function OrderList({ orders, hrefFor, showCustomer = false, empty }: { orders: ListedOrder[]; hrefFor?: (order: ListedOrder) => string; showCustomer?: boolean; empty: string }) {
  if (!orders.length) return <EmptyState>{empty}</EmptyState>;
  return (
    <ul className="card divide-y divide-line overflow-hidden">
      {orders.map((order) => {
        const row = (
          <>
            <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
              <span className="font-mono text-sm font-semibold text-text">{order.reference}</span>
              <span className="text-sm text-muted tabular-nums">{lisbonTimestamp(order.created_at)}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-text">
                {showCustomer ? (
                  <>
                    {order.name}
                    {order.business_name ? <span className="font-normal text-muted"> · {order.business_name}</span> : null}
                  </>
                ) : (
                  orderProducts(order)
                )}
              </p>
              <p className="truncate text-sm text-muted">
                {showCustomer ? `${orderProducts(order)} · ${order.email}` : orderSummary(order) || "Valor sob proposta"}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </>
        );
        const className = "grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-4 sm:px-5";
        return (
          <li key={order.id}>
            {hrefFor ? (
              <Link href={hrefFor(order)} className={`${className} transition-colors hover:bg-surface-2`}>
                {row}
              </Link>
            ) : (
              <div className={className}>{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
