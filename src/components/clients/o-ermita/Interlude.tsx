"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import type { ErmitaCopy } from "@/content/o-ermita/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A pause between rooms: one line about the convent's azulejos, its words lighting up one by one as it scrolls
// past, over a tile pattern that drifts slower than the page. Opacity and transforms only.
export function Interlude({ copy }: { copy: ErmitaCopy }) {
  const { interlude } = copy;
  const root = useRef<HTMLElement>(null);
  const words = interlude.line.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-word]"),
          { opacity: 0.16 },
          { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: 0.5 } },
        );
        gsap.fromTo(q("[data-pattern]"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={interlude.source} className="relative isolate overflow-hidden bg-azulejo-deep py-24 text-cal sm:py-36">
      <div data-pattern aria-hidden="true" className="oe-azulejo-dark absolute -inset-y-[15%] inset-x-0 -z-10 opacity-[0.09] will-change-transform" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_50%,rgb(19_40_90/0.2),rgb(15_22_36/0.75))]" />
      <figure className="mx-auto max-w-[62rem] px-5 text-center sm:px-8">
        <span aria-hidden="true" className="oe-diamond mx-auto mb-10 block text-ouro" />
        <div className="font-serif text-[clamp(1.85rem,6.4vw,3.9rem)] leading-[1.18] font-medium italic">
          <p>
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span data-word className="inline-block">
                  {word}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        </div>
        <figcaption className="oe-eyebrow mt-10 text-ouro">{interlude.source}</figcaption>
      </figure>
    </section>
  );
}
