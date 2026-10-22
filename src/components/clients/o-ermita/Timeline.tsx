"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ermitaPhotos } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { SplitText } from "./react-bits/SplitText";
import { ermitaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The convent's story in five chapters, from 1182 to today (facts from the hotel's own site).
// Large screens: the section holds still and the chapters travel sideways with the scroll (GSAP pin), each photo
// inside an arch drifting the other way, a thread of gold filling as the years go by. Phones: the chapters follow
// one another down the page, each photo opening upwards out of its arch. Reduced motion: everything in place.
export function Timeline({ copy }: { copy: ErmitaCopy }) {
  const { timeline } = copy;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const trackEl = track.current;
        if (!trackEl) return;
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.fromTo(q("[data-thread]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        q("[data-chapter]").forEach((chapter) => {
          const img = chapter.querySelector("[data-drift]");
          const mark = chapter.querySelector("[data-mark]");
          if (img) {
            gsap.fromTo(img, { xPercent: 9 }, { xPercent: -9, ease: "none", scrollTrigger: { trigger: chapter, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
          }
          if (mark) {
            gsap.fromTo(mark, { xPercent: 30, opacity: 0.2 }, { xPercent: -10, opacity: 1, ease: "none", scrollTrigger: { trigger: chapter, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
          }
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-chapter]").forEach((chapter) => {
          const frame = chapter.querySelector("[data-frame]");
          const img = chapter.querySelector("[data-drift]");
          if (frame) {
            gsap.fromTo(frame, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 8px 8px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 8px 8px)", ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 92%", end: "top 40%", scrub: 0.6 } });
          }
          if (img) {
            gsap.fromTo(img, { scale: 1.35 }, { scale: 1.05, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ermitaSections.house} aria-labelledby="oe-timeline-title" className="relative overflow-hidden bg-linho text-tinta lg:h-svh">
      <ol ref={track} className="flex flex-col gap-24 px-5 py-24 sm:px-8 sm:py-32 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:px-0 lg:py-0 lg:will-change-transform">
        <li className="flex flex-col justify-center lg:h-full lg:w-[44vw] lg:pr-[4vw] lg:pl-[max(2rem,calc((100vw-88rem)/2+2rem))]">
          <p className="oe-eyebrow mb-6 flex items-center gap-4 text-oliva">
            <span aria-hidden="true" className="h-px w-10 bg-oliva/60" />
            {timeline.eyebrow}
          </p>
          <h2 id="oe-timeline-title" className="font-serif text-[clamp(2.8rem,10vw,6.2rem)] leading-[0.95] font-medium tracking-[-0.015em]">
            <SplitText text={timeline.title} splitType="chars" delay={30} className="block" />
            <span className="block text-azulejo italic">{timeline.titleItalic}</span>
          </h2>
          <p aria-hidden="true" className="oe-eyebrow mt-10 hidden items-center gap-3 text-pedra lg:flex">
            <span className="h-px w-12 bg-pedra/50" />
            1182 — {timeline.chapters[timeline.chapters.length - 1].mark}
          </p>
        </li>

        {timeline.chapters.map((chapter, i) => {
          const photo = ermitaPhotos[chapter.image];
          return (
            <li key={chapter.title} data-chapter className="relative lg:flex lg:h-full lg:w-[78vw] lg:max-w-[72rem] lg:items-center lg:px-[3vw]">
              <div className="grid gap-8 lg:w-full lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-[4vw]">
                <div className="order-2 lg:order-1">
                  <p
                    data-mark
                    aria-hidden="true"
                    className="font-serif text-[clamp(3.4rem,13vw,8.5rem)] leading-[0.9] font-medium text-transparent italic [-webkit-text-stroke:1.2px_var(--color-azulejo)]"
                  >
                    {chapter.mark}
                  </p>
                  <h3 className="mt-6 flex items-baseline gap-4 font-serif text-[clamp(1.9rem,5vw,3rem)] leading-tight font-medium">
                    <span className="font-sans text-xs tracking-[0.25em] text-ouro">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="sr-only">{chapter.mark}: </span>
                      {chapter.title}
                    </span>
                  </h3>
                  <p className="mt-4 max-w-md text-[1rem] leading-[1.8] text-pedra sm:text-[1.05rem]">{chapter.text}</p>
                </div>
                <div className="order-1 lg:order-2">
                  <div data-frame className="oe-arch relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden bg-noite lg:h-[64svh] lg:max-w-none lg:w-auto">
                    <Image
                      data-drift
                      src={photo.src}
                      alt={chapter.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      className="absolute inset-0 h-full w-full scale-[1.2] object-cover will-change-transform"
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <li aria-hidden="true" className="hidden lg:block lg:w-[10vw]" />
      </ol>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[max(2rem,calc((100vw-88rem)/2+2rem))] bottom-8 hidden h-px bg-oliva/25 lg:block">
        <div data-thread className="h-full origin-left bg-ouro" />
      </div>
    </section>
  );
}
