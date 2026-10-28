"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { MeadaCopy } from "@/content/meada/copy";
import { GiftIcon } from "./icons";
import { Wordmark } from "./Logo";
import { meadaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POINTS = 8;

// The digital customer card (Steevanz «Cartão de cliente digital»), told with the shop's own pun: a «ponto» is both a
// stamp and a stitch. A phone shows the Meada card — eight squares of linen — and as the page scrolls each square
// gets its cross-stitch, two red strokes, the count going up; at the eighth the gift appears on the card. Large
// screens: the scene holds still (GSAP pin + scrub). Phones: the phone fills as it scrolls past. Reduced motion and
// without JavaScript: the full card with the gift. Only what the product does (no app, a tap or the QR code, the team
// gives the point by reading the card's QR, the reward appears by itself).
export function LoyaltyCard({ copy }: { copy: MeadaCopy }) {
  const { card } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const counter = q("[data-count]")[0] as HTMLElement;
      const build = (tl: gsap.core.Timeline) => {
        const state = { n: 0 };
        const show = () => {
          const n = Math.round(state.n);
          counter.textContent = card.phoneCount.replace("{n}", String(n));
        };
        q("[data-point]").forEach((point, i) => {
          tl.fromTo(point.querySelectorAll("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.45, ease: "power1.inOut" }, i)
            .fromTo(point, { backgroundColor: "rgb(231 224 210 / 1)" }, { backgroundColor: "rgb(217 208 189 / 1)", duration: 0.3 }, i + 0.6)
            .to(state, { n: i + 1, duration: 0.01, onUpdate: show, onReverseComplete: () => {
              state.n = i;
              show();
            } }, i + 0.95);
        });
        tl.fromTo(q("[data-reward]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, POINTS)
          .fromTo(q("[data-done]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, POINTS + 0.2)
          .to({}, { duration: 0.6 });
        show();
      };

      mm.add("(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "+=170%", pin: true, scrub: 0.6, anticipatePin: 1 } });
        build(tl);
      });
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 679px) and (prefers-reduced-motion: no-preference)",
        () => {
          const phone = q("[data-phone]")[0];
          const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: phone, start: "top 75%", end: "bottom 45%", scrub: 0.5 } });
          build(tl);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={meadaSections.card} aria-labelledby="md-card-title" className="relative overflow-hidden bg-algodao">
      <div className="mx-auto grid max-w-[84rem] items-center gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:min-h-svh lg:grid-cols-[1fr_auto] lg:gap-20 lg:py-20">
        <div>
          <p className="md-label mb-6 flex items-center gap-3 text-fio">
            <span aria-hidden="true" className="md-stitch w-10" />
            {card.eyebrow}
          </p>
          <h2 id="md-card-title" className="font-display text-[clamp(2.6rem,8.6vw,5.4rem)] leading-[0.96]">
            {card.title} <span className="block text-fio">{card.titleItalic}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.75] text-cinza">{card.intro}</p>

          <ol className="mt-10 hidden max-w-xl gap-6 lg:grid">
            {card.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="grid size-10 place-items-center rounded-full bg-cru font-mono text-sm text-fio">{i + 1}</span>
                <span>
                  <span className="block font-display text-xl leading-snug">{step.title}</span>
                  <span className="mt-1 block leading-relaxed text-cinza">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 hidden text-xs text-cinza lg:block">{card.demoNote}</p>
        </div>

        {/* The phone with the card (an illustration of the card, with an example rule). */}
        <div data-phone role="img" aria-label={card.phoneAlt} className="mx-auto w-[min(78vw,19rem)] lg:mx-0 lg:w-[min(22rem,34vw)] [@media(min-width:1024px)_and_(max-height:800px)]:w-[19rem]">
          <div className="rounded-[2.6rem] bg-grafite p-2.5 shadow-[0_40px_80px_-40px_rgb(31_32_35/0.7)]">
            <div className="relative overflow-hidden rounded-[2.1rem] bg-algodao px-5 pt-9 pb-6">
              <span aria-hidden="true" className="absolute top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-grafite" />
              <div className="flex items-center justify-between">
                <Wordmark id="md-mark-card" className="w-20 text-tinta" />
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-cinza uppercase">{card.phoneTitle}</span>
              </div>
              <p className="mt-5 font-display text-lg">{card.phoneName}</p>
              <p data-count className="font-mono text-[0.78rem] text-fio tabular-nums">
                {card.phoneCount.replace("{n}", String(POINTS))}
              </p>
              <ul className="mt-4 grid grid-cols-4 gap-2.5">
                {Array.from({ length: POINTS }, (_, i) => (
                  <li key={i} data-point className="relative grid aspect-square place-items-center rounded-md bg-cru-2 ring-1 ring-tinta/10">
                    <svg viewBox="0 0 24 24" className="size-[62%] text-fio">
                      <path d="M5 5l14 14" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
                      <path d="M19 5L5 19" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
                    </svg>
                    {i === POINTS - 1 ? <GiftIcon aria-hidden="true" width={12} height={12} className="absolute right-1 bottom-1 text-kraft-2" /> : null}
                  </li>
                ))}
              </ul>
              <div className="relative mt-5 h-[4.6rem] overflow-hidden">
                <div data-reward className="md-kraft md-tag absolute inset-0 flex flex-col justify-end px-4 pb-3 text-tinta">
                  <p data-done className="font-mono text-[0.66rem] tracking-[0.14em] uppercase">{card.phoneDone}</p>
                  <p className="font-display text-[1.05rem] leading-tight">{card.rewardShort}</p>
                </div>
              </div>
              <div aria-hidden="true" className="mx-auto mt-5 grid size-16 place-items-center rounded-lg bg-white p-1.5 ring-1 ring-tinta/10">
                <QrMark />
              </div>
            </div>
          </div>
        </div>

        {/* Phones: the steps after the picture. */}
        <div className="lg:hidden">
          <ol className="grid gap-6">
            {card.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="grid size-10 place-items-center rounded-full bg-cru font-mono text-sm text-fio">{i + 1}</span>
                <span>
                  <span className="block font-display text-xl leading-snug">{step.title}</span>
                  <span className="mt-1 block leading-relaxed text-cinza">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-cinza">{card.demoNote}</p>
        </div>
      </div>
      <p className="sr-only">{card.reward}</p>
    </section>
  );
}

/** A decorative QR-like pattern (not a real code): the card's QR that the team reads. */
function QrMark() {
  const cells = [
    "1110111", "1010101", "1110111", "0001000", "1101011", "0110110", "1011101",
  ];
  return (
    <svg viewBox="0 0 7 7" className="size-full" shapeRendering="crispEdges">
      {cells.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--color-tinta)" /> : null)))}
    </svg>
  );
}
