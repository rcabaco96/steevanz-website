"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { Skyline } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One sentence, very large, that lights up word by word as it is read (the scroll drives it).
// After React Bits' ScrollReveal (MIT + Commons Clause, © David Haz; licence in ./react-bits/LICENSE.md): the
// words start dim and blurred and come into focus with the scroll. Fully readable without JavaScript and with
// reduced motion.
export function Manifesto({ copy }: { copy: ErmitaCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-word]"),
          { opacity: 0.12, filter: "blur(6px)", yPercent: 18 },
          {
            opacity: 1,
            filter: "blur(0px)",
            yPercent: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: q("[data-text]")[0], start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          q("[data-skyline]"),
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 20%", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={manifesto.eyebrow} className="relative overflow-hidden bg-cal px-5 py-28 text-azulejo-deep sm:px-8 sm:py-40">
      <div className="mx-auto flex max-w-[64rem] flex-col items-center text-center">
        <div data-skyline className="w-[min(60vw,18rem)] text-azulejo/70">
          <Skyline className="w-full" />
        </div>
        <p className="oe-eyebrow mt-8 text-oliva">{manifesto.eyebrow}</p>
        <p data-text className="mt-8 font-serif text-[clamp(1.9rem,6.2vw,4.3rem)] leading-[1.12] font-medium tracking-[-0.01em]">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="inline-block will-change-[opacity,filter,transform]">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
