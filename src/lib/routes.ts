// Relative imports with extensions keep this module runnable by `node --test` (tests/site-i18n.test.mjs).
import { docPages, getDocPageMeta } from "../content/doc-pages.ts";
import { getProduct, products } from "../content/products.ts";
import { sectorSlugs } from "../content/sector-slugs.ts";
import type { DocPageId, ProductId, SectorId } from "../content/types.ts";
import { defaultLocale, isPrefixedLocale, locales, localize, type Locale, type Localized } from "./i18n.ts";

export type StaticRouteKey =
  | "home"
  | "products"
  | "sectors"
  | "docs"
  | "book"
  | "requestInfo"
  | "about"
  | "contact"
  | "privacy"
  | "cookies"
  | "terms"
  | "cart";

export type Route =
  | { key: StaticRouteKey }
  | { key: "product"; productId: ProductId }
  | { key: "sector"; sectorId: SectorId }
  | { key: "doc"; productId: ProductId; pageId: DocPageId };

// Spanish, French, German and Italian use the English slugs (2026-10-20: /es/book-a-demo,
// /de/products/digital-menu, …). Any slug record may get its own `es: "…"` later: `slugIn` picks it up
// here, in the static params of app/(intl)/[lang] and in the language switch, with no other change.
export const staticSegments: Record<StaticRouteKey, Localized<string>> = {
  home: { pt: "", en: "" },
  products: { pt: "produtos", en: "products" },
  sectors: { pt: "setores", en: "sectors" },
  docs: { pt: "docs", en: "docs" },
  book: { pt: "agendar", en: "book-a-demo" },
  requestInfo: { pt: "pedir-informacao", en: "request-info" },
  about: { pt: "sobre", en: "about" },
  contact: { pt: "contacto", en: "contact" },
  privacy: { pt: "privacidade", en: "privacy" },
  cookies: { pt: "cookies", en: "cookies" },
  terms: { pt: "termos", en: "terms" },
  cart: { pt: "carrinho", en: "cart" },
};

/** A slug in `locale` (the English one until the record has its own). */
export function slugIn(slug: Localized<string>, locale: Locale): string {
  return localize(slug, locale);
}

function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

function join(locale: Locale, segments: string[]): string {
  const path = segments.filter(Boolean).join("/");
  const prefix = localePrefix(locale);
  if (!path) return prefix || "/";
  return `${prefix}/${path}`;
}

export function href(locale: Locale, route: Route): string {
  switch (route.key) {
    case "product":
      return join(locale, [slugIn(staticSegments.products, locale), slugIn(getProduct(route.productId).slug, locale)]);
    case "sector":
      return join(locale, [slugIn(staticSegments.sectors, locale), slugIn(sectorSlugs[route.sectorId], locale)]);
    case "doc":
      return join(locale, [
        slugIn(staticSegments.docs, locale),
        slugIn(getProduct(route.productId).slug, locale),
        slugIn(getDocPageMeta(route.pageId).slug, locale),
      ]);
    default:
      return join(locale, [slugIn(staticSegments[route.key], locale)]);
  }
}

/** The route's path in each of the six languages. */
export function localizedHrefs(route: Route): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, href(locale, route)])) as Record<Locale, string>;
}

export function routeFromPath(pathname: string): { locale: Locale; route: Route } | null {
  const parts = pathname.split("/").filter(Boolean);
  let locale: Locale = defaultLocale;
  if (parts[0] && isPrefixedLocale(parts[0])) {
    locale = parts[0];
    parts.shift();
  }
  if (parts.length === 0) return { locale, route: { key: "home" } };

  const [first, second, third] = parts;
  const staticKey = (Object.keys(staticSegments) as StaticRouteKey[]).find(
    (key) => key !== "home" && slugIn(staticSegments[key], locale) === first,
  );
  if (!staticKey) return null;

  if (staticKey === "products" && second) {
    const product = products.find((candidate) => slugIn(candidate.slug, locale) === second);
    return product ? { locale, route: { key: "product", productId: product.id } } : null;
  }
  if (staticKey === "sectors" && second) {
    const sectorId = (Object.keys(sectorSlugs) as SectorId[]).find((id) => slugIn(sectorSlugs[id], locale) === second);
    return sectorId ? { locale, route: { key: "sector", sectorId } } : null;
  }
  if (staticKey === "docs" && second) {
    const product = products.find((candidate) => slugIn(candidate.slug, locale) === second);
    const page = docPages.find((candidate) => slugIn(candidate.slug, locale) === (third ?? ""));
    if (!product) return null;
    return { locale, route: { key: "doc", productId: product.id, pageId: page?.id ?? "getting-started" } };
  }
  if (second) return null;
  return { locale, route: { key: staticKey } };
}

/** The same page in another language (the home when the path isn't a site page). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parsed = routeFromPath(pathname);
  if (!parsed) return href(target, { key: "home" });
  return href(target, parsed.route);
}

export const bookingProductParam = "produto";

export function bookingHref(locale: Locale, productId?: ProductId): string {
  const base = href(locale, { key: "book" });
  return productId ? `${base}?${bookingProductParam}=${productId}` : base;
}
