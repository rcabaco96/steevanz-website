"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { CheckIcon, ScissorsIcon } from "./icons";
import { Wordmark } from "./Logo";
import { riscaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stamps = 6;

/** A small pattern standing for the card's QR code (decoration: the team reads the real one). */
function QrPattern() {
  const cells: [number, number][] = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      if (!corner && (x * 7 + y * 11 + x * y) % 3 === 0) cells.push([x, y]);
    }
  }
  return (
    <svg viewBox="0 0 9 9" className="size-full" aria-hidden="true">
      {[
        [0, 0],
        [6, 0],
        [0, 6],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.15} y={y + 0.15} width="2.7" height="2.7" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x={x + 0.9} y={y + 0.9} width="1.2" height="1.2" fill="currentColor" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" fill="currentColor" />
      ))}
    </svg>
  );
}

// The digital client card, on vermilion. The card stands on the page like a phone screen; scrolling stamps it, visit
// by visit — each pair of scissors pressed into its slot (GSAP scrub; on large screens the scene holds while it
// fills) — until the reward rises from the bottom. Beside it: how to join (a tap on the counter's plate or the QR, no
// app), the stamp at each visit and the automatic reward. Phones: heading, the card, then the steps. Reduced motion
// and no JavaScript: the card is drawn full.
export function ClientCard({ copy }: { copy: RiscaCopy }) {
  const { card } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", large: "(min-width: 1024px) and (min-height: 700px)" }, (ctx) => {
        const { motion, large } = ctx.conditions as { motion: boolean; large: boolean };
        if (!motion) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: large
            ? { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.5, anticipatePin: 1 }
            : { trigger: q("[data-phone]")[0], start: "top 80%", end: "bottom 35%", scrub: 0.5 },
        });
        tl.fromTo(q("[data-phone]"), { rotate: -6, yPercent: 6 }, { rotate: 3, yPercent: -4, duration: stamps + 1.5 }, 0);
        q("[data-stamp]").forEach((stamp, i) => {
          tl.fromTo(stamp, { scale: 1.9, rotate: -40, opacity: 0 }, { scale: 1, rotate: -8, opacity: 1, duration: 0.6, ease: "back.out(2.2)" }, i + 0.2).to(
            q("[data-stamp-count]"),
            { textContent: i + 1, snap: { textContent: 1 }, duration: 0.01 },
            i + 0.5,
          );
        });
        tl.fromTo(q("[data-reward]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, stamps + 0.3).to({}, { duration: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={riscaSections.card} ref={root} aria-labelledby="rc-card-title" className="relative overflow-hidden bg-vermelhao py-24 text-tinta lg:flex lg:min-h-svh lg:items-center lg:py-20">
      <div className="mx-auto grid w-full max-w-[92rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="rc-label mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="h-[2px] w-10 bg-tinta" />
            {card.eyebrow}
          </p>
          <h2 id="rc-card-title" className="text-[clamp(3rem,11vw,7rem)] leading-[0.86]">
            <span className="rc-display block">{card.title}</span>
            <span className="rc-serif block text-[0.74em] leading-[0.95]">{card.titleSerif}</span>
          </h2>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed">{card.intro}</p>
        </div>

        {/* The card (media: second on phones, on the right on large screens). */}
        <div className="flex justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div data-phone className="relative w-[min(78vw,20rem)] overflow-hidden rounded-[2rem] bg-tinta p-5 text-gesso shadow-[0_40px_80px_-40px_rgb(18_17_16/0.8)] ring-8 ring-tinta/90">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Wordmark id="rc-mark-card" className="w-24 text-gesso" />
                <p className="rc-label mt-2 text-[0.58rem] text-gesso/60">{card.cardName}</p>
              </div>
              <div className="size-14 shrink-0 bg-gesso p-1 text-tinta">
                <QrPattern />
              </div>
            </div>
            <p className="mt-4 text-[0.75rem] text-gesso/55">{card.cardHolder}</p>
            <ol className="mt-5 grid grid-cols-3 gap-3" aria-label={`${stamps} ${card.stampsLabel}`}>
              {Array.from({ length: stamps }, (_, i) => (
                <li key={i} className="relative grid aspect-square place-items-center rounded-full border border-dashed border-gesso/30">
                  <span className="absolute text-[0.65rem] text-gesso/30 tabular-nums">{i + 1}</span>
                  <span data-stamp className="relative grid size-[86%] -rotate-[8deg] place-items-center rounded-full bg-vermelhao text-tinta">
                    <ScissorsIcon width="55%" height="55%" strokeWidth={2} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-baseline justify-between text-[0.78rem] text-gesso/70">
              <span>
                <span data-stamp-count className="rc-display text-2xl text-gesso tabular-nums">
                  {stamps}
                </span>{" "}
                / {stamps} {card.stampsLabel}
              </span>
            </p>
            <div className="relative mt-4 h-16 overflow-hidden">
              <div data-reward className="absolute inset-0 flex items-center gap-3 bg-gesso px-4 text-tinta">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-vermelhao">
                  <CheckIcon width={16} height={16} strokeWidth={2.4} />
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.9rem] font-bold">{card.reward}</span>
                  <span className="block text-[0.72rem] text-cinza">{card.rewardReady}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ol className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {card.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4 border-t-2 border-tinta pt-4">
                <span className="rc-display text-[2.2rem] leading-none">0{i + 1}</span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[0.8rem]">{card.example}</p>
        </div>
      </div>
    </section>
  );
}
