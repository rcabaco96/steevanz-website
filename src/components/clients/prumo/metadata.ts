import type { Metadata, Viewport } from "next";
import { prumoCopy } from "@/content/prumo/copy";
import { prumo } from "@/content/prumo/facts";
import { prumoOrigin } from "@/content/prumo/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(prumoOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Prumo is fictional.
// No JSON-LD: it would describe a business that does not exist.
export function prumoMetadata(): Metadata {
  const { title, description, ogAlt } = prumoCopy.meta;
  const origin = mediaOrigin();
  const siteOrigin = new URL(prumoOrigin).origin;
  return {
    // The origin only: a base with a path (/prumo) would put the preview image under /prumo/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: prumo.name,
    alternates: { canonical: prumoOrigin },
    robots: { index: false, follow: false },
    manifest: "/prumo/manifest.webmanifest",
    icons: {
      icon: [
        { url: prumo.media.favicon, sizes: "any" },
        { url: prumo.media.icon192, type: "image/png", sizes: "192x192" },
        { url: prumo.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: prumo.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: prumo.name,
      title,
      description,
      url: origin === siteOrigin ? prumoOrigin : `${origin}${new URL(prumoOrigin).pathname}`,
      locale: "pt_PT",
      images: [{ url: prumo.media.og, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [prumo.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const prumoViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d2730",
  colorScheme: "light",
};
