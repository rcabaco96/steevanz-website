// O Quintal's shop: the pure parts of the checkout (owner, 2026-10-25), tested by tests/o-quintal-shop.test.mjs.
//  - The browser sends only product ids, the chosen option and quantities; every price comes from the catalogue
//    (src/content/o-quintal/products.ts) here on the server.
//  - Stripe Checkout (hosted page) is called through its REST API with fetch: no SDK to keep up to date, and the
//    tests pass a fake fetch, so nothing ever reaches Stripe from them.
//  - The webhook's signature is checked with HMAC-SHA256 as Stripe documents it (t=…,v1=…).
// Relative imports with extensions keep this module runnable by `node --test`.
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { findOQuintalProduct, oQuintalUnitPrice, type OQuintalProduct } from "../../content/o-quintal/products.ts";

export const maxQuantity = 99;
export const maxLines = 40;

const lineSchema = z.object({
  id: z.string().min(1).max(120),
  choice: z.string().min(1).max(60).nullable().optional(),
  quantity: z.number().int().min(1).max(maxQuantity),
});

export const checkoutRequestSchema = z.object({
  lines: z.array(lineSchema).min(1).max(maxLines),
  fulfilment: z.enum(["delivery", "pickup"]),
  /** Which addresses the success/cancel links use: the preview path or the client's own domain. */
  mode: z.enum(["preview", "domain"]).default("preview"),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type Fulfilment = CheckoutRequest["fulfilment"];

export interface PricedLine {
  id: string;
  choice: string | null;
  /** «Cabaz de Frescos (frutas e legumes) — Cabaz Misto». */
  name: string;
  unit: string | null;
  unitCents: number;
  quantity: number;
  totalCents: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotalCents: number;
}

export type PriceResult = { ok: true; order: PricedOrder } | { ok: false; error: string };

/** Validates the raw body (unknown JSON) of the checkout request. */
export function parseCheckoutRequest(body: unknown): { ok: true; request: CheckoutRequest } | { ok: false; error: string } {
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "Pedido inválido." };
  return { ok: true, request: parsed.data };
}

function lineName(item: OQuintalProduct, choice: string | null): string {
  const chosen = item.option?.choices.find((entry) => entry.id === choice);
  return chosen ? `${item.name} — ${chosen.name}` : item.name;
}

/**
 * Prices the cart from the catalogue. Lines of the same product and choice are merged (the merged quantity must
 * still be 1–99). Unknown products, choices without a price, out-of-stock products: refused, never guessed.
 */
export function priceOrder(lines: CheckoutRequest["lines"]): PriceResult {
  const merged = new Map<string, { id: string; choice: string | null; quantity: number }>();
  for (const line of lines) {
    const choice = line.choice ?? null;
    const key = `${line.id}\u0000${choice ?? ""}`;
    const current = merged.get(key);
    merged.set(key, { id: line.id, choice, quantity: (current?.quantity ?? 0) + line.quantity });
  }
  const priced: PricedLine[] = [];
  for (const { id, choice, quantity } of merged.values()) {
    const item = findOQuintalProduct(id);
    if (!item) return { ok: false, error: "Um dos produtos já não existe na loja." };
    if (quantity > maxQuantity) return { ok: false, error: `A quantidade máxima por produto é ${maxQuantity}.` };
    const unitCents = oQuintalUnitPrice(item, choice);
    if (unitCents === null) return { ok: false, error: `«${lineName(item, choice)}» não está disponível para compra online.` };
    priced.push({ id, choice, name: lineName(item, choice), unit: item.unit, unitCents, quantity, totalCents: unitCents * quantity });
  }
  return { ok: true, order: { lines: priced, subtotalCents: priced.reduce((sum, line) => sum + line.totalCents, 0) } };
}

/** Stripe metadata values are limited to 500 characters: the order summary is split across keys. */
export function summaryChunks(order: PricedOrder, size = 500): string[] {
  const text = order.lines.map((line) => `${line.quantity}× ${line.name}${line.unit ? ` (${line.unit})` : ""}`).join("; ");
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks.slice(0, 20);
}

export interface SessionOptions {
  /** «https://www.steevanz.com/o-quintal» or «https://www.oquintal.pt»: the shop's base address. */
  shopBase: string;
  fulfilment: Fulfilment;
  /** Delivery fee in cents, or null when it isn't charged online (the business confirms it). */
  deliveryFeeCents: number | null;
}

/**
 * The form fields of POST /v1/checkout/sessions (Stripe's API takes application/x-www-form-urlencoded with
 * bracketed keys). Prices are the catalogue's, in euros, as the business shows them.
 */
export function buildCheckoutSessionParams(order: PricedOrder, options: SessionOptions): Record<string, string> {
  const params: Record<string, string> = {
    mode: "payment",
    locale: "pt",
    success_url: `${options.shopBase}/encomenda/sucesso?sessao={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.shopBase}/encomenda/cancelada`,
    "phone_number_collection[enabled]": "true",
    "metadata[loja]": "o-quintal",
    "metadata[entrega]": options.fulfilment === "delivery" ? "Entrega ao domicílio" : "Levantamento em local indicado pela O Quintal",
    "payment_intent_data[description]": "Encomenda O Quintal",
  };
  order.lines.forEach((line, i) => {
    params[`line_items[${i}][quantity]`] = String(line.quantity);
    params[`line_items[${i}][price_data][currency]`] = "eur";
    params[`line_items[${i}][price_data][unit_amount]`] = String(line.unitCents);
    params[`line_items[${i}][price_data][product_data][name]`] = line.name;
    if (line.unit) params[`line_items[${i}][price_data][product_data][description]`] = `Preço por ${line.unit}`;
  });
  if (options.fulfilment === "delivery") {
    params["shipping_address_collection[allowed_countries][0]"] = "PT";
    if (options.deliveryFeeCents !== null) {
      params["shipping_options[0][shipping_rate_data][type]"] = "fixed_amount";
      params["shipping_options[0][shipping_rate_data][display_name]"] = "Entrega ao domicílio";
      params["shipping_options[0][shipping_rate_data][fixed_amount][amount]"] = String(options.deliveryFeeCents);
      params["shipping_options[0][shipping_rate_data][fixed_amount][currency]"] = "eur";
    }
  }
  summaryChunks(order).forEach((chunk, i) => {
    params[`metadata[itens_${i + 1}]`] = chunk;
  });
  return params;
}

export type FetchLike = (input: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

/** Creates the Checkout Session and returns the hosted page's address. Throws on any failure. */
export async function createCheckoutSession(params: Record<string, string>, secretKey: string, fetchImpl: FetchLike): Promise<string> {
  const response = await fetchImpl("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = (await response.json().catch(() => null)) as { url?: unknown; error?: { message?: unknown } } | null;
  if (!response.ok || typeof data?.url !== "string") {
    const message = typeof data?.error?.message === "string" ? data.error.message : `HTTP ${response.status}`;
    throw new Error(`Stripe: ${message}`);
  }
  return data.url;
}

/** Only a test key in previews and locally: a live key outside production is refused (safety, 2026-10-25). */
export function stripeKeyAllowed(secretKey: string | undefined, vercelEnv: string | undefined): secretKey is string {
  if (!secretKey) return false;
  if (secretKey.startsWith("sk_test_") || secretKey.startsWith("rk_test_")) return true;
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) return vercelEnv === "production";
  return false;
}

/**
 * Checks the «Stripe-Signature» header (t=timestamp,v1=signature…) against the raw body, as Stripe documents it:
 * HMAC-SHA256 of «timestamp.body» with the endpoint's secret, within `toleranceSeconds` of now.
 */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
): boolean {
  if (!header || !secret) return false;
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key?.trim() === "t") timestamp = value?.trim() ?? "";
    else if (key?.trim() === "v1" && value) signatures.push(value.trim());
  }
  const t = Number(timestamp);
  if (!timestamp || !Number.isFinite(t) || !signatures.length) return false;
  if (Math.abs(nowSeconds - t) > toleranceSeconds) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest();
  return signatures.some((signature) => {
    if (!/^[0-9a-f]+$/i.test(signature)) return false;
    const given = Buffer.from(signature, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/** The parts of a completed Checkout Session the order email uses (all optional: Stripe's object, untrusted shape). */
export interface CompletedSession {
  id?: string;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  customer_details?: { name?: string | null; email?: string | null; phone?: string | null } | null;
  shipping_details?: { name?: string | null; address?: Record<string, string | null> | null } | null;
  collected_information?: { shipping_details?: { name?: string | null; address?: Record<string, string | null> | null } | null } | null;
  metadata?: Record<string, string> | null;
}

/** The plain-text order email for the business (amounts as paid, no tax lines). */
export function orderEmailText(session: CompletedSession, formatCents: (cents: number) => string): string {
  const meta = session.metadata ?? {};
  const items = Object.keys(meta)
    .filter((key) => key.startsWith("itens_"))
    .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))
    .map((key) => meta[key])
    .join("")
    .split("; ")
    .filter(Boolean);
  const shipping = session.collected_information?.shipping_details ?? session.shipping_details ?? null;
  const address = shipping?.address
    ? [shipping.address.line1, shipping.address.line2, [shipping.address.postal_code, shipping.address.city].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ")
    : null;
  const customer = session.customer_details ?? {};
  return [
    "Nova encomenda paga na loja online O Quintal.",
    "",
    ...items.map((item) => `- ${item}`),
    "",
    `Total pago: ${typeof session.amount_total === "number" ? formatCents(session.amount_total) : "—"}`,
    `Entrega: ${meta.entrega ?? "—"}`,
    ...(address ? [`Morada: ${shipping?.name ? `${shipping.name}, ` : ""}${address}`] : []),
    "",
    `Cliente: ${customer.name ?? "—"}`,
    `Email: ${customer.email ?? "—"}`,
    `Telefone: ${customer.phone ?? "—"}`,
    "",
    `Sessão Stripe: ${session.id ?? "—"}`,
  ].join("\n");
}
