import type { Metadata, Viewport } from "next";
import { ferragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { ferragialOrigin } from "@/content/ferragial/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(ferragialOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz. No JSON-LD: the
// business is fictional, so structured data would be made up.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too.
export function ferragialMetadata(): Metadata {
  const { title, description, ogAlt } = ferragialCopy.meta;
  const origin = mediaOrigin();
  const siteOrigin = new URL(ferragialOrigin).origin;
  return {
    // The origin only: a base with a path (/ferragial) would put the preview image under /ferragial/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: ferragial.fullName,
    alternates: { canonical: ferragialOrigin },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: ferragial.media.favicon, sizes: "any" },
        { url: ferragial.media.icon192, type: "image/png", sizes: "192x192" },
        { url: ferragial.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: ferragial.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: ferragial.fullName,
      title,
      description,
      url: origin === siteOrigin ? ferragialOrigin : `${origin}${new URL(ferragialOrigin).pathname}`,
      locale: "pt_PT",
      images: [{ url: ferragial.media.og, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ferragial.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const ferragialViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3a0a17",
  colorScheme: "light",
};
