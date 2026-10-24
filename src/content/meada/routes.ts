// Pages of Meada's website (src/app/(clientes)/meada) and their addresses. Meada is a FICTIONAL shop of home and
// Portuguese crafts, made up by Steevanz as a showcase for selling websites and online shops to shops (owner, 2026-10-24).
// One page, in European Portuguese. Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/meada); «domain»: a domain of its own (none: the business is fictional). */
export type MeadaMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const meadaOrigin = "https://www.steevanz.com/meada";
export const meadaPreviewBase = "/meada";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const meadaDomainSegment = "dominio";

export interface MeadaRoute {
  mode: MeadaMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function meadaHref(mode: MeadaMode): string {
  return mode === "domain" ? "/" : meadaPreviewBase;
}

export function meadaCanonical(): string {
  return meadaOrigin;
}

/** The catch-all segments of /meada/[[...path]] → the page, or null (404). */
export function resolveMeadaPath(segments: readonly string[] | undefined): MeadaRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === meadaDomainSegment) return { mode: "domain" };
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function meadaStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [meadaDomainSegment] }];
}

export interface MeadaSitemapEntry {
  url: string;
  priority: number;
}

export function meadaSitemapEntries(): MeadaSitemapEntry[] {
  return [{ url: meadaCanonical(), priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function meadaRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${meadaOrigin}/sitemap.xml`, ""].join("\n");
}
