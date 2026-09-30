import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { priceLabel } from "@/components/ui/Price";
import type { Locale } from "./i18n";
import { renderOgImage } from "./og";

export function productOgParams(locale: Locale) {
  return products.map((product) => ({ slug: product.slug[locale] }));
}

export async function renderProductOg(locale: Locale, slug: string) {
  const product = products.find((candidate) => candidate.slug[locale] === slug) ?? products[0];
  const copy = getProductCopy(product.id, locale);
  return renderOgImage({
    eyebrow: copy.name,
    title: copy.heroTitle,
    subtitle: copy.tagline,
    badge: priceLabel(product, locale),
  });
}
