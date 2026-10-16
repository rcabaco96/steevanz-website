"use server";

import { after } from "next/server";
import { getProposal } from "@/content/proposals";
import { ownerAddress, sendOwnerEmail } from "@/lib/booking/email";
import { requestOrigin } from "@/lib/booking/request";
import { siteUrl } from "@/lib/site";
import { processAcceptance, type AcceptanceState } from "./accept";

/**
 * The client accepts a proposal at /proposta/<id>. The id comes bound by the page; the proposal itself
 * (lines, prices, client) is always read again from src/content/proposals, never from the request.
 */
export async function acceptProposal(proposalId: string, previous: AcceptanceState, formData: FormData): Promise<AcceptanceState> {
  const proposal = getProposal(String(proposalId));
  if (!proposal) return { status: "error", code: "send_failed", errors: {}, values: null, plan: null, attempt: 1 };

  return processAcceptance(proposal, formData, previous, {
    send: sendOwnerEmail,
    sendLater: (email) =>
      after(async () => {
        if (!(await sendOwnerEmail(email))) console.error("[proposals] client confirmation not sent:", proposal.id);
      }),
    now: new Date(),
    origin: (await requestOrigin()) || siteUrl,
    ownerAddress,
  });
}
