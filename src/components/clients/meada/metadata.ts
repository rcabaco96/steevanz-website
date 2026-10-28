import type { Metadata, Viewport } from "next";
import { meadaCopy } from "@/content/meada/copy";
import { meada } from "@/content/meada/facts";
import { meadaCanonical, meadaOrigin } from "@/content/meada/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(meadaOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Meada is fictional.
export function meadaMetadata(): Metadata {
  const { title, description } = meadaCopy.meta;
  const origin = mediaOrigin();
  return {
    // The origin only: a base with a path (/meada) would put the preview image under /meada/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: meada.name,
    alternates: { canonical: meadaCanonical() },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: meada.media.favicon, sizes: "any" },
        { url: meada.media.icon192, type: "image/png", sizes: "192x192" },
        { url: meada.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: meada.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: meada.name,
      title,
      description,
      url: origin === new URL(meadaOrigin).origin ? meadaCanonical() : `${origin}${new URL(meadaOrigin).pathname}`,
      locale: meadaCopy.ogLocale,
      images: [{ url: meada.media.og, width: 1200, height: 630, alt: meadaCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [meada.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const meadaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c1d20",
  colorScheme: "light",
};
