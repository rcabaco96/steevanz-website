"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Badge } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";
import { WaveEdge } from "./WaveEdge";

gsap.registerPlugin(useGSAP);

// The tide comes in: the logo turns into place on the deep navy, the blue tide rises over it with a rolling
// wave on top, and then the whole sea draws back upwards, uncovering the page. Once per tab session; never with
// reduced motion or without JavaScript (the layout's <head> hides it before the first paint: ./preloader-gate.ts).
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || document.documentElement.classList.contains("lm-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      document.documentElement.classList.add("lm-loading");
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("lm-loading");
          document.documentElement.classList.add("lm-seen");
          window.dispatchEvent(new Event("lm:revealed"));
        },
      });
      tl.fromTo(q("[data-badge]"), { scale: 0.6, rotate: -120, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.1, ease: "back.out(1.6)" })
        .fromTo(q("[data-name] span"), { yPercent: 120 }, { yPercent: 0, stagger: 0.05, duration: 0.7, ease: "power4.out" }, 0.45)
        .fromTo(q("[data-tide]"), { yPercent: 100 }, { yPercent: 0, duration: 1.1, ease: "power2.inOut" }, 1.25)
        .to(el, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 2.35);
      return () => {
        tl.kill();
        document.documentElement.classList.remove("lm-loading");
      };
    },
    { scope: root },
  );

  const letters = "LOBO DO MAR".split("");
  return (
    <div ref={root} aria-hidden="true" className="lm-pre fixed inset-0 z-[80] overflow-hidden bg-abismo text-areia" aria-label={label}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div data-badge>
          <Badge className="w-44 rounded-full bg-white p-1.5 sm:w-52" />
        </div>
        <p data-name className="flex overflow-hidden font-display text-xl tracking-[0.3em] sm:text-2xl">
          {letters.map((letter, i) => (
            <span key={i} className="inline-block whitespace-pre">
              {letter}
            </span>
          ))}
        </p>
      </div>
      <div data-tide className="absolute inset-0 translate-y-full text-azul">
        <WaveEdge className="absolute bottom-full left-0" />
        <div className="h-full bg-azul" />
      </div>
    </div>
  );
}
