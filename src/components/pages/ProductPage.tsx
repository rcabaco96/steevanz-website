import Link from "next/link";
import type { Metadata } from "next";
import { photos } from "@/content/media";
import { getProductCopy } from "@/content/product-copy";
import { pageLabels } from "@/content/page-labels";
import { getProduct, type Product } from "@/content/products";
import { getSector } from "@/content/sectors";
import type { ProductId } from "@/content/types";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { cartCopy } from "@/content/cart";
import { AlertIcon, ArrowRight, Check, ProductGlyph } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ProductCard } from "@/components/marketing/ProductCard";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Price } from "@/components/ui/Price";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProductVisual } from "@/components/visuals/ProductVisual";
import type { Locale } from "@/lib/i18n";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";
import { bookingHref, href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export function productMetadata(locale: Locale, productId: ProductId): Metadata {
  const copy = getProductCopy(productId, locale);
  return pageMetadata({
    locale,
    route: { key: "product", productId },
    title: copy.metaTitle,
    description: copy.metaDescription,
    image: `/og/${locale}/${productId}`,
  });
}

export function requestInfoHref(locale: Locale, productId: ProductId): string {
  return `${href(locale, { key: "requestInfo" })}?produto=${productId}`;
}

export function ProductPage({ locale, productId }: { locale: Locale; productId: ProductId }) {
  const product: Product = getProduct(productId);
  const copy = getProductCopy(productId, locale);
  const labels = pageLabels[locale].product;
  const t = ui[locale];
  const productHref = href(locale, { key: "product", productId });
  const bookHref = bookingHref(locale, productId);
  const schemaImage = product.contextPhoto ? photos[product.contextPhoto].src : "/icon.svg";
  const cartHref = href(locale, { key: "cart" });
  const cartLabels = { add: cartCopy[locale].add, inCart: cartCopy[locale].inCart, added: cartCopy[locale].addedAnnouncement };

  return (
    <>
      <JsonLd
        data={[
          productJsonLd({ locale, product, name: copy.name, description: copy.metaDescription, image: schemaImage }),
          faqJsonLd(copy.faq),
        ]}
      />

      <section aria-labelledby="product-title" className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.products, path: href(locale, { key: "products" }) },
              { name: copy.shortName, path: productHref },
            ]}
          />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col items-start gap-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-sm font-medium text-muted">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text">
                  <ProductGlyph icon={product.icon} size={14} />
                </span>
                {copy.name}
              </p>
              <h1 id="product-title" className="display text-[2.6rem] sm:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{copy.heroSubtitle}</p>
              <Price product={product} locale={locale} showQualifier />
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <ButtonLink href={bookHref} size="lg">
                  {t.common.bookDemo}
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover/button:translate-x-1" />
                </ButtonLink>
                <AddToCartButton productId={productId} cartHref={cartHref} labels={cartLabels} />
                <ButtonLink href={requestInfoHref(locale, productId)} variant="ghost" size="lg">
                  {t.common.requestInfo}
                </ButtonLink>
              </div>
              {product.customization ? <p className="-mt-2 text-sm text-subtle">{cartCopy[locale].customize.productHint}</p> : null}
            </div>
            <ProductVisual product={product} locale={locale} />
          </div>
        </div>
      </section>

      <Section tone="soft" labelledBy="problem-title">
        <div className="grid gap-6 lg:grid-cols-2">
          <article data-reveal className="card flex flex-col gap-5 p-7 sm:p-10">
            <p className="eyebrow">{labels.problemEyebrow}</p>
            <h2 id="problem-title" className="display text-3xl sm:text-4xl">
              {copy.problem.title}
            </h2>
            <p className="leading-relaxed text-muted">{copy.problem.body}</p>
            <ul className="flex flex-col gap-3">
              {copy.problem.points.map((point) => (
                <li key={point} className="flex gap-3 text-[0.95rem] text-muted">
                  <AlertIcon size={18} className="mt-0.5 shrink-0 text-danger" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
          <article data-reveal style={{ ["--reveal-delay" as string]: "120ms" }} className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-surface-inverse p-7 text-inverse sm:p-10">
            <p className="font-mono text-xs tracking-[0.16em] text-gold uppercase">{labels.solutionEyebrow}</p>
            <h2 className="display text-3xl sm:text-4xl">{copy.solution.title}</h2>
            <p className="leading-relaxed opacity-80">{copy.solution.body}</p>
            <ul className="flex flex-col gap-3">
              {copy.solution.points.map((point) => (
                <li key={point} className="flex gap-3 text-[0.95rem]">
                  <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span className="opacity-90">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section labelledBy="how-title">
        <SectionHeader id="how-title" eyebrow={labels.howEyebrow} title={labels.howTitle} />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step, index) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="card flex flex-col gap-3 p-6">
              <span className="font-mono text-sm font-medium text-accent-text">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold text-text">{step.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft" labelledBy="features-title">
        <SectionHeader id="features-title" eyebrow={labels.featuresEyebrow} title={labels.featuresTitle} />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {copy.features.map((feature, index) => (
            <div key={feature.title} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 3) * 80}ms` }} className="flex flex-col gap-2 border-t border-line-strong pt-5">
              <h3 className="text-lg font-semibold text-text">{feature.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {product.contextPhoto ? (
        <div className="container-page">
          <Photo
            id={product.contextPhoto}
            locale={locale}
            sizes="(min-width: 1216px) 1152px, 100vw"
            parallax
            className="aspect-[16/9] rounded-[2rem] sm:aspect-[21/9]"
          />
        </div>
      ) : null}

      <Section labelledBy="usecases-title">
        <SectionHeader id="usecases-title" eyebrow={labels.useCasesEyebrow} title={labels.useCasesTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {copy.useCases.map((useCase, index) => (
            <article key={useCase.title} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 2) * 90}ms` }} className="card flex flex-col gap-3 p-7">
              <Link href={href(locale, { key: "sector", sectorId: useCase.sector })} className="eyebrow w-fit hover:underline">
                {getSector(useCase.sector).copy[locale].name}
              </Link>
              <h3 className="text-xl font-semibold text-text">{useCase.title}</h3>
              <p className="leading-relaxed text-muted">{useCase.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="soft" labelledBy="pricing-title">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div data-reveal className="card p-7 sm:p-10">
            <h2 className="display text-3xl">{labels.includesTitle}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-muted">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "120ms" }} className="card flex flex-col gap-5 border-accent/30 p-7 sm:p-10">
            <h2 id="pricing-title" className="eyebrow">
              {labels.priceTitle}
            </h2>
            <Price product={product} locale={locale} size="lg" showQualifier />
            <p className="text-sm text-muted">{labels.priceNote}</p>
            <ButtonLink href={bookHref} size="lg" className="w-full">
              {t.common.bookDemo}
            </ButtonLink>
            <AddToCartButton productId={productId} cartHref={cartHref} labels={cartLabels} className="w-full" />
            <p className="text-center text-sm text-muted">
              {labels.requestInfoLead}{" "}
              <Link href={requestInfoHref(locale, productId)} className="font-semibold text-accent-text underline underline-offset-4">
                {labels.requestInfoCta}
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <SectionHeader id="faq-title" eyebrow="FAQ" title={t.common.faqTitle} />
            <Link
              data-reveal
              href={href(locale, { key: "doc", productId, pageId: "getting-started" })}
              className="card card-interactive flex flex-col gap-2 p-6"
            >
              <span className="font-semibold text-text">{labels.docsTitle}</span>
              <span className="text-sm text-muted">{labels.docsBody}</span>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
                {t.common.readDocs} <ArrowRight size={16} />
              </span>
            </Link>
          </div>
          <div data-reveal>
            <Faq items={copy.faq} />
          </div>
        </div>
      </Section>

      <Section tone="soft" labelledBy="related-title">
        <SectionHeader id="related-title" title={t.common.relatedProducts} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {product.related.map((relatedId, index) => (
            <ProductCard key={relatedId} product={getProduct(relatedId)} locale={locale} revealDelay={index * 80} />
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow={labels.ctaEyebrow}
        title={labels.ctaTitle}
        body={labels.ctaBody}
        primaryLabel={t.common.bookDemo}
        primaryHref={bookHref}
        secondaryLabel={t.common.whatsapp}
        secondaryHref={whatsappUrl(t.common.whatsappMessage)}
      />
    </>
  );
}
