import type { Metadata } from "next";

// Link previews (WhatsApp, LinkedIn, Facebook…) of public pages outside the marketing site, whose layouts have no
// metadataBase: the image URLs are absolute. Kept free of imports beyond types so the unit tests can load it.

export const siteOrigin = "https://www.steevanz.com";

/**
 * Where the preview pictures are served from: a branch preview's own address on a Vercel preview (so a new picture is
 * seen before it reaches www.steevanz.com, owner 2026-10-24), www.steevanz.com otherwise.
 */
export function previewImageUrl(path: string, env: Record<string, string | undefined> = process.env): string {
  const origin = env.VERCEL_ENV === "preview" && env.VERCEL_BRANCH_URL ? `https://${env.VERCEL_BRANCH_URL}` : siteOrigin;
  return `${origin}${path}`;
}

/** The demo spaces (scripts/demo-businesses.mjs): fictional businesses whose public pages are shown as examples. */
export const demoSpaceSlugs = ["tasca-do-largo", "navalha-douro", "clinica-sorriso", "arena-desportiva"] as const;
export type DemoSpaceSlug = (typeof demoSpaceSlugs)[number];

/** A demo space's public page: the queue (/fila), the booking page (/reservar) or the loyalty card (/cartao). */
export type DemoSpacePage = "fila" | "reservar" | "cartao";

export function isDemoSpace(slug: string): slug is DemoSpaceSlug {
  return (demoSpaceSlugs as readonly string[]).includes(slug);
}

/** The 1200×630 picture of a demo space's page: two phones with that live page (also its card on the product page). */
export function demoSpaceImage(page: DemoSpacePage, slug: DemoSpaceSlug): string {
  return `/og/${page === "cartao" ? "cartao-cliente" : page}-${slug}.jpg`;
}

/** Open Graph and Twitter tags for a demo space's page; nothing for a real client's page (no picture of theirs yet). */
export function demoSpacePreview(page: DemoSpacePage, slug: string, title: string): Pick<Metadata, "openGraph" | "twitter"> {
  if (!isDemoSpace(slug)) return {};
  const image = { url: previewImageUrl(demoSpaceImage(page, slug)), width: 1200, height: 630, alt: title };
  return {
    openGraph: { type: "website", url: `${siteOrigin}/${page}/${slug}`, locale: "pt_PT", title, images: [image] },
    twitter: { card: "summary_large_image", title, images: [image.url] },
  };
}
