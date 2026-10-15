/**
 * A proposal (quote) a client accepts online at /proposta/<id>. One file per proposal in this folder,
 * registered in ./index.ts. How to create a new one: docs/propostas/README.md.
 *
 * Amounts are in cents and without VAT; the totals are computed by src/lib/proposals/totals.ts.
 */

export interface ProposalDiscount {
  /** Shown under the line, e.g. «Desconto de quantidade (a partir de 10 placas: 15 €/un.)». */
  description: string;
  /** Positive number: what comes off the line, in cents. */
  amountCents: number;
}

export interface ProposalLine {
  description: string;
  /** Optional small print under the description. */
  detail?: string;
  quantity: number;
  /** Unit price in cents, without VAT. */
  unitCents: number;
  discount?: ProposalDiscount;
}

export interface Proposal {
  /** Unguessable slug: the link is the only key to the page. «<client>-<random>», see the README. */
  id: string;
  /** The quote number, as on the PDF sent to the client. */
  number: string;
  clientName: string;
  /** Issue date, YYYY-MM-DD (Lisbon). */
  date: string;
  /** Days the quote stays valid, counted from `date` (30). */
  validityDays: number;
  /** VAT rate in percent (23). */
  vatRate: number;
  /** Paid once, on acceptance. */
  oneOff: ProposalLine[];
  /** Paid every month. */
  monthly: ProposalLine[];
  /** A short, plain summary of what the client gets. */
  included: string[];
  conditions: string[];
  notes?: string[];
  /** What happens after the client accepts (shown on the thank-you). */
  nextSteps: string[];
}
