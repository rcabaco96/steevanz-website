import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "../../../globals.css";
import { fontVariables } from "@/app/fonts";
import { ThemeScript } from "@/components/site/ThemeScript";
import { businessCards, getBusinessCard } from "@/content/business-cards";
import { htmlLang } from "@/lib/i18n";
import { rootViewport } from "@/lib/root-metadata";

// The root layout of a «Cartão de visita digital» page (/c/<slug>): its own html, in the card owner's language.
// Public, never indexed, prerendered for every card in content/business-cards.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return businessCards.map((card) => ({ slug: card.slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = rootViewport;

export default async function BusinessCardLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const card = getBusinessCard((await params).slug);
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
