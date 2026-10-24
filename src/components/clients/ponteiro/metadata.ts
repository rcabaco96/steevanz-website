import type { Metadata, Viewport } from "next";
import { ponteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro } from "@/content/ponteiro/facts";
import { ponteiroCanonical, ponteiroOrigin } from "@/content/ponteiro/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(ponteiroOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Ponteiro is
// fictional. No JSON-LD: its data would be made up.
export function ponteiroMetadata(): Metadata {
  const { title, description } = ponteiroCopy.meta;
  const origin = mediaOrigin();
  const siteOrigin = new URL(ponteiroOrigin).origin;
  return {
    // The origin only: a base with a path (/ponteiro) would put the preview image under /ponteiro/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: ponteiro.name,
    alternates: { canonical: ponteiroCanonical(), languages: { "pt-PT": ponteiroCanonical() } },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: ponteiro.media.favicon, sizes: "any" },
        { url: ponteiro.media.icon192, type: "image/png", sizes: "192x192" },
        { url: ponteiro.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: ponteiro.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: ponteiro.name,
      title,
      description,
      url: origin === siteOrigin ? ponteiroCanonical() : `${origin}${new URL(ponteiroOrigin).pathname}`,
      locale: ponteiroCopy.ogLocale,
      images: [{ url: ponteiro.media.og, width: 1200, height: 630, alt: ponteiroCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ponteiro.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const ponteiroViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b1838",
  colorScheme: "light",
};
