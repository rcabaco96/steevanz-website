"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const portraitQuery = "(orientation: portrait) and (max-width: 900px)";
function subscribeQuery(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}
const subscribeMotion = subscribeQuery(reducedQuery);
const subscribePortrait = subscribeQuery(portraitQuery);

interface HeroTagProps {
  poster: string;
  posterPortrait: string;
  video: string;
  videoPortrait: string;
  alt: string;
  tagTop: string;
  tagLine: string;
  tagNumber: string;
  children: ReactNode;
}

/** The hang tag's outline (6 points, chamfered top corners) for a tag of w × h with its top-left corner at x, y. */
function tagPoints(x: number, y: number, w: number, h: number): number[] {
  return [x + 0.22 * w, y, x + 0.78 * w, y, x + w, y + 0.14 * h, x + w, y + h, x, y + h, x, y + 0.14 * h];
}

// The opening scene: the loom film, full screen (the poster frame is the first paint; a portrait cut on phones).
// Scrolling holds the scene (GSAP pin + scrub) while the film is cut down to a kraft hang tag: the edges close in to
// the tag's outline, a hole is punched, a red thread drops from the top of the screen to tie it, and the tag swings
// on its thread while its words arrive beside it. Reduced motion: the still frame, no pin. The film plays only while
// on screen.
export function HeroTag({ poster, posterPortrait, video, videoPortrait, alt, tagTop, tagLine, tagNumber, children }: HeroTagProps) {
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
        const frame = q("[data-frame]")[0] as HTMLElement;
        const swing = q("[data-swing]")[0] as HTMLElement;
        const hole = q("[data-hole]")[0] as HTMLElement;
        const thread = q("[data-thread]")[0] as HTMLElement;
        const tagText = q("[data-tag-text]")[0] as HTMLElement;
        const state = { p: 0 };

        // The tag's size and place: a portrait tag in the middle on phones, a little left of centre on wide screens.
        const geometry = () => {
          const vw = el.clientWidth;
          const vh = el.clientHeight;
          const wide = vw >= 900;
          const w = Math.round(Math.min(wide ? vw * 0.26 : vw * 0.6, vh * 0.42, 360));
          const h = Math.round(w * 1.42);
          const x = Math.round(wide ? vw * 0.3 - w / 2 : (vw - w) / 2);
          const y = Math.round(Math.max(84, (vh - h) / 2 - (wide ? 0 : vh * 0.06)));
          return { vw, vh, w, h, x, y };
        };

        const apply = () => {
          const { vw, vh, w, h, x, y } = geometry();
          const p = gsap.parseEase("power3.inOut")(Math.min(1, state.p / 0.62));
          const full = [0, 0, vw, 0, vw, 0, vw, vh, 0, vh, 0, 0];
          const tag = tagPoints(x, y, w, h);
          const pts = full.map((v, i) => v + (tag[i] - v) * p);
          const poly = [];
          for (let i = 0; i < pts.length; i += 2) poly.push(`${pts[i].toFixed(1)}px ${pts[i + 1].toFixed(1)}px`);
          frame.style.clipPath = `polygon(${poly.join(",")})`;

          // The hole and the thread, once the tag has its shape.
          const holeX = x + w / 2;
          const holeY = y + 0.09 * h;
          const clamp = gsap.utils.clamp(0, 1);
          const tie = clamp((state.p - 0.55) / 0.2);
          // Plain style writes (this runs on every scroll frame).
          hole.style.transform = `translate(${holeX}px, ${holeY}px) scale(${tie})`;
          hole.style.opacity = String(tie);
          thread.style.height = `${holeY}px`;
          thread.style.transform = `translateX(${holeX}px) scaleY(${clamp((state.p - 0.6) / 0.18)})`;
          // The swing: around the top of the thread, settling.
          const s = clamp((state.p - 0.7) / 0.3);
          swing.style.transformOrigin = `${holeX}px 0px`;
          swing.style.transform = `rotate(${(Math.sin(s * Math.PI * 2.5) * 4 * (1 - s)).toFixed(3)}deg)`;
          tagText.style.transform = `translate(${x}px, ${y + h * 0.62}px)`;
          tagText.style.width = `${w}px`;
          tagText.style.opacity = String(clamp((state.p - 0.66) / 0.14));
        };

        el.classList.add("is-armed");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: apply },
        });
        tl.fromTo(state, { p: 0 }, { p: 1, duration: 1, onUpdate: apply }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -14, opacity: 0, ease: "power1.in", duration: 0.3 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.18, duration: 0.7 }, 0)
          .fromTo(q("[data-aside]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.22 }, 0.7);
        apply();
        return () => {
          el.classList.remove("is-armed");
          for (const node of [frame, swing, hole, thread, tagText]) node.removeAttribute("style");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt, sizes: "100vw" };
  const { props: { srcSet: portraitSet } } = getImageProps({ ...common, src: posterPortrait, width: 540, height: 960 });
  const { props: { srcSet: wideSet, ...img } } = getImageProps({ ...common, src: poster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="md-hero-title" className="md-linen relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden text-algodao">
      {/* What waits behind the film: the tag's words, beside it once it hangs. */}
      <div
        data-aside
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[7%] hidden px-6 text-center text-tinta opacity-0 [.is-armed_&]:block min-[900px]:inset-x-auto min-[900px]:right-[8%] min-[900px]:bottom-auto min-[900px]:top-1/2 min-[900px]:w-[38%] min-[900px]:-translate-y-1/2 min-[900px]:text-left"
      >
        <p className="md-label text-fio">{tagTop}</p>
        <p className="mt-3 font-display text-[clamp(1.6rem,4.4vw,3.4rem)] leading-[1.05]">{tagLine}</p>
        <div className="md-stitch mx-auto mt-5 w-28 min-[900px]:mx-0" />
      </div>

      <div data-swing className="absolute inset-0 will-change-transform">
        <div data-frame className="absolute inset-0 overflow-hidden bg-grafite will-change-[clip-path]">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_29_32/0.62)_0%,rgb(28_29_32/0.28)_36%,rgb(28_29_32/0.42)_62%,rgb(28_29_32/0.88)_100%)]" />
        </div>
        {/* The thread and the punched hole (placed by the scene). */}
        <span data-thread aria-hidden="true" className="absolute top-0 left-0 hidden w-[2px] -ml-px origin-top bg-fio [.is-armed_&]:block" style={{ height: 0 }} />
        <span
          data-hole
          aria-hidden="true"
          className="absolute top-0 left-0 -mt-[11px] -ml-[11px] hidden size-[22px] rounded-full bg-cru ring-4 ring-kraft opacity-0 [.is-armed_&]:block"
        />
        <p data-tag-text aria-hidden="true" className="absolute top-0 left-0 hidden text-center font-mono text-[0.72rem] tracking-[0.16em] text-algodao uppercase opacity-0 [.is-armed_&]:block">
          <span className="block">{tagTop}</span>
          <span className="mt-1 block text-kraft">{tagNumber}</span>
        </p>
      </div>

      {children}
    </section>
  );
}
