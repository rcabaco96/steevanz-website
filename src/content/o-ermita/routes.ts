// Pages of O Ermita's website (src/app/(clientes)/o-ermita) and their addresses: one page per language.
// Kept free of imports so the unit tests can load it directly.

export type ErmitaLocale = "pt" | "en";
/** «preview»: the Steevanz preview path (/o-ermita/…); «domain»: the client's own domain (none yet). */
export type ErmitaMode = "preview" | "domain";

export const ermitaLocales: readonly ErmitaLocale[] = ["pt", "en"];

/**
 * The address search engines should keep. The restaurant has no domain of its own yet (owner, 2026-10-22: to
 * be chosen), so for now it is the preview on steevanz.com, which stays out of search engines anyway. When a
 * domain is chosen: put it here and in `hosts` in src/lib/client-sites.ts, and add it to the proxy matcher.
 */
export const ermitaOrigin = "https://www.steevanz.com/o-ermita";
export const ermitaPreviewBase = "/o-ermita";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const ermitaDomainSegment = "dominio";

const slugs: Record<ErmitaLocale, string[]> = { pt: [], en: ["en"] };

export interface ErmitaRoute {
  mode: ErmitaMode;
  locale: ErmitaLocale;
}

/** The path on the client's domain: «/» or «/en». */
export function ermitaDomainPath(locale: ErmitaLocale): string {
  const parts = slugs[locale];
  return parts.length ? `/${parts.join("/")}` : "/";
}

/** The link to a language's page from inside the site, in the given mode. */
export function ermitaHref(mode: ErmitaMode, locale: ErmitaLocale): string {
  const path = ermitaDomainPath(locale);
  if (mode === "domain") return path;
  return path === "/" ? ermitaPreviewBase : `${ermitaPreviewBase}${path}`;
}

export function ermitaCanonical(locale: ErmitaLocale): string {
  const path = ermitaDomainPath(locale);
  return path === "/" ? ermitaOrigin : `${ermitaOrigin}${path}`;
}

/** The catch-all segments of /o-ermita/[[...path]] → the page, or null (404). */
export function resolveErmitaPath(segments: readonly string[] | undefined): ErmitaRoute | null {
  let parts = (segments ?? []).map((part) => decodeURIComponent(part));
  let mode: ErmitaMode = "preview";
  if (parts[0] === ermitaDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  const key = parts.join("/");
  for (const locale of ermitaLocales) {
    if (slugs[locale].join("/") === key) return { mode, locale };
  }
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function ermitaStaticParams(): { path: string[] }[] {
  return (["preview", "domain"] as const).flatMap((mode) =>
    ermitaLocales.map((locale) => ({ path: [...(mode === "domain" ? [ermitaDomainSegment] : []), ...slugs[locale]] })),
  );
}

/** hreflang alternates. */
export function ermitaAlternates(): Record<string, string> {
  return { "pt-PT": ermitaCanonical("pt"), en: ermitaCanonical("en"), "x-default": ermitaCanonical("pt") };
}

export interface ErmitaSitemapEntry {
  url: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}

/** The client's sitemap (for its own domain, once it has one). */
export function ermitaSitemapEntries(): ErmitaSitemapEntry[] {
  return ermitaLocales.map((locale) => ({
    url: ermitaCanonical(locale),
    priority: locale === "pt" ? 1 : 0.9,
    alternates: { languages: ermitaAlternates() },
  }));
}

/** robots.txt on the client's own domain. */
export function ermitaRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${ermitaOrigin}/sitemap.xml`, ""].join("\n");
}
