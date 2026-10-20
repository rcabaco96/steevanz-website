import { locales, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";

/** «Quero um cartão assim» on the preview: the product page in each language. */
export function cardProductHrefs(): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, href(locale, { key: "product", productId: "business-card" })])) as Record<Locale, string>;
}
