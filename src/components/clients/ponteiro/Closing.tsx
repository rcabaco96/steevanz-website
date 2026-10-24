"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiroPhotos } from "@/content/ponteiro/facts";
import { Mark } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The end of the day, before the footer. Over the street at night and the café's neon sign, the line «Até amanhã.»;
// as the page reaches the end the steel shutter comes down over it (GSAP scrub, transform only), its sign saying when
// the door goes up again — the opening scene, played backwards. Reduced motion: the shutter half down, still. Without
// JavaScript the shutter stays hidden (the script places it).
export function Closing({ copy }: { copy: PonteiroCopy }) {
  const { closing } = copy;
  const root = useRef<HTMLElement>(null);
  const neon = ponteiroPhotos.neon;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-closing-shutter]"),
          { yPercent: -100, autoAlpha: 1 },
          { yPercent: -38, ease: "none", scrollTrigger: { trigger: el, start: "top 45%", end: "bottom bottom", scrub: 0.6 } },
        );
        gsap.fromTo(q("[data-closing-words]"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 75%", end: "top 30%", scrub: 0.6 } });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-closing-shutter]"), { yPercent: -60, autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pn-closing-title" className="pn-on-dark relative isolate flex min-h-[78svh] items-end overflow-hidden bg-noite text-papel">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={neon.src} alt="" width={neon.width} height={neon.height} sizes="100vw" className="pn-hum h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(27_24_56/0.2),rgb(27_24_56/0.55)_55%,rgb(27_24_56/0.95))]" />
      </div>

      {/* The shutter coming down from the top. */}
      <div data-closing-shutter aria-hidden="true" className="pn-slats invisible absolute inset-x-0 top-0 h-full will-change-transform">
        <div className="absolute inset-x-0 bottom-7 flex justify-center">
          <span className="flex items-center gap-3 rounded-full bg-noite px-5 py-2.5 text-papel">
            <Mark className="h-6 w-auto text-papel" angle={225} />
            <span className="pn-label pn-neon">{closing.shutterSign}</span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-5 items-center justify-between bg-[#55565f] px-[12%]">
          <span className="h-2.5 w-9 rounded-full bg-[#2c2d33]" />
          <span className="h-2.5 w-9 rounded-full bg-[#2c2d33]" />
        </div>
      </div>

      <div data-closing-words className="relative mx-auto w-full max-w-[84rem] px-5 pb-16 sm:px-8 sm:pb-24">
        <h2 id="pn-closing-title" className="font-display text-[clamp(3.4rem,15vw,10rem)] leading-[0.88]">
          {closing.title}
        </h2>
        <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-papel/80">{closing.line}</p>
      </div>
    </section>
  );
}
