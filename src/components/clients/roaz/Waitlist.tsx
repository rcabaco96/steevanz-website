"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { CheckIcon } from "./icons";
import { Mark } from "./Logo";
import { roazSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Walk-up departures with the «Lista de espera digital»: the kiosk's QR code (or a tap on its plate) puts the
// visitor in the queue for the next trip, and the phone shows the ticket being called, the estimated wait and,
// when the boat is ready, «É a sua vez!». The phone is a drawn example screen (labelled so), not a recording; its
// numbers are an example of a ticket, not of anyone's customers. The phone rises and straightens with the scroll.
export function Waitlist({ copy }: { copy: RoazCopy }) {
  const { waitlist } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-phone]"),
          { yPercent: 18, rotate: 7 },
          { yPercent: -4, rotate: -2, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
        gsap.fromTo(
          q("[data-sign]"),
          { yPercent: -10, rotate: -6 },
          { yPercent: 14, rotate: 3, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={roazSections.waitlist} aria-labelledby="rz-waitlist-title" className="rz-on-dark relative overflow-hidden bg-fundo-2 py-24 text-sal sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:repeating-linear-gradient(-12deg,transparent_0_46px,var(--color-agua)_46px_47px)]" />
      <div className="relative mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="rz-label mb-5 text-falesia">{waitlist.eyebrow}</p>
          <h2 id="rz-waitlist-title" className="rz-title text-[clamp(2.8rem,10vw,6.2rem)]">
            {waitlist.title} <span className="block text-agua">{waitlist.titleLine}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.75] text-sal/80">{waitlist.intro}</p>
        </div>

        {/* The kiosk's sign and the visitor's phone. */}
        <div className="relative mx-auto flex w-full max-w-[26rem] justify-center py-6 lg:row-span-2">
          <div data-sign aria-hidden="true" className="absolute top-10 -left-2 hidden w-36 rounded-2xl bg-sal p-3 text-fundo shadow-xl will-change-transform min-[400px]:block sm:-left-10">
            <Mark className="size-10" />
            <p className="mt-2 font-display text-lg leading-none font-extrabold uppercase">{waitlist.screenTitle}</p>
            <div className="mt-2 grid grid-cols-[repeat(7,1fr)] gap-[2px]">
              {Array.from({ length: 49 }, (_, i) => (
                <span key={i} className={`aspect-square ${(i * 7 + (i % 5) * 3) % 3 === 0 || [0, 6, 42].includes(i) ? "bg-fundo" : "bg-transparent"}`} />
              ))}
            </div>
          </div>

          <div data-phone className="relative w-[15.5rem] rounded-[2.6rem] bg-tinta p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] will-change-transform sm:w-[17rem]">
            <div className="relative overflow-hidden rounded-[2.1rem] bg-sal text-tinta">
              <div className="flex items-center justify-between bg-fundo px-5 pt-7 pb-4 text-sal">
                <span className="font-display text-lg font-extrabold uppercase">Roaz</span>
                <span className="rz-label text-[0.62rem] text-falesia">{waitlist.screenTitle}</span>
              </div>
              {/* «É a sua vez!» slides down from the top, stays, and goes, in a loop. */}
              <div className="rz-turn absolute inset-x-3 top-3 z-10 flex items-center gap-2 rounded-2xl bg-falesia px-3 py-2.5 text-[0.82rem] leading-tight font-semibold text-fundo shadow-lg">
                <CheckIcon width={18} height={18} className="shrink-0" />
                {waitlist.screenTurn}
              </div>
              <div className="px-5 py-5">
                <p className="rz-label text-[0.62rem] text-pedra">{waitlist.screenNext}</p>
                <p className="mt-1 font-display text-xl leading-tight font-bold uppercase">{waitlist.screenTour} · 12:00</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-areia p-3">
                    <p className="rz-label text-[0.58rem] text-pedra">{waitlist.screenCalling}</p>
                    <p className="relative mt-1 h-10 overflow-hidden font-stencil text-[2.4rem] leading-none font-bold">
                      <span className="rz-calling-a absolute inset-0">14</span>
                      <span className="rz-calling-b absolute inset-0">15</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-fundo p-3 text-sal">
                    <p className="rz-label text-[0.58rem] text-falesia">{waitlist.screenYours}</p>
                    <p className="mt-1 font-stencil text-[2.4rem] leading-none font-bold">15</p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-2 text-[0.88rem]">
                  <div className="flex justify-between border-b border-tinta/10 pb-2">
                    <dt className="text-pedra">{waitlist.screenWait}</dt>
                    <dd className="font-semibold">~ 10 min</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-pedra">{waitlist.screenPeople}</dt>
                    <dd className="font-semibold">3</dd>
                  </div>
                </dl>
                <p className="mt-5 text-center text-[0.68rem] tracking-[0.08em] text-pedra uppercase">{waitlist.screenNote}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ul className="grid gap-3">
            {waitlist.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-[1.02rem]">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-falesia text-fundo">
                  <CheckIcon width={16} height={16} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="rz-label mt-8 inline-flex rounded-full bg-sal/10 px-4 py-2 text-[0.7rem] text-agua-claro">{waitlist.product}</p>
        </div>
      </div>
    </section>
  );
}
