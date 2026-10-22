import type { Metadata, Viewport } from "next";
import { loboCopy } from "@/content/lobo-do-mar/copy";
import { lobo } from "@/content/lobo-do-mar/facts";
import { loboAlternates, loboCanonical, loboOrigin, type LoboRoute } from "@/content/lobo-do-mar/routes";

// The client's own metadata: its name, its icons, its address as the canonical one. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag).
export function loboMetadata({ locale }: LoboRoute): Metadata {
  const copy = loboCopy[locale];
  const { title, description } = copy.meta;
  return {
    // The origin only: a base with a path (/lobo-do-mar) would put the preview image under /lobo-do-mar/media/… (a 404).
    metadataBase: new URL(new URL(loboOrigin).origin),
    title: { absolute: title },
    description,
    applicationName: lobo.name,
    alternates: { canonical: loboCanonical(locale), languages: loboAlternates() },
    icons: {
      icon: [
        { url: lobo.media.favicon, sizes: "any" },
        { url: lobo.media.icon192, type: "image/png", sizes: "192x192" },
        { url: lobo.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: lobo.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: lobo.name,
      title,
      description,
      url: loboCanonical(locale),
      locale: copy.ogLocale,
      images: [{ url: lobo.media.og, width: 1200, height: 630, alt: copy.meta.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [lobo.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const loboViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2430",
  colorScheme: "light",
};
