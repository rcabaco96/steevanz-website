"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy, LoboImage } from "@/content/lobo-do-mar/copy";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const sources: Record<LoboImage, string> = {
  bar: lobo.media.bar,
  barTall: lobo.media.barTall,
  wall: lobo.media.wall,
  board: lobo.media.board,
  squid: lobo.media.squid,
  bream: lobo.media.bream,
  grilledFish: lobo.media.grilledFish,
  salmon: lobo.media.salmon,
  stew: lobo.media.stew,
  cuttlefish: lobo.media.cuttlefish,
  mixedGrill: lobo.media.mixedGrill,
  pot: lobo.media.pot,
  cutlet: lobo.media.cutlet,
  seabass: lobo.media.seabass,
};

// The plates, sideways: on large screens the section holds still and the row travels with the scroll, the
// photos leaning with its speed (skew from ScrollTrigger's velocity) and settling when it stops — the swell.
// Phones and reduced motion: a row to swipe with snap points.
export function Gallery({ copy }: { copy: LoboCopy }) {
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
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", trackEl);
        const lean = gsap.quickTo(cards, "skewX", { duration: 0.5, ease: "power3.out" });
        const distance = () => Math.max(0, trackEl.scrollWidth - railEl.clientWidth);
        gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => lean(gsap.utils.clamp(-9, 9, self.getVelocity() / -260)),
            onScrubComplete: () => lean(0),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.gallery} aria-labelledby="lm-gallery-title" className="relative overflow-hidden bg-abismo py-24 text-areia sm:py-32 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16">
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="lm-eyebrow text-coral">{gallery.eyebrow}</p>
            <h2 id="lm-gallery-title" className="mt-5 font-display text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.98] font-extrabold uppercase">
              {gallery.title}
            </h2>
          </div>
          <p aria-hidden="true" className="lm-eyebrow text-areia/60 lg:hidden">
            {gallery.hint} →
          </p>
        </div>
      </div>

      <div ref={rail} className="mt-12 snap-x snap-mandatory scroll-pl-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:scroll-pl-8 [&::-webkit-scrollbar]:hidden">
        <ul ref={track} className="flex w-max gap-4 px-5 pb-2 will-change-transform sm:gap-6 sm:px-8 lg:gap-8 lg:pr-[10vw] lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))]">
          {gallery.photos.map((photo, i) => {
            const wide = photo.image === "bar";
            return (
              <li key={photo.image} className="snap-start">
                <figure data-card className="will-change-transform">
                  <div className={`relative overflow-hidden rounded-[1.6rem] bg-abismo-2 ${wide ? "h-[min(60svh,28rem)] w-[min(86vw,40rem)] lg:h-[58svh] lg:w-[calc(58svh*1.5)]" : "h-[min(60svh,28rem)] w-[min(66vw,21rem)] lg:h-[58svh] lg:w-[calc(58svh*0.75)]"}`}>
                    <Image
                      src={sources[photo.image]}
                      alt={photo.alt}
                      width={wide ? loboPhotoSize.wide.width : loboPhotoSize.tall.width}
                      height={wide ? loboPhotoSize.wide.height : loboPhotoSize.tall.height}
                      sizes={wide ? "(min-width: 1024px) 60vw, 86vw" : "(min-width: 1024px) 32vw, 66vw"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-[0.65rem] tracking-[0.2em] text-coral">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg font-medium">{photo.caption}</span>
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
