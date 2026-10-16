import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProposalView } from "@/components/proposals/ProposalView";
import { getProposal } from "@/content/proposals";
import { isExpired } from "@/lib/proposals/totals";

type Props = { params: Promise<{ id: string }> };

// Private by link: never indexed, never followed, not in the sitemap and not linked from the site.
const robots: Metadata["robots"] = { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proposal = getProposal((await params).id);
  return {
    title: proposal ? `Proposta para ${proposal.clientName} · Steevanz` : "Steevanz",
    robots,
    referrer: "no-referrer",
  };
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const proposal = getProposal(id);
  if (!proposal) notFound();

  // Rendered per request: whether the quote is still valid depends on today's date.
  await connection();

  return <ProposalView proposal={proposal} expired={isExpired(proposal, new Date())} />;
}
