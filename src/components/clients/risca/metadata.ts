import type { Metadata, Viewport } from "next";
import { riscaCopy } from "@/content/risca/copy";
import { risca } from "@/content/risca/facts";
import { riscaCanonical, riscaOrigin } from "@/content/risca/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(riscaOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Risca is fictional.
export function riscaMetadata(): Metadata {
  const { title, description } = riscaCopy.meta;
  const origin = mediaOrigin();
  return {
    // The origin only: a base with a path (/risca) would put the preview image under /risca/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: risca.name,
    alternates: { canonical: riscaCanonical() },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: risca.media.favicon, sizes: "any" },
        { url: risca.media.icon192, type: "image/png", sizes: "192x192" },
        { url: risca.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: risca.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: risca.name,
      title,
      description,
      url: origin === new URL(riscaOrigin).origin ? riscaCanonical() : `${origin}${new URL(riscaOrigin).pathname}`,
      locale: riscaCopy.ogLocale,
      images: [{ url: risca.media.og, width: 1200, height: 630, alt: riscaCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [risca.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const riscaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121110",
  colorScheme: "light",
};
