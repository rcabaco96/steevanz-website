"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumoDuration } from "@/content/prumo/facts";
import { Bob } from "./Logo";
import { CountUp } from "./react-bits/CountUp";
import { prumoSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The first consultation, step by step, on slate. The four steps are threaded on the plumb line one under the other,
// like vertebrae: each slides down the thread, leaning, and comes to rest straight under the one before (GSAP pin +
// scrub on screens tall enough; on phones each step settles as it scrolls in). The minutes add up to the hour
// (React Bits CountUp). Reduced motion or no JavaScript: the steps simply stand in place.
export function FirstVisit({ copy }: { copy: PrumoCopy }) {
  const { firstVisit } = copy;
  const root = useRef<HTMLElement>(null);
  const total = firstVisit.steps.reduce((sum, s) => sum + s.minutes, 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-thread]"), { scaleY: 0 }, { scaleY: 1, duration: 0.5 }, 0);
        q("[data-vertebra]").forEach((v, i) => {
          tl.fromTo(
            v,
            { y: -260 - i * 40, rotate: i % 2 ? 9 : -9, opacity: 0 },
            { y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" },
            0.25 + i * 0.45,
          );
        });
        tl.fromTo(q("[data-vbob]"), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.25 + firstVisit.steps.length * 0.45);
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 759px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-vertebra]").forEach((v, i) => {
          gsap.fromTo(
            v,
            { y: -50, rotate: i % 2 ? 6 : -6, opacity: 0.2 },
            { y: 0, rotate: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: v, start: "top 92%", end: "top 62%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={prumoSections.firstVisit}
      aria-labelledby="pr-first-title"
      className="pr-on-dark pr-grid pr-grid-dark relative overflow-hidden bg-ardosia py-24 text-cal sm:py-32 lg:flex lg:min-h-svh lg:items-center lg:py-20"
    >
      <div className="mx-auto grid w-full max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <p className="pr-label mb-6 flex items-center gap-4 text-latao-claro">
            <span aria-hidden="true" className="h-px w-10 bg-latao-claro" />
            {firstVisit.eyebrow}
          </p>
          <h2 id="pr-first-title" className="font-display text-[clamp(2.7rem,9.5vw,5.6rem)] leading-[0.98] tracking-[-0.015em]">
            {firstVisit.title} <span className="block text-latao-claro italic">{firstVisit.titleItalic}</span>
          </h2>
          <p className="mt-6 max-w-md text-[1.02rem] leading-[1.75] text-cal/80">{firstVisit.intro}</p>
          <p className="mt-8 flex items-baseline gap-3">
            <CountUp to={total} className="font-display text-[clamp(3.6rem,12vw,6rem)] leading-none text-latao-claro" />
            <span className="text-cal/75">{firstVisit.totalLabel}</span>
          </p>
          <p className="mt-6 max-w-md border-l border-latao-claro/60 pl-4 text-[0.95rem] leading-relaxed text-cal/75">{firstVisit.note}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem]">
          <span aria-hidden="true" data-thread className="absolute top-0 bottom-0 left-1/2 w-px origin-top -translate-x-1/2 bg-latao-claro/70" />
          <ol className="relative flex flex-col gap-3">
            {firstVisit.steps.map((step, i) => (
              <li key={step.title} data-vertebra className="will-change-transform">
                <div className="relative rounded-[2rem] bg-cal px-5 py-5 sm:rounded-[999px] sm:px-7 text-tinta shadow-[0_24px_50px_-30px_rgb(0_0_0/0.8)] sm:px-10 sm:py-6">
                  <div className="flex items-center gap-5">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ardosia text-cal">
                      <span className="text-center leading-none">
                        <span className="block font-display text-xl">{step.minutes}</span>
                        <span className="block text-[0.6rem] font-semibold tracking-[0.12em] uppercase">min</span>
                      </span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[1.45rem] leading-tight">
                        <span className="sr-only">
                          {i + 1}. ({prumoDuration(step.minutes)}){" "}
                        </span>
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[0.92rem] leading-snug text-pedra">{step.text}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" data-vbob className="relative mt-2 flex flex-col items-center">
            <span className="block h-8 w-px bg-latao-claro/70" />
            <Bob className="h-10 w-auto" color="var(--color-latao-claro)" />
          </div>
        </div>
      </div>
    </section>
  );
}
