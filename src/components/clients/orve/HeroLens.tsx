"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const portraitQuery = "(orientation: portrait) and (max-width: 900px)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function subscribePortrait(onChange: () => void) {
  const query = window.matchMedia(portraitQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

interface HeroLensProps {
  poster: string;
  posterPortrait: string;
  video: string;
  videoPortrait: string;
  alt: string;
  lensLine: string;
  ring: string;
  children: ReactNode;
}

// The opening scene: the film of a hydration mask, full screen (the poster frame is the first paint; a portrait cut
// on phones). Scrolling holds the scene (GSAP pin + scrub) while the film gathers into a single dew drop seen from
// above — a round lens that magnifies what it holds — the words lifting away, a ring of words turning around the drop
// and one line settling under it. Reduced motion: the still frame, no pin. The film only plays while on screen.
export function HeroLens({ poster, posterPortrait, video, videoPortrait, alt, lensLine, ring, children }: HeroLensProps) {
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
        // The lens: its radius from the screen (a third of the width on phones, under half the height on desktop).
        const lensR = () => Math.round(Math.min(window.innerWidth * 0.36, el.clientHeight * 0.25, 230));
        const cover = () => Math.ceil(Math.hypot(window.innerWidth / 2, el.clientHeight * 0.56)) + 4;
        const ringSize = () => lensR() * 2 + Math.min(110, window.innerWidth * 0.2);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=120%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: () => `circle(${cover()}px at 50% 44%)` },
          { clipPath: () => `circle(${lensR()}px at 50% 44%)`, ease: "power2.inOut", duration: 0.7 },
          0,
        )
          .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.12, duration: 0.7 }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -16, opacity: 0, ease: "power1.in", duration: 0.35 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(
            q("[data-ring]"),
            { width: ringSize, height: ringSize, opacity: 0, rotate: -50 },
            { width: ringSize, height: ringSize, opacity: 1, rotate: 0, duration: 0.5 },
            0.45,
          )
          .fromTo(q("[data-lens-line]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.62)
          .to({}, { duration: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt, sizes: "100vw" };
  const { props: { srcSet: portraitSet } } = getImageProps({ ...common, src: posterPortrait, width: 540, height: 960 });
  const { props: { srcSet: wideSet, ...img } } = getImageProps({ ...common, src: poster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="or-hero-title" className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden bg-nacar text-nacar">
      {/* Behind the film: the ring of words and the line that wait for the drop. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[44%] flex -translate-y-1/2 justify-center">
        <div data-ring className="or-spin relative size-0 opacity-0">
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible text-cobre">
            <defs>
              <path id="or-ring-path" d="M100 100m-92 0a92 92 0 1 1 184 0a92 92 0 1 1 -184 0" />
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
            <text className="fill-current font-sans text-[8.4px] tracking-[0.32em] uppercase">
              <textPath href="#or-ring-path">{ring.repeat(2)}</textPath>
            </text>
          </svg>
        </div>
      </div>
      <p
        data-lens-line
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[9%] px-6 text-center font-display text-[clamp(1.4rem,5vw,2.4rem)] leading-tight text-tinta italic opacity-0"
      >
        {lensLine}
      </p>

      <div data-frame className="absolute inset-0 overflow-hidden bg-cacau will-change-[clip-path]">
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
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(36_24_20/0.62)_0%,rgb(36_24_20/0.3)_34%,rgb(36_24_20/0.4)_60%,rgb(36_24_20/0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(42%_38%_at_32%_26%,rgb(255_255_255/0.16),transparent_70%)]" />
      </div>

      {children}
    </section>
  );
}
