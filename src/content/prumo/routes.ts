// Pages of Prumo's website (src/app/(clientes)/prumo) and their addresses. Prumo is a FICTIONAL clinic of
// physiotherapy, osteopathy and wellness, made up by Steevanz as a showcase for selling websites to health and
// wellness businesses (owner, 2026-10-24: «um website para cada tipo de negócio que temos no CRM»). Portuguese only:
// /prumo (preview path) and «/prumo/dominio», the variant whose links point at a domain of its own (it has none: the
// business is fictional). Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/prumo); «domain»: a domain of its own (none: the business is fictional). */
export type PrumoMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const prumoOrigin = "https://www.steevanz.com/prumo";
export const prumoPreviewBase = "/prumo";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const prumoDomainSegment = "dominio";

export interface PrumoRoute {
  mode: PrumoMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function prumoHref(mode: PrumoMode): string {
  return mode === "domain" ? "/" : prumoPreviewBase;
}

/** The catch-all segments of /prumo/[[...path]] → the page, or null (404). */
export function resolvePrumoPath(segments: readonly string[] | undefined): PrumoRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === prumoDomainSegment) return { mode: "domain" };
  return null;
}

/** Both variants, for generateStaticParams. */
export function prumoStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [prumoDomainSegment] }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function prumoRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${prumoOrigin}/sitemap.xml`, ""].join("\n");
}
