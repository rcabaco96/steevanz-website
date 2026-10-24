import type { Metadata, Viewport } from "next";
import { orveCopy } from "@/content/orve/copy";
import { orve } from "@/content/orve/facts";
import { orveAlternates, orveCanonical, orveLocales, orveOrigin, type OrveRoute } from "@/content/orve/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(orveOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: Orvé is fictional.
// One set per language: its own title, description, canonical and og:locale, the hreflang alternates of all six; the
// link preview image is the same for every language.
export function orveMetadata({ locale }: OrveRoute): Metadata {
  const copy = orveCopy[locale];
  const { title, description } = copy.meta;
  const origin = mediaOrigin();
  const canonical = orveCanonical(locale);
  const siteOrigin = new URL(orveOrigin).origin;
  return {
    // The origin only: a base with a path (/orve) would put the preview image under /orve/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: orve.name,
    alternates: { canonical, languages: orveAlternates() },
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
      url: origin === siteOrigin ? canonical : `${origin}${new URL(canonical).pathname}`,
      locale: copy.ogLocale,
      alternateLocale: orveLocales.filter((l) => l !== locale).map((l) => orveCopy[l].ogLocale),
      images: [{ url: orve.media.og, width: 1200, height: 630, alt: copy.ogAlt }],
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
