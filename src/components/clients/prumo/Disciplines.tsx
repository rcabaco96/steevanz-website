"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumoDuration, prumoPhotos, prumoPrice } from "@/content/prumo/facts";
import { ArrowIcon } from "./icons";
import { Bob } from "./Logo";
import { SplitText } from "./react-bits/SplitText";
import { pickServiceEvent, prumoSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The treatments, with durations and prices (without VAT, «+ IVA» beside each, owner's absolute rule; example values).
// Large screens: a sticky panel holds the photos and a brass thread; as each treatment scrolls past, its photo is let
// down over the last one like a blind and the plumb bob slides down the thread to its number (GSAP scrub). Phones: the
// heading and text first, then the photo opening out of a vertical line, then the prices (owner's mobile order).
// Reduced motion: everything in place.
export function Disciplines({ copy }: { copy: PrumoCopy }) {
  const { disciplines } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = q("[data-item]");
        const photos = q("[data-panel-photo]");
        items.forEach((item, i) => {
          if (i === 0) return;
          gsap.fromTo(
            photos[i],
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", scrollTrigger: { trigger: item, start: "top 85%", end: "top 40%", scrub: 0.6 } },
          );
          gsap.fromTo(
            photos[i].querySelector("img"),
            { scale: 1.18 },
            { scale: 1.04, ease: "none", scrollTrigger: { trigger: item, start: "top 85%", end: "top 40%", scrub: 0.6 } },
          );
        });
        const track = q("[data-track]")[0];
        gsap.fromTo(
          q("[data-runner]"),
          { y: 0 },
          {
            y: () => (track ? track.clientHeight : 0),
            ease: "none",
            scrollTrigger: { trigger: q("[data-list]")[0], start: "top 60%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
          },
        );
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => q("[data-step]")[i]?.classList.toggle("is-on", self.isActive),
          });
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-inline-photo]").forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 49% 0% 49% round 1.25rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 92%", end: "top 45%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = (id: string) => window.dispatchEvent(new CustomEvent(pickServiceEvent, { detail: id }));

  return (
    <section ref={root} id={prumoSections.disciplines} aria-labelledby="pr-disciplines-title" className="relative bg-anca pt-24 pb-20 sm:pt-32 lg:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
              <span aria-hidden="true" className="h-px w-10 bg-latao" />
              {disciplines.eyebrow}
            </p>
            <h2 id="pr-disciplines-title" className="font-display text-[clamp(2.7rem,9.5vw,5.8rem)] leading-[0.98] tracking-[-0.015em]">
              <SplitText text={disciplines.title} splitType="words" delay={60} className="block" />
              <span className="block text-latao-fundo italic">{disciplines.titleItalic}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.02rem] leading-[1.75] text-pedra">{disciplines.intro}</p>
            <p className="mt-5 text-sm font-semibold text-tinta">{disciplines.vatNote}</p>
            <p className="mt-1 text-sm text-pedra">{disciplines.demoNote}</p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Large screens: the sticky panel with the photos and the thread. */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-24 flex h-[calc(100svh-8rem)] max-h-[46rem] gap-6">
              <div className="relative flex w-14 shrink-0 flex-col items-center py-2">
                <span className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-tinta/20" />
                <div data-track className="absolute top-2 bottom-12 left-0 w-full">
                  <span data-runner className="absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
                    <span className="block h-5 w-px bg-latao" />
                    <Bob className="h-8 w-auto" />
                  </span>
                </div>
                <ol className="relative flex h-full flex-col justify-between pt-12">
                  {disciplines.list.map((d) => (
                    <li
                      key={d.id}
                      data-step
                      className="grid size-9 place-items-center rounded-full bg-anca text-[0.7rem] font-semibold text-pedra ring-1 ring-tinta/15 transition-colors duration-500 [&.is-on]:bg-ardosia [&.is-on]:text-cal [&.is-on]:ring-ardosia"
                    >
                      {d.number}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-[1.75rem] bg-ardosia">
                {disciplines.list.map((d) => {
                  const photo = prumoPhotos[d.image];
                  return (
                    <div key={d.id} data-panel-photo className="absolute inset-0 overflow-hidden">
                      <Image src={photo.src} alt="" width={photo.width} height={photo.height} sizes="40vw" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ardosia/75 to-transparent px-7 pt-20 pb-6">
                        <p className="font-display text-3xl text-cal italic">{d.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <ol data-list className="flex flex-col gap-6 lg:gap-[14vh] lg:py-[6vh]">
            {disciplines.list.map((d) => {
              const photo = prumoPhotos[d.image];
              return (
                <li key={d.id} id={`tratamento-${d.id}`} data-item className="scroll-mt-24">
                  <article aria-labelledby={`pr-d-${d.id}`} className="rounded-[1.75rem] bg-cal p-5 shadow-[0_30px_60px_-45px_rgb(29_39_48/0.5)] sm:p-9 lg:bg-transparent lg:p-0 lg:shadow-none">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-[clamp(2.2rem,7vw,3.4rem)] leading-none text-latao italic">{d.number}</span>
                      <h3 id={`pr-d-${d.id}`} className="font-display text-[clamp(1.9rem,6vw,3rem)] leading-[1.02]">
                        {d.title}
                      </h3>
                    </div>
                    <p className="mt-4 max-w-xl leading-relaxed text-pedra">{d.intro}</p>
                    <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed">
                      <span className="font-semibold text-tinta">{disciplines.forWhom}: </span>
                      <span className="text-pedra">{d.forWhom}</span>
                    </p>

                    <div data-inline-photo className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-ardosia lg:hidden">
                      <Image src={photo.src} alt={d.alt} width={photo.width} height={photo.height} sizes="94vw" className="absolute inset-0 h-full w-full object-cover" />
                    </div>

                    <ul className="mt-6 divide-y divide-tinta/10 border-y border-tinta/10">
                      {d.services.map((s) => (
                        <li key={s.id} className="flex items-baseline justify-between gap-4 py-3.5">
                          <span className="min-w-0">
                            <span className="block text-[1.02rem] leading-snug">{s.name}</span>
                            <span className="mt-0.5 block text-[0.84rem] text-pedra">
                              {prumoDuration(s.minutes)}
                              {s.note ? <span> · {s.note}</span> : null}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-display text-[1.5rem] leading-none tabular-nums">{prumoPrice(s.price)}</span>
                            <span className="mt-1 block text-[0.68rem] font-semibold tracking-[0.12em] text-pedra uppercase">{disciplines.plusVat}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`#${prumoSections.book}`}
                      onClick={() => pick(d.services[0].id)}
                      className="group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-ardosia px-6 py-2 text-left text-[0.95rem] font-semibold text-cal transition-colors hover:bg-ardosia-3"
                    >
                      {disciplines.book} · {d.title}
                      <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
