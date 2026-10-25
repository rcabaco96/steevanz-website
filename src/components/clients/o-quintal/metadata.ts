import type { Metadata, Viewport } from "next";
import { oQuintalAbout } from "@/content/o-quintal/about";
import { oQuintal } from "@/content/o-quintal/facts";
import { findOQuintalProduct, formatEuros, oQuintalCategories, oQuintalFromPrice } from "@/content/o-quintal/products";
import { oQuintalCanonical, oQuintalOrigin, type OQuintalRoute } from "@/content/o-quintal/routes";

// The client's own metadata: its name, its icons, its address as the canonical one. Nothing of Steevanz.
// Robots: the preview path gets «noindex» from the proxy (X-Robots-Tag); the cart and order pages are noindex too.
// metadataBase: the ORIGIN only; on a Vercel preview it is the preview's own address, so og:image answers there
// (owner, 2026-10-24, Orvé: og:image pointed at www.steevanz.com before the site was on main → 404).
function siteOrigin(): string {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`;
  return new URL(oQuintalOrigin).origin;
}

function titleAndDescription(route: OQuintalRoute): { title: string; description: string; index: boolean } {
  const { page } = route;
  const home = `${oQuintal.name} · Frutas, legumes e cabazes`;
  switch (page.kind) {
    case "home":
      return { title: home, description: `${oQuintal.tagline}. ${oQuintal.summary} Entregas em ${oQuintal.area}.`, index: true };
    case "shop": {
      const category = oQuintalCategories.find((entry) => entry.id === page.category);
      return category
        ? { title: `${category.name} · ${oQuintal.name}`, description: `${category.intro} Loja online da ${oQuintal.name}, ${oQuintal.area}.`, index: true }
        : { title: `Loja online · ${oQuintal.name}`, description: `Fruta, legumes, cabazes e produtos regionais da ${oQuintal.name}. Entregas em ${oQuintal.area}.`, index: true };
    }
    case "product": {
      const product = findOQuintalProduct(page.id);
      const from = product ? oQuintalFromPrice(product) : null;
      const price = from ? ` ${from.varies ? "Desde " : ""}${formatEuros(from.cents)}${product?.unit && !from.varies ? ` / ${product.unit}` : ""}.` : "";
      return {
        title: `${product?.name ?? "Produto"} · ${oQuintal.name}`,
        description: `${(product && oQuintalAbout[product.id]) ?? product?.name ?? ""}${price} ${oQuintal.name}, ${oQuintal.area}.`.trim(),
        index: true,
      };
    }
    case "cart":
      return { title: `Carrinho · ${oQuintal.name}`, description: oQuintal.summary, index: false };
    case "success":
      return { title: `Encomenda recebida · ${oQuintal.name}`, description: oQuintal.summary, index: false };
    case "cancel":
      return { title: `Pagamento não concluído · ${oQuintal.name}`, description: oQuintal.summary, index: false };
  }
}

export function oQuintalMetadata(route: OQuintalRoute): Metadata {
  const { title, description, index } = titleAndDescription(route);
  const canonical = oQuintalCanonical(route.page);
  return {
    metadataBase: new URL(siteOrigin()),
    title: { absolute: title },
    description,
    applicationName: oQuintal.name,
    alternates: { canonical },
    ...(index ? {} : { robots: { index: false, follow: true } }),
    icons: {
      icon: [
        { url: oQuintal.media.favicon, sizes: "any" },
        { url: oQuintal.media.icon192, type: "image/png", sizes: "192x192" },
        { url: oQuintal.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: oQuintal.media.appleIcon, sizes: "180x180" }],
    },
    manifest: "/o-quintal/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: oQuintal.name,
      title,
      description,
      url: canonical,
      locale: "pt_PT",
      images: [{ url: oQuintal.media.og, width: 1200, height: 630, alt: `${oQuintal.name} — ${oQuintal.tagline}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [oQuintal.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const oQuintalViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d4a2b",
  colorScheme: "light",
};
