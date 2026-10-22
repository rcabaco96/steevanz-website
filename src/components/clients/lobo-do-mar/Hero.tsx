"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { AutoVideo } from "./AutoVideo";
import { PhoneIcon, PlayIcon } from "./icons";
import { Badge } from "./Logo";
import { Magnet } from "./react-bits/Magnet";
import { WaveEdge } from "./WaveEdge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const clips = [
  { src: lobo.media.clipShowcase, poster: lobo.media.clipShowcasePoster },
  { src: lobo.media.clipTank, poster: lobo.media.clipTankPoster },
  { src: lobo.media.clipFish, poster: lobo.media.clipFishPoster },
] as const;

// The opening, in the restaurant's own reels: on large screens three of them stand side by side like phones (the
// display, the live tank, the fish of the day), each column drifting at its own speed as the page scrolls; on phones
// the display fills the screen. The name rises letter by letter in the logo's heavy slab capitals after the curtain.
export function Hero({ copy }: { copy: LoboCopy }) {
  const { hero } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const start = () => {
          gsap.fromTo(q("[data-letter]"), { yPercent: 110 }, { yPercent: 0, stagger: 0.04, duration: 1, ease: "power4.out" });
          gsap.fromTo(q("[data-rise]"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.09, duration: 0.9, delay: 0.35, ease: "power3.out" });
          gsap.fromTo(q("[data-card]"), { y: 120, opacity: 0, rotate: (i) => [-4, 2, 5][i] ?? 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1.2, ease: "power3.out" });
        };
        if (document.documentElement.classList.contains("lm-loading")) window.addEventListener("lm:revealed", start, { once: true });
        else start();
        q("[data-card]").forEach((card, i) => {
          gsap.to(card, { yPercent: [-14, 10, -22][i] ?? 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        });
        gsap.to(q("[data-copy]"), { yPercent: -10, opacity: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const word = (text: string) =>
    text.split("").map((letter, i) => (
      <span key={i} data-letter className="inline-block whitespace-pre will-change-transform">
        {letter}
      </span>
    ));

  return (
    <section ref={root} aria-labelledby="lm-hero-title" className="relative isolate overflow-hidden bg-abismo text-areia">
      {/* Phones: the display, full screen, behind the words. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden">
        <AutoVideo src={clips[0].src} poster={clips[0].poster} priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(18_33_59/0.85)_0%,rgb(18_33_59/0.35)_38%,rgb(18_33_59/0.55)_68%,rgb(18_33_59/0.96)_100%)]" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 hidden bg-[radial-gradient(80%_70%_at_75%_40%,#1d4fa3_0%,#12213b_60%)] lg:block" />

      <div className="relative mx-auto grid min-h-[max(100svh,680px)] max-w-[90rem] items-center gap-10 px-5 pt-28 pb-24 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-24">
        <div data-copy className="flex flex-col items-start">
          <div data-rise className="flex items-center gap-3">
            <Badge className="h-14 w-14 rounded-full bg-white p-0.5" />
            <p className="lm-eyebrow text-coral">{hero.kicker}</p>
          </div>
          <h1 id="lm-hero-title" className="mt-7 font-display leading-[0.86] uppercase">
            <span className="flex overflow-hidden text-[clamp(4.4rem,21vw,10.5rem)]">{word(hero.titleTop)}</span>
            <span className="flex overflow-hidden text-[clamp(3.4rem,15.5vw,8rem)] text-coral">{word(hero.titleBottom)}</span>
          </h1>
          <p data-rise className="mt-4 font-display text-sm tracking-[0.5em] text-areia/80 uppercase">
            {hero.sub}
          </p>
          <p data-rise className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-areia/90 sm:text-lg">
            {hero.lead}
          </p>
          <div data-rise className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Magnet className="w-full sm:w-auto">
              <a
                href={lobo.phoneHref}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-coral px-7 text-[0.82rem] font-bold tracking-[0.14em] text-white uppercase shadow-[0_20px_40px_-18px_rgb(236_111_79/0.9)] transition-colors hover:bg-coral-deep sm:w-auto"
              >
                <PhoneIcon width={18} height={18} />
                {hero.book}
              </a>
            </Magnet>
            <a
              href={lobo.menu}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white/10 px-7 text-[0.82rem] font-bold tracking-[0.14em] uppercase ring-1 ring-white/40 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <PlayIcon width={14} height={14} />
              {hero.menu}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>

        {/* Large screens: three reels side by side. */}
        <div aria-hidden="true" className="relative hidden h-[78svh] max-h-[46rem] grid-cols-3 items-center gap-5 lg:grid">
          {clips.map((clip, i) => (
            <figure key={clip.src} data-card className={`relative will-change-transform ${i === 1 ? "translate-y-10" : "-translate-y-6"}`}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-abismo-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/15">
                <AutoVideo src={clip.src} poster={clip.poster} priority={i === 0} />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgb(18_33_59/0.85))]" />
                <figcaption className="absolute bottom-4 left-4 font-display text-sm tracking-[0.12em] uppercase">{hero.clips[i]}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <WaveEdge className="absolute -bottom-px left-0 z-10 text-areia" />
    </section>
  );
}
