"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Where each named thing sits on the owner's photo (percent of the photo): oysters, langoustines, barnacles, prawns. */
const spots = [
  { x: 18, y: 66, above: false },
  { x: 47, y: 62, above: true },
  { x: 55, y: 70, above: false },
  { x: 74, y: 64, above: true },
];

// The seafood boat: the scene holds still while the owner's photo opens out of a porthole until the whole boat is
// on screen, then each thing on it is named in turn (a pulsing dot and its label), slowly enough to read. Reduced
// motion: the photo with its four labels.
export function Boat({ copy }: { copy: LoboCopy }) {
  const { boat } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.set(q("[data-spot]"), { opacity: 0, scale: 0.6 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-porthole]"), { clipPath: "circle(20% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.35, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-photo]"), { scale: 1.35 }, { scale: 1, duration: 0.45 }, 0)
          .fromTo(q("[data-ring]"), { opacity: 1, scale: 1 }, { opacity: 0, scale: 2.6, duration: 0.3 }, 0.02);
        q("[data-spot]").forEach((spot, i) => tl.to(spot, { opacity: 1, scale: 1, duration: 0.08, ease: "back.out(2)" }, 0.42 + i * 0.13));
        tl.to({}, { duration: 0.1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.boat} aria-labelledby="lm-boat-title" className="relative overflow-hidden bg-abismo text-areia">
      <div className="mx-auto grid min-h-svh max-w-[90rem] items-center gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14 lg:py-10">
        <div>
          <p className="lm-eyebrow text-coral">{boat.eyebrow}</p>
          <h2 id="lm-boat-title" className="mt-4 font-display text-[clamp(2.4rem,7.5vw,5rem)] leading-[0.93] uppercase">
            {boat.title}
          </h2>
          <p className="mt-6 max-w-md text-lg text-areia/85">{boat.text}</p>
        </div>
        <div className="relative">
          <div data-porthole className="relative aspect-[1170/1158] w-full overflow-hidden rounded-[2rem]">
            <Image
              data-photo
              src={lobo.media.boat}
              alt={boat.alt}
              width={loboPhotoSize.boat.width}
              height={loboPhotoSize.boat.height}
              sizes="(min-width: 1024px) 55vw, 92vw"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_50%,rgb(18_33_59/0.55))]" />
            {spots.map((spot, i) => (
              <div
                key={i}
                data-spot
                className={`absolute flex -translate-x-1/2 items-center gap-1.5 sm:gap-2 ${spot.above ? "-translate-y-[85%] flex-col-reverse" : "-translate-y-[15%] flex-col"}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <span className="relative grid h-5 w-5 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-coral/70 motion-reduce:animate-none" />
                  <span className="relative h-3 w-3 rounded-full bg-coral ring-2 ring-white" />
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.06em] whitespace-nowrap text-abismo uppercase shadow-lg sm:px-3 sm:text-xs">
                  {boat.spots[i]}
                </span>
              </div>
            ))}
          </div>
          <div aria-hidden="true" data-ring className="pointer-events-none absolute inset-0 m-auto aspect-square w-[44%] rounded-full border-[10px] border-dotted border-coral motion-reduce:hidden" />
        </div>
      </div>
    </section>
  );
}
