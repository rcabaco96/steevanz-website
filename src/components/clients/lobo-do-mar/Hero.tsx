"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { PhoneIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { loboSections } from "./sections";
import { WaveEdge } from "./WaveEdge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const slides = [lobo.media.seabass, lobo.media.stew, lobo.media.squid] as const;

// The opening: the restaurant's own plates come in one after another like waves — each new photo rises from the
// bottom with a rolling swell on its edge — behind the name in very large letters, which rise letter by letter
// after the curtain. Scrolling away, the name spreads apart and the plates sink slower than the page.
// Reduced motion: the first plate and the name, still.
export function Hero({ copy }: { copy: LoboCopy }) {
  const { hero } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const start = () => {
          gsap.fromTo(q("[data-letter]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.045, duration: 1.1, ease: "power4.out" });
          gsap.fromTo(q("[data-rise]"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, delay: 0.5, ease: "power3.out" });
        };
        if (document.documentElement.classList.contains("lm-loading")) window.addEventListener("lm:revealed", start, { once: true });
        else start();

        // The tide of plates: every few seconds the next one rises over the last.
        const layers = q("[data-slide]");
        gsap.set(layers.slice(1), { yPercent: 100 });
        const cycle = gsap.timeline({ repeat: -1, delay: 3.2 });
        for (let step = 1; step <= layers.length; step++) {
          const next = step % layers.length;
          cycle
            .call(() => {
              gsap.set(layers[next], { zIndex: 2 + step, yPercent: 100 });
            })
            .to(layers[next], { yPercent: 0, duration: 1.4, ease: "power2.inOut" })
            .fromTo(layers[next].querySelector("img"), { scale: 1.18 }, { scale: 1.04, duration: 4.4, ease: "none" }, "<")
            .to({}, { duration: 2.4 });
        }

        gsap.to(q("[data-title]"), {
          letterSpacing: "0.12em",
          yPercent: -18,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q("[data-plates]"), { yPercent: 18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        return () => cycle.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const word = (text: string, className: string) => (
    <span className={`flex justify-center overflow-hidden ${className}`}>
      {text.split("").map((letter, i) => (
        <span key={i} data-letter className="inline-block whitespace-pre will-change-transform">
          {letter}
        </span>
      ))}
    </span>
  );

  return (
    <section ref={root} aria-labelledby="lm-hero-title" className="relative isolate flex min-h-[max(100svh,640px)] flex-col overflow-hidden bg-abismo text-areia">
      <div data-plates className="absolute inset-0 -z-10 will-change-transform">
        {slides.map((src, i) => (
          <div key={src} data-slide className="absolute inset-0" style={{ zIndex: i === 0 ? 1 : 0 }}>
            {/* The foam on the rising plate's edge. */}
            <WaveEdge className="absolute bottom-[calc(100%-1px)] left-0 text-espuma/70" />
            <div className="absolute inset-0 overflow-hidden">
            <Image
              src={src}
              alt={hero.alts[i]}
              width={loboPhotoSize.tall.width}
              height={loboPhotoSize.tall.height}
              sizes="100vw"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgb(11_36_48/0.82)_0%,rgb(11_36_48/0.35)_35%,rgb(11_36_48/0.45)_65%,rgb(11_36_48/0.95)_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col items-center justify-center px-4 pt-28 pb-24 text-center sm:px-8">
        <p data-rise className="lm-eyebrow text-coral">
          {hero.kicker}
        </p>
        <h1 id="lm-hero-title" data-title className="mt-6 font-display leading-[0.86] font-extrabold uppercase">
          {word(hero.titleTop, "text-[clamp(4.6rem,24vw,15rem)]")}
          {word(hero.titleBottom, "lm-outline text-[clamp(3.4rem,17vw,11rem)] text-coral")}
        </h1>
        <p data-rise className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-areia/85 sm:text-lg">
          {hero.lead}
        </p>
        <div data-rise className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Magnet className="w-full sm:w-auto">
            <a
              href={lobo.phoneHref}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-coral px-7 font-display text-[0.72rem] font-bold tracking-[0.18em] text-abismo uppercase shadow-[0_20px_40px_-18px_rgb(255_106_74/0.8)] transition-colors hover:bg-areia sm:w-auto"
            >
              <PhoneIcon width={18} height={18} />
              {hero.call}
            </a>
          </Magnet>
          <a
            href={`#${loboSections.board}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 font-display text-[0.72rem] font-bold tracking-[0.18em] uppercase ring-1 ring-areia/45 backdrop-blur-sm transition-colors hover:bg-areia/10"
          >
            {hero.board}
          </a>
        </div>
      </div>

      <a
        href={`#${loboSections.tides}`}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] font-semibold tracking-[0.3em] text-areia/70 uppercase [@media(min-height:820px)]:flex"
      >
        {hero.scroll}
        <span aria-hidden="true" className="block h-9 w-5 rounded-full ring-1 ring-areia/50">
          <span className="mx-auto mt-1.5 block h-2 w-0.5 animate-bounce rounded-full bg-coral" />
        </span>
      </a>
      <WaveEdge className="absolute -bottom-px left-0 z-10 text-areia" />
    </section>
  );
}
