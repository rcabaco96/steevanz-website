// Pages of Platibanda's website (src/app/(clientes)/platibanda) and their addresses. Platibanda is a FICTIONAL
// real-estate agency, made up by Steevanz as a showcase for selling websites to real-estate businesses (owner,
// 2026-10-24). The home page and one page per property («/imoveis/<slug>»), in European Portuguese.
// Kept free of imports (type imports are erased) so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/platibanda); «domain»: a domain of its own (none: the business is fictional). */
export type PlatibandaMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const platibandaOrigin = "https://www.steevanz.com/platibanda";
export const platibandaPreviewBase = "/platibanda";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const platibandaDomainSegment = "dominio";
/** The segment of a property page: /platibanda/imoveis/<slug>. */
export const platibandaListingSegment = "imoveis";

export type PlatibandaRoute = { mode: PlatibandaMode; page: "home" } | { mode: PlatibandaMode; page: "listing"; slug: string };

function base(mode: PlatibandaMode): string {
  return mode === "domain" ? "" : platibandaPreviewBase;
}

/** The link to the home page from inside the site, in the given mode. */
export function platibandaHref(mode: PlatibandaMode): string {
  return mode === "domain" ? "/" : platibandaPreviewBase;
}

/** The link to a property page from inside the site, in the given mode. */
export function platibandaListingHref(mode: PlatibandaMode, slug: string): string {
  return `${base(mode)}/${platibandaListingSegment}/${slug}`;
}

export function platibandaCanonical(slug?: string): string {
  return slug ? `${platibandaOrigin}/${platibandaListingSegment}/${slug}` : platibandaOrigin;
}

/**
 * The catch-all segments of /platibanda/[[...path]] → the page, or null (404). `slugs` are the listings that exist
 * (passed in, so this file stays free of imports).
 */
export function resolvePlatibandaPath(segments: readonly string[] | undefined, slugs: readonly string[]): PlatibandaRoute | null {
  let parts = (segments ?? []).map((part) => decodeURIComponent(part));
  let mode: PlatibandaMode = "preview";
  if (parts[0] === platibandaDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  if (parts.length === 0) return { mode, page: "home" };
  if (parts.length === 2 && parts[0] === platibandaListingSegment && slugs.includes(parts[1])) {
    return { mode, page: "listing", slug: parts[1] };
  }
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function platibandaStaticParams(slugs: readonly string[]): { path: string[] }[] {
  const pages = [[], ...slugs.map((slug) => [platibandaListingSegment, slug])];
  return [...pages.map((path) => ({ path })), ...pages.map((path) => ({ path: [platibandaDomainSegment, ...path] }))];
}

export interface PlatibandaSitemapEntry {
  url: string;
  priority: number;
}

export function platibandaSitemapEntries(slugs: readonly string[]): PlatibandaSitemapEntry[] {
  return [{ url: platibandaCanonical(), priority: 1 }, ...slugs.map((slug) => ({ url: platibandaCanonical(slug), priority: 0.7 }))];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function platibandaRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${platibandaOrigin}/sitemap.xml`, ""].join("\n");
}
