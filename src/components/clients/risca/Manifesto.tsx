"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RiscaCopy } from "@/content/risca/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// How far the slanted edge leans, in % of the block's width (the bottom of the edge trails the top).
const lean = 22;

function Words({ copy, solid }: { copy: RiscaCopy; solid: boolean }) {
  return (
    <>
      {copy.manifesto.words.map((w, i) => (
        <span key={i}>
          <span
            className={
              w.serif
                ? `rc-serif text-[1.08em] leading-none ${solid ? "text-gesso" : "rc-outline"}`
                : w.accent
                  ? solid
                    ? "text-vermelhao"
                    : "rc-outline"
                  : solid
                    ? "text-gesso"
                    : "rc-outline"
            }
          >
            {w.text}
          </span>{" "}
        </span>
      ))}
    </>
  );
}

// The manifesto, on ink. The sentence first stands only in outline; scrolling holds the scene (pin + scrub) while a
// vermilion line at the angle of the parting sweeps across it, and everything the line has passed is cut into solid
// letters. Reduced motion and no JavaScript: the sentence is simply solid.
export function Manifesto({ copy }: { copy: RiscaCopy }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const edge = (x: number) => `polygon(-${lean}% 0%, ${x}% 0%, ${x - lean}% 100%, -${lean}% 100%)`;
        gsap.set(q("[data-outline]"), { opacity: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-solid]"), { clipPath: edge(0) }, { clipPath: edge(100 + lean), duration: 1 }, 0)
          .fromTo(q("[data-sweep]"), { xPercent: 0, opacity: 1 }, { xPercent: 100 + lean, duration: 1 }, 0)
          .to(q("[data-sweep]"), { opacity: 0, duration: 0.08 }, 0.95)
          .fromTo(q("[data-count]"), { textContent: 0 }, { textContent: copy.manifesto.words.length, snap: { textContent: 1 }, duration: 1 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const text = "rc-display text-[clamp(2.9rem,11.5vw,8.6rem)] leading-[0.92]";
  return (
    <section ref={root} aria-label={copy.manifesto.label} className="rc-on-dark relative flex min-h-svh items-center overflow-hidden bg-tinta py-24 text-gesso">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8">
        <p className="rc-label mb-8 flex items-center gap-4 text-gesso/60">
          <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
          {copy.manifesto.label}
          <span aria-hidden="true" className="ml-auto tabular-nums text-gesso/40">
            <span data-count>{copy.manifesto.words.length}</span>/{copy.manifesto.words.length}
          </span>
        </p>
        <div className="relative">
          {/* The outline: only seen while the line hasn't passed (decoration; the solid copy is the text). */}
          <p data-outline aria-hidden="true" className={`${text} absolute inset-0 opacity-0`}>
            <Words copy={copy} solid={false} />
          </p>
          <p data-solid className={`${text} relative`}>
            <Words copy={copy} solid />
          </p>
          <svg
            data-sweep
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible motion-safe:block"
            style={{ opacity: 0 }}
          >
            <line x1="0" y1="0" x2={-lean} y2="100" stroke="var(--color-vermelhao)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </section>
  );
}
