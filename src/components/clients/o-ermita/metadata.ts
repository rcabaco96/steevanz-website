import type { Metadata, Viewport } from "next";
import { ermitaCopy } from "@/content/o-ermita/copy";
import { ermita } from "@/content/o-ermita/facts";
import { ermitaAlternates, ermitaCanonical, ermitaOrigin, type ErmitaRoute } from "@/content/o-ermita/routes";

// The client's own metadata: its name, its icons, its address as the canonical one. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag).
export function ermitaMetadata({ locale }: ErmitaRoute): Metadata {
  const copy = ermitaCopy[locale];
  const { title, description } = copy.meta;
  return {
    metadataBase: new URL(ermitaOrigin),
    title: { absolute: title },
    description,
    applicationName: ermita.name,
    alternates: { canonical: ermitaCanonical(locale), languages: ermitaAlternates() },
    icons: {
      icon: [
        { url: ermita.media.favicon, sizes: "any" },
        { url: ermita.media.icon192, type: "image/png", sizes: "192x192" },
        { url: ermita.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: ermita.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: ermita.name,
      title,
      description,
      url: ermitaCanonical(locale),
      locale: copy.ogLocale,
      images: [{ url: ermita.media.og, width: 1200, height: 630, alt: copy.hero.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ermita.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const ermitaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1624",
  colorScheme: "light",
};
