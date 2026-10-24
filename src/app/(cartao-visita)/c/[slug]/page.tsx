import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCardView } from "@/components/business-card/BusinessCardView";
import { loadPublicCard } from "@/lib/business-cards/store";
import { href } from "@/lib/routes";

// Cached for an hour at most; every save in the admin refreshes the page at once.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Link previews (WhatsApp, LinkedIn…) read the Open Graph tags; this layout has no metadataBase, so the URLs are
// absolute, from this deployment (a branch preview's own address before the picture reaches www.steevanz.com).
const siteOrigin = "https://www.steevanz.com";
const imageOrigin = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : siteOrigin;

/** Cards with a link-preview picture of their own, 1200×630: the printed card and the page it opens. */
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
  if (!preview) return { title, description };
  const image = { url: `${imageOrigin}${preview.image}`, width: 1200, height: 630, alt: preview.alt };
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
