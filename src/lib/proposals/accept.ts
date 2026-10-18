// What happens when a client accepts a proposal, without the framework: validate, email the owner, then
// confirm to the client. The server action (./actions.ts) passes the real senders; the tests pass mocks.
// Relative imports with extensions keep this module runnable by `node --test` (tests/proposals.test.mjs).
import type { EmailTable, OwnerEmail } from "../booking/email.ts";
import { honeypotField } from "../booking/types.ts";
import type { Proposal, ProposalLine } from "../../content/proposals/types.ts";
import {
  annualLineCents,
  annualLineSavingsCents,
  annualPaidMonths,
  annualSavingsLabel,
  dueLabel,
  dueOnAcceptance,
  formatDate,
  formatEuros,
  formatLisbonDateTime,
  formatQuantity,
  freeMonthsLabel,
  isExpired,
  isPaymentPlan,
  lineTotal,
  planLabel,
  planOptions,
  proposalTotals,
  twelveMonthsCents,
  validUntil,
  type GroupTotals,
  type PaymentPlan,
} from "./totals.ts";
import { acceptanceFields, planField, validateAcceptance, type AcceptanceErrors, type AcceptanceValues, type BillingDetails } from "./validation.ts";

export type AcceptanceState =
  | { status: "idle" }
  | {
      status: "error";
      code: "validation" | "expired" | "send_failed";
      errors: AcceptanceErrors;
      values: AcceptanceValues | null;
      /** The plan the client had picked, to keep it selected. */
      plan: PaymentPlan | null;
      attempt: number;
    }
  | { status: "success" };

export interface AcceptanceDeps {
  /** Sends a Steevanz email (sendOwnerEmail); resolves false when it was not sent. */
  send: (email: OwnerEmail) => Promise<boolean>;
  /** Sends the client's confirmation; may run after the response (the owner's email is what counts). */
  sendLater: (email: OwnerEmail) => void;
  now: Date;
  /** «https://www.steevanz.com», for the proposal link. */
  origin: string;
}

function valuesOf(billing: BillingDetails): AcceptanceValues {
  return Object.fromEntries(acceptanceFields.map((field) => [field, billing[field]])) as AcceptanceValues;
}

export const phoneDisplay = "961 292 679";

export function proposalUrl(origin: string, proposal: Proposal): string {
  return `${origin.replace(/\/$/, "")}/proposta/${proposal.id}`;
}

function tableRows(lines: readonly ProposalLine[], suffix = ""): string[][] {
  return lines.flatMap((line) => {
    const total = lineTotal(line);
    const rows = [[line.description, line.quantity > 1 ? formatQuantity(line) : "1", `${formatEuros(total.grossCents)}${suffix}`]];
    if (line.discount && total.discountCents) rows.push([line.discount.description, "", `− ${formatEuros(total.discountCents)}${suffix}`]);
    return rows;
  });
}

/** The table's total without VAT, «+ IVA» (VAT-inclusive amounts are never shown). */
function totalsFoot(totals: GroupTotals, suffix = ""): [string, string][] {
  return [["Total", `${formatEuros(totals.subtotalCents)}${suffix} + IVA`]];
}

/** The quote as email tables: one-off items and monthly items, each with its totals, and the annual plan when chosen. */
export function proposalTables(proposal: Proposal, plan: PaymentPlan = "monthly"): EmailTable[] {
  const totals = proposalTotals(proposal);
  const tables: EmailTable[] = [];
  if (proposal.oneOff.length) {
    tables.push({ title: "Pagamento único", head: ["Item", "Qtd.", "Valor"], rows: tableRows(proposal.oneOff), foot: totalsFoot(totals.oneOff) });
  }
  if (proposal.monthly.length) {
    tables.push({ title: "Mensalidade", head: ["Item", "Qtd.", "Valor"], rows: tableRows(proposal.monthly, "/mês"), foot: totalsFoot(totals.monthly, "/mês") });
  }
  if (plan === "annual" && totals.annual) {
    const months = annualPaidMonths(proposal);
    tables.push({
      title: `Plano anual, pago adiantado (12 meses pelo preço de ${months}, ${freeMonthsLabel(proposal)})`,
      head: ["Item", "Meses", "Valor"],
      rows: proposal.monthly.map((line) => [
        `${line.description}\nem vez de ${formatEuros(twelveMonthsCents(line))}: poupa ${formatEuros(annualLineSavingsCents(proposal, line))}`,
        `${months} × ${formatEuros(lineTotal(line).netCents)}`,
        `${formatEuros(annualLineCents(proposal, line))}/ano`,
      ]),
      foot: totalsFoot(totals.annual, "/ano"),
    });
  }
  return tables;
}

export function ownerEmail(proposal: Proposal, billing: BillingDetails, deps: Pick<AcceptanceDeps, "now" | "origin">): OwnerEmail {
  const when = formatLisbonDateTime(deps.now);
  const link = proposalUrl(deps.origin, proposal);
  const due = dueOnAcceptance(proposal, billing.plan);
  const offersPlans = planOptions(proposal).length > 0;
  return {
    subject: `Nova adjudicação · ${proposal.clientName} · ${proposal.number}`,
    heading: `Nova adjudicação: ${proposal.clientName}`,
    intro: [
      `${billing.company} adjudicou a proposta ${proposal.number} (de ${formatDate(proposal.date)}, válida até ${formatDate(validUntil(proposal))}) a ${when}.`,
      `A faturar na adjudicação (${dueLabel(proposal, billing.plan)}): ${formatEuros(due.subtotalCents)} + IVA.`,
    ],
    rows: [
      { label: "Data e hora", value: when },
      { label: "Proposta", value: `${proposal.number} · ${proposal.clientName}` },
      { label: "Mensalidades", value: offersPlans ? planLabel(proposal, billing.plan) : null },
      { label: "Na adjudicação", value: `${formatEuros(due.subtotalCents)} + IVA (${dueLabel(proposal, billing.plan)})` },
      { label: "Poupança", value: billing.plan === "annual" ? annualSavingsLabel(proposal) : null },
      { label: "Empresa", value: billing.company },
      { label: billing.nifIsPortuguese ? "NIF" : "N.º de IVA", value: billing.nif },
      { label: "Morada", value: billing.address },
      { label: "Código postal", value: billing.postalCode },
      { label: "Localidade", value: billing.city },
      { label: "Contacto", value: billing.contact },
      { label: "Email (faturas)", value: billing.email },
      { label: "Telefone", value: billing.phone },
      { label: "Observações", value: billing.notes },
    ],
    tables: proposalTables(proposal, billing.plan),
    replyTo: billing.email,
    adminUrl: link,
    linkLabel: "Abrir a proposta",
    showUrl: true,
    note: "Responder a este email escreve diretamente ao cliente.",
  };
}

export function clientEmail(proposal: Proposal, billing: BillingDetails, deps: Pick<AcceptanceDeps, "origin">, replyTo: string): OwnerEmail {
  const due = dueOnAcceptance(proposal, billing.plan);
  const annual = billing.plan === "annual" && proposalTotals(proposal).annual;
  return {
    to: [billing.email],
    subject: `Proposta adjudicada · ${proposal.clientName} · ${proposal.number}`,
    heading: `Obrigado, ${proposal.clientName}! Está feito.`,
    intro: [
      `Olá ${billing.contact.split(" ")[0]}, recebemos a adjudicação da proposta ${proposal.number}. Obrigado pela confiança.`,
      "A equipa Steevanz entra em contacto em breve para começarmos. O que se segue:",
      ...proposal.nextSteps.map((step, index) => `${index + 1}. ${step}`),
      ...(annual ? [`Com o plano anual, ${annualSavingsLabel(proposal)}: 12 meses pelo preço de ${annualPaidMonths(proposal)}.`] : []),
      `Na adjudicação faturamos ${dueLabel(proposal, billing.plan)}${annual ? ` (plano anual, ${freeMonthsLabel(proposal)})` : ""}: ${formatEuros(due.subtotalCents)} + IVA, para ${billing.email}.`,
    ],
    rows: [
      { label: "Empresa", value: billing.company },
      { label: billing.nifIsPortuguese ? "NIF" : "N.º de IVA", value: billing.nif },
      { label: "Mensalidades", value: planOptions(proposal).length ? planLabel(proposal, billing.plan) : null },
    ],
    tables: proposalTables(proposal, billing.plan),
    replyTo,
    adminUrl: proposalUrl(deps.origin, proposal),
    linkLabel: "Ver a proposta",
    note: `Com os bons modos de antigamente, a equipa Steevanz. Alguma dúvida? Responda a este email ou ligue ${phoneDisplay}.`,
  };
}

/**
 * Validates the form, emails the owner (reply-to the client) and, only once that email has gone,
 * confirms to the client. Without the owner's email the client sees an error with the phone number.
 */
export async function processAcceptance(
  proposal: Proposal,
  formData: FormData,
  previous: AcceptanceState,
  deps: AcceptanceDeps & { ownerAddress: string },
): Promise<AcceptanceState> {
  const attempt = (previous.status === "error" ? previous.attempt : 0) + 1;

  // Bots fill the hidden field: pretend it worked, send nothing.
  const honeypot = formData.get(honeypotField);
  if (typeof honeypot === "string" && honeypot.trim()) return { status: "success" };

  const chosen = formData.get(planField);
  const plan = isPaymentPlan(chosen) ? chosen : null;

  if (isExpired(proposal, deps.now)) return { status: "error", code: "expired", errors: {}, values: null, plan, attempt };

  // Only the plan's name comes from the form; every amount is computed again from the content file.
  const result = validateAcceptance(formData, planOptions(proposal));
  if (!result.ok) return { status: "error", code: "validation", errors: result.errors, values: result.values, plan, attempt };

  const sent = await deps.send(ownerEmail(proposal, result.data, deps));
  if (!sent) return { status: "error", code: "send_failed", errors: {}, values: valuesOf(result.data), plan: result.data.plan, attempt };

  deps.sendLater(clientEmail(proposal, result.data, deps, deps.ownerAddress));
  return { status: "success" };
}
