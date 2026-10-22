"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import type { ErmitaLocale } from "@/content/o-ermita/routes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Enough tiles to cover the section: 6 a row on phones, 12 from 640 px (the rest overflow, hidden). */
const tiles = 132;

// 54 000 tiles: a wall of cobalt azulejos that turn over one by one from the centre as the section comes in,
// while the number counts up (GSAP, scrubbed by the scroll). The final number is in the HTML, so it is right
// without JavaScript, for screen readers and with reduced motion (then the wall simply stands there).
export function AzulejoWall({ copy, locale }: { copy: ErmitaCopy; locale: ErmitaLocale }) {
  const { azulejos } = copy;
  const root = useRef<HTMLElement>(null);
  const formatted = azulejos.value.toLocaleString(locale === "pt" ? "pt-PT" : "en-GB");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const number = q("[data-number]")[0] as HTMLElement | undefined;
        const counter = { value: 0 };
        const fmt = new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB");
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: 0.7 } });
        tl.fromTo(
          q("[data-tile]"),
          { rotateY: -90, opacity: 0 },
          { rotateY: 0, opacity: 1, ease: "power2.out", stagger: { grid: "auto", from: "center", amount: 0.8 } },
          0,
        )
          .to(
            counter,
            {
              value: azulejos.value,
              ease: "power1.out",
              duration: 0.9,
              onUpdate: () => {
                if (number) number.textContent = fmt.format(Math.round(counter.value / 10) * 10);
              },
            },
            0.1,
          )
          .fromTo(q("[data-card]"), { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, ease: "power3.out", duration: 0.5 }, 0.2);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="oe-tiles-title" className="relative isolate overflow-hidden bg-azulejo-deep py-28 text-cal sm:py-40">
      <div aria-hidden="true" className="absolute inset-0 grid auto-rows-[calc(100vw/6)] grid-cols-6 content-center overflow-hidden [perspective:900px] sm:auto-rows-[calc(100vw/12)] sm:grid-cols-12">
        {Array.from({ length: tiles }, (_, i) => (
          <span key={i} data-tile className="oe-tile block border-[0.5px] border-azulejo-deep/60 will-change-transform" />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,rgb(19_40_90/0.92)_0%,rgb(19_40_90/0.55)_60%,rgb(19_40_90/0.2)_100%)]" />

      <div data-card className="oe-arch relative mx-4 flex max-w-[44rem] flex-col items-center bg-azulejo-deep/92 px-6 pt-20 pb-12 text-center shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-ouro/30 sm:mx-auto sm:px-14 sm:pt-28 sm:pb-16">
        <h2 id="oe-tiles-title" className="flex flex-col items-center">
          <span data-number className="font-serif text-[clamp(3.6rem,17vw,9.5rem)] leading-[0.9] font-medium tabular-nums tracking-[-0.02em]">
            {formatted}
          </span>
          <span className="oe-eyebrow mt-5 text-ouro">{azulejos.label}</span>
        </h2>
        <span aria-hidden="true" className="oe-diamond mt-10 text-ouro" />
        <p className="mt-8 font-serif text-[clamp(1.4rem,4vw,2.2rem)] leading-[1.3] italic">{azulejos.line}</p>
        <p className="oe-eyebrow mt-6 text-cal/60">{azulejos.source}</p>
      </div>
    </section>
  );
}
