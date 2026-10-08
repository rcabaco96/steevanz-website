export const orderStatuses = ["pending", "accepted", "rejected", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const subscriptionStatuses = ["active", "suspended", "cancelled"] as const;
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];

export function isOrderStatus(value: string): value is OrderStatus {
  return (orderStatuses as readonly string[]).includes(value);
}

export function isSubscriptionStatus(value: string): value is SubscriptionStatus {
  return (subscriptionStatuses as readonly string[]).includes(value);
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  accepted: "Aceite",
  rejected: "Recusada",
  cancelled: "Cancelada",
};

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  active: "Ativo",
  suspended: "Suspenso",
  cancelled: "Cancelado",
};

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  nif: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitCents: number;
  subtotalCents: number;
  billing: "oneTime" | "monthly";
  details: string[];
}

export interface OrderTotals {
  oneTimeCents: number;
  monthlyCents: number;
}

export interface OrderRow {
  id: string;
  reference: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  sector: string | null;
  message: string | null;
  locale: string;
  items: OrderItem[];
  totals: OrderTotals;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientProductRow {
  id: string;
  user_id: string;
  product_id: string;
  status: SubscriptionStatus;
  order_id: string | null;
  activated_at: string;
  notes: string | null;
  /** Spaces covered (products sold per space: waitlist, loyalty card, bookings). */
  spaces: number;
  created_at: string;
  updated_at: string;
}
