import type { Metadata } from "next";
import { aboutCopy, contactCopy } from "@/content/company";
import { legalDocuments, type LegalDocumentId } from "@/content/legal";
import { ui } from "@/content/ui";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight, Check, ClockIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { InlineText } from "@/components/ui/InlineText";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/jsonld";
import { href, type StaticRouteKey } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

export function aboutMetadata(locale: Locale): Metadata {
  const copy = aboutCopy[locale];
  return pageMetadata({ locale, route: { key: "about" }, title: copy.metaTitle, description: copy.metaDescription });
}

export function AboutPage({ locale }: { locale: Locale }) {
  const copy = aboutCopy[locale];
  const t = ui[locale];
  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <section aria-labelledby="about-title" className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page flex flex-col gap-10">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.about, path: href(locale, { key: "about" }) },
            ]}
          />
          <SectionHeader as="h1" id="about-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <figure className="flex flex-col gap-3">
            <Photo id="team-meeting" locale={locale} sizes="(min-width: 1216px) 1152px, 100vw" priority className="aspect-[16/9] rounded-[2rem] sm:aspect-[21/9]" />
            <figcaption className="text-sm text-subtle">{copy.photoCaption}</figcaption>
          </figure>
        </div>
      </section>

      <Section tone="soft" labelledBy="story-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="story-title" data-reveal className="display text-4xl sm:text-5xl">
            {copy.storyTitle}
          </h2>
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
            {copy.story.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section labelledBy="values-title">
        <SectionHeader id="values-title" eyebrow={copy.valuesEyebrow} title={copy.valuesTitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.values.map((value, index) => (
            <article key={value.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 80}ms` }} className="card flex flex-col gap-3 p-6">
              <h3 className="display text-2xl text-accent-text">{value.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{value.body}</p>
            </article>
          ))}
        </div>
        <h2 data-reveal className="display mt-20 text-3xl sm:text-4xl">
          {copy.howTitle}
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {copy.how.map((step, index) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-soft font-mono text-sm text-gold-text">{index + 1}</span>
              <div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        eyebrow={copy.eyebrow}
        title={copy.ctaTitle}
        body={copy.ctaBody}
        primaryLabel={t.common.bookDemo}
        primaryHref={href(locale, { key: "book" })}
        secondaryLabel={t.common.whatsapp}
        secondaryHref={whatsappUrl(t.common.whatsappMessage)}
      />
    </>
  );
}

export function contactMetadata(locale: Locale): Metadata {
  const copy = contactCopy[locale];
  return pageMetadata({ locale, route: { key: "contact" }, title: copy.metaTitle, description: copy.metaDescription });
}

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = contactCopy[locale];
  const t = ui[locale];
  const channels = [
    { icon: WhatsAppIcon, title: copy.channels.whatsapp, body: copy.channels.whatsappBody, value: site.whatsappDisplay, link: whatsappUrl(t.common.whatsappMessage), external: true, highlight: true },
    { icon: MailIcon, title: copy.channels.email, body: copy.channels.emailBody, value: site.email, link: `mailto:${site.email}`, external: false, highlight: false },
    { icon: PhoneIcon, title: copy.channels.phone, body: copy.channels.phoneBody, value: site.phoneDisplay, link: site.phoneHref, external: false, highlight: false },
    { icon: InstagramIcon, title: copy.channels.instagram, body: copy.channels.instagramBody, value: site.instagramHandle, link: site.instagramUrl, external: true, highlight: false },
  ];
  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <section aria-labelledby="contact-title" className="relative isolate overflow-hidden pt-24 pb-20 sm:pt-32">
        <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
        <div className="container-page flex flex-col gap-10">
          <Breadcrumbs
            label={t.common.breadcrumbHome}
            items={[
              { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
              { name: t.nav.contact, path: href(locale, { key: "contact" }) },
            ]}
          />
          <SectionHeader as="h1" id="contact-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <li key={channel.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}>
                  <a
                    href={channel.link}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className={`card card-interactive flex h-full flex-col gap-3 p-6 ${channel.highlight ? "border-whatsapp/50" : ""}`}
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${channel.highlight ? "bg-whatsapp text-[#0b2e17]" : "bg-accent-soft text-accent-text"}`}>
                      <Icon size={22} />
                    </span>
                    <span className="text-lg font-semibold text-text">{channel.title}</span>
                    <span className="text-sm text-muted">{channel.body}</span>
                    <span className="mt-auto text-sm font-semibold break-all text-accent-text">{channel.value}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="grid gap-5 lg:grid-cols-3">
            <div data-reveal className="card flex flex-col gap-4 p-7">
              <p className="flex items-center gap-2 font-semibold text-text">
                <ClockIcon size={18} className="text-gold-text" /> {copy.hoursTitle}
              </p>
              <p className="text-muted">{copy.hours}</p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-success" /> {copy.responseTime}
              </p>
              <p className="mt-2 flex items-center gap-2 font-semibold text-text">
                <MapPinIcon size={18} className="text-gold-text" /> {copy.locationTitle}
              </p>
              <p className="text-muted">{copy.location}</p>
            </div>
            <div data-reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface-inverse p-7 text-inverse">
              <p className="display text-2xl">{copy.demoTitle}</p>
              <p className="opacity-80">{copy.demoBody}</p>
              <ButtonLink href={href(locale, { key: "book" })} className="mt-auto w-full bg-gold! text-[#1d1220]!">
                {t.common.bookDemo} <ArrowRight size={16} />
              </ButtonLink>
            </div>
            <div data-reveal className="card flex flex-col gap-4 p-7">
              <p className="display text-2xl">{copy.infoTitle}</p>
              <p className="text-muted">{copy.infoBody}</p>
              <ButtonLink href={href(locale, { key: "requestInfo" })} variant="secondary" className="mt-auto w-full">
                {t.common.requestInfo}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const legalRouteKeys: Record<LegalDocumentId, StaticRouteKey> = {
  privacy: "privacy",
  cookies: "cookies",
  terms: "terms",
};

export function legalMetadata(locale: Locale, documentId: LegalDocumentId): Metadata {
  const document = legalDocuments[documentId][locale];
  return pageMetadata({
    locale,
    route: { key: legalRouteKeys[documentId] },
    title: document.metaTitle,
    description: document.metaDescription,
  });
}

export function LegalPage({ locale, documentId }: { locale: Locale; documentId: LegalDocumentId }) {
  const document = legalDocuments[documentId][locale];
  const t = ui[locale];
  return (
    <div className="container-page pt-24 pb-20 sm:pt-32">
      <Breadcrumbs
        label={t.common.breadcrumbHome}
        items={[
          { name: t.common.breadcrumbHome, path: href(locale, { key: "home" }) },
          { name: document.title, path: href(locale, { key: legalRouteKeys[documentId] }) },
        ]}
      />
      <div className="mt-8 grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav aria-label={t.common.onThisPage} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="eyebrow mb-3">{t.common.onThisPage}</p>
            <ul className="flex flex-col gap-2 border-l border-line pl-4 text-sm">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-muted hover:text-text">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <article className="max-w-3xl">
          <h1 className="display text-4xl sm:text-5xl">{document.title}</h1>
          <p className="mt-3 text-sm text-subtle">{document.updated}</p>
          <div className="prose-doc mt-8">
            <p className="text-lg">{document.intro}</p>
            {document.sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id} className="mt-12">
                <h2 id={section.id} className="scroll-mt-28 text-2xl font-semibold text-text">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4">
                    <InlineText text={paragraph} />
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 marker:text-gold">
                    {section.list.map((item) => (
                      <li key={item}>
                        <InlineText text={item} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
