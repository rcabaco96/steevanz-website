// Pages of Orvé's website (src/app/(clientes)/orve) and their addresses: one page per language. Orvé is a FICTIONAL
// beauty business, made up by Steevanz as a showcase for selling websites to beauty and aesthetics businesses (owner,
// 2026-10-23). The six languages of the Steevanz site (owner, 2026-10-24): /orve (pt), /orve/en, /orve/es, /orve/fr,
// /orve/de, /orve/it. Kept free of imports so the unit tests can load it directly.

export type OrveLocale = "pt" | "en" | "es" | "fr" | "de" | "it";
/** «preview»: the Steevanz preview path (/orve/…); «domain»: a domain of its own (none: the business is fictional). */
export type OrveMode = "preview" | "domain";

/** In the order the language switcher lists them. */
export const orveLocales: readonly OrveLocale[] = ["pt", "en", "es", "fr", "de", "it"];

/** Each language's name in its own language, as the switcher shows it. */
export const orveLanguageNames: Record<OrveLocale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

/** The value of <html lang> and of hreflang. */
export const orveHtmlLang: Record<OrveLocale, string> = { pt: "pt-PT", en: "en", es: "es", fr: "fr", de: "de", it: "it" };

/** The address search engines would keep. The preview stays out of search engines (the proxy sends «noindex»). */
export const orveOrigin = "https://www.steevanz.com/orve";
export const orvePreviewBase = "/orve";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const orveDomainSegment = "dominio";

const slugs: Record<OrveLocale, string[]> = { pt: [], en: ["en"], es: ["es"], fr: ["fr"], de: ["de"], it: ["it"] };

export interface OrveRoute {
  mode: OrveMode;
  locale: OrveLocale;
}

/** The path on a domain of its own: «/» or «/en». */
export function orveDomainPath(locale: OrveLocale): string {
  const parts = slugs[locale];
  return parts.length ? `/${parts.join("/")}` : "/";
}

/** The link to a language's page from inside the site, in the given mode. */
export function orveHref(mode: OrveMode, locale: OrveLocale = "pt"): string {
  const path = orveDomainPath(locale);
  if (mode === "domain") return path;
  return path === "/" ? orvePreviewBase : `${orvePreviewBase}${path}`;
}

export function orveCanonical(locale: OrveLocale = "pt"): string {
  const path = orveDomainPath(locale);
  return path === "/" ? orveOrigin : `${orveOrigin}${path}`;
}

/** The catch-all segments of /orve/[[...path]] → the page, or null (404). */
export function resolveOrvePath(segments: readonly string[] | undefined): OrveRoute | null {
  let parts = (segments ?? []).map((part) => decodeURIComponent(part));
  let mode: OrveMode = "preview";
  if (parts[0] === orveDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  const key = parts.join("/");
  for (const locale of orveLocales) {
    if (slugs[locale].join("/") === key) return { mode, locale };
  }
  return null;
}

/** The language of a browser address (preview path or a domain of its own), for the 404 page. */
export function orveLocaleFromPathname(pathname: string): OrveLocale {
  const rest = pathname.startsWith(orvePreviewBase) ? pathname.slice(orvePreviewBase.length) : pathname;
  const match = /^\/(?:dominio\/)?([a-z]{2})(?:\/|$)/.exec(rest);
  const code = match?.[1] as OrveLocale | undefined;
  return code && orveLocales.includes(code) ? code : "pt";
}

/** Every page in both modes, for generateStaticParams. */
export function orveStaticParams(): { path: string[] }[] {
  return (["preview", "domain"] as const).flatMap((mode) =>
    orveLocales.map((locale) => ({ path: [...(mode === "domain" ? [orveDomainSegment] : []), ...slugs[locale]] })),
  );
}

/** hreflang alternates. */
export function orveAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of orveLocales) languages[orveHtmlLang[locale]] = orveCanonical(locale);
  languages["x-default"] = orveCanonical("pt");
  return languages;
}

export interface OrveSitemapEntry {
  url: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}

export function orveSitemapEntries(): OrveSitemapEntry[] {
  return orveLocales.map((locale) => ({
    url: orveCanonical(locale),
    priority: locale === "pt" ? 1 : 0.9,
    alternates: { languages: orveAlternates() },
  }));
}

/** robots.txt for a domain of its own (the preview itself is out of search engines). */
export function orveRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${orveOrigin}/sitemap.xml`, ""].join("\n");
}
