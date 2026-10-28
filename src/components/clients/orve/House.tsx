"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orvePhotos } from "@/content/orve/facts";
import { orveSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Into the house through a drop: the scene holds still (GSAP pin + scrub) while a single dew drop — point up — sends
// out two ripples and then swells until it fills the screen, the treatment room inside it staying put like a view
// through glass; the title floats up and away and the words about the house settle at the end. Transform-only (the
// drop grows by scale), so it stays smooth on phones. Reduced motion: the full photo with its text.
export function House({ copy }: { copy: OrveCopy }) {
  const { house } = copy;
  const root = useRef<HTMLElement>(null);
  const photo = orvePhotos.espaco;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        el.classList.add("is-armed");
        const drop = q("[data-drop]")[0] as HTMLElement;
        const inner = q("[data-inner]")[0] as HTMLElement;
        const start = 0.46;
        const endScale = () => (Math.hypot(el.clientWidth, el.clientHeight) / drop.offsetWidth) * 1.2;
        const state = { p: 0 };
        const apply = () => {
          const e = endScale();
          const s = start + (e - start) * gsap.parseEase("power2.in")(state.p);
          gsap.set(drop, { scale: s, rotate: 45 });
          // The room is a screen-sized picture held still behind the glass: only the drop around it grows.
          gsap.set(inner, { width: el.clientWidth, height: el.clientHeight, xPercent: -50, yPercent: -50, scale: (1.15 - 0.15 * state.p) / s, rotate: -45 });
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: apply },
        });
        tl.fromTo(q("[data-ripple]"), { scale: 0.5, opacity: 0.7 }, { scale: 2.4, opacity: 0, duration: 0.3, stagger: 0.08, ease: "power1.out" }, 0)
          .fromTo(state, { p: 0 }, { p: 1, duration: 0.75, onUpdate: apply }, 0.12)
          .fromTo(q("[data-title]"), { y: 0, opacity: 1 }, { y: () => -el.clientHeight * 0.3, opacity: 0, duration: 0.4, ease: "power1.in" }, 0.15)
          .fromTo(q("[data-caption]"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.78);
        apply();
        return () => el.classList.remove("is-armed");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={orveSections.house} aria-labelledby="or-house-title" className="relative isolate h-svh min-h-[600px] overflow-hidden bg-nacar">
      <div className="absolute inset-0 grid place-items-center [.is-armed_&]:pt-[14svh]">
        {/* Ripples around the drop (decorative). */}
        <span aria-hidden="true" className="absolute hidden place-items-center [.is-armed_&]:grid">
          <span data-ripple className="absolute size-[min(56vw,40svh)] rounded-full border border-cobre/40 opacity-0" />
          <span data-ripple className="absolute size-[min(56vw,40svh)] rounded-full border border-cobre/30 opacity-0" />
        </span>
        <div
          data-drop
          className="relative size-full overflow-hidden bg-cacau will-change-transform [.is-armed_&]:size-[min(78vw,62svh)] [.is-armed_&]:rounded-[0_50%_50%_50%]"
        >
          <div data-inner className="absolute inset-0 will-change-transform [.is-armed_&]:inset-auto [.is-armed_&]:top-1/2 [.is-armed_&]:left-1/2">
            <Image src={photo.src} alt={house.alt} width={photo.width} height={photo.height} sizes="100vw" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent,rgb(36_24_20/0.85))]" />
          </div>
        </div>
      </div>

      <h2
        id="or-house-title"
        data-title
        className="pointer-events-none absolute inset-x-0 top-[max(5.5rem,11svh)] z-10 px-5 text-center font-display text-[clamp(2.4rem,8.5vw,5.6rem)] leading-[0.98] text-tinta [:not(.is-armed)>&]:sr-only"
      >
        {house.title} <span className="block text-cobre italic">{house.titleItalic}</span>
      </h2>

      <div data-caption className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[84rem] px-5 pb-12 text-nacar sm:px-8 sm:pb-16">
        <p className="or-label flex items-center gap-4 text-argila">
          <span aria-hidden="true" className="h-px w-10 bg-argila/70" />
          {house.eyebrow}
        </p>
        <p aria-hidden="true" className="mt-4 font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.98] [.is-armed_&]:hidden">
          {house.title} <span className="text-argila italic">{house.titleItalic}</span>
        </p>
        <p className="mt-4 max-w-xl font-display text-[clamp(1.25rem,3.6vw,1.9rem)] leading-[1.35] italic">{house.text}</p>
      </div>
    </section>
  );
}
