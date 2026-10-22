"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { RestauranteLine, Skyline, Wordmark } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens like a curtain: the years count up to 1182 while the convent's skyline is
// drawn from left to right, the name rises, and the curtain lifts in an arch onto the film. Shown once per tab
// session; never with reduced motion or without JavaScript (the layout's <head> hides it before the first paint,
// so it never flashes: ./preloader-gate.ts).

export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || document.documentElement.classList.contains("oe-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      const counter = { value: 0 };
      const year = q("[data-year]")[0] as HTMLElement | undefined;
      document.documentElement.classList.add("oe-loading");
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.documentElement.classList.remove("oe-loading");
          document.documentElement.classList.add("oe-seen");
          window.dispatchEvent(new Event("oe:revealed"));
        },
      });
      tl.to(counter, {
        value: 1182,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          if (year) year.textContent = String(Math.round(counter.value)).padStart(4, "0");
        },
      })
        .fromTo(q("[data-skyline]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.5 }, 0.1)
        .fromTo(q("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out" }, 0.7)
        .fromTo(q("[data-line]"), { opacity: 0, letterSpacing: "0.6em" }, { opacity: 1, letterSpacing: "0em", duration: 0.9 }, 1)
        .to(q("[data-inner]"), { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, 2.1)
        .to(el, { clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)", duration: 1.1, ease: "expo.inOut" }, 2.35);
      return () => {
        tl.kill();
        document.documentElement.classList.remove("oe-loading");
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="oe-pre fixed inset-0 z-[80] flex items-center justify-center bg-noite text-cal [clip-path:inset(0_0_0_0_round_0)]"
    >
      <div className="oe-azulejo-dark pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div data-inner className="relative flex w-[min(80vw,26rem)] flex-col items-center" aria-label={label}>
        <span data-year className="mb-10 font-serif text-[clamp(3.5rem,14vw,6rem)] leading-none font-medium tabular-nums text-ouro italic">
          0000
        </span>
        <div data-skyline className="w-[94%] self-start [clip-path:inset(0_100%_0_0)]">
          <Skyline className="w-full" />
        </div>
        <div className="mt-[6.5%] w-full overflow-hidden">
          <div data-word>
            <Wordmark className="w-full" />
          </div>
        </div>
        <div data-line className="mt-[6.3%] w-[29.7%] opacity-0">
          <RestauranteLine className="w-full" />
        </div>
      </div>
  </div>
);
}
