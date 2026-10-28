"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roazPhotos } from "@/content/roaz/facts";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The logbook: six pictures of the coast in a staggered grid, each one opening inside a wake — a V that starts at
// the bow, at the top of the frame, and widens down until the whole picture is out — while the photo drifts the
// other way. The columns travel at different speeds on large screens. Reduced motion: all open, standing still.
export function Logbook({ copy }: { copy: RoazCopy }) {
  const { gallery } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-shot]").forEach((shot) => {
          gsap.fromTo(
            shot,
            { clipPath: "polygon(50% 0%, 50% 0%, 50% 0%)" },
            { clipPath: "polygon(50% 0%, 230% 210%, -130% 210%)", ease: "power1.in", scrollTrigger: { trigger: shot, start: "top 95%", end: "top 55%", scrub: 0.6 } },
          );
          const img = shot.querySelector("img");
          if (img) gsap.fromTo(img, { yPercent: -10, scale: 1.2 }, { yPercent: 6, scale: 1.2, ease: "none", scrollTrigger: { trigger: shot, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-column]").forEach((col, i) => {
          gsap.fromTo(col, { y: i === 1 ? 140 : 0 }, { y: i === 1 ? -60 : 40, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const columns = [gallery.items.slice(0, 2), gallery.items.slice(2, 4), gallery.items.slice(4, 6)];
  const aspects = ["aspect-[4/5]", "aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]"];

  return (
    <section ref={root} aria-labelledby="rz-gallery-title" className="relative overflow-hidden bg-areia py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rz-label mb-5 text-ocre">{gallery.eyebrow}</p>
        <h2 id="rz-gallery-title" className="rz-title text-[clamp(2.8rem,10vw,6.8rem)] text-fundo">
          <SplitText text={gallery.title} splitType="chars" delay={26} className="block" />
          <span className="block text-falesia-deep">{gallery.titleLine}</span>
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-7">
          {columns.map((items, c) => (
            <div key={c} data-column className={`flex flex-col gap-3 sm:gap-5 lg:gap-7 ${c === 2 ? "col-span-2 grid grid-cols-2 lg:col-span-1 lg:flex" : ""}`}>
              {items.map((item, j) => {
                const index = c * 2 + j;
                const photo = roazPhotos[item.image];
                return (
                  <figure key={item.image}>
                    <div data-shot className={`relative overflow-hidden rounded-[1.25rem] bg-fundo ${aspects[index]}`}>
                      <Image src={photo.src} alt={item.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 30vw, 48vw" className="absolute inset-0 h-full w-full object-cover will-change-transform" />
                    </div>
                    <figcaption className="mt-2.5 flex items-baseline gap-2.5">
                      <span className="font-stencil text-sm text-ocre">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-display text-[1.15rem] leading-tight font-bold uppercase sm:text-[1.3rem]">{item.caption}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-pedra">{gallery.note}</p>
      </div>
    </section>
  );
}
