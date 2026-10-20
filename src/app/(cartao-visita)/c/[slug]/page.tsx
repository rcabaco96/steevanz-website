import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCardView } from "@/components/business-card/BusinessCardView";
import { loadPublicCard } from "@/lib/business-cards/store";
import { href } from "@/lib/routes";

// Cached for an hour at most; every save in the admin refreshes the page at once.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await loadPublicCard((await params).slug);
  if (!card) return {};
  const line = [card.role, card.company].filter(Boolean).join(" · ");
  return { title: line ? `${card.name} · ${line}` : card.name, description: line || undefined };
}

export default async function BusinessCardPage({ params }: Props) {
  const card = await loadPublicCard((await params).slug);
  if (!card) notFound();
  return <BusinessCardView card={card} productHref={href(card.locale, { key: "product", productId: "business-card" })} />;
}
