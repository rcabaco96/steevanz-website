import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { dolci, dolciCopy, quoteDate, quotes, reelImage, reelLink, reels, type DolciLocale } from "@/content/dolci-salati";
import { CircleText } from "./CircleText";
import { FloatingMenu } from "./FloatingMenu";
import { HeaderBar } from "./HeaderBar";
import { Hero } from "./Hero";
import { ArrowIcon, InstagramIcon, PinIcon, PlayIcon } from "./icons";
import { ParallaxImage } from "./ParallaxImage";
import { PhoneFan } from "./PhoneFan";
import { ReelRail } from "./ReelRail";
import { RevealObserver } from "./RevealObserver";
import { ScrollVelocity } from "./ScrollVelocity";
import { ScrollWords } from "./ScrollWords";
import { SweetSavoury } from "./SweetSavoury";
import { TiltCard } from "./TiltCard";
import styles from "./dolci.module.css";

// Dolci e Salati's landing page. Server-rendered; the moving parts are small client islands (hero,
// marquee, scroll-linked words, the sweet/savoury card, parallax photos, the phone fan). Motion is
// tasteful and optional: prefers-reduced-motion turns it all off and the page still reads in full.

const rootId = "dolci-salati";
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Label({ children }: { children: string }) {
  return <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--dz-berry)] uppercase">{children}</p>;
}

function External({ href, children, className = "", newTab }: { href: string; children: React.ReactNode; className?: string; newTab: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> ({newTab})</span>
    </a>
  );
}

export function DolciLanding({ locale }: { locale: DolciLocale }) {
  const copy = dolciCopy[locale];
  const byId = (id: string) => reels.find((reel) => reel.id === id)!;
  const sweet = byId("CwJIfVcoTpA");
  const savory = byId("DMYAiwcoUIy");

  return (
    <div id={rootId} lang={copy.htmlLang} className={`${styles.root} relative min-h-dvh overflow-x-clip`}>
      <a href="#conteudo" className="sr-only z-50 rounded-full bg-[var(--dz-cta-bg)] px-4 py-2 text-[var(--dz-cta-fg)] focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        {copy.skip}
      </a>
      <HeaderBar copy={copy} />

      <main>
        <Hero copy={copy} locale={locale} />

        <ScrollVelocity items={copy.marquee} label={copy.marquee.join(", ")} />

        {/* 01 · A nossa pausa */}
        <section id="conteudo" aria-labelledby="dz-intro" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-8 sm:py-24">
          <div data-reveal>
            <Label>{copy.intro.label}</Label>
          </div>
          <h2 id="dz-intro" className="sr-only">
            {copy.intro.lines}
          </h2>
          <ScrollWords text={copy.intro.lines} className="display mt-5 text-[2.35rem] leading-[1.08] tracking-[-0.02em] text-[var(--dz-ink)] sm:text-6xl lg:text-7xl" />
          <div className="mt-10 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-12">
            <p data-reveal="blur" className="display-italic text-2xl text-[var(--dz-berry)] sm:max-w-[16rem] sm:text-3xl">
              {copy.intro.emphasis}
            </p>
            <p data-reveal style={delay(120)} className="max-w-xl text-lg leading-relaxed text-[var(--dz-ink-2)]">
              {copy.intro.text}
            </p>
          </div>
        </section>

        {/* 02 · Doce & salgado */}
        <section id="doce-salgado" aria-labelledby="dz-dual" className="mx-auto max-w-6xl px-3 sm:px-8">
          <div data-reveal className="mb-6 px-1 text-center sm:mb-8">
            <Label>{copy.dual.label}</Label>
            <h2 id="dz-dual" className="sr-only">
              {copy.dual.label}
            </h2>
          </div>
          <div data-reveal style={delay(80)}>
            <SweetSavoury
              copy={copy.dual}
              sweet={{ image: reelImage(sweet.id), alt: sweet.alt[locale] }}
              savory={{ image: reelImage(savory.id), alt: savory.alt[locale] }}
            />
          </div>
        </section>

        {/* 03 · Pequenos prazeres */}
        <section id="sabores" aria-labelledby="dz-products" className="py-16 sm:py-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div data-reveal>
              <Label>{copy.products.label}</Label>
              <h2 id="dz-products" className="display mt-3 max-w-lg text-[2.6rem] leading-[1.02] text-[var(--dz-ink)] sm:text-6xl">
                {copy.products.title}
              </h2>
            </div>
            <p data-reveal style={delay(100)} className="max-w-xs text-base text-[var(--dz-ink-2)]">
              {copy.products.intro}
            </p>
          </div>

          <ReelRail label={copy.products.title} prev={copy.products.prev} next={copy.products.next}>
            {reels.map((reel, index) => (
              <li key={reel.id} data-reveal style={delay(Math.min(index, 4) * 90)} className="w-[62vw] max-w-[250px] shrink-0 snap-start sm:w-[230px]">
                <TiltCard className="rounded-[1.6rem]">
                  <External href={reelLink(reel.id)} newTab={copy.newTab} className="group block overflow-hidden rounded-[1.6rem] bg-[var(--dz-surface)] shadow-[0_24px_48px_-30px_rgb(var(--dz-shadow)/0.6)] ring-1 ring-[var(--dz-line)]">
                    <span className="relative block aspect-[9/14] overflow-hidden">
                      <Image
                        src={reelImage(reel.id)}
                        alt={reel.alt[locale]}
                        fill
                        sizes="(min-width: 640px) 230px, 62vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-[#1d382f] uppercase backdrop-blur">
                        {reel.kind[locale]}
                      </span>
                      <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[#1d382f] backdrop-blur transition-transform duration-500 group-hover:scale-110">
                        <PlayIcon className="h-3.5 w-3.5 translate-x-[1px]" />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <span className="display block text-xl leading-tight">{reel.title[locale]}</span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-white/85">{reel.text[locale]}</span>
                      </span>
                    </span>
                    <span className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-[var(--dz-ink)]">
                      {copy.products.watch}
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </External>
                </TiltCard>
              </li>
            ))}
          </ReelRail>
          <p className="px-4 text-center text-xs text-[var(--dz-ink-2)] sm:hidden" aria-hidden="true">
            {copy.products.swipe} →
          </p>
        </section>

        {/* Ver o menu */}
        <section id="menu" aria-labelledby="dz-menu" className="px-3 sm:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] bg-[#1d382f] px-5 pt-14 pb-12 text-[#f7f2e8] sm:px-12 sm:py-20">
            <div aria-hidden="true" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#ef6f94]/35 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#b5ca91]/30 blur-3xl" />
            {/* Stacked: label, title and text, then the phones, then the button (Steevanz rule, 2026-10-20: on
                mobile the heading and intro, then the media, then the rest). On a computer text left, phones right. */}
            <div className="relative grid items-center gap-x-12 gap-y-10 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-y-0">
              <div className="text-center lg:col-start-1 lg:row-start-2 lg:text-left">
                <p data-reveal className="text-[0.7rem] font-semibold tracking-[0.2em] text-[#f7c6d3] uppercase">
                  {copy.menuBand.label}
                </p>
                <h2 id="dz-menu" data-reveal="blur" style={delay(80)} className="display mt-4 text-[2.5rem] leading-[1.02] sm:text-6xl">
                  {copy.menuBand.title}
                </h2>
                <p data-reveal style={delay(160)} className="mx-auto mt-4 max-w-md text-base text-[#f7f2e8]/80 lg:mx-0">
                  {copy.menuBand.text}
                </p>
              </div>
              <div className="lg:col-start-2 lg:row-span-4 lg:row-start-1">
                <PhoneFan images={[reelImage("DMdyAaOILFK"), reelImage("DNF6fL8uN2r"), reelImage("DM-lbCEOei_")]} />
              </div>
              <div className="text-center lg:col-start-1 lg:row-start-3 lg:text-left">
                <div data-reveal style={delay(240)} className="lg:mt-8">
                  <Link
                    href={dolci.menu}
                    data-menu-cta
                    className={`${styles.shine} group inline-flex min-h-16 items-center gap-4 rounded-full bg-[#f7f2e8] py-2 pr-8 pl-2 text-lg font-semibold text-[#1d382f] shadow-[0_20px_50px_-20px_rgb(239_111_148/0.8)] transition-transform duration-300 hover:-translate-y-1 active:scale-[0.97]`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ad2c5c] text-white transition-transform duration-500 group-hover:scale-110">
                      <PlayIcon className="h-5 w-5 translate-x-[1px]" />
                    </span>
                    {copy.menuBand.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 · O nosso lugar */}
        <section id="o-espaco" aria-labelledby="dz-place" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div data-reveal>
              <Label>{copy.placeSection.label}</Label>
              <h2 id="dz-place" className="display mt-3 text-[2.75rem] leading-[1.02] text-[var(--dz-ink)] sm:text-7xl">
                {copy.placeSection.title}
              </h2>
            </div>
            <p data-reveal style={delay(100)} className="max-w-md text-lg leading-relaxed text-[var(--dz-ink-2)] lg:justify-self-end">
              {copy.placeSection.text}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-[1.45fr_1fr] sm:gap-6">
            <figure className="m-0">
              <ParallaxImage src={dolci.terrace} alt={copy.placeSection.terraceAlt} width={1546} height={1017} sizes="(min-width: 1024px) 680px, (min-width: 640px) 58vw, 100vw" className="aspect-[4/3] sm:aspect-auto sm:h-[460px]" />
              <figcaption className="mt-3 text-xs font-semibold tracking-[0.16em] text-[var(--dz-ink-2)] uppercase">{copy.placeSection.terrace}</figcaption>
            </figure>
            <figure className="m-0 sm:mt-16">
              <ParallaxImage src={dolci.interior} alt={copy.placeSection.insideAlt} width={1254} height={1254} sizes="(min-width: 1024px) 460px, (min-width: 640px) 40vw, 100vw" className="aspect-square sm:aspect-auto sm:h-[400px]" amount={10} />
              <figcaption className="mt-3 text-xs font-semibold tracking-[0.16em] text-[var(--dz-ink-2)] uppercase">{copy.placeSection.inside}</figcaption>
            </figure>
          </div>
        </section>

        {/* Opiniões: verbatim excerpts with their sources */}
        <section id="palavras" aria-labelledby="dz-reviews" className="bg-[var(--dz-bg-2)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Label>{copy.reviews.label}</Label>
                <h2 id="dz-reviews" className="display mt-3 text-[2.6rem] leading-[1.02] text-[var(--dz-ink)] sm:text-6xl">
                  {copy.reviews.title}
                </h2>
              </div>
              <External href={dolci.googleReviews} newTab={copy.newTab} className={`${styles.underline} inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--dz-ink)] sm:self-auto`}>
                {copy.reviews.google}
                <ArrowIcon className="h-4 w-4" />
              </External>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {quotes.map((item, index) => (
                <li key={item.href} data-reveal style={delay(index * 110)} className={index === 1 ? "md:translate-y-8" : ""}>
                  <figure className="m-0 flex h-full flex-col rounded-[1.75rem] bg-[var(--dz-surface)] p-6 shadow-[0_24px_48px_-36px_rgb(var(--dz-shadow)/0.6)] ring-1 ring-[var(--dz-line)] transition-transform duration-500 hover:-translate-y-1 hover:-rotate-1">
                    <span aria-hidden="true" className="display-italic text-6xl leading-[0.6] text-[var(--dz-berry)]">
                      “
                    </span>
                    <blockquote lang="pt-PT" className="display mt-4 flex-1 text-2xl leading-snug text-[var(--dz-ink)]">
                      {item.quote}
                    </blockquote>
                    {copy.reviews.original ? <p className="mt-2 text-xs text-[var(--dz-ink-2)] italic">{copy.reviews.original}</p> : null}
                    <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--dz-line)] pt-4 text-sm">
                      <span>
                        <span className="block font-semibold text-[var(--dz-ink)]">{item.author}</span>
                        <span className="block text-xs text-[var(--dz-ink-2)]">
                          {item.source} · {quoteDate(item.date, locale)}
                        </span>
                      </span>
                      <External href={item.href} newTab={copy.newTab} className={`${styles.underline} shrink-0 text-xs font-semibold text-[var(--dz-berry)]`}>
                        {copy.reviews.source}
                      </External>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Brunch · 2027 */}
        <section id="brunch" aria-labelledby="dz-brunch" className="mx-auto max-w-6xl overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
            <div data-reveal className="relative mx-auto grid aspect-square w-60 place-items-center sm:w-72">
              <CircleText id="dz-brunch-ring" text={copy.brunch.ring} slow className="absolute inset-0 h-full w-full text-[var(--dz-berry)]" />
              <div className="grid aspect-square w-[72%] place-items-center rounded-full bg-[var(--dz-berry-soft)] text-center">
                <div>
                  <p className="display-italic text-5xl leading-none text-[var(--dz-berry)]">
                    {copy.brunch.name}
                    <span className="text-[var(--dz-ink)]">.</span>
                  </p>
                  <p className="mt-2 text-[0.65rem] font-semibold tracking-[0.18em] text-[var(--dz-ink-2)] uppercase">{copy.brunch.status}</p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div data-reveal>
                <Label>{copy.brunch.label}</Label>
              </div>
              <h2 id="dz-brunch" data-reveal="blur" style={delay(80)} className="display mt-3 text-[2.5rem] leading-[1.04] text-[var(--dz-ink)] sm:text-6xl">
                {copy.brunch.title}
              </h2>
              <p data-reveal style={delay(160)} className="mt-4 text-base text-[var(--dz-ink-2)]">
                {copy.brunch.text}
              </p>
              <div data-reveal style={delay(220)} className="mt-6">
                <External href={dolci.instagram} newTab={copy.newTab} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--dz-ink)] px-5 text-sm font-semibold text-[var(--dz-ink)] transition-colors hover:bg-[var(--dz-ink)] hover:text-[var(--dz-bg)]">
                  <InstagramIcon className="h-4 w-4" />
                  {copy.brunch.cta}
                </External>
              </div>
            </div>
          </div>
        </section>

        {/* 05 · Visita-nos */}
        <section id="visita" aria-labelledby="dz-visit" className="px-3 pb-16 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-6xl rounded-[2.25rem] bg-[var(--dz-surface)] p-5 shadow-[0_30px_70px_-50px_rgb(var(--dz-shadow)/0.7)] ring-1 ring-[var(--dz-line)] sm:p-12">
            <div data-reveal>
              <Label>{copy.visit.label}</Label>
              <h2 id="dz-visit" className="display mt-3 text-[2.6rem] leading-[1.02] text-[var(--dz-ink)] sm:text-6xl">
                {copy.visit.title}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div data-reveal className="rounded-[1.5rem] bg-[var(--dz-bg-2)] p-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--dz-ink-2)] uppercase">{copy.visit.addressLabel}</p>
                <address className="display mt-3 text-2xl leading-snug text-[var(--dz-ink)] not-italic">
                  {dolci.address[0]}
                  <br />
                  {dolci.address[1]}
                </address>
                <div className="mt-6 flex flex-wrap gap-2">
                  <External href={dolci.directions} newTab={copy.newTab} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--dz-cta-bg)] px-4 text-sm font-semibold text-[var(--dz-cta-fg)] transition-transform hover:-translate-y-0.5">
                    <PinIcon className="h-4 w-4" />
                    {copy.visit.directions}
                  </External>
                  <External href={dolci.maps} newTab={copy.newTab} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--dz-line)] px-4 text-sm font-semibold text-[var(--dz-ink)] transition-colors hover:border-[var(--dz-ink)]">
                    {copy.visit.maps}
                    <ArrowIcon className="h-4 w-4" />
                  </External>
                </div>
              </div>
              <div data-reveal style={delay(100)} className="rounded-[1.5rem] bg-[var(--dz-berry-soft)] p-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--dz-ink-2)] uppercase">{copy.visit.hoursLabel}</p>
                <p className="display mt-3 text-2xl leading-snug text-[var(--dz-ink)]">{copy.visit.hours}</p>
                <External href={dolci.instagram} newTab={copy.newTab} className={`${styles.underline} mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--dz-berry)]`}>
                  {copy.visit.hoursCta}
                  <ArrowIcon className="h-4 w-4" />
                </External>
              </div>
              <External
                href={dolci.instagram}
                newTab={copy.newTab}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#f7c6d3,#ef6f94_45%,#e5ba83)] p-6 text-[#2a0f1b] transition-transform duration-500 hover:-translate-y-1"
              >
                <span data-reveal style={delay(200)} className="block">
                  <span className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase opacity-80">{copy.visit.socialLabel}</span>
                  <span className="mt-3 flex items-center gap-3">
                    <Image src={dolci.logo} alt="" width={48} height={48} className="h-12 w-12 rounded-full bg-white ring-2 ring-white/80 transition-transform duration-700 group-hover:rotate-[360deg]" />
                    <span className="display text-2xl">{dolci.instagramHandle}</span>
                  </span>
                  <span className="mt-3 block text-sm opacity-85">{copy.visit.socialText}</span>
                </span>
                <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-[#2a0f1b] px-4 py-2.5 text-sm font-semibold text-white">
                  <InstagramIcon className="h-4 w-4" />
                  {copy.visit.follow}
                </span>
              </External>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-[var(--dz-line)] px-4 pt-14 pb-28 sm:px-8 sm:pb-12">
        <div className="mx-auto max-w-6xl">
          <p data-reveal="blur" className="display text-[clamp(3.2rem,16vw,9rem)] leading-[0.9] tracking-[-0.04em] text-[var(--dz-ink)]">
            dolci <span className="display-italic text-[var(--dz-berry)]">e</span> salati<span className="text-[var(--dz-berry)]">.</span>
          </p>
          <p className="display-italic mt-3 text-xl text-[var(--dz-ink-2)]">{copy.footer.line}</p>
          <div className="mt-10 flex flex-col gap-4 border-t border-[var(--dz-line)] pt-6 text-sm text-[var(--dz-ink-2)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 {dolci.name}. {copy.footer.rights}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <External href={dolci.instagram} newTab={copy.newTab} className={`${styles.underline} font-semibold text-[var(--dz-ink)]`}>
                Instagram ↗
              </External>
              <a href="https://www.steevanz.com/" className={`${styles.underline} font-semibold text-[var(--dz-ink)]`}>
                {copy.footer.madeBy}
              </a>
              <a href="#inicio" className={`${styles.underline} font-semibold text-[var(--dz-ink)]`}>
                {copy.footer.top} ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingMenu href={dolci.menu} label={copy.floatingMenu} />
      <RevealObserver rootId={rootId} />
    </div>
  );
}
