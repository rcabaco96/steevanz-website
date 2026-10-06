import { orderStatusLabels, subscriptionStatusLabels, type OrderStatus, type SubscriptionStatus } from "@/lib/accounts/types";

const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

const orderTone: Record<OrderStatus, string> = {
  pending: "bg-gold-soft text-gold-text border-gold/40",
  accepted: "bg-success-soft text-success border-success/30",
  rejected: "bg-danger-soft text-danger border-danger/30",
  cancelled: "bg-surface-2 text-subtle border-line line-through decoration-1",
};

const subscriptionTone: Record<SubscriptionStatus, string> = {
  active: "bg-success-soft text-success border-success/30",
  suspended: "bg-gold-soft text-gold-text border-gold/40",
  cancelled: "bg-surface-2 text-subtle border-line line-through decoration-1",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`${base} ${orderTone[status]}`}>{orderStatusLabels[status]}</span>;
}

export function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  return <span className={`${base} ${subscriptionTone[status]}`}>{subscriptionStatusLabels[status]}</span>;
}
