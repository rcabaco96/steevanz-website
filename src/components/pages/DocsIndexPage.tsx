import Link from "next/link";
import type { Metadata } from "next";
import { docPages } from "@/content/doc-pages";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { ui } from "@/content/ui";
import { ArrowRight, ProductGlyph } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { SectionHeader } from "@/components/ui/Section";
import { localize, type Locale, type Localized } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

const copy = {
  pt: {
    metaTitle: "Documentação e guias de utilização | Steevanz Docs",
    metaDescription: "Guias práticos para instalar, configurar e usar as placas, reservas, lista de espera, chatbot, receção por voz e automações da Steevanz.",
    eyebrow: "Documentação",
    title: "Tudo o que precisa de saber, passo a passo.",
    lead: "Guias escritos para quem gere um negócio, não para engenheiros. Da colocação de uma placa à configuração de um chatbot.",
    helpTitle: "Não encontrou o que procurava?",
    helpBody: "Escreva-nos. Respondemos por WhatsApp ou e-mail em dias úteis.",
  },
  en: {
    metaTitle: "Documentation and how-to guides | Steevanz Docs",
    metaDescription: "Practical guides to set up, configure and use Steevanz plates, bookings, waiting lists, chatbot, voice receptionist and automations.",
    eyebrow: "Documentation",
    title: "Everything you need to know, step by step.",
    lead: "Guides written for people who run a business, not for engineers. From placing a plate to configuring a chatbot.",
    helpTitle: "Couldn't find what you were looking for?",
    helpBody: "Write to us. We reply by WhatsApp or email on working days.",
  },
  es: {
    metaTitle: "Documentación y guías de uso | Steevanz Docs",
    metaDescription: "Guías prácticas para instalar, configurar y usar las placas, las reservas, la lista de espera, el chatbot, la recepción por voz y las automatizaciones de Steevanz.",
    eyebrow: "Documentación",
    title: "Todo lo que necesita saber, paso a paso.",
    lead: "Guías escritas para quien gestiona un negocio, no para ingenieros. Desde colocar una placa hasta configurar un chatbot.",
    helpTitle: "¿No ha encontrado lo que buscaba?",
    helpBody: "Escríbanos. Respondemos por WhatsApp o correo electrónico en días laborables.",
  },
  fr: {
    metaTitle: "Documentation et guides d'utilisation | Steevanz Docs",
    metaDescription: "Des guides pratiques pour installer, configurer et utiliser les plaques, les réservations, la liste d'attente, le chatbot, l'accueil vocal et les automatisations Steevanz.",
    eyebrow: "Documentation",
    title: "Tout ce que vous devez savoir, étape par étape.",
    lead: "Des guides écrits pour ceux qui gèrent une entreprise, pas pour des ingénieurs. De la pose d'une plaque à la configuration d'un chatbot.",
    helpTitle: "Vous n'avez pas trouvé ce que vous cherchiez ?",
    helpBody: "Écrivez-nous. Nous répondons par WhatsApp ou par e-mail les jours ouvrés.",
  },
  de: {
    metaTitle: "Dokumentation und Anleitungen | Steevanz Docs",
    metaDescription: "Praktische Anleitungen zum Einrichten, Konfigurieren und Nutzen der Steevanz-Schilder, Reservierungen, Warteliste, des Chatbots, des KI-Telefons und der Automatisierungen.",
    eyebrow: "Dokumentation",
    title: "Alles, was Sie wissen müssen, Schritt für Schritt.",
    lead: "Anleitungen für Menschen, die ein Geschäft führen, nicht für Ingenieure. Vom Aufstellen eines Schildes bis zur Einrichtung eines Chatbots.",
    helpTitle: "Nicht gefunden, was Sie gesucht haben?",
    helpBody: "Schreiben Sie uns. Wir antworten werktags per WhatsApp oder E-Mail.",
  },
  it: {
    metaTitle: "Documentazione e guide all'uso | Steevanz Docs",
    metaDescription: "Guide pratiche per installare, configurare e usare le targhe, le prenotazioni, la lista d'attesa, il chatbot, la reception vocale e le automazioni Steevanz.",
    eyebrow: "Documentazione",
    title: "Tutto ciò che Le serve sapere, passo dopo passo.",
    lead: "Guide scritte per chi gestisce un'attività, non per ingegneri. Dal posizionamento di una targa alla configurazione di un chatbot.",
    helpTitle: "Non ha trovato ciò che cercava?",
    helpBody: "Ci scriva. Rispondiamo via WhatsApp o e-mail nei giorni feriali.",
  },
} satisfies Localized<{ metaTitle: string; metaDescription: string; eyebrow: string; title: string; lead: string; helpTitle: string; helpBody: string }>;

export function docsIndexMetadata(locale: Locale): Metadata {
  return pageMetadata({ locale, route: { key: "docs" }, title: localize(copy, locale).metaTitle, description: localize(copy, locale).metaDescription });
}

export function DocsIndexPage({ locale }: { locale: Locale }) {
  const t = localize(ui, locale);
  const text = localize(copy, locale);
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
                        {localize(page.label, locale)}
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
            <a href={whatsappUrl(t.common.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent px-5 py-2.5 text-accent-contrast">
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
