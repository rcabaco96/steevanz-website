import { getProductCopy } from "@/content/product-copy";
import { getProduct, isProductId, productIds } from "@/content/products";
import { priceLabel } from "@/components/ui/Price";
import { isLocale, locales } from "@/lib/i18n";
import { renderOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => productIds.map((product) => ({ locale, product })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; product: string }> }) {
  const { locale: rawLocale, product: rawProduct } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "pt";
  const productId = isProductId(rawProduct) ? rawProduct : "nfc-google-reviews";
  const copy = getProductCopy(productId, locale);
  return renderOgImage({
    eyebrow: copy.name,
    title: copy.heroTitle,
    subtitle: copy.tagline,
    badge: priceLabel(getProduct(productId), locale),
  });
}
