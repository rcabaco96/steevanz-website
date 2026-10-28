"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orvePhotos } from "@/content/orve/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Size (% of the width) and place of each drop on large screens, and how fast it drifts against the scroll. */
const layout = [
  { w: 30, left: 4, top: 2, speed: 0.25 },
  { w: 17, left: 40, top: 0, speed: -0.35 },
  { w: 22, left: 70, top: 6, speed: 0.15 },
  { w: 14, left: 33, top: 38, speed: 0.45 },
  { w: 25, left: 52, top: 30, speed: -0.2 },
  { w: 19, left: 8, top: 52, speed: -0.4 },
  { w: 15, left: 80, top: 52, speed: 0.35 },
  { w: 21, left: 34, top: 68, speed: 0.1 },
];

// The gallery as drops on a dark window: round pictures with a glint, scattered and each drifting at its own speed
// with the scroll (GSAP scrub), so they slide past one another like condensation. Phones: two staggered columns,
// gently drifting. Reduced motion: still. Hovering a drop magnifies what's inside it.
export function Reflections({ copy }: { copy: OrveCopy }) {
  const { gallery } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-bead]").forEach((bead) => {
          const speed = Number((bead as HTMLElement).dataset.speed ?? 0);
          gsap.fromTo(bead, { yPercent: speed * 35 }, { yPercent: speed * -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="or-gallery-title" className="or-on-dark relative overflow-hidden bg-cacau py-24 text-nacar sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="or-label mb-6 flex items-center gap-4 text-argila">
          <span aria-hidden="true" className="h-px w-10 bg-argila/60" />
          {gallery.eyebrow}
        </p>
        <h2 id="or-gallery-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.96]">
          {gallery.title} <span className="block text-argila italic">{gallery.titleItalic}</span>
        </h2>
      </div>

      <ul className="mx-auto mt-14 grid max-w-[84rem] grid-cols-2 gap-x-4 gap-y-6 px-5 sm:px-8 lg:relative lg:mt-10 lg:block lg:h-[min(92vw,64rem)] lg:px-0">
        {gallery.photos.map((item, i) => {
          const photo = orvePhotos[item.image];
          const spot = layout[i % layout.length];
          return (
            <li
              key={item.image}
              data-bead
              data-speed={spot.speed}
              className={`group will-change-transform lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)] ${i % 2 ? "mt-14 lg:mt-0" : ""}`}
              style={{ ["--x" as string]: `${spot.left}%`, ["--y" as string]: `${spot.top}%`, ["--w" as string]: `${spot.w}%` }}
            >
              <div className="or-bead relative aspect-square overflow-hidden rounded-full bg-cacau-2">
                <Image
                  src={photo.src}
                  alt={item.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 28vw, 46vw"
                  className="absolute inset-0 h-full w-full scale-[1.08] object-cover transition-transform duration-700 ease-[var(--ease-orvalho)] group-hover:scale-[1.22]"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
