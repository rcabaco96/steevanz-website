// Pages of Fabio's Roadstop's website (src/app/(clientes)/fabios-roadstop) and their addresses.
// Kept free of imports so the unit tests can load it directly.

export type FabiosLocale = "pt" | "en";
export type FabiosPage = "home" | "about" | "contact";
/** «preview»: the Steevanz preview path (/fabios-roadstop/…); «domain»: the client's own domain. */
export type FabiosMode = "preview" | "domain";

export const fabiosLocales: readonly FabiosLocale[] = ["pt", "en"];
export const fabiosPages: readonly FabiosPage[] = ["home", "about", "contact"];

export const fabiosOrigin = "https://www.fabiosroadstop.pt";
export const fabiosPreviewBase = "/fabios-roadstop";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const fabiosDomainSegment = "dominio";

// The Portuguese addresses are the ones of the old site (/sobre-nos, /contacto), so links keep working.
const slugs: Record<FabiosLocale, Record<FabiosPage, string[]>> = {
  pt: { home: [], about: ["sobre-nos"], contact: ["contacto"] },
  en: { home: ["en"], about: ["en", "about-us"], contact: ["en", "contact"] },
};

export interface FabiosRoute {
  mode: FabiosMode;
  locale: FabiosLocale;
  page: FabiosPage;
}

/** The path on the client's domain: «/», «/sobre-nos», «/en/contact». */
export function fabiosDomainPath(locale: FabiosLocale, page: FabiosPage): string {
  const parts = slugs[locale][page];
  return parts.length ? `/${parts.join("/")}` : "/";
}

/** The link to a page from inside the site, in the given mode. */
export function fabiosHref(mode: FabiosMode, locale: FabiosLocale, page: FabiosPage): string {
  const path = fabiosDomainPath(locale, page);
  if (mode === "domain") return path;
  return path === "/" ? fabiosPreviewBase : `${fabiosPreviewBase}${path}`;
}

/** The address search engines should keep: always the client's own domain. */
export function fabiosCanonical(locale: FabiosLocale, page: FabiosPage): string {
  const path = fabiosDomainPath(locale, page);
  return path === "/" ? fabiosOrigin : `${fabiosOrigin}${path}`;
}

/** The catch-all segments of /fabios-roadstop/[[...path]] → the page, or null (404). */
export function resolveFabiosPath(segments: readonly string[] | undefined): FabiosRoute | null {
  let parts = (segments ?? []).map((part) => decodeURIComponent(part));
  let mode: FabiosMode = "preview";
  if (parts[0] === fabiosDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  const key = parts.join("/");
  for (const locale of fabiosLocales) {
    for (const page of fabiosPages) {
      if (slugs[locale][page].join("/") === key) return { mode, locale, page };
    }
  }
  return null;
}

/** Every page in both modes, for generateStaticParams. */
export function fabiosStaticParams(): { path: string[] }[] {
  return (["preview", "domain"] as const).flatMap((mode) =>
    fabiosLocales.flatMap((locale) =>
      fabiosPages.map((page) => ({
        path: [...(mode === "domain" ? [fabiosDomainSegment] : []), ...slugs[locale][page]],
      })),
    ),
  );
}

/** hreflang alternates of a page, on the client's domain. */
export function fabiosAlternates(page: FabiosPage): Record<string, string> {
  return {
    "pt-PT": fabiosCanonical("pt", page),
    en: fabiosCanonical("en", page),
    "x-default": fabiosCanonical("pt", page),
  };
}

export interface FabiosSitemapEntry {
  url: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}

/** The client's sitemap (served at /sitemap.xml on its own domain): only its pages, only on its domain. */
export function fabiosSitemapEntries(): FabiosSitemapEntry[] {
  return fabiosPages.flatMap((page) =>
    fabiosLocales.map((locale) => ({
      url: fabiosCanonical(locale, page),
      priority: page === "home" ? 1 : 0.6,
      alternates: { languages: fabiosAlternates(page) },
    })),
  );
}

/** robots.txt on the client's own domain. */
export function fabiosRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${fabiosOrigin}/sitemap.xml`, `Host: ${fabiosOrigin}`, ""].join("\n");
}
