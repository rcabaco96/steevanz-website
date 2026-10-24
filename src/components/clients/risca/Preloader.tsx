"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Wordmark, cutAngle } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

// tan of the cut's angle: the screen is split along the same line that crosses the wordmark (half the width × tan).
const slope = Math.tan((Math.abs(cutAngle) * Math.PI) / 180);
const half = `${(slope * 50).toFixed(2)}vw`;
const topClip = `polygon(0 0, 100% 0, 100% calc(50% - ${half}), 0 calc(50% + ${half}))`;
// The lower half starts a pixel higher, so no seam shows between the two before they part.
const bottomClip = `polygon(0 calc(50% + ${half} - 1px), 100% calc(50% - ${half} - 1px), 100% 100%, 0 100%)`;

function Panel({ clip, part }: { clip: string; part: "top" | "bottom" }) {
  return (
    <div data-panel={part} className="absolute inset-0 bg-tinta will-change-transform" style={{ clipPath: clip }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rc-pre-word w-[min(78vw,30rem)] text-gesso">
          <Wordmark id={`rc-pre-${part}`} cut={false} accent="none" className="block w-full" />
        </div>
      </div>
    </div>
  );
}

// The first visit of a session opens with one cut: on ink, the «RISCA» capitals come up, a vermilion line is drawn
// straight through them at the angle of the parting, the upper half slides along the line as if the scissors had
// gone through, and the two halves of the screen part — up and down — uncovering the film. Shown once per tab
// session; never with reduced motion or without JavaScript (the layout's <head> hides it before the first paint, so it
// never flashes: ./preloader-gate.ts).
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("rc-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      html.classList.add("rc-loading");
      const q = gsap.utils.selector(el);
      const rad = (cutAngle * Math.PI) / 180;
      const slide = () => Math.min(window.innerWidth * 0.035, 34);
      const away = () => window.innerHeight * 0.5 + window.innerWidth * slope * 0.5 + 40;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          html.classList.remove("rc-loading");
          html.classList.add("rc-seen");
          window.dispatchEvent(new Event("rc:revealed"));
        },
      });
      // The letters rise by CSS from the first paint (.rc-pre-word), so they never show, hide and show again.
      tl.fromTo(q("[data-label]"), { opacity: 0, y: 10 }, { opacity: 0.75, y: 0, duration: 0.6 }, 0.1)
        .fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power4.inOut" }, 0.75)
        .to(q('[data-panel="top"]'), { x: () => slide() * Math.cos(rad), y: () => slide() * Math.sin(rad), duration: 0.35, ease: "power2.out" }, 1.25)
        .to(q("[data-label]"), { opacity: 0, duration: 0.2 }, 1.6)
        .to(q('[data-panel="top"]'), { y: () => -away(), duration: 0.85, ease: "expo.in" }, 1.75)
        .to(q('[data-panel="bottom"]'), { y: () => away(), duration: 0.85, ease: "expo.in" }, 1.75)
        .to(q("[data-line]"), { opacity: 0, duration: 0.3 }, 2.2);
      return () => {
        tl.kill();
        html.classList.remove("rc-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="rc-pre fixed inset-0 z-[80] overflow-hidden" aria-label={label}>
      <Panel clip={topClip} part="top" />
      <Panel clip={bottomClip} part="bottom" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-0 w-[160vmax] -translate-x-1/2" style={{ rotate: `${cutAngle}deg` }}>
        <div data-line className="h-[3px] w-full origin-left -translate-y-1/2 scale-x-0 bg-vermelhao" />
      </div>
      <p data-label className="rc-label pointer-events-none absolute inset-x-0 bottom-[14%] text-center text-gesso opacity-0">
        Cabeleireiro e barbearia · Porto
      </p>
    </div>
  );
}
