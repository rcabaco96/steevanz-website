import type { Metadata, Viewport } from "next";
import { orveCopy } from "@/content/orve/copy";
import { orve } from "@/content/orve/facts";
import { orveCanonical, orveOrigin } from "@/content/orve/routes";

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Orvé is fictional.
export function orveMetadata(): Metadata {
  const { title, description } = orveCopy.meta;
  return {
    // The origin only: a base with a path (/orve) would put the preview image under /orve/media/… (a 404).
    metadataBase: new URL(new URL(orveOrigin).origin),
    title: { absolute: title },
    description,
    applicationName: orve.name,
    alternates: { canonical: orveCanonical() },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: orve.media.favicon, sizes: "any" },
        { url: orve.media.icon192, type: "image/png", sizes: "192x192" },
        { url: orve.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: orve.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: orve.name,
      title,
      description,
      url: orveCanonical(),
      locale: orveCopy.ogLocale,
      images: [{ url: orve.media.og, width: 1200, height: 630, alt: orveCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [orve.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const orveViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#241814",
  colorScheme: "light",
};
