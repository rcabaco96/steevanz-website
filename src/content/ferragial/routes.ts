// Pages of the Adega Ferragial's website (src/app/(clientes)/ferragial). The Adega Ferragial is a FICTIONAL family
// winery in the Alentejo, made up by Steevanz (owner, 2026-10-24) as a showcase for selling websites to wineries
// (the CRM's «adegas»). One page in Portuguese: /ferragial (preview) and «/dominio» (the variant whose links would
// point at a domain of its own; it has none). Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/ferragial); «domain»: a domain of its own (none: the business is fictional). */
export type FerragialMode = "preview" | "domain";

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const ferragialOrigin = "https://www.steevanz.com/ferragial";
export const ferragialPreviewBase = "/ferragial";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const ferragialDomainSegment = "dominio";

export interface FerragialRoute {
  mode: FerragialMode;
}

/** The link to the home page from inside the site, in the given mode. */
export function ferragialHref(mode: FerragialMode): string {
  return mode === "domain" ? "/" : ferragialPreviewBase;
}

/** The catch-all segments of /ferragial/[[...path]] → the page, or null (404). */
export function resolveFerragialPath(segments: readonly string[] | undefined): FerragialRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === ferragialDomainSegment) return { mode: "domain" };
  return null;
}

/** Both variants, for generateStaticParams. */
export function ferragialStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [ferragialDomainSegment] }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function ferragialRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${ferragialOrigin}/sitemap.xml`, ""].join("\n");
}
