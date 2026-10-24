"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Wordmark } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const portraitQuery = "(orientation: portrait) and (max-width: 900px)";
function subscribe(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}
const subscribeMotion = subscribe(reducedQuery);
const subscribePortrait = subscribe(portraitQuery);

interface CoverCopy {
  issue: string;
  lines: readonly string[];
  side: string;
}

interface HeroCoverProps {
  poster: string;
  posterPortrait: string;
  video: string;
  videoPortrait: string;
  alt: string;
  cover: CoverCopy;
  children: ReactNode;
}

/** The magazine cover's box on this screen: 3:4, as tall as fits under the menu bar, centred. */
function coverBox(w: number, h: number) {
  const top = Math.min(96, h * 0.13);
  const bottom = Math.max(28, h * 0.06);
  const height = Math.min(h - top - bottom, (w * 0.82) / 0.75);
  const width = height * 0.75;
  return { left: (w - width) / 2, top, width, height };
}

// The opening scene: the salon film, full screen (the poster frame is the first paint; a portrait cut on phones).
// Scrolling holds the scene (GSAP pin + scrub) while the film is trimmed, edge by edge, into the cover of a fashion
// magazine: the «RISCA» masthead lands across its top, the cover lines come up from its foot, the issue number and
// the sections are printed on the paper around it. Reduced motion: the still frame, no pin. The film only plays on
// screen.
export function HeroCover({ poster, posterPortrait, video, videoPortrait, alt, cover, children }: HeroCoverProps) {
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
        const box = () => coverBox(el.clientWidth, el.clientHeight);
        const inset = () => {
          const b = box();
          return `inset(${b.top}px ${el.clientWidth - b.left - b.width}px ${el.clientHeight - b.top - b.height}px ${b.left}px)`;
        };
        const place = () => {
          const b = box();
          gsap.set(q("[data-cover]"), { left: b.left, top: b.top, width: b.width, height: b.height });
        };
        place();
        ScrollTrigger.addEventListener("refreshInit", place);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(q("[data-hero-copy]"), { yPercent: -14, opacity: 0, ease: "power1.in", duration: 0.3 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(q("[data-frame]"), { clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: inset, ease: "power2.inOut", duration: 0.6 }, 0.1)
          .fromTo(q("[data-film]"), { scale: 1.12 }, { scale: 1, duration: 0.6 }, 0.1)
          .to(q("[data-shade]"), { opacity: 0.35, duration: 0.5 }, 0.15)
          .fromTo(q("[data-masthead]"), { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.35 }, 0.5)
          .fromTo(q("[data-cover-line]"), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.3, stagger: 0.06 }, 0.58)
          .fromTo(q("[data-print]"), { opacity: 0, x: (i: number) => (i % 2 ? 30 : -30) }, { opacity: 1, x: 0, ease: "power2.out", duration: 0.3 }, 0.62)
          .to({}, { duration: 0.18 });
        return () => ScrollTrigger.removeEventListener("refreshInit", place);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt, sizes: "100vw" };
  const { props: { srcSet: portraitSet } } = getImageProps({ ...common, src: posterPortrait, width: 540, height: 960 });
  const { props: { srcSet: wideSet, ...img } } = getImageProps({ ...common, src: poster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="rc-hero-title" className="relative isolate flex h-svh min-h-[560px] flex-col overflow-hidden bg-gesso text-gesso">
      {/* Printed on the paper around the cover (decoration: the same words are in the page). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden text-tinta sm:block">
        <p data-print className="rc-label absolute top-[16%] left-[5%] opacity-0 [writing-mode:vertical-rl] rotate-180">
          {cover.issue}
        </p>
        <p data-print className="rc-label absolute right-[5%] bottom-[10%] opacity-0 [writing-mode:vertical-rl]">
          {cover.side}
        </p>
      </div>

      <div data-frame className="absolute inset-0 overflow-hidden bg-tinta will-change-[clip-path]">
        <div data-film className="absolute inset-0 will-change-transform">
          <picture>
            <source media={portraitQuery} srcSet={portraitSet} />
            <source srcSet={wideSet} />
            <img {...img} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          {motionOk ? (
            <video
              key={portrait ? "portrait" : "wide"}
              ref={film}
              src={portrait ? videoPortrait : video}
              poster={portrait ? posterPortrait : poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>
        <div data-shade className="absolute inset-0 bg-[linear-gradient(180deg,rgb(18_17_16/0.7)_0%,rgb(18_17_16/0.25)_38%,rgb(18_17_16/0.45)_62%,rgb(18_17_16/0.92)_100%)]" />
      </div>

      {/* The cover: masthead and cover lines, placed over the trimmed film by the scene. */}
      <div data-cover aria-hidden="true" className="pointer-events-none absolute top-0 left-0 hidden overflow-hidden motion-safe:block">
        <div data-masthead className="absolute inset-x-[5%] top-[3%] opacity-0">
          <Wordmark id="rc-mark-cover" className="w-full text-gesso" />
          <p className="rc-label mt-1 flex justify-between text-[0.6rem] text-gesso/85">
            <span>{cover.issue}</span>
            <span>Porto</span>
          </p>
        </div>
        <div className="absolute inset-x-[6%] bottom-[5%] grid gap-1.5">
          {cover.lines.map((line, i) => (
            <p key={line} className="overflow-hidden">
              <span data-cover-line className={`block opacity-0 ${i === 0 ? "rc-display text-[clamp(1.6rem,4.4vh,2.6rem)]" : "rc-serif text-[clamp(1.05rem,2.6vh,1.5rem)] leading-tight"}`}>
                {line}
              </span>
            </p>
          ))}
        </div>
      </div>

      {children}
    </section>
  );
}
