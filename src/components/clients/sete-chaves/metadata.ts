import type { Metadata, Viewport } from "next";
import { seteChaves } from "@/content/sete-chaves/facts";
import { seteChavesOrigin } from "@/content/sete-chaves/routes";

/**
 * Where the link preview image is served from. On a Vercel preview the site is not on www.steevanz.com yet, so the
 * image is taken from the preview's own address; otherwise a shared preview link shows no picture (404) — the Orvé
 * lesson, owner 2026-10-24.
 */
function mediaOrigin(): string {
  const preview =
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
      : undefined;
  return preview ? `https://${preview}` : new URL(seteChavesOrigin).origin;
}

const title = "Sete Chaves · Casa de campo em Aljezur";
const description =
  "Cinco quartos e duas casinhas num monte do vale de Aljezur, entre a serra e as praias da Costa Vicentina. Pequeno-almoço no alpendre, piscina de água salgada e um guia da casa num toque. Site de demonstração de um negócio fictício.";

// The business's own metadata: its name, its icons, its own link preview. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag), and the page says so too: it is fictional.
// No JSON-LD: every fact would be made up.
export function seteChavesMetadata(): Metadata {
  const origin = mediaOrigin();
  const siteOrigin = new URL(seteChavesOrigin).origin;
  return {
    // The origin only: a base with a path (/sete-chaves) would put the preview image under /sete-chaves/media/… (404).
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    applicationName: seteChaves.name,
    alternates: { canonical: seteChavesOrigin },
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: seteChaves.media.favicon, sizes: "any" },
        { url: seteChaves.media.icon192, type: "image/png", sizes: "192x192" },
        { url: seteChaves.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: seteChaves.media.appleIcon, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: seteChaves.name,
      title,
      description,
      url:
        origin === siteOrigin
          ? seteChavesOrigin
          : `${origin}${new URL(seteChavesOrigin).pathname}`,
      locale: "pt_PT",
      images: [
        {
          url: seteChaves.media.og,
          width: 1200,
          height: 630,
          alt: "Sete Chaves, casa de campo em Aljezur: o porta-chaves de latão com o número 7",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seteChaves.media.og],
    },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const seteChavesViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#262c33",
  colorScheme: "light",
};
