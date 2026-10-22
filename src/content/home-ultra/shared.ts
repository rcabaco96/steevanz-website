// Shared data and helpers for /novo-ultra. Pure data: value imports use explicit .ts extensions so
// `node --test` can load this file (tests/home-ultra.test.mjs). Section copy lives next to it in
// src/content/home-ultra/<section>.ts (one file per section builder).
import { clientLogos } from "../client-logos.ts";
import { products, type Product } from "../products.ts";
import type { ProductId } from "../types";

/** The brand line. Owner rule (2026-10-18): always the two lines together, in this order and wording. */
export const brandLine = ["Tecnologia do futuro.", "Com os bons modos de antigamente."] as const;

export const contact = {
  phoneDisplay: "961 292 679",
  phoneHref: "tel:+351961292679",
  demoHref: "/agendar",
  contactHref: "/contacto",
} as const;

export interface ClientLogo {
  src: string;
  width: number;
  height: number;
  /** Optical scale of the logo's height (src/content/client-logos.ts). */
  scale: number;
}

// The client logos (one-colour versions, in src/content/client-logos.ts), then Dolci e Salati, still set in
// type here (its logo is a colourful badge; it has its own case section on this page). Never describe
// what was done for a client.
export const clients: readonly { name: string; logo?: ClientLogo }[] = [
  ...clientLogos.map((l) => ({ name: l.name, logo: { src: l.monoSrc, width: l.width, height: l.height, scale: l.scale } })),
  { name: "Dolci e Salati" },
];

export type GoalId = "encontrado" | "casa" | "vender" | "voltar" | "medida";

export interface Goal {
  id: GoalId;
  title: string;
  line: string;
  /** Every one of the 14 products appears in exactly one goal (enforced by the test). */
  productIds: readonly ProductId[];
}

export const goals: readonly Goal[] = [
  {
    id: "encontrado",
    title: "Ser encontrado",
    line: "Que o encontrem à primeira, no Google e no telemóvel.",
    productIds: ["website", "landing-page", "google-review-plates", "ai-reviews"],
  },
  {
    id: "casa",
    title: "Encher a casa",
    line: "Mesas e agendas cheias, sem passar o dia ao telefone.",
    productIds: ["bookings", "waitlist", "ai-voice"],
  },
  {
    id: "vender",
    title: "Vender mais",
    line: "Mostrar melhor o que vende, à mesa e online.",
    productIds: ["digital-menu", "online-shop", "ai-chatbot", "business-card"],
  },
  {
    id: "voltar",
    title: "Fazer voltar",
    line: "Que o cliente de hoje volte amanhã.",
    productIds: ["loyalty", "social-plates", "guest-guide", "keychain"],
  },
  {
    id: "medida",
    title: "À medida",
    line: "Uma tarefa que se repete todos os dias? Automatizamos.",
    productIds: ["automation"],
  },
];

export function product(id: ProductId): Product {
  const found = products.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown product ${id}`);
  return found;
}

export function productHref(id: ProductId): string {
  return `/produtos/${product(id).slug.pt}`;
}

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** «29 €» (same output as formatEuro(n, "pt") in @/components/ui/Price). */
export function euros(amount: number): string {
  return euro.format(amount);
}

/** «desde 29 €» or «desde 19 €/mês» (same output as priceLabel(product, "pt")). */
export function fromLabel(p: Product): string {
  return `desde ${euros(p.priceFrom)}${p.priceBilling === "monthly" ? "/mês" : ""}`;
}

/** The goal's cheapest product (lowest priceFrom; ties keep the goal's order). */
export function goalFromPrice(goal: Goal): Product {
  return goal.productIds.map(product).reduce((best, p) => (p.priceFrom < best.priceFrom ? p : best));
}

/** Strips «sem fidelização» (and any other «fidelização» clause) from a price qualifier. */
export function cleanQualifier(text: string): string {
  return text
    .replace(/\s*[,;]?\s*[^,;]*fideliza[^,;]*/gi, "")
    .replace(/^[\s,;]+/, "")
    .trim();
}

/** « + 30 €/mês» when the cleaned qualifier carries a monthly fee, otherwise "". */
export function monthlyFeeSuffix(p: Product): string {
  if (p.priceBilling === "monthly") return "";
  const match = cleanQualifier(p.priceQualifier.pt).match(/(\d+)\s*€\/mês/);
  return match ? ` + ${match[1]} €/mês` : "";
}
