"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roaz } from "@/content/roaz/facts";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { roazSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const portraitQuery = "(orientation: portrait) and (max-width: 900px)";
function subscribeTo(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}
const subscribeMotion = subscribeTo(reducedQuery);
const subscribePortrait = subscribeTo(portraitQuery);

/** Compass bearings every 15°, the cardinal points named. */
const bearings = Array.from({ length: 25 }, (_, i) => i * 15).map((deg) => ({ deg, name: { 0: "N", 90: "E", 180: "S", 270: "W", 360: "N" }[deg] }));

// THE HORIZON. The opening scene: a drone film of the golden cliffs and a boat's wake (the poster frame is the first
// paint; a portrait cut on phones). Scrolling holds the scene (GSAP pin + scrub): the top edge of the film sinks to a
// horizon line that tilts and rolls like a small boat at sea — the film becomes the sea, the salt-white sky opens
// above it with the name of where we are, and a compass ruler slides along the horizon. Reduced motion: the still
// frame, no pin. The film only plays while on screen.
export function Hero({ copy }: { copy: RoazCopy }) {
  const { hero } = copy;
  const m = roaz.media;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  const portrait = useSyncExternalStore(subscribePortrait, () => window.matchMedia(portraitQuery).matches, () => false);

  useEffect(() => {
    const el = film.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk, portrait]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        // The horizon: left and right ends of the film's top edge, in % of the scene's height.
        const edge = { l: 0, r: 0 };
        const frame = q("[data-frame]")[0] as HTMLElement;
        const draw = () => {
          frame.style.clipPath = `polygon(0% ${edge.l}%, 100% ${edge.r}%, 100% 100%, 0% 100%)`;
        };
        draw();
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(edge, { l: 54, r: 46, duration: 0.45, ease: "power2.inOut", onUpdate: draw }, 0)
          .to(edge, { l: 47, r: 55, duration: 0.3, ease: "sine.inOut", onUpdate: draw }, 0.45)
          .to(edge, { l: 51, r: 50, duration: 0.25, ease: "sine.inOut", onUpdate: draw }, 0.75)
          .fromTo(q("[data-film]"), { scale: 1, yPercent: 0 }, { scale: 1.15, yPercent: 8, duration: 1 }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.3 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.08 }, 0)
          .fromTo(q("[data-sky]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
          .fromTo(q("[data-ruler]"), { xPercent: 0 }, { xPercent: -30, duration: 1 }, 0)
          .fromTo(q("[data-bearing]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.62)
          .to({}, { duration: 0.1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt: hero.alt, sizes: "100vw" };
  const { props: { srcSet: portraitSet } } = getImageProps({ ...common, src: m.heroPortraitPoster, width: 720, height: 1280 });
  const { props: { srcSet: wideSet, ...img } } = getImageProps({ ...common, src: m.heroPoster, width: 1600, height: 900, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="rz-hero-title" className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden bg-sal text-sal">
      {/* The sky that opens above the horizon: where we are, and the way we're heading. */}
      <div data-sky aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[13%] px-5 text-center text-fundo opacity-0 sm:top-[12%]">
        <p className="rz-label text-ocre">{roaz.coordinates}</p>
        <p className="rz-title mt-3 text-[clamp(2.6rem,11vw,7.5rem)]">{hero.horizon}</p>
        <p data-bearing className="mt-3 font-display text-[clamp(1.1rem,3.6vw,1.6rem)] font-medium tracking-[0.04em] text-pedra uppercase opacity-0">
          {hero.bearing}
        </p>
      </div>

      <div data-frame className="absolute inset-0 overflow-hidden bg-fundo will-change-[clip-path]">
        <div data-film className="absolute inset-0 origin-bottom will-change-transform">
          <picture>
            <source media={portraitQuery} srcSet={portraitSet} />
            <source srcSet={wideSet} />
            <img {...img} alt={hero.alt} className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          {motionOk ? (
            <video
              key={portrait ? "portrait" : "wide"}
              ref={film}
              src={portrait ? m.heroPortrait : m.hero}
              poster={portrait ? m.heroPortraitPoster : m.heroPoster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_48_58/0.55)_0%,rgb(6_48_58/0.2)_30%,rgb(6_48_58/0.35)_62%,rgb(6_48_58/0.88)_100%)]" />
        {/* The compass ruler riding the horizon. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-sal/25 pb-3 text-sal/70">
          <div data-ruler className="flex w-max will-change-transform">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex">
                {bearings.map((b) => (
                  <span key={`${copyIndex}-${b.deg}`} className="relative flex w-[60px] flex-col items-start">
                    <span className={`block w-px bg-current ${b.name ? "h-4" : "h-2.5"}`} />
                    <span className={`mt-1 -translate-x-1/2 font-stencil text-[0.7rem] tracking-[0.12em] ${b.name ? "text-falesia" : ""}`}>{b.name ?? String(b.deg).padStart(3, "0")}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        data-hero-copy
        className="relative flex w-full flex-1 flex-col justify-end px-5 pt-24 pb-20 sm:px-10 sm:pb-28 lg:px-16 [@media(max-height:700px)]:pt-20 [@media(max-height:700px)]:pb-14"
      >
        <div className="max-w-[60rem]">
          <p className="rz-label rz-rise text-agua-claro [animation-delay:150ms]">{hero.kicker}</p>
          <h1 id="rz-hero-title" className="rz-title rz-rise mt-5 text-[clamp(3rem,12vw,7.4rem)] [animation-delay:350ms] [@media(max-height:700px)]:mt-3 [@media(max-height:700px)]:text-[clamp(2.3rem,10vw,5.6rem)]">
            <span className="sr-only">{roaz.name}: </span>
            {hero.title.split(/(?<=\.)\s/).map((sentence) => (
              <span key={sentence} className="block">
                {sentence}
              </span>
            ))}
          </h1>
          <p className="rz-rise mt-5 max-w-xl text-[1.02rem] leading-relaxed text-sal/90 sm:text-[1.12rem] [animation-delay:550ms] [@media(max-height:700px)]:mt-3 [@media(max-height:700px)]:text-[0.95rem] [@media(max-height:700px)]:leading-snug">{hero.lead}</p>
          <div className="rz-rise mt-7 flex w-full flex-col items-stretch gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center [animation-delay:700ms] [@media(max-height:700px)]:mt-5">
            <Magnet className="w-full min-[420px]:w-auto">
              <a
                href={`#${roazSections.book}`}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-falesia [@media(max-height:700px)]:h-12 px-7 font-display text-[1.2rem] font-bold tracking-[0.08em] text-fundo uppercase shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-falesia-deep min-[420px]:w-auto"
              >
                {hero.book}
                <ArrowIcon width={18} height={18} />
              </a>
            </Magnet>
            <a
              href={`#${roazSections.tours}`}
              className="inline-flex h-14 items-center justify-center rounded-full px-7 [@media(max-height:700px)]:h-12 font-display text-[1.2rem] font-bold tracking-[0.08em] uppercase ring-1 ring-sal/60 backdrop-blur-sm transition-colors hover:bg-sal/10"
            >
              {hero.tours}
            </a>
          </div>
          <p className="rz-rise mt-5 inline-flex items-center gap-2 rounded-full [@media(max-height:700px)]:mt-3 bg-fundo/45 px-3 py-1.5 text-[0.72rem] tracking-[0.06em] text-sal/85 [animation-delay:850ms]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-falesia" />
            {copy.demo}
          </p>
        </div>
      </div>

      <div data-hero-cue className="pointer-events-none absolute right-6 bottom-12 z-10 hidden sm:flex [@media(max-height:860px)]:hidden">
        <a href={`#${roazSections.tours}`} className="rz-rise pointer-events-auto flex flex-col items-center gap-2 font-stencil text-[0.7rem] tracking-[0.3em] text-sal/80 uppercase [animation-delay:1200ms]">
          {hero.scroll}
          <span aria-hidden="true" className="relative block h-12 w-px bg-sal/30">
            <span className="rz-cue absolute -left-[3px] top-0 block h-3 w-[7px] rounded-t-full bg-falesia" />
          </span>
        </a>
      </div>
    </section>
  );
}
