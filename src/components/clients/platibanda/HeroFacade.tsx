"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { facadeFlat, facadeIn, facadePost, facadePostX, polygon } from "./facade";

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

/** The house front's box on this screen, in percent of the hero: tall on phones, about square on desktop. */
function facadeBox(width: number, height: number): [number, number, number, number] {
  const top = 15;
  const bottom = width < 640 ? 76 : 78;
  const boxH = ((bottom - top) / 100) * height;
  const boxW = Math.min(width * 0.84, boxH * (width < 640 ? 0.92 : 1.12));
  const half = ((boxW / width) * 100) / 2;
  return [50 - half, top, 50 + half, bottom];
}

interface HeroFacadeProps {
  poster: string;
  posterPortrait: string;
  video: string;
  videoPortrait: string;
  alt: string;
  line: string;
  children: ReactNode;
}

// The opening scene: the film of the river Gilão at dusk, full screen (the poster frame is the first paint; a
// portrait cut on phones). Scrolling holds the scene (GSAP pin + scrub) while the film closes into the front of an
// Algarve house — its platibanda rising in a baroque curve, two finials landing on the posts, an ochre band painted
// round the door — the words lifting away and one line settling under the house. Reduced motion: the still frame,
// no pin. The film only plays while on screen.
export function HeroFacade({ poster, posterPortrait, video, videoPortrait, alt, line, children }: HeroFacadeProps) {
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
        const outline = el.querySelector<SVGPathElement>("[data-outline]")!;
        const finials = q("[data-finial]") as HTMLElement[];
        const door = q("[data-door]")[0] as HTMLElement;
        const box = () => facadeBox(el.clientWidth, el.clientHeight);
        // Place the drawn outline, the finials and the door on the house's box for this screen.
        const place = () => {
          const [l, t, r, b] = box();
          // The outline in pixels (a stretched viewBox would bend the stroke and its dashes).
          const W = el.clientWidth;
          const H = el.clientHeight;
          outline.ownerSVGElement?.setAttribute("viewBox", `0 0 ${W} ${H}`);
          const pts = facadeIn((l / 100) * W, (t / 100) * H, (r / 100) * W, (b / 100) * H);
          outline.setAttribute("d", `M${pts.map(([x, y]) => `${x} ${y}`).join("L")}Z`);
          const w = r - l;
          const h = b - t;
          const cx = (facadePostX[0] + facadePostX[1]) / 2;
          const fy = t + facadePost * h;
          gsap.set(finials[0], { left: `${l + cx * w}%`, top: `${fy}%` });
          gsap.set(finials[1], { left: `${r - cx * w}%`, top: `${fy}%` });
          gsap.set(door, { left: `${50 - w * 0.13}%`, width: `${w * 0.26}%`, top: `${b - h * 0.36}%`, height: `${h * 0.36}%` });
        };
        place();
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: place,
          },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: polygon(facadeFlat()) },
          { clipPath: () => polygon(facadeIn(...box())), ease: "power2.inOut", duration: 0.7 },
          0,
        )
          .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.14, duration: 0.7 }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.32 }, 0)
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(outline, { strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.35, ease: "power1.inOut" }, 0.5)
          .fromTo(finials, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "back.out(2.5)", stagger: 0.05 }, 0.66)
          .fromTo(door, { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.2, ease: "power2.out" }, 0.7)
          .fromTo(q("[data-line]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.22 }, 0.78)
          .to({}, { duration: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt, sizes: "100vw" };
  const {
    props: { srcSet: portraitSet },
  } = getImageProps({ ...common, src: posterPortrait, width: 540, height: 960 });
  const {
    props: { srcSet: wideSet, ...img },
  } = getImageProps({ ...common, src: poster, width: 1280, height: 720, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="pb-hero-title" className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden bg-cal text-cal">
      <div aria-hidden="true" className="pb-grain pointer-events-none absolute inset-0" />
      <p
        data-line
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[6%] px-6 text-center font-display text-[clamp(1.35rem,4.6vw,2.3rem)] leading-tight text-ria opacity-0 sm:bottom-[7%]"
      >
        {line}
      </p>

      <div data-frame className="absolute inset-0 overflow-hidden bg-ria will-change-[clip-path]">
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(19_48_46/0.62)_0%,rgb(19_48_46/0.22)_36%,rgb(19_48_46/0.3)_62%,rgb(19_48_46/0.85)_100%)]" />
      </div>

      {/* Drawn over the house once it has formed: its outline, the finials on the posts and the band round the door. */}
      <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path data-outline d="" fill="none" stroke="var(--color-ocre)" strokeWidth="3" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0" />
      </svg>
      <span data-finial aria-hidden="true" className="pointer-events-none absolute -mt-6 -ml-[9px] block size-[18px] rounded-full bg-ocre opacity-0 motion-reduce:hidden" />
      <span data-finial aria-hidden="true" className="pointer-events-none absolute -mt-6 -ml-[9px] block size-[18px] rounded-full bg-ocre opacity-0 motion-reduce:hidden" />
      <span data-door aria-hidden="true" className="pb-barra pointer-events-none absolute block scale-y-0 [--barra-w:10px] motion-reduce:hidden" />

      {children}
    </section>
  );
}
