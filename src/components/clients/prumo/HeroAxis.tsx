"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Bob } from "./Logo";

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

interface HeroAxisProps {
  poster: string;
  posterPortrait: string;
  video: string;
  videoPortrait: string;
  alt: string;
  axisLine: string;
  marks: readonly string[];
  children: ReactNode;
}

// The opening scene: the film of a physiotherapist assessing a leg, full screen (the poster frame is the first paint;
// a portrait cut on phones). Scrolling holds the scene (GSAP pin + scrub) while the film narrows into a tall column
// standing on a posture grid: it leans off true as it narrows, then comes back into plumb along the brass thread,
// while the four steps of the clinic's method appear along the line and one sentence settles underneath.
// Reduced motion: the still frame, no pin. The film only plays while on screen.
export function HeroAxis({ poster, posterPortrait, video, videoPortrait, alt, axisLine, marks, children }: HeroAxisProps) {
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
        // The column: about a third of a phone's width, at most 300 px; tall, with round ends.
        const colW = () => Math.round(Math.min(window.innerWidth * 0.4, 300, el.clientHeight * 0.36));
        const side = () => Math.round((window.innerWidth - colW()) / 2);
        const top = () => Math.round(el.clientHeight * 0.13);
        const bottom = () => Math.round(el.clientHeight * 0.2);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(0px 0px 0px 0px round 0px)" },
          { clipPath: () => `inset(${top()}px ${side()}px ${bottom()}px ${side()}px round ${colW() / 2}px)`, ease: "power2.inOut", duration: 0.6 },
          0,
        )
          .fromTo(q("[data-tilt]"), { rotate: 0 }, { rotate: -7, ease: "power1.out", duration: 0.35 }, 0.1)
          .to(q("[data-tilt]"), { rotate: 0, ease: "back.out(2.2)", duration: 0.35 }, 0.45)
          .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.08, duration: 0.6 }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -14, opacity: 0, ease: "power1.in", duration: 0.3 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(q("[data-axis]"), { scaleY: 0 }, { scaleY: 1, duration: 0.35 }, 0.35)
          .fromTo(q("[data-axis-bob]"), { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.55)
          .fromTo(q("[data-mark]"), { opacity: 0, x: (i) => (i % 2 ? 24 : -24) }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.06 }, 0.6)
          .fromTo(q("[data-axis-line]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, 0.78)
          .to({}, { duration: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt, sizes: "100vw" };
  const { props: { srcSet: portraitSet } } = getImageProps({ ...common, src: posterPortrait, width: 540, height: 960 });
  const { props: { srcSet: wideSet, ...img } } = getImageProps({ ...common, src: poster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="pr-hero-title" className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden bg-cal text-cal">
      {/* Behind the film: the posture grid, the brass thread and the steps along it. */}
      <div aria-hidden="true" className="pr-grid pointer-events-none absolute inset-0">
        <span data-axis className="absolute top-0 bottom-[11%] left-1/2 w-px origin-top -translate-x-1/2 bg-latao" style={{ transform: "scaleY(0)" }} />
        <Bob data-axis-bob className="absolute bottom-[calc(11%-1.6rem)] left-1/2 h-8 w-auto -translate-x-1/2 opacity-0" />
        <ol className="absolute inset-x-0 top-[17%] bottom-[24%] flex flex-col justify-between">
          {marks.map((mark, i) => (
            <li
              key={mark}
              data-mark
              className={`flex items-center gap-3 font-display text-[clamp(0.84rem,3.6vw,1.6rem)] text-tinta italic opacity-0 ${
                i % 2 ? "justify-start pl-[calc(50%+var(--col)/2+0.55rem)] sm:pl-[calc(50%+var(--col)/2+1rem)]" : "flex-row-reverse justify-start pr-[calc(50%+var(--col)/2+0.55rem)] sm:pr-[calc(50%+var(--col)/2+1rem)]"
              }`}
              style={{ ["--col" as string]: "min(40vw, 300px, 36svh)" }}
            >
              <span className="hidden h-px w-10 bg-latao sm:block" />
              {mark}
            </li>
          ))}
        </ol>
      </div>
      <p
        data-axis-line
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[3.5%] px-6 text-center font-display text-[clamp(1.35rem,4.6vw,2.2rem)] leading-tight text-tinta italic opacity-0"
      >
        {axisLine}
      </p>

      <div data-tilt className="absolute inset-0 will-change-transform">
        <div data-frame className="absolute inset-0 overflow-hidden bg-ardosia will-change-[clip-path]">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(29_39_48/0.6)_0%,rgb(29_39_48/0.28)_32%,rgb(29_39_48/0.42)_62%,rgb(29_39_48/0.88)_100%)]" />
        </div>
      </div>

      {children}
    </section>
  );
}
