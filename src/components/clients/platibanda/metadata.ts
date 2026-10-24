import type { Metadata, Viewport } from "next";
import { platibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";
import { listingPrice, zones, type Listing } from "@/content/platibanda/listings";
import { platibandaCanonical, platibandaListingSegment, platibandaOrigin } from "@/content/platibanda/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404).
 */
function mediaOrigin(): string {
  const preview = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : undefined;
  return preview ? `https://${preview}` : new URL(platibandaOrigin).origin;
}

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: it is fictional.
export function platibandaMetadata(listing?: Listing): Metadata {
  const title = listing
    ? `${listing.typology} em ${zones[listing.zone]} · ${listingPrice(listing)} · ${platibanda.name}`
    : platibandaCopy.meta.title;
  const description = listing ? `${listing.lead} ${platibandaCopy.fictionalListing}.` : platibandaCopy.meta.description;
  const origin = mediaOrigin();
  const canonical = platibandaCanonical(listing?.slug);
  const path = new URL(platibandaOrigin).pathname + (listing ? `/${platibandaListingSegment}/${listing.slug}` : "");
  return {
    // The origin only: a base with a path (/platibanda) would put the preview image under /platibanda/media/… (a 404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: platibanda.name,
    alternates: { canonical },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: platibanda.media.favicon, sizes: "any" },
        { url: platibanda.media.icon192, type: "image/png", sizes: "192x192" },
        { url: platibanda.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: platibanda.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: platibanda.fullName,
      title,
      description,
      url: origin === new URL(platibandaOrigin).origin ? canonical : `${origin}${path}`,
      locale: platibandaCopy.ogLocale,
      images: [{ url: platibanda.media.og, width: 1200, height: 630, alt: platibandaCopy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [platibanda.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const platibandaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#13302e",
  colorScheme: "light",
};
