import { docPages, getDocPageMeta } from "@/content/doc-pages";
import { getProduct, products } from "@/content/products";
import { sectorSlugs } from "@/content/sector-slugs";
import type { DocPageId, ProductId, SectorId } from "@/content/types";
import { defaultLocale, type Locale, type Localized } from "./i18n";

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

const staticSegments: Record<StaticRouteKey, Localized<string>> = {
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
      return join(locale, [staticSegments.products[locale], getProduct(route.productId).slug[locale]]);
    case "sector":
      return join(locale, [staticSegments.sectors[locale], sectorSlugs[route.sectorId][locale]]);
    case "doc":
      return join(locale, [
        staticSegments.docs[locale],
        getProduct(route.productId).slug[locale],
        getDocPageMeta(route.pageId).slug[locale],
      ]);
    default:
      return join(locale, [staticSegments[route.key][locale]]);
  }
}

export function localizedHrefs(route: Route): Localized<string> {
  return { pt: href("pt", route), en: href("en", route) };
}

export function routeFromPath(pathname: string): { locale: Locale; route: Route } | null {
  const parts = pathname.split("/").filter(Boolean);
  let locale: Locale = "pt";
  if (parts[0] === "en") {
    locale = "en";
    parts.shift();
  }
  if (parts.length === 0) return { locale, route: { key: "home" } };

  const [first, second, third] = parts;
  const staticKey = (Object.keys(staticSegments) as StaticRouteKey[]).find(
    (key) => key !== "home" && staticSegments[key][locale] === first,
  );
  if (!staticKey) return null;

  if (staticKey === "products" && second) {
    const product = products.find((candidate) => candidate.slug[locale] === second);
    return product ? { locale, route: { key: "product", productId: product.id } } : null;
  }
  if (staticKey === "sectors" && second) {
    const sectorId = (Object.keys(sectorSlugs) as SectorId[]).find((id) => sectorSlugs[id][locale] === second);
    return sectorId ? { locale, route: { key: "sector", sectorId } } : null;
  }
  if (staticKey === "docs" && second) {
    const product = products.find((candidate) => candidate.slug[locale] === second);
    const page = docPages.find((candidate) => candidate.slug[locale] === (third ?? ""));
    if (!product) return null;
    return { locale, route: { key: "doc", productId: product.id, pageId: page?.id ?? "getting-started" } };
  }
  if (second) return null;
  return { locale, route: { key: staticKey } };
}

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
