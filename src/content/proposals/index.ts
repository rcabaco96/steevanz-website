// Relative imports with extensions keep this module runnable by `node --test` (tests/proposals.test.mjs).
import { proposal as dolciSalati } from "./dolci-salati-695graik.ts";
import type { Proposal } from "./types.ts";

export type { Proposal, ProposalDiscount, ProposalLine } from "./types.ts";

/** Every proposal that can be opened at /proposta/<id>. Add new ones here (docs/propostas/README.md). */
export const proposals: readonly Proposal[] = [dolciSalati];

export function getProposal(id: string): Proposal | null {
  return proposals.find((proposal) => proposal.id === id) ?? null;
}
