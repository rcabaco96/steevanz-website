"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { prumoThread, prumoViewBox, Wordmark } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

// The first visit of a session opens on slate: the letters of «prumo» are drawn as one steady line, the thread and
// its brass bob drop from the «p» and swing until they come to rest, the thread runs the full height of the screen,
// and the dark closes onto that line — everything comes into plumb — uncovering the film. Shown once per tab session;
// never with reduced motion or without JavaScript (the layout's <head> decides before the first paint, so it never
// flashes: ./preloader-gate.ts).
export function Preloader({ label, line }: { label: string; line: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("pr-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      html.classList.add("pr-playing");
      const q = gsap.utils.selector(el);
      const svg = el.querySelector("svg");
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const vb = prumoViewBox;
      const axisX = Math.round(rect.left + ((prumoThread.x - vb.x) / vb.width) * rect.width);
      const vw = window.innerWidth;
      gsap.set(q("[data-axis]"), { left: axisX });

      const finish = () => {
        html.classList.remove("pr-loading", "pr-playing");
        html.classList.add("pr-seen");
        window.dispatchEvent(new Event("pr:revealed"));
      };
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tl.set(svg, { opacity: 1 }, 0)
        .fromTo(q("[data-letters] path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.08 }, 0.1)
        .fromTo(q("[data-plumb]"), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.in" }, 0.9)
        .fromTo(
          q("[data-plumb]"),
          { rotation: 32, svgOrigin: `${prumoThread.x} ${prumoThread.top}` },
          { rotation: 0, svgOrigin: `${prumoThread.x} ${prumoThread.top}`, duration: 2.1, ease: "elastic.out(1, 0.28)" },
          1.25,
        )
        .fromTo(q("[data-line]"), { opacity: 0, y: 10 }, { opacity: 0.85, y: 0, duration: 0.8 }, 1.7)
        .fromTo(q("[data-axis]"), { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power2.inOut" }, 2.75)
        .to(q("[data-inner]"), { opacity: 0, duration: 0.45, ease: "power2.in" }, 3.0)
        .fromTo(
          el,
          { clipPath: `inset(0px 0px 0px 0px)` },
          { clipPath: `inset(0px ${vw - axisX - 1}px 0px ${axisX - 1}px)`, duration: 0.95, ease: "expo.inOut" },
          3.2,
        )
        .to(q("[data-axis]"), { opacity: 0, duration: 0.4 }, 4.0);
      return () => {
        tl.kill();
        html.classList.remove("pr-loading", "pr-playing");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pr-pre fixed inset-0 z-[80] bg-ardosia text-cal">
      <div className="pr-grid pr-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div data-inner className="relative flex h-full flex-col items-center justify-center" aria-label={label}>
        <Wordmark
          className="w-[min(70vw,22rem)] opacity-0"
          ink="var(--color-cal)"
          bob="var(--color-latao-claro)"
          lettersProps={{ "data-letters": true }}
          plumbProps={{ "data-plumb": true, opacity: 0 }}
        />
        <span data-line className="pr-label mt-10 block px-6 text-center text-nevoa opacity-0">
          {line}
        </span>
      </div>
      <span data-axis className="absolute top-0 bottom-0 w-px origin-center bg-latao-claro" style={{ transform: "scaleY(0)" }} />
    </div>
  );
}
