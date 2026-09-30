import Link from "next/link";
import type { Metadata } from "next";
import { pageLabels } from "@/content/page-labels";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, products, type ProductFamily } from "@/content/products";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight, ProductGlyph } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ProductCard } from "@/components/marketing/ProductCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, whatsappUrl } from "@/lib/site";

export function productsIndexMetadata(locale: Locale): Metadata {
  const labels = pageLabels[locale].products;
  return pageMetadata({ locale, route: { key: "products" }, title: labels.metaTitle, description: labels.metaDescription });
}

const families: ProductFamily[] = ["nfc", "operations", "ai"];

export function ProductsIndexPage({ locale }: { locale: Locale }) {
  const labels = pageLabels[locale];
  const t = ui[locale];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getProductCopy(product.id, locale).name,
      url: absoluteUrl(href(locale, { key: "product", productId: product.id })),
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <section aria-labelledby="products-title" className="relative isolate overflow-hidden pt-24 pb-10 sm:pt-32">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page flex flex-col gap-8">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.products, path: href(locale, { key: "products" }) },
            ]}
          />
          <SectionHeader as="h1" id="products-title" eyebrow={labels.products.eyebrow} title={labels.products.title} lead={labels.products.lead} />
          <nav aria-label={t.nav.products} className="flex flex-wrap gap-2">
            {families.map((family) => (
              <a key={family} href={`#${family}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-line-strong hover:text-text">
                {labels.product.family[family]}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {families.map((family, familyIndex) => (
        <Section key={family} id={family} tone={familyIndex % 2 === 1 ? "soft" : "default"} labelledBy={`family-${family}`} className="py-14! sm:py-20!">
          <div className="flex flex-col gap-2" data-reveal>
            <h2 id={`family-${family}`} className="display text-3xl sm:text-4xl">
              {labels.product.family[family]}
            </h2>
            <p className="max-w-2xl text-muted">{labels.products.familyLeads[family]}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((product) => product.family === family)
              .map((product, index) => (
                <ProductCard key={product.id} product={product} locale={locale} revealDelay={index * 80} />
              ))}
          </div>
        </Section>
      ))}

      <Section labelledBy="bundles-title">
        <SectionHeader id="bundles-title" eyebrow={labels.products.bundlesEyebrow} title={labels.products.bundlesTitle} lead={labels.products.bundlesLead} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sectors.map((sector, index) => {
            const copy = sector.copy[locale];
            return (
              <article key={sector.id} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 2) * 90}ms` }} className="card flex flex-col gap-5 p-7">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-text">{copy.bundleTitle}</h3>
                  <p className="text-[0.95rem] leading-relaxed text-muted">{copy.bundleBody}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {sector.bundle.map((productId) => {
                    const product = getProduct(productId);
                    return (
                      <li key={productId}>
                        <Link
                          href={href(locale, { key: "product", productId })}
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-text transition-opacity hover:opacity-80"
                        >
                          <ProductGlyph icon={product.icon} size={14} />
                          {getProductCopy(productId, locale).shortName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link href={href(locale, { key: "sector", sectorId: sector.id })} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-accent-text">
                  {copy.name} <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <CtaBand
        eyebrow={labels.product.ctaEyebrow}
        title={labels.product.ctaTitle}
        body={labels.product.ctaBody}
        primaryLabel={t.common.bookDemo}
        primaryHref={href(locale, { key: "book" })}
        secondaryLabel={t.common.whatsapp}
        secondaryHref={whatsappUrl(t.common.whatsappMessage)}
      />
    </>
  );
}
