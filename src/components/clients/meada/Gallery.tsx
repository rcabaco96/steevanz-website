"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { MeadaCopy } from "@/content/meada/copy";
import { meadaPhotos } from "@/content/meada/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Shape and drift of each picture on large screens (column span, aspect ratio, speed against the scroll). */
const layout = [
  { span: "lg:col-span-5", ratio: "aspect-[4/3]", speed: 0.12, tilt: -1.2 },
  { span: "lg:col-span-4 lg:mt-24", ratio: "aspect-[4/3]", speed: -0.1, tilt: 1 },
  { span: "lg:col-span-3 lg:mt-8", ratio: "aspect-[3/4]", speed: 0.2, tilt: -0.6 },
  { span: "lg:col-span-3 lg:-mt-10", ratio: "aspect-[3/4]", speed: -0.16, tilt: 0.8 },
  { span: "lg:col-span-4 lg:mt-10", ratio: "aspect-[4/3]", speed: 0.08, tilt: -0.9 },
  { span: "lg:col-span-5", ratio: "aspect-[4/3]", speed: -0.12, tilt: 1.1 },
];

// The house as swatches pinned to a board: each picture is let down like a piece of cloth unrolled from its top
// (clip-path, scrubbed), a red running stitch then runs round its edge, and on large screens the swatches drift
// against the scroll at their own speeds. Reduced motion and without JavaScript: all in place, already sewn.
export function Gallery({ copy }: { copy: MeadaCopy }) {
  const { gallery } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-swatch]").forEach((swatch) => {
          const pic = swatch.querySelector("[data-pic]");
          const seam = swatch.querySelector("[data-seam]");
          gsap.fromTo(pic, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: swatch, start: "top 90%", end: "top 45%", scrub: 0.5 } });
          gsap.fromTo(seam, { strokeDashoffset: 80, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: swatch, start: "top 60%", end: "top 25%", scrub: 0.5 } });
        });
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-swatch]").forEach((swatch) => {
          const speed = Number((swatch as HTMLElement).dataset.speed ?? 0);
          gsap.fromTo(swatch, { yPercent: speed * 60 }, { yPercent: speed * -60, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="md-gallery-title" className="relative overflow-hidden bg-cru py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="md-label mb-6 flex items-center gap-3 text-fio">
          <span aria-hidden="true" className="md-stitch w-10" />
          {gallery.eyebrow}
        </p>
        <h2 id="md-gallery-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.96]">
          {gallery.title} <span className="block text-fio">{gallery.titleItalic}</span>
        </h2>
      </div>

      <ul className="mx-auto mt-14 grid max-w-[84rem] grid-cols-2 gap-x-4 gap-y-8 px-5 sm:px-8 lg:mt-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
        {gallery.photos.map((item, i) => {
          const photo = meadaPhotos[item.image];
          const spot = layout[i % layout.length];
          return (
            <li
              key={item.image}
              data-swatch
              data-speed={spot.speed}
              className={`${spot.span} ${i % 2 ? "mt-10 lg:mt-0" : ""} will-change-transform`}
              style={{ rotate: `${spot.tilt}deg` }}
            >
              <div className="relative bg-algodao p-2.5 shadow-[0_24px_40px_-30px_rgb(31_32_35/0.6)] sm:p-3.5">
                <div data-pic className={`relative ${spot.ratio} overflow-hidden bg-cru-2`}>
                  <Image src={photo.src} alt={item.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 40vw, 46vw" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <svg aria-hidden="true" className="pointer-events-none absolute inset-1 size-[calc(100%-0.5rem)] overflow-visible" preserveAspectRatio="none">
                  <rect
                    data-seam
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="var(--color-fio)"
                    strokeWidth="1.6"
                    strokeDasharray="7 6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
