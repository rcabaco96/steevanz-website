"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A fixed, gentle disorder for each word (the same on the server and in the browser). */
function lean(i: number) {
  const r = Math.sin(i * 12.9898) * 43758.5453;
  const f = r - Math.floor(r);
  const g = Math.sin(i * 78.233) * 12345.678;
  const h = g - Math.floor(g);
  return { rotate: (f - 0.5) * 16, y: (h - 0.5) * 34, x: (f - 0.5) * 10 };
}

// How the clinic works, in one sentence that starts out of line — each word leaning and off the baseline, like a
// body out of plumb — and settles word by word as the page scrolls (GSAP scrub; pinned on large screens), while a
// brass level line draws under it. Reduced motion or no JavaScript: the sentence simply stands straight.
export function Manifesto({ copy }: { copy: PrumoCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const build = (pin: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.7, anticipatePin: 1 }
            : { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.7 },
        });
        tl.fromTo(
          q("[data-word]"),
          { rotate: (i) => lean(i).rotate, y: (i) => lean(i).y, x: (i) => lean(i).x, opacity: 0.28 },
          { rotate: 0, y: 0, x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" },
          0,
        ).fromTo(q("[data-level]"), { scaleX: 0 }, { scaleX: 1, duration: 0.6 + words.length * 0.05 }, 0);
      };
      mm.add("(min-width: 768px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)", () => build(true));
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)", () => build(false));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pr-manifesto-title" className="pr-grid relative flex min-h-svh items-center overflow-hidden bg-cal py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <h2 id="pr-manifesto-title" className="pr-label mb-8 flex items-center gap-4 text-latao-fundo">
          <span aria-hidden="true" className="h-px w-10 bg-latao" />
          {manifesto.eyebrow}
        </h2>
        <p className="font-display text-[clamp(1.85rem,6.4vw,4.4rem)] leading-[1.14] tracking-[-0.01em] text-tinta">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="inline-block origin-bottom will-change-transform">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
        <span aria-hidden="true" data-level className="mt-10 block h-px w-full origin-left bg-latao" />
        <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-pedra">{manifesto.note}</p>
      </div>
    </section>
  );
}
