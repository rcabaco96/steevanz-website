import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "../../../globals.css";
import { fontVariables } from "@/app/fonts";
import { ThemeScript } from "@/components/site/ThemeScript";
import { businessCards } from "@/content/business-cards";
import { loadPublicCard } from "@/lib/business-cards/store";
import { htmlLang } from "@/lib/i18n";
import { rootViewport } from "@/lib/root-metadata";

// The root layout of a «Cartão de visita digital» page (/c/<slug>): its own html, in the card owner's language.
// Public, never indexed. The cards come from the database (edited in /admin/cartoes), or from
// content/business-cards.ts before its migration; each page is rendered on its first visit and kept,
// refreshed at once by every save in the admin.

/** The content file's cards are built with the site; the others on their first visit. */
export function generateStaticParams() {
  return businessCards.map((card) => ({ slug: card.slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = rootViewport;

export default async function BusinessCardLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const card = await loadPublicCard((await params).slug);
  if (!card) notFound();
  return (
    <html lang={htmlLang[card.locale]} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-soft">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
