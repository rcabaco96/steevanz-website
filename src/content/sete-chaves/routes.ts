// The address of Sete Chaves' website (src/app/(clientes)/sete-chaves): a single page in Portuguese. Sete Chaves is a
// FICTIONAL guest house, made up by Steevanz as a showcase for selling websites to lodging businesses (owner,
// 2026-10-24). Kept free of imports so the unit tests can load it directly.

/** «preview»: the Steevanz preview path (/sete-chaves); «domain»: a domain of its own (none: the business is fictional). */
export type SeteChavesMode = "preview" | "domain";

export interface SeteChavesRoute {
  mode: SeteChavesMode;
}

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const seteChavesOrigin = "https://www.steevanz.com/sete-chaves";
export const seteChavesPreviewBase = "/sete-chaves";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const seteChavesDomainSegment = "dominio";

/** The link to the home page from inside the site, in the given mode. */
export function seteChavesHref(mode: SeteChavesMode): string {
  return mode === "domain" ? "/" : seteChavesPreviewBase;
}

/** The catch-all segments of /sete-chaves/[[...path]] → the page, or null (404). */
export function resolveSeteChavesPath(
  segments: readonly string[] | undefined,
): SeteChavesRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === seteChavesDomainSegment)
    return { mode: "domain" };
  return null;
}

/** Both variants, for generateStaticParams. */
export function seteChavesStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [seteChavesDomainSegment] }];
}

export function seteChavesSitemapEntries(): {
  url: string;
  priority: number;
}[] {
  return [{ url: seteChavesOrigin, priority: 1 }];
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function seteChavesRobotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${seteChavesOrigin}/sitemap.xml`,
    "",
  ].join("\n");
}
