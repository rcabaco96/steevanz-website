"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy, LoboImage } from "@/content/lobo-do-mar/copy";
import { loboSections } from "./sections";
import { WaveEdge } from "./WaveEdge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const photos: Partial<Record<LoboImage, string>> = { seabass: lobo.media.seabass, stew: lobo.media.stew, cuttlefish: lobo.media.cuttlefish };
const themes = [
  { panel: "bg-areia text-tinta", wave: "text-areia", accent: "text-coral-deep", muted: "text-calhau" },
  { panel: "bg-espuma text-tinta", wave: "text-espuma", accent: "text-mar", muted: "text-calhau" },
  { panel: "bg-abismo text-areia", wave: "text-abismo", accent: "text-coral", muted: "text-areia/70" },
];

// The cooking in three tides (the board's own groups): the section holds still while each tide rises over the
// last with a rolling wave on its edge, its dishes washing in one by one and its photo drifting up inside the
// frame (GSAP pin + scrub). Reduced motion: the three panels one after the other.
export function Tides({ copy }: { copy: LoboCopy }) {
  const { tides } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const panels = q("[data-panel]");
        gsap.set(panels.slice(1), { position: "absolute", inset: 0, yPercent: 105 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${(panels.length - 1) * 110}%`, pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        panels.forEach((panel, i) => {
          const dishes = panel.querySelectorAll("[data-dish]");
          const img = panel.querySelector("[data-photo]");
          if (i > 0) tl.to(panel, { yPercent: 0, duration: 1, ease: "power2.inOut" }, (i - 1) * 1.4);
          const at = i === 0 ? 0 : (i - 1) * 1.4 + 0.55;
          tl.fromTo(dishes, { xPercent: -14, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: 0.08, duration: 0.45 }, at);
          if (img) tl.fromTo(img, { yPercent: 8, scale: 1.15 }, { yPercent: -4, scale: 1.05, duration: 1.4 }, i === 0 ? 0 : (i - 1) * 1.4);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.tides} aria-labelledby="lm-tides-title" className="relative overflow-hidden">
      <h2 id="lm-tides-title" className="sr-only">
        {tides.eyebrow}: {tides.title}
      </h2>
      {tides.items.map((item, i) => {
        const theme = themes[i % themes.length];
        return (
          <article key={item.index} data-panel className={`relative min-h-svh ${theme.panel}`} style={{ zIndex: i + 1 }}>
            {i > 0 ? <WaveEdge className={`absolute bottom-[calc(100%-1px)] left-0 ${theme.wave}`} /> : null}
            <div className="mx-auto grid min-h-svh max-w-[90rem] items-center gap-8 px-5 pt-24 pb-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-0">
              <div className="order-2 lg:order-1">
                <p className={`lm-eyebrow flex items-center gap-3 ${theme.accent}`}>
                  <span className="font-display text-sm">{item.index}</span>
                  <span aria-hidden="true" className="h-px w-10 bg-current" />
                  {tides.title}
                </p>
                <h3 className="mt-5 font-display text-[clamp(2.2rem,8vw,5.4rem)] leading-[0.95] font-extrabold tracking-[-0.01em] uppercase">{item.title}</h3>
                <ul className="mt-8 flex flex-col">
                  {item.dishes.map((dish, d) => (
                    <li key={dish} data-dish className="flex items-baseline gap-4 border-t border-current/15 py-3 text-[1.15rem] font-medium sm:text-2xl">
                      <span className={`font-display text-[0.65rem] tracking-[0.2em] ${theme.muted}`}>{String(d + 1).padStart(2, "0")}</span>
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative mx-auto aspect-[4/5] max-h-[38svh] w-auto overflow-hidden rounded-[2rem] lg:max-h-[72svh]">
                  <Image
                    data-photo
                    src={photos[item.image] ?? lobo.media.seabass}
                    alt={item.alt}
                    width={loboPhotoSize.tall.width}
                    height={loboPhotoSize.tall.height}
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
