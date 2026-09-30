import Link from "next/link";
import type { Metadata } from "next";
import { docPages, getDocPageMeta } from "@/content/doc-pages";
import { getDocPage } from "@/content/docs";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, products } from "@/content/products";
import type { DocBlock, DocPageId, ProductId } from "@/content/types";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { DocBlocks } from "@/components/docs/DocBlocks";
import { ArrowLeft, ArrowRight, ChevronDown, ProductGlyph } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";
import { faqJsonLd, howToJsonLd } from "@/lib/jsonld";
import { bookingHref, href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const docsLabels = {
  pt: {
    navLabel: "Navegação da documentação",
    browse: "Explorar a documentação",
    needHelp: "Precisa de ajuda?",
    needHelpBody: "A nossa equipa responde por WhatsApp e e-mail em dias úteis.",
    contact: "Falar connosco",
    productPage: "Ver o produto",
  },
  en: {
    navLabel: "Documentation navigation",
    browse: "Browse the docs",
    needHelp: "Need help?",
    needHelpBody: "Our team answers by WhatsApp and email on working days.",
    contact: "Contact us",
    productPage: "View the product",
  },
};

export function docMetadata(locale: Locale, productId: ProductId, pageId: DocPageId): Metadata {
  const page = getDocPage(productId, pageId)[locale];
  const productName = getProductCopy(productId, locale).shortName;
  return pageMetadata({
    locale,
    route: { key: "doc", productId, pageId },
    title: `${page.title} · ${productName} | Steevanz Docs`,
    description: page.description,
    type: "article",
  });
}

function tableOfContents(blocks: DocBlock[]) {
  return blocks.flatMap((block) =>
    block.type === "h2" || block.type === "h3" ? [{ id: block.id, text: block.text, level: block.type }] : [],
  );
}

function DocsSidebar({ locale, productId, pageId }: { locale: Locale; productId: ProductId; pageId: DocPageId }) {
  return (
    <ul className="flex flex-col gap-1 text-[0.92rem]">
      {products.map((product) => {
        const isCurrentProduct = product.id === productId;
        return (
          <li key={product.id}>
            <details open={isCurrentProduct} className="group/doc">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-lg px-2 py-2 font-medium text-text hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                <ProductGlyph icon={product.icon} size={16} className="shrink-0 text-accent-text" />
                <span className="flex-1">{getProductCopy(product.id, locale).shortName}</span>
                <ChevronDown size={14} className="text-subtle transition-transform group-open/doc:rotate-180" />
              </summary>
              <ul className="mt-1 mb-2 ml-4 flex flex-col border-l border-line pl-3">
                {docPages.map((page) => {
                  const isCurrent = isCurrentProduct && page.id === pageId;
                  return (
                    <li key={page.id}>
                      <Link
                        href={href(locale, { key: "doc", productId: product.id, pageId: page.id })}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`block rounded-md px-2 py-1.5 transition-colors ${
                          isCurrent ? "bg-accent-soft font-semibold text-accent-text" : "text-muted hover:text-text"
                        }`}
                      >
                        {page.label[locale]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

export function DocPage({ locale, productId, pageId }: { locale: Locale; productId: ProductId; pageId: DocPageId }) {
  const t = ui[locale];
  const labels = docsLabels[locale];
  const product = getProduct(productId);
  const productCopy = getProductCopy(productId, locale);
  const page = getDocPage(productId, pageId)[locale];
  const pageMeta = getDocPageMeta(pageId);
  const path = href(locale, { key: "doc", productId, pageId });
  const toc = tableOfContents(page.blocks);
  const pageIndex = docPages.findIndex((candidate) => candidate.id === pageId);
  const previous = pageIndex > 0 ? docPages[pageIndex - 1] : null;
  const next = pageIndex < docPages.length - 1 ? docPages[pageIndex + 1] : null;

  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: page.title,
      description: page.description,
      inLanguage: locale === "pt" ? "pt-PT" : "en",
      about: productCopy.name,
      publisher: { "@type": "Organization", name: "Steevanz" },
    },
  ];
  const firstSteps = page.blocks.find((block) => block.type === "steps");
  if (firstSteps && firstSteps.type === "steps") {
    structuredData.push(howToJsonLd({ name: page.title, description: page.description, path, steps: firstSteps.items }));
  }
  const faqItems = page.blocks.flatMap((block) => (block.type === "faq" ? block.items : []));
  if (faqItems.length > 0) structuredData.push(faqJsonLd(faqItems));

  return (
    <div className="container-page pt-24 pb-20 sm:pt-28">
      <JsonLd data={structuredData} />
      <div className="grid gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[15.5rem_minmax(0,1fr)_13rem]">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
          <details className="card group/nav p-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1 font-semibold text-text [&::-webkit-details-marker]:hidden">
              {labels.browse}
              <ChevronDown size={16} className="transition-transform group-open/nav:rotate-180" />
            </summary>
            <nav aria-label={labels.navLabel} className="mt-3">
              <DocsSidebar locale={locale} productId={productId} pageId={pageId} />
            </nav>
          </details>
          <nav aria-label={labels.navLabel} className="hidden lg:block">
            <DocsSidebar locale={locale} productId={productId} pageId={pageId} />
          </nav>
        </aside>

        <article className="min-w-0">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.nav.docs, path: href(locale, { key: "docs" }) },
              { name: productCopy.shortName, path: href(locale, { key: "doc", productId, pageId: "getting-started" }) },
              { name: pageMeta.label[locale], path },
            ]}
          />
          <header className="mt-6 border-b border-line pb-8">
            <p className="eyebrow flex items-center gap-2">
              <ProductGlyph icon={product.icon} size={14} />
              {productCopy.shortName}
            </p>
            <h1 className="display mt-3 text-4xl sm:text-5xl">{page.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{page.description}</p>
          </header>

          {toc.length > 0 ? (
            <details className="card group/toc mt-6 p-4 xl:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text [&::-webkit-details-marker]:hidden">
                {t.common.onThisPage}
                <ChevronDown size={16} className="transition-transform group-open/toc:rotate-180" />
              </summary>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                {toc.map((entry) => (
                  <li key={entry.id} className={entry.level === "h3" ? "pl-4" : ""}>
                    <a href={`#${entry.id}`} className="text-muted hover:text-text">
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <div className="mt-8 max-w-3xl">
            <DocBlocks blocks={page.blocks} />
          </div>

          <nav aria-label={`${t.common.previous} / ${t.common.next}`} className="mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
            {previous ? (
              <Link href={href(locale, { key: "doc", productId, pageId: previous.id })} className="card card-interactive flex flex-col gap-1 p-5">
                <span className="flex items-center gap-1.5 text-sm text-subtle">
                  <ArrowLeft size={14} /> {t.common.previous}
                </span>
                <span className="font-semibold text-text">{previous.label[locale]}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={href(locale, { key: "doc", productId, pageId: next.id })} className="card card-interactive flex flex-col items-end gap-1 p-5 text-right">
                <span className="flex items-center gap-1.5 text-sm text-subtle">
                  {t.common.next} <ArrowRight size={14} />
                </span>
                <span className="font-semibold text-text">{next.label[locale]}</span>
              </Link>
            ) : null}
          </nav>

          <div className="mt-10 flex max-w-3xl flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-bg-soft p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-text">{labels.needHelp}</p>
              <p className="text-sm text-muted">{labels.needHelpBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={href(locale, { key: "product", productId })} variant="secondary" size="sm">
                {labels.productPage}
              </ButtonLink>
              <ButtonLink href={bookingHref(locale, productId)} size="sm">
                {t.common.bookDemo}
              </ButtonLink>
            </div>
          </div>
        </article>

        {toc.length > 0 ? (
          <aside className="hidden xl:block">
            <nav aria-label={t.common.onThisPage} className="sticky top-24">
              <p className="eyebrow mb-3">{t.common.onThisPage}</p>
              <ul className="flex flex-col gap-2 border-l border-line pl-4 text-sm">
                {toc.map((entry) => (
                  <li key={entry.id} className={entry.level === "h3" ? "pl-3" : ""}>
                    <a href={`#${entry.id}`} className="text-muted transition-colors hover:text-text">
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
