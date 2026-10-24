"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumoPhotos } from "@/content/prumo/facts";
import { prumoSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Where each picture sits on the grid (large screens) and how far off true it starts. */
const layout = [
  { cls: "lg:col-span-7 lg:row-span-2 aspect-[4/3] lg:aspect-auto", tilt: -6, speed: -40 },
  { cls: "lg:col-span-5 aspect-[4/3]", tilt: 5, speed: 30 },
  { cls: "lg:col-span-5 aspect-[4/3]", tilt: -4, speed: 60 },
  { cls: "lg:col-span-6 aspect-[4/3]", tilt: 7, speed: 20 },
  { cls: "lg:col-span-6 aspect-[4/3]", tilt: -5, speed: -20 },
];

// The rooms, as pictures pinned crooked on the posture grid that straighten as the page scrolls, each at its own
// pace (GSAP scrub, rotate and translate only). Reduced motion or no JavaScript: straight from the start.
export function Space({ copy }: { copy: PrumoCopy }) {
  const { space } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-pic]").forEach((pic, i) => {
          const { tilt, speed } = layout[i % layout.length];
          gsap.fromTo(
            pic,
            { rotate: tilt, y: speed },
            { rotate: 0, y: 0, ease: "power2.out", scrollTrigger: { trigger: pic, start: "top 98%", end: "top 40%", scrub: 0.7 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={prumoSections.space} aria-labelledby="pr-space-title" className="pr-grid relative overflow-hidden bg-cal pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
              <span aria-hidden="true" className="h-px w-10 bg-latao" />
              {space.eyebrow}
            </p>
            <h2 id="pr-space-title" className="font-display text-[clamp(2.7rem,9.5vw,5.6rem)] leading-[0.98] tracking-[-0.015em]">
              {space.title} <span className="block text-latao-fundo italic">{space.titleItalic}</span>
            </h2>
          </div>
          <p className="max-w-lg text-[1.02rem] leading-[1.75] text-pedra">{space.intro}</p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-12">
          {space.photos.map((p, i) => {
            const photo = prumoPhotos[p.id];
            const spot = layout[i % layout.length];
            return (
              <li key={p.id} data-pic className={`relative overflow-hidden rounded-[1.25rem] bg-ardosia shadow-[0_30px_60px_-40px_rgb(29_39_48/0.7)] will-change-transform ${i === 0 ? "col-span-2" : ""} ${spot.cls}`}>
                <Image src={photo.src} alt={p.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
