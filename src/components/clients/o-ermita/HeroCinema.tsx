"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
/** The film is only added in the browser (never in the server HTML) and only when motion is fine. */
function motionAllowed() {
  return !window.matchMedia(reducedQuery).matches;
}

// The opening scene. The poster frame is the first paint (next/image, priority) and the film fades in over it as
// soon as it plays. Scrolling holds the scene (GSAP pin) while the film closes into the arch of a convent window
// set in a tiled wall, the film drifting closer and the words lifting away; then the page carries on.
// Reduced motion: no film (the still frame), no pin. The film only plays while it is on screen.
export function HeroCinema({ poster, video, alt, label, children }: { poster: string; video: string; alt: string; label: string; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotion, motionAllowed, () => false);

  useEffect(() => {
    const el = film.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
        (context) => {
          const wide = Boolean(context.conditions?.wide);
          const q = gsap.utils.selector(root);
          const arch = wide ? "inset(13% 31% 9% 31% round 999px 999px 10px 10px)" : "inset(17% 13% 13% 13% round 999px 999px 10px 10px)";
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", pin: true, scrub: 0.8, anticipatePin: 1 },
          });
          tl.fromTo(q("[data-frame]"), { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" }, { clipPath: arch, ease: "power2.inOut" }, 0)
            .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.22 }, 0)
            .to(q("[data-hero-copy]"), { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.45 }, 0)
            .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.15 }, 0)
            .fromTo(q("[data-wall-line]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.6);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="oe-hero-title" className="relative isolate flex h-svh min-h-[620px] flex-col overflow-hidden bg-cal text-cal">
      {/* The tiled wall the window sits in, seen as the film closes. */}
      <div aria-hidden="true" className="oe-azulejo absolute inset-0 opacity-[0.16]" />
      <p
        data-wall-line
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[3.2%] text-center font-serif text-[clamp(1.1rem,3.4vw,1.6rem)] text-azulejo italic opacity-0"
      >
        {label}
      </p>

      <div data-frame className="absolute inset-0 overflow-hidden bg-noite will-change-[clip-path]">
        <div data-film className="absolute inset-0 will-change-transform">
          <Image src={poster} alt={alt} fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
          {motionOk ? (
            <video
              ref={film}
              src={video}
              poster={poster}
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_22_36/0.7)_0%,rgb(15_22_36/0.25)_32%,rgb(15_22_36/0.35)_62%,rgb(15_22_36/0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_50%,transparent_40%,rgb(10_14_24/0.5)_100%)]" />
      </div>

      {children}
    </section>
  );
}
