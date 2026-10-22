"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ermitaPhotos } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Stepping into the Bishop's Chapel: the scene holds still while the dining room opens out of a narrow arch
// until it fills the screen, the painted vault settling into place; the title steps aside as the room opens and
// the words about the vault come in at the end (GSAP pin + scrub). Reduced motion: the full photo and the text.
export function SalaReveal({ copy }: { copy: ErmitaCopy }) {
  const { sala } = copy;
  const root = useRef<HTMLElement>(null);
  const photo = ermitaPhotos.salaFresco;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
        (context) => {
          const wide = Boolean(context.conditions?.wide);
          const q = gsap.utils.selector(root);
          const start = wide ? "inset(18% 40% 18% 40% round 999px 999px 8px 8px)" : "inset(33% 20% 10% 20% round 999px 999px 8px 8px)";
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.8, anticipatePin: 1 },
          });
          tl.fromTo(q("[data-frame]"), { clipPath: start }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power2.inOut", duration: 0.7 }, 0)
            .fromTo(q("[data-photo]"), { scale: 1.45, yPercent: 6 }, { scale: 1.05, yPercent: 0, duration: 1 }, 0)
            .fromTo(q("[data-title-left]"), { xPercent: 0, opacity: 1 }, { xPercent: -40, opacity: 0, duration: 0.45 }, 0.15)
            .fromTo(q("[data-title-right]"), { xPercent: 0, opacity: 1 }, { xPercent: 40, opacity: 0, duration: 0.45 }, 0.15)
            .fromTo(q("[data-caption]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.7);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="oe-sala-title" className="relative isolate h-svh min-h-[620px] overflow-hidden bg-cal text-cal">
      <h2 id="oe-sala-title" className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start gap-2 px-5 pt-[max(6rem,12svh)] text-center font-serif leading-[0.95] font-medium text-azulejo-deep motion-reduce:sr-only md:justify-center md:pt-0">
        <span data-title-left className="block text-[clamp(2.6rem,9vw,6.5rem)] md:-translate-x-[32vw]">
          {sala.title}
        </span>
        <span data-title-right className="block text-[clamp(2rem,6.5vw,4.6rem)] text-azulejo italic md:translate-x-[27vw]">
          {sala.titleItalic}
        </span>
      </h2>

      <div data-frame className="absolute inset-0 overflow-hidden bg-noite will-change-[clip-path]">
        <Image
          data-photo
          src={photo.src}
          alt={sala.alt}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] will-change-transform"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent,rgb(15_22_36/0.85))]" />
      </div>

      <div data-caption className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[88rem] px-5 pb-12 sm:px-8 sm:pb-16">
        <p className="oe-eyebrow flex items-center gap-4 text-ouro">
          <span aria-hidden="true" className="h-px w-10 bg-ouro/70" />
          {sala.eyebrow}
        </p>
        <p aria-hidden="true" className="mt-4 hidden font-serif text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.98] font-medium motion-reduce:block">
          {sala.title} <span className="text-ouro italic">{sala.titleItalic}</span>
        </p>
        <p className="mt-5 max-w-xl font-serif text-[clamp(1.25rem,3.4vw,1.9rem)] leading-[1.35] text-cal/95 italic">{sala.text}</p>
      </div>
    </section>
  );
}
