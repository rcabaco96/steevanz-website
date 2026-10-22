"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ermitaPhotos } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { ermitaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);


// The restaurant's own photos (its Google profile) and the hotel's. Large screens: the section holds still and the photos
// travel sideways as the page scrolls (GSAP pin), each photo drifting inside its frame. Phones, tablets and
// reduced motion: a row to swipe, with snap points.
export function Gallery({ copy }: { copy: ErmitaCopy }) {
  const { gallery } = copy;
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const railEl = rail.current;
        const trackEl = track.current;
        if (!railEl || !trackEl) return;
        gsap.set(railEl, { overflow: "hidden" });
        const distance = () => Math.max(0, trackEl.scrollWidth - railEl.clientWidth);
        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-drift]", trackEl).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            { xPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={ermitaSections.gallery}
      aria-labelledby="oe-gallery-title"
      className="relative overflow-hidden bg-noite py-24 text-cal sm:py-32 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-24 lg:pb-10"
    >
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="oe-eyebrow mb-6 flex items-center gap-4 text-ouro">
              <span aria-hidden="true" className="h-px w-10 bg-ouro/70" />
              {gallery.eyebrow}
            </p>
            <h2 id="oe-gallery-title" className="font-serif text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.98] font-medium">
              {gallery.title} <span className="text-ouro italic">{gallery.titleItalic}</span>
            </h2>
          </div>
          <p className="oe-eyebrow flex items-center gap-3 text-cal/60 lg:hidden" aria-hidden="true">
            {gallery.hint}
            <span className="h-px w-8 bg-cal/40" />
          </p>
        </div>
      </div>

      <div ref={rail} className="mt-12 snap-x snap-mandatory scroll-pl-5 overflow-x-auto sm:scroll-pl-8 overscroll-x-contain [scrollbar-width:none] sm:mt-16 [&::-webkit-scrollbar]:hidden">
        <ul ref={track} className="flex w-max gap-4 px-5 pb-2 will-change-transform sm:gap-6 sm:px-8 lg:gap-10 lg:pr-[12vw] lg:pl-[max(2rem,calc((100vw-88rem)/2+2rem))]">
          {gallery.photos.map((photo, i) => {
            const { src, width, height } = ermitaPhotos[photo.image];
            const tall = height > width;
            return (
              <li key={photo.image} className="snap-start">
                <figure>
                  <div
                    className={`relative overflow-hidden rounded-[0.4rem] bg-noite-2 ${
                      tall
                        ? "oe-arch h-[min(62svh,30rem)] w-[min(68vw,20rem)] lg:h-[56svh] lg:w-[calc(56svh*0.68)]"
                        : "h-[min(62svh,30rem)] w-[min(84vw,34rem)] lg:h-[56svh] lg:w-[calc(56svh*1.4)]"
                    }`}
                  >
                    <Image
                      data-drift
                      src={src}
                      alt={photo.alt}
                      width={width}
                      height={height}
                      sizes={tall ? "(min-width: 1024px) 30vw, 70vw" : "(min-width: 1024px) 62vw, 86vw"}
                      className="absolute inset-0 h-full w-full scale-[1.14] object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline gap-3">
                    <span className="font-sans text-xs tracking-[0.2em] text-ouro">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-xl italic text-cal/90 sm:text-2xl">{photo.caption}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
