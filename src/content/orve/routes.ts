// Pages of Orvé's website (src/app/(clientes)/orve) and their addresses. Orvé is a FICTIONAL beauty business, made
// up by Steevanz as a showcase for selling websites to beauty and aesthetics businesses (owner, 2026-10-23).
// One page, in European Portuguese. Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/orve); «domain»: a domain of its own (none: the business is fictional). */
export type OrveMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const orveOrigin = "https://www.steevanz.com/orve";
export const orvePreviewBase = "/orve";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const orveDomainSegment = "dominio";

export interface OrveRoute {
  mode: OrveMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function orveHref(mode: OrveMode): string {
  return mode === "domain" ? "/" : orvePreviewBase;
}

export function orveCanonical(): string {
  return orveOrigin;
}

/** The catch-all segments of /orve/[[...path]] → the page, or null (404). */
export function resolveOrvePath(segments: readonly string[] | undefined): OrveRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === orveDomainSegment) return { mode: "domain" };
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function orveStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [orveDomainSegment] }];
}

export interface OrveSitemapEntry {
  url: string;
  priority: number;
}

export function orveSitemapEntries(): OrveSitemapEntry[] {
  return [{ url: orveCanonical(), priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function orveRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${orveOrigin}/sitemap.xml`, ""].join("\n");
}
