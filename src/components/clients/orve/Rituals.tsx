"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orveDuration, orvePhotos, orvePrice } from "@/content/orve/facts";
import { ArrowIcon } from "./icons";
import { SplitText } from "./react-bits/SplitText";
import { orveSections, pickRitualEvent } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The menu of treatments, with durations and prices (without VAT, «+ IVA» beside each, owner's absolute rule).
// Six cards, one per family. Large screens (tall enough): the cards stack — each one slides up over the one before,
// which sinks back and dims (CSS sticky + GSAP scrub), the photo inside its round «drop» drifting. Phones: the cards
// follow one another, each photo opening out of a circle as it arrives. Reduced motion: everything in place.
export function Rituals({ copy }: { copy: OrveCopy }) {
  const { rituals } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = q("[data-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          const img = card.querySelector("[data-photo]");
          if (img) gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
          if (!next) return;
          gsap.to(card.querySelector("[data-sheet]"), {
            scale: 0.93,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
          gsap.to(card.querySelector("[data-shade]"), {
            opacity: 0.5,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 799px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-frame]").forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "circle(18% at 50% 50%)" },
            { clipPath: "circle(75% at 50% 50%)", ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 92%", end: "top 35%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = (id: string) => window.dispatchEvent(new CustomEvent(pickRitualEvent, { detail: id }));

  return (
    <section ref={root} id={orveSections.rituals} aria-labelledby="or-rituals-title" className="relative bg-linho pt-24 pb-16 sm:pt-32 lg:pb-32">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="or-label mb-6 flex items-center gap-4 text-cobre">
              <span aria-hidden="true" className="h-px w-10 bg-cobre/60" />
              {rituals.eyebrow}
            </p>
            <h2 id="or-rituals-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.95] tracking-[-0.015em]">
              <SplitText text={rituals.title} splitType="chars" delay={28} className="block" />
              <span className="block text-cobre italic">{rituals.titleItalic}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.02rem] leading-[1.8] text-pedra">{rituals.intro}</p>
            <p className="mt-5 text-sm font-medium text-tinta">{rituals.vatNote}</p>
            <p className="mt-1 text-sm text-pedra">{rituals.demoNote}</p>
          </div>
        </div>

        <nav aria-label={rituals.eyebrow} className="-mx-5 mt-10 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {rituals.list.map((ritual) => (
              <li key={ritual.id}>
                <a
                  href={`#ritual-${ritual.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-nacar px-4 text-[0.92rem] whitespace-nowrap ring-1 ring-tinta/10 transition-colors hover:bg-white hover:ring-cobre/40"
                >
                  <span className="text-xs text-cobre">{ritual.number}</span>
                  {ritual.title} <span className="font-display italic">{ritual.titleItalic}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ol className="mx-auto mt-10 flex max-w-[80rem] flex-col gap-6 px-3 sm:mt-14 sm:px-8 lg:gap-[12vh]">
        {rituals.list.map((ritual, i) => {
          const photo = orvePhotos[ritual.image];
          return (
            <li
              key={ritual.id}
              id={`ritual-${ritual.id}`}
              data-card
              className="scroll-mt-20 [@media(min-width:1024px)_and_(min-height:800px)]:sticky"
              style={{ top: `calc(5.5rem + ${i * 14}px)` }}
            >
              <article
                data-sheet
                aria-labelledby={`or-ritual-${ritual.id}`}
                className="relative origin-top overflow-hidden rounded-[2rem] bg-nacar shadow-[0_30px_70px_-40px_rgb(36_24_20/0.45)] will-change-transform"
              >
                <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-cacau opacity-0" />
                <div className="grid gap-7 p-5 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-14 lg:gap-y-6 lg:p-12">
                  <div className="lg:col-start-1 lg:row-start-1">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-[clamp(2.6rem,8vw,4rem)] leading-none text-argila-2 italic">{ritual.number}</span>
                      <h3 id={`or-ritual-${ritual.id}`} className="font-display text-[clamp(1.9rem,6vw,3rem)] leading-[1.02]">
                        {ritual.title} <span className="text-cobre italic">{ritual.titleItalic}</span>
                      </h3>
                    </div>
                    <p className="mt-4 max-w-md leading-relaxed text-pedra">{ritual.intro}</p>
                  </div>

                  <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:items-center lg:justify-center">
                    <div
                      data-frame
                      className="or-bead relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-[1.6rem] bg-cacau sm:aspect-[16/10] lg:aspect-square lg:w-[min(100%,52svh)] lg:rounded-full"
                    >
                      <Image
                        data-photo
                        src={photo.src}
                        alt={ritual.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(min-width: 1024px) 34vw, 94vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-start-1 lg:row-start-2">
                    <ul className="divide-y divide-tinta/10 border-y border-tinta/10">
                      {ritual.treatments.map((t) => (
                        <li key={t.name} className="flex items-baseline justify-between gap-4 py-3.5">
                          <span className="min-w-0">
                            <span className="block text-[1.02rem] leading-snug hyphens-auto">{t.name}</span>
                            <span className="mt-0.5 block text-[0.82rem] text-pedra">
                              {orveDuration(t.minutes, copy.locale)}
                              {t.note ? <span className="font-display italic"> · {t.note}</span> : null}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-display text-[1.45rem] leading-none tabular-nums">{orvePrice(t.price, copy.locale)}</span>
                            <span className="mt-1 block text-[0.68rem] tracking-[0.12em] text-pedra uppercase">{rituals.plusVat}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`#${orveSections.book}`}
                      onClick={() => pick(ritual.id)}
                      className="group mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-tinta px-6 text-[0.8rem] font-medium tracking-[0.14em] text-nacar uppercase transition-colors hover:bg-cobre"
                    >
                      {rituals.book}
                      <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
