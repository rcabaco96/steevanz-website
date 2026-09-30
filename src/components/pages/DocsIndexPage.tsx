import Link from "next/link";
import type { Metadata } from "next";
import { docPages } from "@/content/doc-pages";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { ui } from "@/content/ui";
import { ArrowRight, ProductGlyph } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { SectionHeader } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

const copy = {
  pt: {
    metaTitle: "Documentação e guias de utilização | Steevanz Docs",
    metaDescription: "Guias práticos para instalar, configurar e usar as placas NFC, reservas, lista de espera, chatbot, receção por voz e automações da Steevanz.",
    eyebrow: "Documentação",
    title: "Tudo o que precisa de saber, passo a passo.",
    lead: "Guias escritos para quem gere um negócio, não para engenheiros. Da colocação de uma placa NFC à configuração de um chatbot.",
    helpTitle: "Não encontrou o que procurava?",
    helpBody: "Escreva-nos. Respondemos por WhatsApp ou e-mail em dias úteis.",
  },
  en: {
    metaTitle: "Documentation and how-to guides | Steevanz Docs",
    metaDescription: "Practical guides to set up, configure and use Steevanz NFC plates, bookings, waiting lists, chatbot, voice receptionist and automations.",
    eyebrow: "Documentation",
    title: "Everything you need to know, step by step.",
    lead: "Guides written for people who run a business, not for engineers. From placing an NFC plate to configuring a chatbot.",
    helpTitle: "Couldn't find what you were looking for?",
    helpBody: "Write to us. We reply by WhatsApp or email on working days.",
  },
};

export function docsIndexMetadata(locale: Locale): Metadata {
  return pageMetadata({ locale, route: { key: "docs" }, title: copy[locale].metaTitle, description: copy[locale].metaDescription });
}

export function DocsIndexPage({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const text = copy[locale];
  return (
    <section aria-labelledby="docs-title" className="relative isolate overflow-hidden pt-24 pb-20 sm:pt-32">
      <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
      <div className="container-page flex flex-col gap-10">
        <Breadcrumbs
          label={t.common.breadcrumbHome}
          items={[
            { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
            { name: t.nav.docs, path: href(locale, { key: "docs" }) },
          ]}
        />
        <SectionHeader as="h1" id="docs-title" eyebrow={text.eyebrow} title={text.title} lead={text.lead} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const productCopy = getProductCopy(product.id, locale);
            return (
              <article key={product.id} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 3) * 80}ms` }} className="card flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-text">
                    <ProductGlyph icon={product.icon} size={20} />
                  </span>
                  <h2 className="text-lg font-semibold text-text">{productCopy.shortName}</h2>
                </div>
                <ul className="flex flex-col gap-1">
                  {docPages.map((page) => (
                    <li key={page.id}>
                      <Link
                        href={href(locale, { key: "doc", productId: product.id, pageId: page.id })}
                        className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-[0.95rem] text-muted transition-colors hover:bg-surface-2 hover:text-text"
                      >
                        {page.label[locale]}
                        <ArrowRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <div data-reveal className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-bg-soft p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">{text.helpTitle}</h2>
            <p className="text-muted">{text.helpBody}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a href={whatsappUrl(t.common.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-whatsapp px-5 py-2.5 text-[#0b2e17]">
              WhatsApp
            </a>
            <a href={`mailto:${site.email}`} className="rounded-full border border-line-strong px-5 py-2.5 text-text">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
