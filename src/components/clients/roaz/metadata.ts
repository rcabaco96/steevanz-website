import type { Metadata, Viewport } from "next";
import { roazCopy } from "@/content/roaz/copy";
import { roaz } from "@/content/roaz/facts";
import { roazCanonical, roazOrigin } from "@/content/roaz/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(roazOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Roaz is fictional.
// No JSON-LD: every fact about the business would be made up.
export function roazMetadata(): Metadata {
  const { title, description } = roazCopy.meta;
  const origin = mediaOrigin();
  const canonical = roazCanonical();
  const siteOrigin = new URL(roazOrigin).origin;
  return {
    // The origin only: a base with a path (/roaz) would put the preview image under /roaz/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: roaz.name,
    alternates: { canonical },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: roaz.media.favicon, sizes: "any" },
        { url: roaz.media.icon192, type: "image/png", sizes: "192x192" },
        { url: roaz.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: roaz.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: roaz.name,
      title,
      description,
      url: origin === siteOrigin ? canonical : `${origin}${new URL(canonical).pathname}`,
      locale: roazCopy.ogLocale,
      images: [{ url: roaz.media.og, width: 1200, height: 630, alt: roazCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [roaz.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const roazViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06303a",
  colorScheme: "light",
};
