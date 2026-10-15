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

export interface ProposalTotals {
  oneOff: GroupTotals;
  monthly: GroupTotals;
  /** Paid on acceptance: the one-off items plus the first month. */
  dueOnAcceptance: GroupTotals;
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

export function proposalTotals(proposal: Proposal): ProposalTotals {
  const oneOff = groupTotals(proposal.oneOff, proposal.vatRate);
  const monthly = groupTotals(proposal.monthly, proposal.vatRate);
  return {
    oneOff,
    monthly,
    dueOnAcceptance: {
      subtotalCents: oneOff.subtotalCents + monthly.subtotalCents,
      vatCents: oneOff.vatCents + monthly.vatCents,
      totalCents: oneOff.totalCents + monthly.totalCents,
    },
  };
}

const wholeEuros = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const euros = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** «350 €», «132,25 €» (no decimals on whole euros, as on the quote). */
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
