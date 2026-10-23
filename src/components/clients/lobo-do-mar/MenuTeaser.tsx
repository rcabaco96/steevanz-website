"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { AutoVideo } from "./AutoVideo";
import { ArrowIcon, PlayIcon } from "./icons";
import { Octopus } from "./Octopus";
import { Magnet } from "./react-bits/Magnet";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The video menu: the octopus from the restaurant's walls draws itself line by line behind a phone playing a recording
// of the real menu (its dish videos running, the page scrolling), which turns upright as it comes in; the sections of the menu pop in one after another. Reduced motion: the
// octopus already drawn, the phone straight.
export function MenuTeaser({ copy }: { copy: LoboCopy }) {
  const { menu } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.utils.toArray<SVGPathElement>("[data-draw]", root.current).forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.to(q("[data-draw]"), { strokeDashoffset: 0, ease: "none", stagger: 0.04, scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 40%", scrub: 0.8 } });
        gsap.fromTo(q("[data-phone]"), { rotate: 10, y: 80 }, { rotate: -3, y: -20, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(q("[data-chip]"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.07, duration: 0.5, ease: "back.out(2)", scrollTrigger: { trigger: q("[data-chips]")[0], start: "top 85%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.menu} aria-labelledby="lm-menu-title" className="relative overflow-hidden bg-white py-24 text-abismo sm:py-32">
      <Octopus className="pointer-events-none absolute -top-10 -right-24 w-[46rem] max-w-none text-marinho/25 sm:-right-10 lg:right-[38%] lg:-top-6" />
      <div className="relative mx-auto grid max-w-[90rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="lm-eyebrow text-coral-deep">{menu.eyebrow}</p>
          <h2 id="lm-menu-title" className="mt-4 font-display text-[clamp(2.6rem,8vw,5.4rem)] leading-[0.93] uppercase">
            {menu.title}
          </h2>
          <p className="mt-6 max-w-md text-lg text-calhau">{menu.text}</p>
          <ul data-chips className="mt-8 flex max-w-lg flex-wrap gap-2">
            {menu.sections.map((section) => (
              <li key={section} data-chip className="rounded-full bg-espuma px-4 py-2 text-sm font-semibold text-marinho">
                {section}
              </li>
            ))}
          </ul>
          <Magnet className="mt-10 inline-block">
            <a
              href={lobo.menu}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-marinho px-8 text-[0.82rem] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-abismo"
            >
              <PlayIcon width={14} height={14} />
              {menu.button}
              <ArrowIcon width={16} height={16} />
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </Magnet>
        </div>
        <a href={lobo.menu} target="_blank" rel="noopener noreferrer" aria-label={`${menu.button} ${copy.newTab}`} className="mx-auto block w-[min(78vw,20rem)]">
          <div data-phone className="relative rounded-[2.6rem] bg-abismo p-3 shadow-[0_50px_90px_-35px_rgb(18_33_59/0.7)] will-change-transform">
            {/* A recording of the live menu, its dish videos playing and the page scrolling (plays only on screen). */}
            <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] bg-areia">
              <AutoVideo src={lobo.media.menuDemo} poster={lobo.media.menuDemoPoster} />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
