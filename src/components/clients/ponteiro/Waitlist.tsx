"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { Mark } from "./Logo";
import { ponteiroSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The waitlist at the door, told in three steps beside a phone. As the card scrolls through the screen (GSAP scrub)
// the phone's wait bar fills, the screen turns yolk-yellow with «A sua mesa está pronta» and the phone gives a little
// buzz. An illustration with example values, and the page says so. Reduced motion: the waiting screen, still.
export function Waitlist({ copy }: { copy: PonteiroCopy }) {
  const { espera } = copy;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-wl-phone]")[0], start: "top 85%", end: "bottom 35%", scrub: 0.5 },
        });
        tl.fromTo(q("[data-wl-bar]"), { scaleX: 0.08 }, { scaleX: 1, duration: 0.6 }, 0)
          .fromTo(q("[data-wl-step]"), { opacity: 0.35 }, { opacity: 1, stagger: 0.25, duration: 0.15 }, 0)
          .fromTo(q("[data-wl-ready]"), { clipPath: "circle(0% at 50% 60%)" }, { clipPath: "circle(150% at 50% 60%)", duration: 0.25, ease: "power2.in" }, 0.62)
          .to(q("[data-wl-phone]"), { keyframes: { rotate: [0, -3, 3, -2, 2, 0] }, duration: 0.12 }, 0.86);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} id={ponteiroSections.waitlist} className="pn-on-dark relative overflow-hidden rounded-[1.8rem] bg-noite p-6 text-papel sm:p-9">
      <p className="pn-label mb-4 flex items-center gap-3 text-gema">
        <span aria-hidden="true" className="h-px w-8 bg-gema/60" />
        {espera.eyebrow}
      </p>
      <h3 className="font-display text-[clamp(2.2rem,7vw,3.4rem)] leading-[0.95]">
        {espera.title} <span className="text-gema italic">{espera.titleItalic}</span>
      </h3>
      <p className="mt-4 leading-relaxed text-papel/75">{espera.intro}</p>

      <div className="mt-8 grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        {/* The phone, with the waitlist page (illustration). */}
        <figure className="mx-auto w-[min(56vw,13rem)]">
          <div data-wl-phone className="relative aspect-[9/18] rounded-[2rem] bg-tinta p-[7px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] will-change-transform">
            <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-papel text-tinta">
              <div className="flex h-full flex-col items-center px-4 pt-8 pb-5 text-center">
                <Mark className="h-9 w-auto text-tinta" accent="var(--color-ginja)" />
                <p className="pn-label mt-2 text-[0.58rem] text-cinza">{espera.phone.title}</p>
                <p className="mt-5 text-[0.7rem] text-cinza">{espera.phone.ticket}</p>
                <p className="font-display text-[3.4rem] leading-none tabular-nums">14</p>
                <p className="mt-1 rounded-full bg-marmore px-2.5 py-0.5 text-[0.7rem] font-semibold">{espera.phone.waiting}</p>
                <div className="mt-auto w-full">
                  <p className="flex justify-between text-[0.66rem] text-cinza">
                    <span>{espera.phone.eta}</span>
                    <span className="font-semibold text-tinta tabular-nums">{espera.phone.etaValue}</span>
                  </p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-marmore">
                    <div data-wl-bar className="h-full w-full origin-left rounded-full bg-ginja" style={{ transform: "scaleX(0.35)" }} />
                  </div>
                </div>
              </div>
              <div data-wl-ready className="absolute inset-0 flex flex-col items-center justify-center bg-gema px-4 text-center text-tinta" style={{ clipPath: "circle(0% at 50% 60%)" }}>
                <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-tinta text-gema">
                  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <p className="mt-4 font-display text-[1.6rem] leading-tight">{espera.phone.ready}</p>
                <p className="mt-2 text-[0.75rem]">{espera.phone.readyText}</p>
              </div>
              <span aria-hidden="true" className="absolute top-1.5 left-1/2 h-4 w-14 -translate-x-1/2 rounded-full bg-tinta" />
            </div>
          </div>
          <figcaption className="mt-3 text-center text-[0.7rem] leading-snug text-papel/55">{espera.illustration}</figcaption>
        </figure>

        <ol className="grid gap-5">
          {espera.steps.map((s, i) => (
            <li key={s.title} data-wl-step className="flex gap-4">
              <span className="font-display text-[2rem] leading-none text-gema tabular-nums">{i + 1}</span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="mt-1 block text-[0.92rem] leading-relaxed text-papel/70">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
