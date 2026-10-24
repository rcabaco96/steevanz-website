// Pages of Ponteiro's website (src/app/(clientes)/ponteiro) and their addresses. Ponteiro is a FICTIONAL café,
// kitchen and bar, made up by Steevanz as a showcase for selling websites to restaurants, cafés and bars (owner,
// 2026-10-24). One page, in European Portuguese. Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/ponteiro); «domain»: a domain of its own (none: the business is fictional). */
export type PonteiroMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const ponteiroOrigin = "https://www.steevanz.com/ponteiro";
export const ponteiroPreviewBase = "/ponteiro";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const ponteiroDomainSegment = "dominio";

export interface PonteiroRoute {
  mode: PonteiroMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function ponteiroHref(mode: PonteiroMode): string {
  return mode === "domain" ? "/" : ponteiroPreviewBase;
}

export function ponteiroCanonical(): string {
  return ponteiroOrigin;
}

/** The catch-all segments of /ponteiro/[[...path]] → the page, or null (404). */
export function resolvePonteiroPath(segments: readonly string[] | undefined): PonteiroRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === ponteiroDomainSegment) return { mode: "domain" };
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function ponteiroStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [ponteiroDomainSegment] }];
}

export interface PonteiroSitemapEntry {
  url: string;
  priority: number;
}

export function ponteiroSitemapEntries(): PonteiroSitemapEntry[] {
  return [{ url: ponteiroCanonical(), priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function ponteiroRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${ponteiroOrigin}/sitemap.xml`, ""].join("\n");
}
