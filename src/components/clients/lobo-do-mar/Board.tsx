"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { SplitText } from "./react-bits/SplitText";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A jagged bubble like the ones chalked on the board (a star with many soft points). */
function burst(points: number, inner: number, outer: number) {
  const path: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / points;
    path.push(`${(100 + r * Math.cos(a) * 1.5).toFixed(1)},${(60 + r * Math.sin(a) * 0.82).toFixed(1)}`);
  }
  return `M${path.join("L")}Z`;
}
const bubblePath = burst(13, 48, 58);

// The board by the door, on screen: the slate, the dishes written in chalk line by line as the board comes into
// view (each line uncovered from left to right, as if written), the chalked bubbles drawing themselves round
// their words, and the photo of the real board beside it. Reduced motion: everything already written.
export function Board({ copy }: { copy: LoboCopy }) {
  const { board } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q("[data-column]").forEach((column) => {
          gsap.fromTo(
            column.querySelectorAll("[data-line]"),
            { clipPath: "inset(-20% 100% -20% 0)" },
            { clipPath: "inset(-20% 0% -20% 0)", ease: "none", stagger: 0.12, scrollTrigger: { trigger: column, start: "top 80%", end: "bottom 55%", scrub: 0.5 } },
          );
        });
        gsap.utils.toArray<SVGPathElement>("[data-bubble] path", root.current).forEach((path) => {
          const length = path.getTotalLength();
          gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path, start: "top 85%", end: "top 50%", scrub: 0.6 } });
        });
        gsap.fromTo(q("[data-photo]"), { rotate: -8, yPercent: 10 }, { rotate: 3, yPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.board} aria-labelledby="lm-board-title" className="lm-slate relative overflow-hidden py-24 text-areia sm:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <p className="lm-eyebrow text-coral">{board.eyebrow}</p>
            <h2 id="lm-board-title" className="mt-5 font-display text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.98] font-extrabold uppercase">
              <SplitText text={board.title} splitType="words" delay={60} />
            </h2>
            <p className="mt-5 max-w-lg text-areia/75">{board.intro}</p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {board.columns.map((column) => (
                <div key={column.name} data-column>
                  <h3 className="lm-chalk flex items-center gap-3 text-[2rem] leading-none font-bold text-[#b8f0a8]">
                    <span aria-hidden="true">→</span>
                    {column.name}
                    <span aria-hidden="true">←</span>
                  </h3>
                  <ul className="mt-4 flex flex-col gap-1">
                    {column.dishes.map((dish) => (
                      <li key={dish} data-line className="lm-chalk text-[1.7rem] leading-snug text-areia/95 sm:text-[1.85rem]">
                        {dish}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {board.bubbles.map((bubble) => (
                <li key={bubble} data-bubble className="relative grid aspect-[5/3] place-items-center text-center">
                  <svg aria-hidden="true" viewBox="0 0 200 120" className="absolute inset-0 h-full w-full overflow-visible text-[#b8f0a8]">
                    <path d={bubblePath} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                  </svg>
                  <span className="lm-chalk relative px-6 text-[1.35rem] leading-tight font-bold text-[#b8f0a8] sm:text-[1.5rem]">{bubble}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 font-display text-xs tracking-[0.18em] text-areia/60 uppercase">{board.note}</p>
          </div>

          <figure className="hidden lg:block">
            <div data-photo className="sticky top-28 overflow-hidden rounded-xl border-[10px] border-[#a8673a] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
              <Image src={lobo.media.board} alt={board.alt} width={loboPhotoSize.board.width} height={loboPhotoSize.board.height} sizes="22rem" className="h-auto w-full" />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
