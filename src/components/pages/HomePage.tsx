import Link from "next/link";
import type { Metadata } from "next";
import { homeCopy } from "@/content/home";
import { videos } from "@/content/media";
import { flagshipProduct, products } from "@/content/products";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight, Check, ProductGlyph } from "@/components/icons";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Marquee } from "@/components/marketing/Marquee";
import { ProductCard } from "@/components/marketing/ProductCard";
import { LazyVideo } from "@/components/media/LazyVideo";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { formatEuro } from "@/components/ui/Price";
import { Section, SectionHeader } from "@/components/ui/Section";
import { HeroTapScene } from "@/components/visuals/HeroTapScene";
import { NfcPlate, type PlateVariant } from "@/components/visuals/NfcPlate";
import type { Locale } from "@/lib/i18n";
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { bookingHref, href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export function homeMetadata(locale: Locale): Metadata {
  const copy = homeCopy[locale];
  return pageMetadata({
    locale,
    route: { key: "home" },
    title: copy.metaTitle,
    description: copy.metaDescription,
    absoluteTitle: true,
  });
}

const formatVariants: PlateVariant[] = ["stand", "square", "sticker", "wall"];

export function HomePage({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  const t = ui[locale];
  const bookHref = href(locale, { key: "book" });
  const flagshipHref = href(locale, { key: "product", productId: flagshipProduct.id });

  return (
    <>
      <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale), faqJsonLd(copy.faq.items)]} />

      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div aria-hidden="true" className="dot-grid absolute inset-x-0 top-0 -z-10 h-[70%] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div className="flex flex-col items-start gap-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-sm font-medium text-muted backdrop-blur">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-contrast">
                <ProductGlyph icon="star-tap" size={12} />
              </span>
              {copy.hero.eyebrow}
            </p>
            <h1 id="hero-title" className="display text-[2.9rem] sm:text-6xl lg:text-[4.6rem]">
              {copy.hero.titleLead}{" "}
              <em className="text-accent-text italic">{copy.hero.titleEmphasis}</em>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{copy.hero.subtitle}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href={bookingHref(locale, flagshipProduct.id)} size="lg">
                {copy.hero.primaryCta}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover/button:translate-x-1" />
              </ButtonLink>
              <ButtonLink href={flagshipHref} variant="secondary" size="lg">
                {copy.hero.secondaryCta}
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {copy.hero.trust.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-success" />
                  {item}
                </li>
              ))}
              <li className="inline-flex items-center gap-1.5 font-semibold text-text">
                {copy.hero.priceChip} {formatEuro(flagshipProduct.priceFrom, locale)}
              </li>
            </ul>
          </div>
          <HeroTapScene copy={copy.scene} />
        </div>
      </section>

      <Marquee items={copy.marquee} />

      <Section id="produtos" labelledBy="products-title">
        <SectionHeader id="products-title" eyebrow={copy.products.eyebrow} title={copy.products.title} lead={copy.products.lead} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} locale={locale} revealDelay={(index % 3) * 80} />
          ))}
        </div>
      </Section>

      <Section tone="soft" labelledBy="flagship-title" className="overflow-hidden">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <SectionHeader id="flagship-title" eyebrow={copy.flagship.eyebrow} title={copy.flagship.title} lead={copy.flagship.lead} />
            <ul className="grid gap-5 sm:grid-cols-2">
              {copy.flagship.points.map((point, index) => (
                <li key={point.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 70}ms` }} className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 font-semibold text-text">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent-text">
                      <Check size={14} />
                    </span>
                    {point.title}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-muted">{point.body}</span>
                </li>
              ))}
            </ul>
            <div data-reveal>
              <ButtonLink href={flagshipHref} variant="secondary">
                {copy.flagship.cta}
                <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div data-reveal className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-inverse">
              <LazyVideo video={videos["phone-tap"]} label={copy.flagship.videoAlt} className="aspect-video h-auto w-full object-cover opacity-90" />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-black/55 px-4 py-3 text-sm text-white backdrop-blur-md">
                <ProductGlyph icon="star-tap" size={18} />
                {copy.scene.chipTap}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">{copy.flagship.formatsTitle}</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {copy.flagship.formats.map((format, index) => (
                  <li
                    key={format.name}
                    data-reveal
                    style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}
                    className="card flex flex-col items-center gap-3 p-4 text-center"
                  >
                    <NfcPlate
                      variant={formatVariants[index]}
                      finish={index % 2 === 0 ? "black" : "white"}
                      line1={copy.scene.plateLine1}
                      line2={copy.scene.plateLine2}
                      className="h-28 w-auto"
                    />
                    <span className="text-sm font-semibold text-text">{format.name}</span>
                    <span className="text-xs leading-snug text-subtle">{format.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="how-title">
        <SectionHeader id="how-title" eyebrow={copy.howItWorks.eyebrow} title={copy.howItWorks.title} lead={copy.howItWorks.lead} />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
          <span aria-hidden="true" className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block" />
          {copy.howItWorks.steps.map((step, index) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="relative flex flex-col gap-3">
              <span className="relative grid h-12 w-12 place-items-center rounded-full border border-line bg-surface font-mono text-sm font-medium text-accent-text shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-text">{step.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft" labelledBy="sectors-title">
        <SectionHeader id="sectors-title" eyebrow={copy.sectors.eyebrow} title={copy.sectors.title} lead={copy.sectors.lead} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {sectors.map((sector, index) => {
            const sectorCopy = sector.copy[locale];
            return (
              <article
                key={sector.id}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(index % 2) * 90}ms` }}
                className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 text-white sm:min-h-[26rem]"
              >
                <Photo
                  id={sector.photo}
                  locale={locale}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 -z-20"
                  imageClassName="transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/5" />
                <h3 className="display text-3xl">
                  <Link href={href(locale, { key: "sector", sectorId: sector.id })} className="after:absolute after:inset-0">
                    {sectorCopy.cardTitle}
                  </Link>
                </h3>
                <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-white/85">{sectorCopy.cardBody}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {sector.bundle.slice(0, 3).map((productId) => {
                    const product = products.find((candidate) => candidate.id === productId);
                    return product ? (
                      <li key={productId} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                        <ProductGlyph icon={product.icon} size={14} />
                        {t.nav.families[product.family]}
                      </li>
                    ) : null;
                  })}
                </ul>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  {copy.sectors.cta}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </article>
            );
          })}
        </div>
      </Section>

      <Section labelledBy="proof-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-8">
            <SectionHeader id="proof-title" eyebrow={copy.proof.eyebrow} title={copy.proof.title} lead={copy.proof.lead} />
            <ul className="flex flex-col gap-5">
              {copy.proof.principles.map((principle, index) => (
                <li key={principle.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 80}ms` }} className="flex gap-4">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text">
                    <Check size={15} />
                  </span>
                  <span>
                    <span className="block font-semibold text-text">{principle.title}</span>
                    <span className="block text-[0.95rem] leading-relaxed text-muted">{principle.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal className="flex flex-col gap-4">
            <dl className="grid grid-cols-2 gap-4">
              {copy.proof.stats.map((stat) => (
                <div key={stat.label} className="card flex flex-col gap-2 p-6">
                  <dt className="order-2 text-sm leading-snug text-muted">{stat.label}</dt>
                  <dd className="display order-1 text-5xl text-accent-text tabular">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-subtle">{copy.proof.disclaimer}</p>
          </div>
        </div>
      </Section>

      <Section tone="soft" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="faq-title" eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
          <div data-reveal>
            <Faq items={copy.faq.items} />
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow={copy.finalCta.eyebrow}
        title={copy.finalCta.title}
        body={copy.finalCta.body}
        primaryLabel={copy.finalCta.primary}
        primaryHref={bookHref}
        secondaryLabel={copy.finalCta.secondary}
        secondaryHref={whatsappUrl(t.common.whatsappMessage)}
      />
    </>
  );
}
