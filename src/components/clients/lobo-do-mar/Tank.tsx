"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { AutoVideo } from "./AutoVideo";
import { WaveEdge } from "./WaveEdge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The live tank and the fish of the day, from the restaurant's own reels: on deep blue (the dining room's ceiling),
// two portrait films open out of rounded windows as they come in — one from below, one from above — and drift apart
// as the page scrolls, each with its line. Reduced motion: the still frames and the words.
export function Tank({ copy }: { copy: LoboCopy }) {
  const { tank } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q("[data-window]").forEach((win, i) => {
          gsap.fromTo(
            win,
            { clipPath: i === 0 ? "inset(100% 0% 0% 0% round 2rem)" : "inset(0% 0% 100% 0% round 2rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 2rem)", ease: "power2.out", scrollTrigger: { trigger: win, start: "top 90%", end: "top 35%", scrub: 0.6 } },
          );
          gsap.fromTo(win, { yPercent: i === 0 ? 10 : -6 }, { yPercent: i === 0 ? -8 : 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo(q("[data-line]"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="lm-tank-title" className="relative bg-azul pt-6 pb-28 text-white sm:pb-36">
      <WaveEdge className="absolute bottom-[calc(100%-1px)] left-0 text-azul" />
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 pt-16 sm:px-8 md:grid-cols-2 md:gap-10 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div data-line>
            <p className="lm-eyebrow text-coral">{tank.eyebrow}</p>
            <h2 id="lm-tank-title" className="mt-4 font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.95] uppercase">
              {tank.title}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/85">{tank.text}</p>
          </div>
          <div data-window className="relative aspect-[9/16] max-h-[78svh] w-full max-w-sm overflow-hidden rounded-[2rem] bg-abismo will-change-transform">
            <AutoVideo src={lobo.media.clipTank} poster={lobo.media.clipTankPoster} />
          </div>
        </div>
        <div className="flex flex-col gap-8 md:mt-40">
          <div data-window className="relative order-2 aspect-[9/16] max-h-[78svh] w-full max-w-sm overflow-hidden rounded-[2rem] bg-abismo will-change-transform md:order-1">
            <AutoVideo src={lobo.media.clipFish} poster={lobo.media.clipFishPoster} />
          </div>
          <div data-line className="order-1 md:order-2">
            <h3 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] uppercase">{tank.fishTitle}</h3>
            <p className="mt-4 max-w-md text-lg text-white/85">{tank.fishText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
