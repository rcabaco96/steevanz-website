"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Wordmark } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// The first visit of a session opens on a sheet of raw linen: «meada» is written stroke by stroke in thread, a red
// running stitch is sewn under it and finished with a cross-stitch, and then the linen is pulled up by that thread,
// uncovering the loom. Shown once per tab session; never with reduced motion or without JavaScript (the layout's
// <head> hides it before the first paint, so it never flashes: ./preloader-gate.ts).
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("md-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      html.classList.add("md-loading");

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          html.classList.remove("md-loading");
          html.classList.add("md-seen");
          window.dispatchEvent(new Event("md:revealed"));
        },
      });
      // Each stroke starts hidden (a zero-length dash would still show its round ends as dots) and fades in as it is drawn.
      tl.fromTo(q("[data-letter]"), { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.42, stagger: 0.07 }, 0.15)
        .fromTo(q("[data-stitch]"), { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: "power1.inOut" }, 0.75)
        .fromTo(q("[data-cross]"), { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.18, stagger: 0.14, ease: "power1.out" }, 1.4)
        .fromTo(q("[data-line]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.45)
        .fromTo(q("[data-needle]"), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.in" }, 1.95)
        .to(q("[data-inner]"), { y: -40, opacity: 0, duration: 0.55, ease: "power2.in" }, 2.15)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.0, ease: "expo.inOut" }, 2.3);
      return () => {
        tl.kill();
        html.classList.remove("md-loading");
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="md-pre md-linen fixed inset-0 z-[80] flex items-center justify-center text-tinta [clip-path:inset(0%_0%_0%_0%)]"
    >
      {/* The thread that pulls the linen up, from the centre of the word to the top of the screen. */}
      <span data-needle className="absolute top-0 left-1/2 h-1/2 w-[2px] origin-bottom -translate-x-1/2 bg-fio" style={{ transform: "scaleY(0)" }} />
      <div data-inner className="relative flex w-[min(70vw,22rem)] flex-col items-center" aria-label={label}>
        <Wordmark
          id="md-mark-pre"
          className="w-full"
          letterProps={{ "data-letter": true, opacity: 0 }}
          stitchProps={{ "data-stitch": true, opacity: 0 }}
          crossProps={{ "data-cross": true, opacity: 0 }}
        />
        <span data-line className="md-label mt-8 block whitespace-nowrap text-cinza opacity-0">
          Casa &amp; Ofícios · Guimarães
        </span>
      </div>
    </div>
  );
}
