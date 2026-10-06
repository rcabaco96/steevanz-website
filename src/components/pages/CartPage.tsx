import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CartView, type CartCatalogItem } from "@/components/cart/CartView";
import { otherSectorValue } from "@/lib/booking/schema";
import { priceLabel } from "@/components/ui/Price";
import { infoRequestCopy } from "@/content/booking";
import { cartCopy } from "@/content/cart";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export function cartMetadata(locale: Locale): Metadata {
  const copy = cartCopy[locale];
  return pageMetadata({ locale, route: { key: "cart" }, title: copy.metaTitle, description: copy.metaDescription, absoluteTitle: true, noIndex: true });
}

export function CartPage({ locale }: { locale: Locale }) {
  const copy = cartCopy[locale];
  const formCopy = infoRequestCopy[locale].form;
  const catalog: CartCatalogItem[] = products.map((product) => {
    const productCopy = getProductCopy(product.id, locale);
    return {
      id: product.id,
      name: productCopy.name,
      shortName: productCopy.shortName,
      qualifier: product.priceQualifier[locale],
      billingLabel: `${priceLabel(product, locale)} · ${ui[locale].billing[product.priceBilling]}`,
      href: href(locale, { key: "product", productId: product.id }),
      icon: product.icon,
      customization: product.customization
        ? {
            formats: product.customization.formats.map((format) => ({ value: format.id, label: format.label[locale] })),
            logoExtraCents: product.customization.logoExtra * 100,
            logoExtraPer: product.customization.logoExtraPer,
            textMaxLength: product.customization.textMaxLength,
          }
        : undefined,
      packs: product.packs?.map((pack) => ({ quantity: pack.quantity, unitCents: pack.unitPrice * 100 })),
    };
  });
  const sectorOptions = [
    ...sectors.map((sector) => ({ value: sector.id, label: sector.copy[locale].name })),
    { value: otherSectorValue, label: formCopy.sectorOther },
  ];

  return (
    <div className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div aria-hidden="true" className="glow-backdrop absolute inset-x-0 top-0 -z-10 h-[40rem]" />
      <div className="container-page flex flex-col gap-10 sm:gap-14">
        <div className="flex max-w-3xl flex-col gap-5">
          <p data-reveal className="eyebrow">
            {copy.eyebrow}
          </p>
          <h1 data-reveal style={{ "--reveal-delay": "60ms" } as CSSProperties} className="display text-[2.4rem] sm:text-6xl">
            {copy.title}
          </h1>
          <p data-reveal style={{ "--reveal-delay": "120ms" } as CSSProperties} className="max-w-2xl text-lg leading-relaxed text-muted">
            {copy.lead}
          </p>
        </div>
        <CartView
          locale={locale}
          copy={copy}
          formCopy={formCopy}
          catalog={catalog}
          sectors={sectorOptions}
          links={{
            privacy: href(locale, { key: "privacy" }),
            products: href(locale, { key: "products" }),
            home: href(locale, { key: "home" }),
            signIn: `/conta/entrar?next=${encodeURIComponent(href(locale, { key: "cart" }))}`,
          }}
        />
      </div>
    </div>
  );
}
