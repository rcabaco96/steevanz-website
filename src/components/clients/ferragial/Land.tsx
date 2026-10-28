"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialPhotos } from "@/content/ferragial/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Heights of the photos (rem), so the row reads like a skyline standing on one horizon. */
const heights = [20, 14, 24, 17, 21, 12, 18, 22];
const widths = [26, 14, 20, 24, 18, 22, 16, 15];

// The land as a panorama: photos of different heights standing on one long horizon line, like the white villages and
// the lone trees of the plain, the whole row sliding sideways as the page goes down (scrubbed, no pin). Reduced
// motion: the row scrolls by hand.
export function Land({ copy }: { copy: FerragialCopy }) {
  const { land } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const row = el.querySelector<HTMLElement>("[data-row]");
        const scroller = el.querySelector<HTMLElement>("[data-scroller]");
        if (!row || !scroller) return;
        scroller.style.overflowX = "hidden";
        gsap.fromTo(
          row,
          { x: () => window.innerWidth * 0.15 },
          {
            x: () => -(row.scrollWidth - window.innerWidth * 0.85),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
          },
        );
        return () => {
          scroller.style.overflowX = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="fg-land-title" className="fg-cal relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="fg-label mb-5 flex items-center gap-3 text-barro">
            <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
            {land.eyebrow}
          </p>
          <h2 id="fg-land-title" className="font-display text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.95]">
            {land.title} <span className="text-esteva">{land.titleAccent}</span>
          </h2>
        </div>
        <p className="max-w-lg text-[1.04rem] leading-[1.75] text-pedra">{land.intro}</p>
      </div>

      <div data-scroller className="fg-noscroll mt-14 overflow-x-auto sm:mt-20">
        <ul data-row className="relative flex w-max items-end gap-4 px-5 will-change-transform sm:gap-6 sm:px-8">
          {land.photos.map((item, i) => {
            const photo = ferragialPhotos[item.id];
            return (
              <li key={item.id} className="shrink-0" style={{ width: `min(${widths[i]}rem, ${widths[i] * 3.2}vw)` }}>
                <figure>
                  <div className="relative overflow-hidden rounded-t-[3px]" style={{ height: `min(${heights[i]}rem, ${heights[i] * 2.6}vw, 46svh)` }}>
                    <Image src={photo.src} alt={item.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 26rem, 70vw" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-4 text-[0.82rem] text-pedra">{item.label}</figcaption>
                </figure>
              </li>
            );
          })}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[2.35rem] h-px bg-tinta/50" />
        </ul>
      </div>
    </section>
  );
}
