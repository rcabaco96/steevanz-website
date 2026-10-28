"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Wordmark, wordmarkDropCenter, wordmarkViewBox } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens with a single drop: on the cocoa of the hour before dawn the letters of «orvé»
// rise, a copper drop falls from the top of the screen and lands on the «e» as its accent, two ripples spread, and
// the dark is drawn back into the drop, uncovering the film. Shown once per tab session; never with reduced motion or
// without JavaScript (the layout's <head> hides it before the first paint, so it never flashes: ./preloader-gate.ts).
export function Preloader({ label, line }: { label: string; line: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("or-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      const svg = el.querySelector("svg");
      if (!svg) return;
      html.classList.add("or-loading");

      const vb = wordmarkViewBox;
      const rect = svg.getBoundingClientRect();
      const unit = vb.width / rect.width;
      const landX = rect.left + ((wordmarkDropCenter.x - vb.x) / vb.width) * rect.width;
      const landY = rect.top + ((wordmarkDropCenter.y - vb.y) / vb.height) * rect.height;
      // From just above the top edge of the screen, in the wordmark's own units.
      const fall = (landY + 40) * unit;
      const big = Math.hypot(window.innerWidth, window.innerHeight);

      gsap.set(el, { clipPath: `circle(${big}px at ${landX}px ${landY}px)` });
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          html.classList.remove("or-loading");
          html.classList.add("or-seen");
          window.dispatchEvent(new Event("or:revealed"));
        },
      });
      tl.fromTo(q("[data-letters]"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.1)
        .fromTo(q("[data-drop]"), { y: -fall, scaleY: 1.25 }, { y: 0, scaleY: 1, duration: 0.75, ease: "power2.in" }, 0.55)
        .to(q("[data-drop]"), { scaleY: 0.78, scaleX: 1.18, transformOrigin: "50% 100%", duration: 0.12, ease: "power1.out" }, 1.3)
        .to(q("[data-drop]"), { scaleY: 1, scaleX: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" }, 1.42)
        .fromTo(
          q("[data-ripple]"),
          { scale: 0.4, opacity: 0.9, transformOrigin: "50% 50%" },
          { scale: 5, opacity: 0, duration: 1.3, ease: "power2.out", stagger: 0.22, immediateRender: false },
          1.3,
        )
        .fromTo(q("[data-line]"), { opacity: 0, letterSpacing: "0.7em" }, { opacity: 0.8, letterSpacing: "0.34em", duration: 0.9 }, 1.5)
        .to(q("[data-inner]"), { opacity: 0, scale: 0.96, duration: 0.5, ease: "power2.in" }, 2.45)
        .to(el, { clipPath: `circle(0px at ${landX}px ${landY}px)`, duration: 1.05, ease: "expo.inOut" }, 2.5);
      return () => {
        tl.kill();
        html.classList.remove("or-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="or-pre fixed inset-0 z-[80] flex items-center justify-center bg-cacau text-nacar">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(154_74_46/0.22),transparent_70%)]" />
      <div data-inner className="relative flex w-[min(72vw,24rem)] flex-col items-center" aria-label={label}>
        <Wordmark id="or-mark-pre" className="w-full" lettersProps={{ "data-letters": true }} dropProps={{ "data-drop": true }}>
          <g fill="none" stroke="var(--color-argila)" strokeWidth="1.2">
            <circle data-ripple cx={wordmarkDropCenter.x} cy={wordmarkDropCenter.y} r="10" opacity="0" />
            <circle data-ripple cx={wordmarkDropCenter.x} cy={wordmarkDropCenter.y} r="10" opacity="0" />
          </g>
        </Wordmark>
        <span data-line className="or-label mt-8 block text-center text-argila opacity-0">
          {line}
        </span>
      </div>
    </div>
  );
}
