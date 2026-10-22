// Pages of Lobo do Mar's website (src/app/(clientes)/lobo-do-mar) and their addresses: one page per language.
// Kept free of imports so the unit tests can load it directly.

export type LoboLocale = "pt" | "en";
/** «preview»: the Steevanz preview path (/lobo-do-mar/…); «domain»: the client's own domain (none yet). */
export type LoboMode = "preview" | "domain";

export const loboLocales: readonly LoboLocale[] = ["pt", "en"];

/**
 * The address search engines should keep. The restaurant has no domain of its own yet (owner, 2026-10-22: to
 * be chosen), so for now it is the preview on steevanz.com, which stays out of search engines anyway. When a
 * domain is chosen: put it here and in `hosts` in src/lib/client-sites.ts, and add it to the proxy matcher.
 */
export const loboOrigin = "https://www.steevanz.com/lobo-do-mar";
export const loboPreviewBase = "/lobo-do-mar";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const loboDomainSegment = "dominio";

const slugs: Record<LoboLocale, string[]> = { pt: [], en: ["en"] };

export interface LoboRoute {
  mode: LoboMode;
  locale: LoboLocale;
}

/** The path on the client's domain: «/» or «/en». */
export function loboDomainPath(locale: LoboLocale): string {
  const parts = slugs[locale];
  return parts.length ? `/${parts.join("/")}` : "/";
}

/** The link to a language's page from inside the site, in the given mode. */
export function loboHref(mode: LoboMode, locale: LoboLocale): string {
  const path = loboDomainPath(locale);
  if (mode === "domain") return path;
  return path === "/" ? loboPreviewBase : `${loboPreviewBase}${path}`;
}

export function loboCanonical(locale: LoboLocale): string {
  const path = loboDomainPath(locale);
  return path === "/" ? loboOrigin : `${loboOrigin}${path}`;
}

/** The catch-all segments of /lobo-do-mar/[[...path]] → the page, or null (404). */
export function resolveLoboPath(segments: readonly string[] | undefined): LoboRoute | null {
  let parts = (segments ?? []).map((part) => decodeURIComponent(part));
  let mode: LoboMode = "preview";
  if (parts[0] === loboDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  const key = parts.join("/");
  for (const locale of loboLocales) {
    if (slugs[locale].join("/") === key) return { mode, locale };
  }
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function loboStaticParams(): { path: string[] }[] {
  return (["preview", "domain"] as const).flatMap((mode) =>
    loboLocales.map((locale) => ({ path: [...(mode === "domain" ? [loboDomainSegment] : []), ...slugs[locale]] })),
  );
}

/** hreflang alternates. */
export function loboAlternates(): Record<string, string> {
  return { "pt-PT": loboCanonical("pt"), en: loboCanonical("en"), "x-default": loboCanonical("pt") };
}

export interface LoboSitemapEntry {
  url: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}

/** The client's sitemap (for its own domain, once it has one). */
export function loboSitemapEntries(): LoboSitemapEntry[] {
  return loboLocales.map((locale) => ({
    url: loboCanonical(locale),
    priority: locale === "pt" ? 1 : 0.9,
    alternates: { languages: loboAlternates() },
  }));
}

/** robots.txt on the client's own domain. */
export function loboRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${loboOrigin}/sitemap.xml`, ""].join("\n");
}
