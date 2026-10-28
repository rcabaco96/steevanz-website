"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { openingSeenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens on the plain before dawn: a horizon line is drawn across the dark, half a sun of
// fired clay rises on it, the letters of «Ferragial» come up one by one, and then the screen opens along the horizon —
// the sky lifts away, the earth sinks — uncovering the vineyard film. Shown once per tab session; never with reduced
// motion or without JavaScript (the layout's <head> decides before the first paint, so it never flashes and the
// hero's entrance waits behind it: ./preloader-gate.ts).
export function Opening({ name, line }: { name: string; line: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("fg-seen")) return;
      try {
        sessionStorage.setItem(openingSeenKey, "1");
      } catch {}
      html.classList.add("fg-loading");
      const q = gsap.utils.selector(el);
      const done = () => {
        html.classList.remove("fg-loading");
        html.classList.add("fg-seen");
        window.dispatchEvent(new Event("fg:opened"));
      };
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: done });
      tl.fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 0.1)
        .fromTo(q("[data-sun]"), { y: 0, yPercent: 100 }, { y: 0, yPercent: 50, duration: 1.4, ease: "power2.out" }, 0.7)
        .fromTo(q("[data-letter]"), { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 0.9, stagger: 0.05 }, 0.95)
        .fromTo(q("[data-sub]"), { opacity: 0, y: -10 }, { opacity: 0.8, y: 0, duration: 0.8 }, 1.5)
        .to(q("[data-top]"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.7)
        .to(q("[data-bottom]"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, 2.7)
        .to(q("[data-line]"), { scaleX: 0, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.6);
      return () => {
        tl.kill();
        html.classList.remove("fg-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="fg-open fixed inset-0 z-[80] text-cal">
      <div data-top className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-xisto will-change-transform">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgb(180_83_42/0.28),transparent_70%)]" />
        <span data-sun className="absolute bottom-0 left-1/2 -ml-[min(16vmin,7rem)] block size-[min(32vmin,14rem)] rounded-full bg-barro" style={{ transform: "translateY(100%)" }} />
        <p className="absolute inset-x-0 bottom-[min(22vmin,9.5rem)] flex justify-center overflow-hidden font-display text-[clamp(3rem,15vw,7.5rem)] leading-[1.05]">
          {name.split("").map((ch, i) => (
            <span key={i} data-letter className="inline-block" style={{ transform: "translateY(110%)" }}>
              {ch}
            </span>
          ))}
        </p>
      </div>
      <div data-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-xisto will-change-transform">
        <p data-sub className="fg-label mt-6 text-center text-palha opacity-0">
          {line}
        </p>
      </div>
      <span data-line className="absolute inset-x-0 top-1/2 block h-px origin-center scale-x-0 bg-palha" />
    </div>
  );
}
