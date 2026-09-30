import Link from "next/link";
import type { Metadata } from "next";
import { pageLabels } from "@/content/page-labels";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import { ArrowRight } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Photo } from "@/components/media/Photo";
import { SectionHeader } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export function sectorsIndexMetadata(locale: Locale): Metadata {
  const labels = pageLabels[locale].sectors;
  return pageMetadata({ locale, route: { key: "sectors" }, title: labels.metaTitle, description: labels.metaDescription });
}

export function SectorsIndexPage({ locale }: { locale: Locale }) {
  const labels = pageLabels[locale];
  const t = ui[locale];
  return (
    <>
      <section aria-labelledby="sectors-title" className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page flex flex-col gap-8">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.sectors, path: href(locale, { key: "sectors" }) },
            ]}
          />
          <SectionHeader as="h1" id="sectors-title" eyebrow={labels.sectors.eyebrow} title={labels.sectors.title} lead={labels.sectors.lead} />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {sectors.map((sector, index) => {
              const copy = sector.copy[locale];
              return (
                <article key={sector.id} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 2) * 90}ms` }} className="card card-interactive group relative overflow-hidden">
                  <Photo id={sector.photo} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/9]" priority={index < 2} />
                  <div className="flex flex-col gap-3 p-7">
                    <h2 className="display text-3xl">
                      <Link href={href(locale, { key: "sector", sectorId: sector.id })} className="after:absolute after:inset-0">
                        {copy.name}
                      </Link>
                    </h2>
                    <p className="leading-relaxed text-muted">{copy.cardBody}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
                      {t.common.learnMore}
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
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
