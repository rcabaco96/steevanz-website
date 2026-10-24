"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { wordmarkDolphin, wordmarkHorizon, wordmarkLetterPaths, wordmarkViewBox } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens at sea, before dawn: on the deep blue the stencil letters of ROAZ rise, the
// horizon draws itself under them and a dolphin's back breaks the line. Then a small boat crosses the screen from
// the bottom to the top and its wake opens the dark like water — a V widening behind it — uncovering the film.
// Shown once per tab session; never with reduced motion or without JavaScript (the layout's <head> hides it before
// the first paint, so it never flashes: ./preloader-gate.ts).
export function Preloader({ label, line }: { label: string; line: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("rz-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      html.classList.add("rz-loading");

      // The wake: a V notch cut into the dark from the bottom edge, its tip under the boat (in % of the screen).
      const wake = { tip: 112, spread: 0 };
      const boat = q("[data-boat]")[0] as HTMLElement | undefined;
      const draw = () => {
        const { tip, spread } = wake;
        el.style.clipPath = `polygon(0% 0%, 100% 0%, 100% 100%, ${50 + spread}% 100%, 50% ${tip}%, ${50 - spread}% 100%, 0% 100%)`;
        if (boat) boat.style.transform = `translate3d(-50%, ${(tip / 100) * window.innerHeight}px, 0)`;
      };
      draw();

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          html.classList.remove("rz-loading");
          html.classList.add("rz-seen");
          window.dispatchEvent(new Event("rz:revealed"));
        },
      });
      tl.fromTo(q("[data-letter]"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.1)
        .fromTo(q("[data-horizon]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "0% 50%" }, 0.5)
        .fromTo(q("[data-dolphin]"), { y: 12 }, { y: 0, duration: 0.8, ease: "power2.out" }, 1.05)
        .fromTo(q("[data-line]"), { opacity: 0, letterSpacing: "0.5em" }, { opacity: 0.85, letterSpacing: "0.22em", duration: 0.8 }, 1.2)
        .to(q("[data-inner]"), { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, 2.1)
        .fromTo(q("[data-boat]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 2.15)
        .to(wake, { tip: -14, spread: 26, duration: 1.15, ease: "power2.inOut", onUpdate: draw }, 2.2)
        .to(wake, { spread: 420, duration: 0.75, ease: "power2.in", onUpdate: draw }, 3.05)
        .to(q("[data-boat]"), { opacity: 0, duration: 0.2 }, 3.2);
      return () => {
        tl.kill();
        html.classList.remove("rz-loading");
      };
    },
    { scope: root },
  );

  const vb = wordmarkViewBox;
  return (
    <div ref={root} aria-hidden="true" className="rz-pre fixed inset-0 z-[80] flex items-center justify-center bg-fundo text-sal">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_60%,rgb(70_198_201/0.16),transparent_70%)]" />
      <div data-inner className="relative flex w-[min(70vw,22rem)] flex-col items-center" aria-label={label}>
        <svg viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`} className="w-full overflow-visible">
          <defs>
            <clipPath id="rz-pre-sea">
              <rect x="-10" y="-10" width="180" height="80" />
            </clipPath>
          </defs>
          <g fill="currentColor">
            {wordmarkLetterPaths.map((d) => (
              <path key={d} d={d} data-letter />
            ))}
          </g>
          <path data-horizon d={wordmarkHorizon} stroke="var(--color-falesia)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <g clipPath="url(#rz-pre-sea)">
            <path data-dolphin d={wordmarkDolphin} fill="var(--color-falesia)" />
          </g>
        </svg>
        <span data-line className="rz-label mt-7 block whitespace-nowrap text-agua-claro opacity-0">
          {line}
        </span>
      </div>
      {/* The boat seen from above, its bow up: it leads the wake that opens the screen. */}
      <div data-boat className="absolute top-0 left-1/2 opacity-0 will-change-transform">
        <svg viewBox="0 0 20 40" className="-mt-5 h-10 w-5 text-sal">
          <path d="M10 0C15 7 17 15 17 24V38H3V24C3 15 5 7 10 0Z" fill="currentColor" />
          <path d="M6.5 22h7v8h-7Z" fill="var(--color-fundo)" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
