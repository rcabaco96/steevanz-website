"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Mark } from "./Logo";
import { shutterSeenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens like the café does every morning: the steel shutter is down, the name painted on
// it; the clock hand ticks round to 7:30, the sign lights up and the shutter rolls up out of sight, uncovering the
// coffee falling from the machine. Shown once per tab session; never with reduced motion or without JavaScript (the
// layout's <head> hides it before the first paint, so it never flashes: ./preloader-gate.ts). The name plate starts
// hidden in the HTML too, so it only ever fades in once.
export function Shutter({ label, sign }: { label: string; sign: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("pn-seen")) return;
      try {
        sessionStorage.setItem(shutterSeenKey, "1");
      } catch {}
      html.classList.add("pn-loading");
      const q = gsap.utils.selector(el);
      const done = () => {
        html.classList.remove("pn-loading");
        html.classList.add("pn-seen");
        window.dispatchEvent(new Event("pn:revealed"));
      };
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: done });
      tl.fromTo(q("[data-plate]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.05)
        .fromTo(q("[data-clock]"), { "--pn-hand": "-90deg" }, { "--pn-hand": "225deg", duration: 1.1, ease: "back.out(1.4)" }, 0.25)
        .fromTo(q("[data-sign]"), { opacity: 0 }, { opacity: 1, duration: 0.08, repeat: 3, yoyo: true, ease: "none" }, 1.0)
        .to(q("[data-sign]"), { opacity: 1, duration: 0.1 }, 1.32)
        .to(q("[data-plate]"), { y: -40, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.75)
        .to(el, { yPercent: -101, duration: 1.0, ease: "power3.inOut" }, 1.8);
      return () => {
        tl.kill();
        html.classList.remove("pn-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pn-shutter pn-slats fixed inset-0 z-[80] flex flex-col items-center justify-center will-change-transform">
      <div data-plate className="flex flex-col items-center gap-6 opacity-0 rounded-[1.4rem] bg-noite px-9 pt-8 pb-7 text-papel shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]" aria-label={label}>
        <Mark data-clock className="h-24 w-auto text-papel" angle={-90} />
        <span className="font-display text-[2.6rem] leading-none">Ponteiro</span>
        <span data-sign className="pn-label pn-neon opacity-0">
          {sign}
        </span>
      </div>
      {/* The bottom rail of the shutter and its two locks. */}
      <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-between bg-[#55565f] px-[12%] shadow-[0_-2px_0_rgb(255_255_255/0.2)]">
        <span className="h-3 w-10 rounded-full bg-[#2c2d33]" />
        <span className="h-3 w-10 rounded-full bg-[#2c2d33]" />
      </div>
    </div>
  );
}
