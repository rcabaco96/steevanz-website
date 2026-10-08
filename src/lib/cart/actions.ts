"use server";

import { randomBytes } from "node:crypto";
import type { FormField } from "@/content/booking";
import { getProduct } from "@/content/products";
import { ui } from "@/content/ui";
import { sendOwnerEmail, type EmailTable } from "@/lib/booking/email";
import { productLabel, sectorLabel } from "@/lib/booking/labels";
import { isRateLimited } from "@/lib/booking/request";
import { fieldErrorsFrom, formDataToObject, orderFormKeys, orderSubmissionSchema } from "@/lib/booking/schema";
import { honeypotField } from "@/lib/booking/types";
import type { OrderItem, OrderTotals } from "@/lib/accounts/types";
import { getSession } from "@/lib/auth/session";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { alreadyActive, ownedSpaces, type OwnedProduct } from "./ownership";
import { formatCents, priceCart, sanitizeLines, vatRate, type CartGroupId, type CartLine, type GroupTotals } from "./pricing";

export type OrderActionState =
  | { status: "idle" }
  | { status: "error"; code: "validation" | "empty_cart" | "rate_limited" | "generic"; fields: FormField[] }
  | { status: "success"; reference: string };

const groupTitles: Record<CartGroupId, string> = {
  oneTime: "Pagamento único",
  monthly: "Mensalidades",
};

function orderReference(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `STZ-${date}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

function parseItems(raw: string) {
  try {
    return sanitizeLines(JSON.parse(raw));
  } catch {
    return [];
  }
}

function customizationLines({ productId, options }: CartLine): string[] {
  const customization = getProduct(productId).customization;
  if (!customization || !options) return [];
  const format = customization.formats.find((candidate) => candidate.id === options.format)?.label.pt ?? options.format;
  const text = options.text.trim();
  return [
    `Formato: ${format}`,
    options.logo
      ? `Logótipo: sim (+${formatCents(customization.logoExtra * 100, "pt")}${customization.logoExtraPer === "line" ? " uma vez, incluído no subtotal" : "/un."})`
      : "Logótipo: não",
    `Texto: ${text ? `"${text}"` : "sem texto"}`,
  ];
}

function orderItems(totals: Record<CartGroupId, GroupTotals>): OrderItem[] {
  return (["oneTime", "monthly"] as const).flatMap((billing) =>
    totals[billing].lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitCents: line.unitCents,
      subtotalCents: line.subtotalCents,
      billing,
      details: customizationLines(line),
    })),
  );
}

function groupTable(group: CartGroupId, totals: GroupTotals): EmailTable {
  const suffix = group === "monthly" ? "/mês" : "";
  const money = (cents: number) => `${formatCents(cents, "pt")}${suffix}`;
  return {
    title: groupTitles[group],
    head: ["Produto", "Preço unit.", "Qtd.", "Subtotal"],
    rows: totals.lines.map((line) => {
      const product = getProduct(line.productId);
      const name = `${productLabel(line.productId)} (${ui.pt.billing[product.priceBilling]})`;
      return [[name, ...customizationLines(line)].join("\n"), money(line.unitCents), String(line.quantity), money(line.subtotalCents)];
    }),
    foot: [
      ["Subtotal (s/ IVA)", money(totals.subtotalCents)],
      [`IVA (${vatRate}%)`, money(totals.vatCents)],
      ["Total (c/ IVA)", money(totals.totalCents)],
    ],
  };
}

/** The products active on the signed-in client's account (the cart marks or removes them). */
async function ownedProducts(userId: string): Promise<OwnedProduct[]> {
  const client = tryCreateServiceClient();
  if (!client) return [];
  const { data, error } = await client.from("client_products").select("product_id, spaces").eq("user_id", userId).eq("status", "active");
  if (error) {
    console.error("[cart] owned products failed:", error.message);
    return [];
  }
  return ((data ?? []) as { product_id: string; spaces: number | null }[]).map((row) => ({ productId: row.product_id, spaces: Math.max(1, row.spaces ?? 1) }));
}

export async function cartOwnership(): Promise<OwnedProduct[]> {
  const session = await getSession();
  return session.state === "client" ? ownedProducts(session.user.id) : [];
}

export async function submitOrder(_previous: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const raw = formDataToObject(formData, orderFormKeys);
  const honeypot = formData.get(honeypotField);
  if (typeof honeypot === "string" && honeypot.trim()) return { status: "success", reference: "ok" };

  const parsed = orderSubmissionSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", code: "validation", fields: fieldErrorsFrom(parsed.error) };
  const data = parsed.data;

  // A signed-in client never orders again a monthly product already active on the account.
  const session = await getSession();
  const owned = session.state === "client" ? await ownedProducts(session.user.id) : [];
  const lines = parseItems(data.items).filter((line) => !alreadyActive(line.productId, owned));
  if (!lines.length) return { status: "error", code: "empty_cart", fields: [] };

  const client = tryCreateServiceClient();
  if (client && (await isRateLimited(client, "order"))) return { status: "error", code: "rate_limited", fields: [] };

  const totals = priceCart(lines);
  const groups = (["oneTime", "monthly"] as const).filter((group) => totals[group].lines.length);
  const summary = [
    totals.oneTime.lines.length ? `${formatCents(totals.oneTime.totalCents, "pt")} único` : null,
    totals.monthly.lines.length ? `${formatCents(totals.monthly.totalCents, "pt")}/mês` : null,
  ]
    .filter(Boolean)
    .join(" + ");
  const reference = orderReference();

  // Orders are stored so they show up in the client area (when signed in) and in
  // the admin panel. A storage failure must not lose the order: the email still goes out.
  const userId = session.state === "client" || session.state === "admin" ? session.user.id : null;
  const orderTotals: OrderTotals = { oneTimeCents: totals.oneTime.totalCents, monthlyCents: totals.monthly.totalCents };
  let saved = false;
  if (client) {
    const { error } = await client.from("orders").insert({
      reference,
      user_id: userId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone ?? null,
      business_name: data.businessName ?? null,
      sector: data.sector ?? null,
      message: data.message ?? null,
      locale: data.locale,
      items: orderItems(totals),
      totals: orderTotals,
    });
    if (error) console.error("[cart] order insert failed:", error.message);
    else saved = true;
  }

  const sent = await sendOwnerEmail({
    subject: `Novo pedido de encomenda ${reference}: ${data.name} · ${summary}`,
    heading: `Novo pedido de encomenda ${reference}`,
    replyTo: data.email,
    rows: [
      { label: "Referência", value: reference },
      { label: "Conta", value: userId ? "Cliente com conta (ver Encomendas no painel)" : "Sem conta" },
      {
        label: "Já tem",
        value:
          lines
            .filter((line) => ownedSpaces(line.productId, owned))
            .map((line) => `${productLabel(line.productId)}: ${ownedSpaces(line.productId, owned)} espaço(s), a encomenda acrescenta ${line.quantity}`)
            .join(" · ") || null,
      },
      { label: "Nome", value: data.name },
      { label: "Email", value: data.email },
      { label: "Telemóvel", value: data.phone },
      { label: "Negócio", value: data.businessName },
      { label: "Setor", value: sectorLabel(data.sector) },
      { label: "Mensagem", value: data.message },
      { label: "Total único", value: totals.oneTime.lines.length ? `${formatCents(totals.oneTime.totalCents, "pt")} c/ IVA` : null },
      { label: "Total mensal", value: totals.monthly.lines.length ? `${formatCents(totals.monthly.totalCents, "pt")}/mês c/ IVA` : null },
      { label: "Idioma", value: data.locale.toUpperCase() },
      { label: "Origem", value: [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") },
      { label: "Referrer", value: data.referrer },
      { label: "Nota", value: "Preços \"desde\" do site, indicativos e sujeitos a proposta." },
    ],
    tables: groups.map((group) => groupTable(group, totals[group])),
  });

  if (!sent && !saved) return { status: "error", code: "generic", fields: [] };
  return { status: "success", reference };
}
