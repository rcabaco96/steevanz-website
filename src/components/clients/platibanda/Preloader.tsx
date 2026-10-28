"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { emblemOutline } from "./Logo";
import { finialsIn } from "./facade";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

const [f1, f2] = finialsIn(6, 6, 58, 60);

// The first visit of a session opens on a whitewashed wall: the outline of a house front draws itself, the finials
// land on the posts, the painted band climbs up around the door, the name rises — and then we walk in: the door
// grows until it fills the screen and opens onto the film of the river. Shown once per tab session; never with
// reduced motion or without JavaScript (the layout's <head> hides it before the first paint: ./preloader-gate.ts).
export function Preloader({ label, tagline }: { label: string; tagline: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("pb-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      html.classList.add("pb-loading");
      const q = gsap.utils.selector(el);
      const door = el.querySelector<SVGRectElement>("[data-door]");
      if (!door) return;

      const cover = () => {
        const r = door.getBoundingClientRect();
        return Math.max(window.innerWidth / Math.max(r.width, 1), window.innerHeight / Math.max(r.height, 1)) * 2.4;
      };

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          html.classList.remove("pb-loading");
          html.classList.add("pb-seen");
          window.dispatchEvent(new Event("pb:revealed"));
        },
      });
      tl.fromTo(q("[data-outline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.1)
        .fromTo(q("[data-wall]"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9)
        .fromTo(q("[data-finial]"), { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.12 }, 0.95)
        .fromTo(q("[data-barra]"), { scaleY: 0, opacity: 1, transformOrigin: "50% 100%" }, { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 1.15)
        .fromTo(q("[data-door], [data-window]"), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 1.45)
        .fromTo(q("[data-name]"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 1.2)
        .fromTo(q("[data-tagline]"), { opacity: 0, letterSpacing: "0.5em" }, { opacity: 0.85, letterSpacing: "0.26em", duration: 0.9 }, 1.5)
        .to(q("[data-words]"), { opacity: 0, y: 16, duration: 0.4, ease: "power2.in" }, 2.35)
        .to(q("[data-outline], [data-finial], [data-window], [data-barra], [data-wall]"), { opacity: 0, duration: 0.35 }, 2.5)
        .to(door, { scale: cover, transformOrigin: "50% 50%", duration: 1, ease: "expo.in" }, 2.45)
        .to(el, { opacity: 0, duration: 0.55, ease: "power1.out" }, 3.35);
      return () => {
        tl.kill();
        html.classList.remove("pb-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pb-pre fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-cal text-ria">
      <div aria-hidden="true" className="pb-grain pointer-events-none absolute inset-0" />
      <div className="relative flex flex-col items-center" aria-label={label}>
        <svg viewBox="0 0 64 64" className="w-[min(40vw,11rem)] overflow-visible">
          <path data-wall d={emblemOutline} fill="var(--color-areia)" opacity="0" />
          <path data-outline d={emblemOutline} fill="none" stroke="var(--color-ria)" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
          <circle data-finial cx={f1[0]} cy={f1[1]} r="2.4" fill="var(--color-ria)" opacity="0" />
          <circle data-finial cx={f2[0]} cy={f2[1]} r="2.4" fill="var(--color-ria)" opacity="0" />
          <circle data-window cx="32" cy="23" r="3.2" fill="var(--color-ria)" opacity="0" />
          <rect data-barra x="22.5" y="37" width="19" height="23" fill="var(--color-ocre)" opacity="0" />
          <rect data-door x="26.5" y="41" width="11" height="19" fill="var(--color-ria)" opacity="0" />
        </svg>
        <div data-words className="mt-7 flex flex-col items-center overflow-hidden">
          <span data-name className="block font-display text-[clamp(2.4rem,11vw,4rem)] leading-none opacity-0">
            Platibanda
          </span>
          <span data-tagline className="pb-label mt-3 block whitespace-nowrap text-ocre-deep opacity-0">
            {tagline}
          </span>
        </div>
      </div>
    </div>
  );
}
