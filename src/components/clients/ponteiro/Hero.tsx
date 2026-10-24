"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro } from "@/content/ponteiro/facts";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { ponteiroSections } from "./sections";

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

// The opening scene. The coffee falling from the machine, full screen (the poster frame is the first paint; a portrait
// cut on phones). Scrolling holds the scene (GSAP pin + scrub) while the morning film narrows into one third of a
// triptych and the two other hours of the house slide in beside it — the fire of the wood oven rising from below, the
// bar coming down from above — each with its hour, and one line settles over the three: a house, the whole day.
// Columns on wide screens, rows on phones. Reduced motion: the still morning frame and the words, no pin.
export function Hero({ copy }: { copy: PonteiroCopy }) {
  const { hero } = copy;
  const m = ponteiro.media;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const side = useRef<(HTMLVideoElement | null)[]>([]);
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
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const still = "(prefers-reduced-motion: no-preference)";
      // Rows on a phone held upright; columns everywhere else (landscape, or wider than 900 px).
      const conditions = { rows: `${portraitQuery} and ${still}`, cols: `(orientation: landscape) and ${still}, (min-width: 901px) and ${still}` };
      mm.add(conditions, (ctx) => {
        const rows = Boolean(ctx.conditions?.rows);
        if (!ctx.conditions?.rows && !ctx.conditions?.cols) return;
        const playSide = (on: boolean) =>
          side.current.forEach((v) => {
            if (!v) return;
            if (on) void v.play().catch(() => {});
            else v.pause();
          });
        // Where the two other hours stand: the middle and last third (columns), or the middle and bottom band (rows).
        q("[data-side]").forEach((panel, i) => {
          const at = `${(i + 1) * 33.333}%`;
          gsap.set(panel, rows ? { top: at, left: 0, width: "100%", height: "33.4%" } : { left: at, top: 0, width: "33.4%", height: "100%" });
        });
        gsap.set(q("[data-side]"), { autoAlpha: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => playSide(self.progress > 0.08 && self.progress < 0.995),
            onLeave: () => playSide(false),
            onLeaveBack: () => playSide(false),
          },
        });
        tl.to(q("[data-hero-copy]"), { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.3 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(
            q("[data-main]"),
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: rows ? "inset(0% 0% 66.67% 0%)" : "inset(0% 66.67% 0% 0%)", ease: "power2.inOut", duration: 0.5 },
            0.08,
          )
          .fromTo(q("[data-main-inner]"), { x: 0, y: 0 }, { x: rows ? 0 : () => -window.innerWidth / 3, y: rows ? () => -el.clientHeight / 3 : 0, ease: "power2.inOut", duration: 0.5 }, 0.08)
          .fromTo(q("[data-side='1']"), rows ? { xPercent: 100 } : { yPercent: 100 }, { xPercent: 0, yPercent: 0, ease: "power3.out", duration: 0.42 }, 0.24)
          .fromTo(q("[data-side='2']"), rows ? { xPercent: -100 } : { yPercent: -100 }, { xPercent: 0, yPercent: 0, ease: "power3.out", duration: 0.42 }, 0.34)
          .fromTo(q("[data-tag]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.18 }, 0.58)
          .fromTo(q("[data-trip-title]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.22 }, 0.66)
          .to({}, { duration: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt: hero.alt, sizes: "100vw" };
  const {
    props: { srcSet: portraitSet },
  } = getImageProps({ ...common, src: m.heroPortraitPoster, width: 540, height: 960 });
  const {
    props: { srcSet: wideSet, ...img },
  } = getImageProps({ ...common, src: m.heroPoster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  const sides = [
    { video: m.forno, poster: m.fornoPoster, ...hero.triptych[1] },
    { video: m.noite, poster: m.noitePoster, ...hero.triptych[2] },
  ];
  const tag = "pn-label inline-flex items-center gap-2 rounded-full bg-noite/70 px-3 py-1.5 text-papel backdrop-blur-sm";

  return (
    <section ref={root} aria-labelledby="pn-hero-title" className="pn-on-dark relative isolate flex h-svh min-h-[560px] flex-col overflow-hidden bg-noite text-papel">
      {/* The morning film: full screen, then the first third. */}
      <div data-main className="absolute inset-0 overflow-hidden will-change-[clip-path]">
        <div data-main-inner className="absolute inset-0 will-change-transform">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(27_24_56/0.72)_0%,rgb(27_24_56/0.35)_38%,rgb(27_24_56/0.45)_62%,rgb(27_24_56/0.92)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(27_24_56/0.7)_0%,rgb(27_24_56/0.25)_55%,transparent_80%)]" />
        </div>
        <span data-tag className="absolute bottom-5 left-4 opacity-0 sm:left-6">
          <span className={tag}>
            <span className="text-gema tabular-nums">{hero.triptych[0].time}</span> {hero.triptych[0].label}
          </span>
        </span>
      </div>

      {/* The two other hours of the house, waiting off screen (only with motion). */}
      {sides.map((s, i) => (
        <div
          key={s.time}
          data-side={i + 1}
          aria-hidden="true"
          className="invisible absolute inset-0 overflow-hidden bg-noite-2 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a decorative poster under a film, sized by CSS */}
          <img src={s.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {motionOk ? (
            <video
              ref={(node) => {
                side.current[i] = node;
              }}
              src={s.video}
              poster={s.poster}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(27_24_56/0.25),rgb(27_24_56/0.55))]" />
          <span data-tag className="absolute bottom-5 left-4 opacity-0 sm:left-6">
            <span className={tag}>
              <span className="text-gema tabular-nums">{s.time}</span> {s.label}
            </span>
          </span>
        </div>
      ))}

      <p
        data-trip-title
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[38%] z-10 px-5 text-center font-display text-[clamp(2.6rem,9vw,6.6rem)] leading-[0.95] opacity-0 [text-shadow:0_4px_40px_rgb(27_24_56/0.8)] [@media(orientation:portrait)_and_(max-width:900px)]:top-[30%]"
      >
        {hero.tripTitle} <span className="text-gema italic">{hero.tripTitleItalic}</span>
      </p>

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pt-24 pb-14 sm:px-8 sm:pb-20 [@media(max-height:700px)]:pb-8"
      >
        <p className="pn-label pn-rise text-gema [animation-delay:150ms]">{hero.kicker}</p>
        <h1 id="pn-hero-title" className="pn-rise mt-5 max-w-[13ch] font-display text-[clamp(3rem,13vw,8.2rem)] leading-[0.9] [animation-delay:350ms] [@media(max-height:700px)]:text-[clamp(2.6rem,11vw,5rem)]">
          <span className="sr-only">{ponteiro.name}: </span>
          {hero.title}
        </h1>
        <p className="pn-rise mt-6 max-w-xl text-[1.02rem] leading-relaxed text-papel/85 sm:text-[1.1rem] [animation-delay:550ms] [@media(max-height:700px)]:mt-4">{hero.lead}</p>
        <div className="pn-rise mt-8 flex w-full flex-col gap-3 min-[440px]:w-auto min-[440px]:flex-row [animation-delay:750ms] [@media(max-height:700px)]:mt-5">
          <Magnet className="w-full min-[440px]:w-auto">
            <a
              href={`#${ponteiroSections.book}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gema px-7 font-semibold text-tinta shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-gema-soft min-[440px]:w-auto"
            >
              {hero.book}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${ponteiroSections.carta}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 font-semibold ring-1 ring-papel/55 backdrop-blur-sm transition-colors hover:bg-papel/10"
          >
            {hero.carta}
          </a>
        </div>
        <p className="pn-rise mt-6 inline-flex items-center gap-2 self-start rounded-full bg-noite/50 px-3 py-1.5 text-[0.72rem] tracking-[0.06em] text-papel/80 [animation-delay:900ms]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gema" />
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute right-5 bottom-6 z-10 sm:right-8 [@media(max-height:820px)]:hidden">
        <a href={`#${ponteiroSections.day}`} className="pn-rise pointer-events-auto flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] text-papel/80 uppercase [animation-delay:1200ms]">
          {hero.scroll}
          <span aria-hidden="true" className="relative grid size-10 place-items-center rounded-full ring-1 ring-papel/40">
            <span className="pn-tick absolute top-1/2 left-1/2 h-3.5 w-px origin-bottom -translate-x-1/2 -translate-y-full bg-gema" />
            <span className="size-1.5 rounded-full bg-gema" />
          </span>
        </a>
      </div>
    </section>
  );
}
