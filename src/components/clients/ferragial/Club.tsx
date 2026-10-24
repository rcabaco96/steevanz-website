"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialPhotos } from "@/content/ferragial/facts";
import { TalhaMark } from "./Logo";
import { ferragialSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The wine club as the Steevanz «Cartão de cliente digital»: a card that lives on the phone, without an app. As the
// card scrolls in it tilts upright and is stamped five times with cork — one round stamp after the other, pressed in
// (scale and a small turn) — and the reward line lights up with the fifth. The rule is an example; the copy says only
// what the product does (join with a touch or QR code, stamped by the staff, reward shown automatically).
export function Club({ copy }: { copy: FerragialCopy }) {
  const { club } = copy;
  const root = useRef<HTMLElement>(null);
  const cork = ferragialPhotos.rolhas;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(q("[data-card]"), { rotate: -7, y: 60 }, { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: q("[data-card]")[0], start: "top bottom", end: "top 35%", scrub: 0.6 } });
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-card]")[0], start: "top 60%", once: true } });
        tl.fromTo(q("[data-stamp]"), { scale: 1.8, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.45, ease: "back.out(2.2)", stagger: 0.32 }).fromTo(
          q("[data-reward]"),
          { opacity: 0.35 },
          { opacity: 1, duration: 0.4 },
          "-=0.1",
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ferragialSections.club} aria-labelledby="fg-club-title" className="relative overflow-hidden bg-cal-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="fg-label mb-5 flex items-center gap-3 text-barro">
            <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
            {club.eyebrow}
          </p>
          <h2 id="fg-club-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            {club.title} <span className="text-tinto">{club.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[1.04rem] leading-[1.75] text-pedra">{club.intro}</p>
        </div>

        <div className="flex justify-center lg:row-span-2">
          <div data-card className="relative w-full max-w-[24rem] origin-bottom-left overflow-hidden rounded-[1.6rem] bg-tinto p-6 text-cal shadow-[0_40px_80px_-40px_rgb(58_10_23/0.8)] will-change-transform sm:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-barro/40" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="fg-label text-[0.62rem] text-palha">{club.cardMember}</p>
                <p className="mt-2 font-display text-[1.9rem] leading-none">{club.cardName}</p>
              </div>
              <TalhaMark className="h-12 w-auto text-cal" sun="var(--color-palha)" />
            </div>
            <ol className="relative mt-8 grid grid-cols-5 gap-2.5" aria-label={`5 ${club.stamps}`}>
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="relative aspect-square rounded-full ring-1 ring-cal/30">
                  <span data-stamp className="absolute inset-[3px] block overflow-hidden rounded-full">
                    <Image src={cork.src} alt="" width={cork.width} height={cork.height} sizes="64px" className="h-full w-full scale-[2.2] object-cover" />
                  </span>
                </li>
              ))}
            </ol>
            <p data-reward className="relative mt-6 flex items-center gap-3 rounded-xl bg-cal/10 px-4 py-3 text-[0.95rem]">
              <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-palha text-xs font-bold text-tinto">
                5
              </span>
              {club.reward}
            </p>
            <div aria-hidden="true" className="relative mt-6 flex items-end justify-between">
              <span className="fg-label text-[0.58rem] text-cal/60">N.º 0000</span>
              {/* A QR-like pattern (decorative, not a real code). */}
              <span className="grid grid-cols-5 gap-[2px] rounded bg-cal p-1.5">
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className={`size-2 ${[0, 1, 3, 5, 6, 8, 12, 14, 16, 18, 19, 21, 23, 24].includes(i) ? "bg-xisto" : "bg-transparent"}`} />
                ))}
              </span>
            </div>
          </div>
        </div>

        <div>
          <ol className="grid gap-4 border-t border-tinta/12 pt-6">
            {club.steps.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="fg-label text-barro">0{i + 1}</span>
                <span className="text-[1.05rem]">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-display text-[1.5rem] leading-snug">{club.rule}</p>
          <p className="mt-2 text-sm text-pedra">{club.demoNote}</p>
        </div>
      </div>
    </section>
  );
}
