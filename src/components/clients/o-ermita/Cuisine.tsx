"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ermita, ermitaImageSize } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { Skyline } from "./Logo";
import { Reveal } from "./Reveal";
import { SplitText } from "./react-bits/SplitText";
import { ermitaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The cuisine: the dishes the hotel's own page names from the menu, set like a printed menu card (no prices:
// the restaurant's menu is not public), the cellar in the afternoon light, the chef and the sommelier.
export function Cuisine({ copy }: { copy: ErmitaCopy }) {
  const { cuisine } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const photo = q("[data-photo]")[0];
        if (photo) {
          gsap.fromTo(
            q("[data-photo] img"),
            { yPercent: -7, scale: 1.18 },
            { yPercent: 7, scale: 1.18, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        }
        gsap.fromTo(
          q("[data-card]"),
          { y: 60 },
          { y: -20, ease: "none", scrollTrigger: { trigger: q("[data-card]")[0], start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ermitaSections.cuisine} aria-labelledby="oe-cuisine-title" className="relative overflow-hidden bg-linho py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-14">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="oe-eyebrow mb-6 flex items-center gap-4 text-oliva">
              <span aria-hidden="true" className="h-px w-10 bg-oliva/60" />
              {cuisine.eyebrow}
            </p>
            <h2 id="oe-cuisine-title" className="font-serif text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.98] font-medium tracking-[-0.01em]">
              <SplitText text={cuisine.title} splitType="words" delay={70} className="block" />{" "}
              <span className="block text-oliva italic">{cuisine.titleItalic}</span>
            </h2>
            <Reveal delay={150}>
              <p className="mt-7 max-w-lg text-[1rem] leading-[1.8] text-pedra sm:text-[1.05rem]">{cuisine.intro}</p>
            </Reveal>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <div data-photo className="relative aspect-[4/5] overflow-hidden rounded-[0.4rem] bg-noite sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image
                src={ermita.media.cellar}
                alt={cuisine.imageAlt}
                width={ermitaImageSize.wide.width}
                height={ermitaImageSize.wide.height}
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover object-[38%_50%] will-change-transform"
              />
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div data-card className="oe-menu-card relative px-6 py-12 text-center will-change-transform sm:px-14 sm:py-16">
              <Skyline className="mx-auto w-40 text-oliva/80 sm:w-48" />
              <h3 className="oe-eyebrow mt-6 text-oliva">{cuisine.menuTitle}</h3>
              <div className="mt-10 flex flex-col gap-10">
                {cuisine.courses.map((course, i) => (
                  <Reveal key={course.name} delay={i * 110}>
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex items-center gap-3 text-ouro">
                        <span aria-hidden="true" className="h-px w-8 bg-current" />
                        <h4 className="oe-eyebrow text-azulejo">{course.name}</h4>
                        <span aria-hidden="true" className="h-px w-8 bg-current" />
                      </div>
                      <ul className="flex flex-col gap-3">
                        {course.dishes.map((dish) => (
                          <li key={dish} className="font-serif text-[1.45rem] leading-snug text-tinta sm:text-[1.7rem]">
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
              <span aria-hidden="true" className="oe-diamond mx-auto mt-12 block text-ouro" />
              <p className="mt-6 font-serif text-lg text-pedra italic">{cuisine.menuNote}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:mt-28 md:grid-cols-2 md:gap-8">
          {cuisine.people.map((person, i) => (
            <Reveal key={person.name} delay={i * 120}>
              <article className="flex h-full flex-col gap-5 border-t border-oliva/30 pt-8 sm:flex-row sm:gap-7">
                <span
                  aria-hidden="true"
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-serif text-2xl text-oliva italic ring-1 ring-oliva/45"
                >
                  {person.initials}
                </span>
                <div>
                  <p className="oe-eyebrow text-oliva">{person.role}</p>
                  <h3 className="mt-2 font-serif text-[2rem] leading-tight font-medium">{person.name}</h3>
                  <p className="mt-3 max-w-md leading-[1.75] text-pedra">{person.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
