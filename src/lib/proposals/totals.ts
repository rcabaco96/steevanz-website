// Pure helpers for the proposals at /proposta/<id>. Relative imports with extensions keep this module
// runnable by `node --test` (tests/proposals.test.mjs).
import type { Proposal, ProposalLine } from "../../content/proposals/types.ts";

export interface LineTotal {
  /** quantity × unit price, before the discount. */
  grossCents: number;
  discountCents: number;
  /** What the line adds to the subtotal. */
  netCents: number;
}

export interface GroupTotals {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
}

/** How the client pays the monthly lines: every month, or a year upfront with months free. */
export const paymentPlans = ["annual", "monthly"] as const;
export type PaymentPlan = (typeof paymentPlans)[number];

export function isPaymentPlan(value: unknown): value is PaymentPlan {
  return typeof value === "string" && (paymentPlans as readonly string[]).includes(value);
}

export interface ProposalTotals {
  oneOff: GroupTotals;
  monthly: GroupTotals;
  /** The monthly lines paid a year upfront (12 − freeMonths months), when the proposal offers it. */
  annual: GroupTotals | null;
  /** What the annual plan saves against 12 monthly payments (the free months). */
  annualSavings: GroupTotals | null;
}

export function lineTotal(line: ProposalLine): LineTotal {
  const grossCents = line.quantity * line.unitCents;
  const discountCents = Math.min(line.discount?.amountCents ?? 0, grossCents);
  return { grossCents, discountCents, netCents: grossCents - discountCents };
}

/** VAT on a subtotal, rounded to the cent (as on the invoice: on the total, not per line). */
export function vatOf(subtotalCents: number, vatRate: number): number {
  return Math.round((subtotalCents * vatRate) / 100);
}

export function groupTotals(lines: readonly ProposalLine[], vatRate: number): GroupTotals {
  const subtotalCents = lines.reduce((sum, line) => sum + lineTotal(line).netCents, 0);
  const vatCents = vatOf(subtotalCents, vatRate);
  return { subtotalCents, vatCents, totalCents: subtotalCents + vatCents };
}

/** The plans this proposal offers, the recommended one first. */
export function planOptions(proposal: Proposal): PaymentPlan[] {
  if (!proposal.monthly.length) return [];
  return proposal.annual ? ["annual", "monthly"] : ["monthly"];
}

/** Months paid in the annual plan: 12 − freeMonths (10 for «2 meses grátis»). */
export function annualPaidMonths(proposal: Proposal): number {
  return proposal.annual ? 12 - proposal.annual.freeMonths : 12;
}

/** One monthly line paid a year upfront, in cents without VAT (15 €/mês → 150 €/ano). */
export function annualLineCents(proposal: Proposal, line: ProposalLine): number {
  return lineTotal(line).netCents * annualPaidMonths(proposal);
}

/** One monthly line paid as 12 separate months, in cents without VAT (15 €/mês → 180 €). */
export function twelveMonthsCents(line: ProposalLine): number {
  return lineTotal(line).netCents * 12;
}

/** What the annual plan saves on one monthly line, in cents without VAT (15 €/mês → 30 €). */
export function annualLineSavingsCents(proposal: Proposal, line: ProposalLine): number {
  return proposal.annual ? lineTotal(line).netCents * proposal.annual.freeMonths : 0;
}

function totalsOf(subtotalCents: number, vatRate: number): GroupTotals {
  const vatCents = vatOf(subtotalCents, vatRate);
  return { subtotalCents, vatCents, totalCents: subtotalCents + vatCents };
}

function sumTotals(a: GroupTotals, b: GroupTotals): GroupTotals {
  return { subtotalCents: a.subtotalCents + b.subtotalCents, vatCents: a.vatCents + b.vatCents, totalCents: a.totalCents + b.totalCents };
}

export function proposalTotals(proposal: Proposal): ProposalTotals {
  const oneOff = groupTotals(proposal.oneOff, proposal.vatRate);
  const monthly = groupTotals(proposal.monthly, proposal.vatRate);
  const offersAnnual = Boolean(proposal.annual && proposal.monthly.length);
  return {
    oneOff,
    monthly,
    annual: offersAnnual ? totalsOf(monthly.subtotalCents * annualPaidMonths(proposal), proposal.vatRate) : null,
    annualSavings: offersAnnual ? totalsOf(monthly.subtotalCents * (proposal.annual?.freeMonths ?? 0), proposal.vatRate) : null,
  };
}

/**
 * Paid on acceptance: the one-off items plus the first year (annual plan) or the first month
 * (monthly plan). A plan the proposal does not offer falls back to monthly.
 */
export function dueOnAcceptance(proposal: Proposal, plan: PaymentPlan): GroupTotals {
  const totals = proposalTotals(proposal);
  return sumTotals(totals.oneOff, plan === "annual" && totals.annual ? totals.annual : totals.monthly);
}

// «always»: pt-PT leaves four-digit amounts ungrouped by default («1025 €»); the quote writes «1 025 €».
const wholeEuros = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: "always" });
const euros = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" });

/** «350 €», «132,25 €», «1 260,75 €» (no decimals on whole euros, as on the quote). */
export function formatEuros(cents: number): string {
  return (cents % 100 === 0 ? wholeEuros : euros).format(cents / 100);
}

/** «15 × 20 €» for several units, «350 €» for one. */
export function formatQuantity(line: ProposalLine): string {
  return line.quantity > 1 ? `${line.quantity} × ${formatEuros(line.unitCents)}` : formatEuros(line.unitCents);
}

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Last day the quote can be accepted, YYYY-MM-DD: the issue date plus the validity days. */
export function validUntil(proposal: Proposal): string {
  return addDays(proposal.date, proposal.validityDays);
}

/** «15/10/2026». */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Today's date in Lisbon, YYYY-MM-DD. */
export function lisbonDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** «15/10/2026, 18:42» in Lisbon time. */
export function formatLisbonDateTime(now: Date): string {
  const parts = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("day")}/${part("month")}/${part("year")}, ${part("hour")}:${part("minute")}`;
}

/** The quote can still be accepted until the end of its last valid day (Lisbon). */
export function isExpired(proposal: Proposal, now: Date): boolean {
  return lisbonDate(now) > validUntil(proposal);
}

/** «2 meses grátis», «1 mês grátis». */
export function freeMonthsLabel(proposal: Proposal): string {
  const months = proposal.annual?.freeMonths ?? 0;
  return months === 1 ? "1 mês grátis" : `${months} meses grátis`;
}

/** What the first invoice covers: «itens únicos + 1.º ano» or «itens únicos + 1.ª mensalidade». */
export function dueLabel(proposal: Proposal, plan: PaymentPlan): string {
  const recurring = plan === "annual" && proposal.annual ? "1.º ano" : "1.ª mensalidade";
  return proposal.oneOff.length ? `itens únicos + ${recurring}` : recurring;
}

/** «Anual, pago adiantado (2 meses grátis): 450 € + IVA/ano» or «Mensal: 45 € + IVA/mês». */
export function planLabel(proposal: Proposal, plan: PaymentPlan): string {
  const totals = proposalTotals(proposal);
  if (plan === "annual" && totals.annual) return `Anual, pago adiantado (${freeMonthsLabel(proposal)}): ${formatEuros(totals.annual.subtotalCents)} + IVA/ano`;
  return `Mensal: ${formatEuros(totals.monthly.subtotalCents)} + IVA/mês`;
}

/** «poupa 90 € + IVA por ano», or null without an annual plan (amounts are never shown with VAT added). */
export function annualSavingsLabel(proposal: Proposal): string | null {
  const savings = proposalTotals(proposal).annualSavings;
  return savings ? `poupa ${formatEuros(savings.subtotalCents)} + IVA por ano` : null;
}
