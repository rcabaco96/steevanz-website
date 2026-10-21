import type { Metadata, Viewport } from "next";
import { fabiosCopy } from "@/content/fabios-roadstop/copy";
import { fabios } from "@/content/fabios-roadstop/facts";
import { fabiosAlternates, fabiosCanonical, fabiosOrigin, type FabiosRoute } from "@/content/fabios-roadstop/routes";

// The client's own metadata: its name, its logo as the icon, its domain as the canonical address. Nothing of
// Steevanz. Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), the client's domain does not.
export function fabiosMetadata({ locale, page }: FabiosRoute): Metadata {
  const copy = fabiosCopy[locale];
  const { title, description } = copy.meta[page];
  return {
    metadataBase: new URL(fabiosOrigin),
    title: { absolute: title },
    description,
    applicationName: fabios.name,
    alternates: { canonical: fabiosCanonical(locale, page), languages: fabiosAlternates(page) },
    icons: {
      icon: [
        { url: fabios.media.favicon, sizes: "any" },
        { url: fabios.media.icon192, type: "image/png", sizes: "192x192" },
        { url: fabios.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: fabios.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: fabios.name,
      title,
      description,
      url: fabiosCanonical(locale, page),
      locale: copy.ogLocale,
      images: [{ url: fabios.media.og, width: 1200, height: 630, alt: copy.experience.interiorAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [fabios.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const fabiosViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1726",
  colorScheme: "light",
};
