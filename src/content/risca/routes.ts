// Pages of Risca's website (src/app/(clientes)/risca) and their addresses. Risca is a FICTIONAL hair salon in Porto, made
// up by Steevanz as a showcase for selling websites to hair salons (owner, 2026-10-24).
// One page, in European Portuguese. Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/risca); «domain»: a domain of its own (none: the business is fictional). */
export type RiscaMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const riscaOrigin = "https://www.steevanz.com/risca";
export const riscaPreviewBase = "/risca";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const riscaDomainSegment = "dominio";

export interface RiscaRoute {
  mode: RiscaMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function riscaHref(mode: RiscaMode): string {
  return mode === "domain" ? "/" : riscaPreviewBase;
}

export function riscaCanonical(): string {
  return riscaOrigin;
}

/** The catch-all segments of /risca/[[...path]] → the page, or null (404). */
export function resolveRiscaPath(segments: readonly string[] | undefined): RiscaRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === riscaDomainSegment) return { mode: "domain" };
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function riscaStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [riscaDomainSegment] }];
}

export interface RiscaSitemapEntry {
  url: string;
  priority: number;
}

export function riscaSitemapEntries(): RiscaSitemapEntry[] {
  return [{ url: riscaCanonical(), priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function riscaRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${riscaOrigin}/sitemap.xml`, ""].join("\n");
}
