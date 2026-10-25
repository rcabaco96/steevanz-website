"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { oQuintal } from "@/content/o-quintal/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 2 — «O quadro de ardósia». The business's own sentence (its home page, verbatim) written on the stall's
// slate: each word is chalked in as the scroll reads it (after React Bits' ScrollReveal: dim and blurred → sharp),
// while a chalk underline draws itself under «estandarte». Readable without JavaScript and with reduced motion.
export function Chalkboard() {
  const root = useRef<HTMLElement>(null);
  const words = oQuintal.promise.split(" ");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-word]"),
          { opacity: 0.1, filter: "blur(5px)", rotate: -2 },
          { opacity: 1, filter: "blur(0px)", rotate: 0, ease: "none", stagger: 0.05, scrollTrigger: { trigger: q("[data-text]")[0], start: "top 80%", end: "bottom 50%", scrub: 0.6 } },
        );
        gsap.fromTo(q("[data-line]"), { strokeDashoffset: 420 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: q("[data-text]")[0], start: "center 70%", end: "bottom 45%", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="A nossa promessa" className="relative overflow-hidden bg-ardosia px-4 py-24 text-giz sm:px-8 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.2rem] border-[10px] border-caixote-deep/70 sm:inset-6 sm:border-[14px]" />
      <div className="relative mx-auto max-w-[60rem] text-center">
        <p className="oq-stamp text-limao">Escrito no quadro</p>
        <p data-text className="mt-8 font-giz text-[clamp(2.1rem,7.4vw,4.4rem)] leading-[1.12]">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="inline-block will-change-[opacity,filter]">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
        <svg aria-hidden="true" viewBox="0 0 400 20" className="mx-auto mt-4 h-5 w-[min(70%,22rem)] text-limao">
          <path data-line d="M4 14 C 90 4, 200 18, 396 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="420" />
        </svg>
        <p className="mt-8 text-giz/65">{oQuintal.producers}</p>
      </div>
    </section>
  );
}
