import Link from "next/link";
import type { Metadata } from "next";
import { videos, type VideoId } from "@/content/media";
import { pageLabels } from "@/content/page-labels";
import { getProduct } from "@/content/products";
import { getSector, sectors } from "@/content/sectors";
import type { SectorId } from "@/content/types";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { AlertIcon, ArrowRight } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ProductCard } from "@/components/marketing/ProductCard";
import { LazyVideo } from "@/components/media/LazyVideo";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n";
import { faqJsonLd } from "@/lib/jsonld";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export function sectorMetadata(locale: Locale, sectorId: SectorId): Metadata {
  const copy = getSector(sectorId).copy[locale];
  return pageMetadata({ locale, route: { key: "sector", sectorId }, title: copy.metaTitle, description: copy.metaDescription });
}

const sectorVideos: Partial<Record<SectorId, VideoId>> = {
  restaurants: "cafe-barista",
  beauty: "salon-haircut",
};

export function SectorPage({ locale, sectorId }: { locale: Locale; sectorId: SectorId }) {
  const sector = getSector(sectorId);
  const copy = sector.copy[locale];
  const labels = pageLabels[locale];
  const t = ui[locale];
  const sectorHref = href(locale, { key: "sector", sectorId });
  const videoId = sectorVideos[sectorId];

  return (
    <>
      <JsonLd data={faqJsonLd(copy.faq)} />
      <section aria-labelledby="sector-title" className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.sectors, path: href(locale, { key: "sectors" }) },
              { name: copy.name, path: sectorHref },
            ]}
          />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col items-start gap-6">
              <p className="eyebrow">{copy.name}</p>
              <h1 id="sector-title" className="display text-[2.6rem] sm:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{copy.heroSubtitle}</p>
              <ButtonLink href={href(locale, { key: "book" })} size="lg">
                {t.common.bookDemo}
                <ArrowRight size={18} />
              </ButtonLink>
            </div>
            <Photo
              id={sector.photo}
              locale={locale}
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              className="aspect-[4/3] rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(var(--shadow-color)/0.5)]"
            />
          </div>
        </div>
      </section>

      <Section tone="soft" labelledBy="pains-title">
        <SectionHeader id="pains-title" eyebrow={labels.sectors.painsEyebrow} title={labels.sectors.painsTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {copy.pains.map((pain, index) => (
            <article key={pain.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="card flex flex-col gap-3 p-7">
              <AlertIcon size={22} className="text-danger" />
              <h3 className="text-lg font-semibold text-text">{pain.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{pain.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="bundle-title">
        <SectionHeader id="bundle-title" eyebrow={labels.sectors.bundleEyebrow} title={copy.bundleTitle} lead={copy.bundleBody} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sector.bundle.map((productId, index) => (
            <ProductCard key={productId} product={getProduct(productId)} locale={locale} revealDelay={index * 70} />
          ))}
        </div>
      </Section>

      <Section tone="soft" labelledBy="day-title">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <SectionHeader id="day-title" eyebrow={labels.sectors.dayEyebrow} title={labels.sectors.dayTitle} />
            <ol className="relative flex flex-col gap-8 border-l border-line-strong pl-8">
              {copy.dayInTheLife.map((moment, index) => (
                <li key={moment.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="relative">
                  <span aria-hidden="true" className="absolute top-1.5 -left-[2.4rem] h-3 w-3 rounded-full border-2 border-bg-soft bg-gold" />
                  <h3 className="font-semibold text-text">{moment.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{moment.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="overflow-hidden rounded-[2rem] border border-line lg:sticky lg:top-28">
            {videoId ? (
              <LazyVideo video={videos[videoId]} label={videos[videoId].alt[locale]} className="aspect-[4/5] h-auto w-full object-cover sm:aspect-video lg:aspect-[4/5]" />
            ) : (
              <Photo
                id={sectorId === "clinics" ? "reception-phone" : "retail"}
                locale={locale}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/5] sm:aspect-video lg:aspect-[4/5]"
              />
            )}
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <SectionHeader id="faq-title" eyebrow="FAQ" title={t.common.faqTitle} />
            <div data-reveal className="flex flex-col gap-2">
              <p className="eyebrow">{labels.sectors.otherSectors}</p>
              <ul className="flex flex-wrap gap-2">
                {sectors
                  .filter((other) => other.id !== sectorId)
                  .map((other) => (
                    <li key={other.id}>
                      <Link href={href(locale, { key: "sector", sectorId: other.id })} className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:border-line-strong hover:text-text">
                        {other.copy[locale].name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div data-reveal>
            <Faq items={copy.faq} />
          </div>
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
