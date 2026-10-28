// Pages of Roaz's website (src/app/(clientes)/roaz) and their addresses. Roaz is a FICTIONAL boat-trip operator, made
// up by Steevanz as a showcase for selling websites to boat-trip and activity businesses (owner, 2026-10-24).
// One page, in European Portuguese. Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/roaz); «domain»: a domain of its own (none: the business is fictional). */
export type RoazMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const roazOrigin = "https://www.steevanz.com/roaz";
export const roazPreviewBase = "/roaz";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const roazDomainSegment = "dominio";

export interface RoazRoute {
  mode: RoazMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function roazHref(mode: RoazMode): string {
  return mode === "domain" ? "/" : roazPreviewBase;
}

export function roazCanonical(): string {
  return roazOrigin;
}

/** The catch-all segments of /roaz/[[...path]] → the page, or null (404). */
export function resolveRoazPath(segments: readonly string[] | undefined): RoazRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === roazDomainSegment) return { mode: "domain" };
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function roazStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [roazDomainSegment] }];
}

export interface RoazSitemapEntry {
  url: string;
  priority: number;
}

export function roazSitemapEntries(): RoazSitemapEntry[] {
  return [{ url: roazCanonical(), priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function roazRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${roazOrigin}/sitemap.xml`, ""].join("\n");
}
