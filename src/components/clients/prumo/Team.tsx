"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumoPhotos } from "@/content/prumo/facts";
import { prumoSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The team (fictional, said on the page; hands at work, never faces presented as the therapists). Each card hangs
// from its own thread on a brass rail: as the section scrolls in they arrive swinging, each at its own angle, and
// come to rest hanging straight (GSAP scrub, rotate only). Regulated professions show the licence number as an
// obvious placeholder. Reduced motion: hanging still.
export function Team({ copy }: { copy: PrumoCopy }) {
  const { team } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-person]"),
          { rotate: (i) => [-12, 9, -7, 11, -9][i % 5], y: (i) => -30 - (i % 3) * 20 },
          { rotate: 0, y: 0, ease: "elastic.out(1, 0.5)", stagger: 0.08, scrollTrigger: { trigger: q("[data-rail]")[0], start: "top 85%", end: "top 25%", scrub: 0.8 } },
        );
      });
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-person]").forEach((person, i) => {
          gsap.fromTo(
            person,
            { rotate: i % 2 ? 5 : -5 },
            { rotate: 0, ease: "power2.out", scrollTrigger: { trigger: person, start: "top 95%", end: "top 60%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={prumoSections.team} aria-labelledby="pr-team-title" className="relative overflow-hidden bg-anca pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
              <span aria-hidden="true" className="h-px w-10 bg-latao" />
              {team.eyebrow}
            </p>
            <h2 id="pr-team-title" className="font-display text-[clamp(2.7rem,9.5vw,5.6rem)] leading-[0.98] tracking-[-0.015em]">
              {team.title} <span className="text-latao-fundo italic">{team.titleItalic}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.02rem] leading-[1.75] text-pedra">{team.intro}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cal px-3 py-1.5 text-[0.82rem] text-tinta">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-latao" />
              {team.note}
            </p>
          </div>
        </div>

        <div className="relative mt-14 sm:mt-20">
          <span aria-hidden="true" data-rail className="absolute inset-x-0 top-0 hidden h-[3px] rounded-full bg-latao/70 lg:block" />
          <ul className="grid gap-4 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-5">
            {team.list.map((person) => {
              const photo = prumoPhotos[person.image];
              return (
                <li key={person.id} data-person className="relative origin-top will-change-transform lg:pt-10">
                  <span aria-hidden="true" className="absolute top-0 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-tinta/40 lg:block" />
                  <article className="flex gap-4 overflow-hidden rounded-[1.5rem] bg-cal p-3 shadow-[0_24px_50px_-36px_rgb(29_39_48/0.6)] md:block md:p-0">
                    <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-[1.1rem] bg-ardosia md:aspect-[4/5] md:w-full md:rounded-none">
                      <Image src={photo.src} alt={person.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 112px" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 py-1 md:p-5">
                      <h3 className="font-display text-[1.4rem] leading-tight">{person.name}</h3>
                      <p className="mt-0.5 text-[0.95rem] font-semibold text-latao-fundo">{person.role}</p>
                      <p className="mt-2 text-[0.88rem] leading-snug text-pedra">{person.focus}</p>
                      {person.licence ? (
                        <p className="mt-3 text-[0.78rem] text-pedra">
                          {team.licenceLabel}: <span className="font-semibold text-tinta">{team.licencePlaceholder}</span>
                        </p>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
