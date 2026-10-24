import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCardView } from "@/components/business-card/BusinessCardView";
import { loadPublicCard } from "@/lib/business-cards/store";
import { previewImageUrl, siteOrigin } from "@/lib/link-previews";
import { href } from "@/lib/routes";

// Cached for an hour at most; every save in the admin refreshes the page at once.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Link previews (WhatsApp, LinkedIn…) read the Open Graph tags; this layout has no metadataBase, so the URLs are
// absolute, from this deployment (a branch preview's own address before the picture reaches www.steevanz.com).
// Every card has one (owner, 2026-10-24): a photographed picture below, or else one drawn from the card (/og/cartao/<slug>).

/** Cards with a photographed link-preview picture of their own, 1200×630: the printed card and the page it opens. */
const cardPreviews: Record<string, { image: string; alt: string }> = {
  // Also the picture of its card on the business-card product page (content/product-examples.ts).
  "rogerio-cabaco": { image: "/og/cartao-rogerio-cabaco.jpg", alt: "O cartão de visita de Rogério Cabaço e a página que abre no telemóvel" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await loadPublicCard((await params).slug);
  if (!card) return {};
  const line = [card.role, card.company].filter(Boolean).join(" · ");
  const title = line ? `${card.name} · ${line}` : card.name;
  const description = line || undefined;
  const preview = cardPreviews[card.slug];
  const image = {
    url: previewImageUrl(preview?.image ?? `/og/cartao/${card.slug}`),
    width: 1200,
    height: 630,
    alt: preview?.alt ?? title,
  };
  return {
    title,
    description,
    openGraph: { type: "profile", url: `${siteOrigin}/c/${card.slug}`, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function BusinessCardPage({ params }: Props) {
  const card = await loadPublicCard((await params).slug);
  if (!card) notFound();
  return <BusinessCardView card={card} productHref={href(card.locale, { key: "product", productId: "business-card" })} />;
}
