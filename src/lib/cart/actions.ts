"use server";

import { randomBytes } from "node:crypto";
import { after } from "next/server";
import type { FormField } from "@/content/booking";
import { canonicalProductId, getProduct, isWebProduct } from "@/content/products";
import { ui } from "@/content/ui";
import { briefFields, webBriefCopy, type BriefField } from "@/content/web-brief";
import { ownerAddress, sendOwnerEmail, type EmailSection, type EmailTable } from "@/lib/booking/email";
import { productLabel, sectorLabel } from "@/lib/booking/labels";
import { isRateLimited } from "@/lib/booking/request";
import { fieldErrorsFrom, formDataToObject, orderFormKeys, orderSubmissionSchema } from "@/lib/booking/schema";
import { honeypotField } from "@/lib/booking/types";
import type { OrderItem, OrderTotals } from "@/lib/accounts/types";
import { getSession } from "@/lib/auth/session";
import { localize, type Locale, type Localized } from "@/lib/i18n";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { briefDetails, briefRows, cartNeedsBrief, parseBrief, type WebBrief } from "./brief";
import { alreadyActive, type OwnedProduct } from "./ownership";
import { formatCents, priceCart, sanitizeLines, type CartGroupId, type CartLine, type GroupTotals, type PricedLine } from "./pricing";

export type OrderActionState =
  | { status: "idle" }
  | { status: "error"; code: "validation" | "empty_cart" | "rate_limited" | "generic"; fields: FormField[]; briefFields?: BriefField[] }
  | { status: "success"; reference: string };

const emailText = {
  pt: {
    groups: { oneTime: "Pagamento único", monthly: "Mensalidades" } as Record<CartGroupId, string>,
    head: ["Produto", "Preço unit.", "Qtd.", "Subtotal"],
    total: "Total",
    plusVat: "+ IVA",
    perMonth: "/mês",
    format: "Formato",
    logo: "Logótipo",
    yes: "sim",
    no: "não",
    logoOnce: " uma vez, incluído no subtotal",
    perUnit: "/un.",
    text: "Texto",
    noText: "sem texto",
    signupOffer: "1.ª placa oferecida na adesão",
  },
  en: {
    groups: { oneTime: "One-off payment", monthly: "Monthly plans" } as Record<CartGroupId, string>,
    head: ["Product", "Unit price", "Qty", "Subtotal"],
    total: "Total",
    plusVat: "+ VAT",
    perMonth: "/month",
    format: "Format",
    logo: "Logo",
    yes: "yes",
    no: "no",
    logoOnce: " once, included in the subtotal",
    perUnit: "/unit",
    text: "Text",
    noText: "no text",
    signupOffer: "1st plate free on sign-up",
  },
} satisfies Localized<unknown>;

/** The customer's order confirmation email: ready, switched off for now (owner, 2026-10-11). */
const sendCustomerConfirmation = false;

const confirmationText = {
  pt: {
    subject: (reference: string) => `Recebemos o seu pedido ${reference} · Steevanz`,
    heading: "Recebemos o seu pedido",
    hello: (name: string) => `Olá ${name}, obrigado pelo seu pedido.`,
    next: "Vamos analisá-lo e responder com uma proposta de preço fechado. Nada foi cobrado: só avança se aceitar a proposta.",
    web: "Para o projeto web, usamos as suas respostas (abaixo) para preparar a proposta. Se faltar alguma coisa, falamos consigo.",
    reference: "Referência",
    oneTime: "Total único",
    monthly: "Total mensal",
    note: "Preços «desde», indicativos: o valor final é o da proposta. Se quiser acrescentar alguma coisa, basta responder a este email.",
  },
  en: {
    subject: (reference: string) => `We received your request ${reference} · Steevanz`,
    heading: "We received your request",
    hello: (name: string) => `Hi ${name}, thank you for your request.`,
    next: "We'll review it and reply with a fixed-price proposal. Nothing has been charged: it only goes ahead if you accept the proposal.",
    web: "For your web project, we use your answers (below) to prepare the proposal. If anything is missing, we'll get in touch.",
    reference: "Reference",
    oneTime: "One-off total",
    monthly: "Monthly total",
    note: "“From” prices are indicative: the final price is the one in the proposal. To add anything, just reply to this email.",
  },
} satisfies Localized<unknown>;

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

function customizationLines({ productId, options }: CartLine, locale: Locale = "pt"): string[] {
  const customization = getProduct(productId).customization;
  if (!customization || !options) return [];
  const t = localize(emailText, locale);
  const format = customization.formats.find((candidate) => candidate.id === options.format)?.label ?? null;
  const formatLabel = format ? localize(format, locale) : options.format;
  if (customization.formatOnly) return [`${t.format}: ${formatLabel}`];
  const text = options.text.trim();
  return [
    `${t.format}: ${formatLabel}`,
    options.logo
      ? `${t.logo}: ${t.yes} (+${formatCents(customization.logoExtra * 100, locale)}${customization.logoExtraPer === "line" ? t.logoOnce : t.perUnit})`
      : `${t.logo}: ${t.no}`,
    `${t.text}: ${text ? `"${text}"` : t.noText}`,
  ];
}

/** The sign-up offer on a line (the guest guide's 1st plate), as a detail line: «1.ª placa oferecida na adesão: −20,00 €». */
function offerLines(line: PricedLine, locale: Locale = "pt"): string[] {
  return line.offerCents ? [`${localize(emailText, locale).signupOffer}: −${formatCents(line.offerCents, locale)}`] : [];
}

/** The order as stored: the web brief goes with the first website product of the order. */
function orderItems(totals: Record<CartGroupId, GroupTotals>, brief: WebBrief | null): OrderItem[] {
  const items = (["oneTime", "monthly"] as const).flatMap((billing) =>
    totals[billing].lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitCents: line.unitCents,
      subtotalCents: line.subtotalCents,
      billing,
      details: [...customizationLines(line), ...offerLines(line)],
    })),
  );
  const webItem = brief ? items.find((item) => isWebProduct(item.productId)) : undefined;
  if (webItem && brief) webItem.details = [...webItem.details, ...briefDetails(brief)];
  return items;
}

function groupTable(group: CartGroupId, totals: GroupTotals, locale: Locale = "pt"): EmailTable {
  const t = localize(emailText, locale);
  const suffix = group === "monthly" ? t.perMonth : "";
  const money = (cents: number) => `${formatCents(cents, locale)}${suffix}`;
  return {
    title: t.groups[group],
    head: t.head,
    rows: totals.lines.map((line) => {
      const product = getProduct(line.productId);
      const name = `${productLabel(line.productId, locale)} (${localize(ui, locale).billing[product.priceBilling]})`;
      return [[name, ...customizationLines(line, locale), ...offerLines(line, locale)].join("\n"), money(line.unitCents), String(line.quantity), money(line.subtotalCents)];
    }),
    // Without VAT, «+ IVA»: VAT-inclusive amounts are never shown (owner, 2026-10-18).
    foot: [[t.total, `${money(totals.subtotalCents)} ${t.plusVat}`]],
  };
}

function briefSection(brief: WebBrief | null, locale: Locale): EmailSection[] {
  return brief ? [{ title: localize(webBriefCopy, locale).emailTitle, rows: briefRows(brief, locale) }] : [];
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
  return ((data ?? []) as { product_id: string; spaces: number | null }[]).map((row) => ({ productId: canonicalProductId(row.product_id), spaces: Math.max(1, row.spaces ?? 1) }));
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
  // Website products come with a short brief; both checks run so every error shows at once.
  const briefResult = cartNeedsBrief(parseItems(raw.items)) ? parseBrief(formDataToObject(formData, briefFields)) : null;
  const briefErrors = briefResult && !briefResult.ok ? briefResult.fields : [];
  if (!parsed.success || briefErrors.length) {
    return { status: "error", code: "validation", fields: parsed.success ? [] : fieldErrorsFrom(parsed.error), briefFields: briefErrors };
  }
  const data = parsed.data;
  const brief = briefResult?.ok ? briefResult.brief : null;

  // A signed-in client never orders again a monthly product already active on the account.
  const session = await getSession();
  const owned = session.state === "client" ? await ownedProducts(session.user.id) : [];
  const lines = parseItems(data.items).filter((line) => !alreadyActive(line.productId, owned));
  if (!lines.length) return { status: "error", code: "empty_cart", fields: [] };

  const client = tryCreateServiceClient();
  if (client && (await isRateLimited(client, "order"))) return { status: "error", code: "rate_limited", fields: [] };

  // The guide's 1st plate is offered on the order that starts it, never to a client who already has it.
  const totals = priceCart(lines, owned.map((item) => item.productId));
  const groups = (["oneTime", "monthly"] as const).filter((group) => totals[group].lines.length);
  const summary = [
    totals.oneTime.lines.length ? `${formatCents(totals.oneTime.subtotalCents, "pt")} único + IVA` : null,
    totals.monthly.lines.length ? `${formatCents(totals.monthly.subtotalCents, "pt")}/mês + IVA` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const reference = orderReference();

  // Orders are stored so they show up in the client area (when signed in) and in
  // the admin panel. A storage failure must not lose the order: the email still goes out.
  const userId = session.state === "client" || session.state === "admin" ? session.user.id : null;
  // Stored as before (with VAT); the admin and the client area show the items' amounts without VAT instead.
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
      // The visitor's own language, one of the six site languages (check constraint since 2026-10-20).
      locale: data.locale,
      items: orderItems(totals, brief),
      totals: orderTotals,
    });
    if (error) console.error("[cart] order insert failed:", error.message);
    else saved = true;
  }

  const sent = await sendOwnerEmail({
    subject: `Novo pedido de encomenda ${reference}: ${data.name} · ${summary}${brief ? " · Inclui projeto web" : ""}`,
    heading: `Novo pedido de encomenda ${reference}`,
    replyTo: data.email,
    rows: [
      { label: "Referência", value: reference },
      { label: "Conta", value: userId ? "Cliente com conta (ver Encomendas no painel)" : "Sem conta" },
      { label: "Nome", value: data.name },
      { label: "Email", value: data.email },
      { label: "Telemóvel", value: data.phone },
      { label: "Negócio", value: data.businessName },
      { label: "Setor", value: sectorLabel(data.sector) },
      { label: "Mensagem", value: data.message },
      { label: "Total único", value: totals.oneTime.lines.length ? `${formatCents(totals.oneTime.subtotalCents, "pt")} + IVA` : null },
      { label: "Total mensal", value: totals.monthly.lines.length ? `${formatCents(totals.monthly.subtotalCents, "pt")}/mês + IVA` : null },
      { label: "Idioma", value: data.locale.toUpperCase() },
      { label: "Origem", value: [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") },
      { label: "Referrer", value: data.referrer },
      { label: "Nota", value: "Preços \"desde\" do site, indicativos e sujeitos a proposta." },
    ],
    tables: groups.map((group) => groupTable(group, totals[group])),
    sections: briefSection(brief, "pt"),
  });

  if (!sent && !saved) return { status: "error", code: "generic", fields: [] };

  // Confirmation to the customer, in the language they ordered in (es, fr, de, it fall back to English
  // until the text has their translation). Replies go to the owner.
  // Off for now (owner, 2026-10-11): only the owner is emailed; flip sendCustomerConfirmation to send it.
  if (!sendCustomerConfirmation) return { status: "success", reference };
  const locale: Locale = data.locale;
  const text = localize(confirmationText, locale);
  after(async () => {
    await sendOwnerEmail({
      to: [data.email],
      replyTo: ownerAddress,
      subject: text.subject(reference),
      heading: text.heading,
      intro: [text.hello(data.name.split(/\s+/)[0]), text.next, ...(brief ? [text.web] : [])],
      rows: [
        { label: text.reference, value: reference },
        { label: text.oneTime, value: totals.oneTime.lines.length ? `${formatCents(totals.oneTime.subtotalCents, locale)} ${localize(emailText, locale).plusVat}` : null },
        {
          label: text.monthly,
          value: totals.monthly.lines.length ? `${formatCents(totals.monthly.subtotalCents, locale)}${localize(emailText, locale).perMonth} ${localize(emailText, locale).plusVat}` : null,
        },
      ],
      tables: groups.map((group) => groupTable(group, totals[group], locale)),
      sections: briefSection(brief, locale),
      note: text.note,
    });
  });

  return { status: "success", reference };
}
