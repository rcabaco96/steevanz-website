"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ermita, ermitaImageSize } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { Reveal } from "./Reveal";
import { SplitText } from "./react-bits/SplitText";
import { ermitaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The house: the convent of 1182 and the 18th-century Bishop's Chapel. The tiled room opens inside an arch as it
// scrolls in (the frame grows, the photo settles), then three facts from the convent's own history.
export function Story({ copy }: { copy: ErmitaCopy }) {
  const { story } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const frame = q("[data-frame]")[0];
        if (!frame) return;
        gsap.fromTo(frame, { scale: 0.86 }, { scale: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top 95%", end: "center 55%", scrub: 0.6 } });
        gsap.fromTo(
          q("[data-frame] img"),
          { scale: 1.28, yPercent: -4 },
          { scale: 1.04, yPercent: 4, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
        gsap.fromTo(q("[data-outline]"), { y: 40 }, { y: -30, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ermitaSections.house} aria-labelledby="oe-story-title" className="relative overflow-hidden bg-cal py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_1fr] lg:gap-x-24 lg:gap-y-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="oe-eyebrow mb-6 flex items-center gap-4 text-oliva">
              <span aria-hidden="true" className="h-px w-10 bg-oliva/60" />
              {story.eyebrow}
            </p>
            <h2 id="oe-story-title" className="font-serif text-[clamp(2.7rem,9.5vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.01em]">
              <SplitText text={story.title} splitType="words" delay={70} className="block" />{" "}
              <span className="block text-oliva italic">{story.titleItalic}</span>
            </h2>
            <Reveal delay={150}>
              <p className="mt-8 max-w-xl font-serif text-[1.35rem] leading-[1.45] text-tinta/90 sm:text-[1.6rem]">{story.intro}</p>
            </Reveal>
          </div>

          <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-10">
            <div
              data-outline
              aria-hidden="true"
              className="oe-arch absolute inset-0 translate-x-3 translate-y-4 border border-oliva/40 sm:translate-x-5 sm:translate-y-6 lg:top-10"
            />
            <div data-frame className="oe-arch relative aspect-[4/5] overflow-hidden bg-linho will-change-transform">
              <Image
                src={ermita.media.tiles}
                alt={story.imageAlt}
                width={ermitaImageSize.wide.width}
                height={ermitaImageSize.wide.height}
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover object-[46%_50%] will-change-transform"
              />
            </div>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <Reveal>
              <p className="max-w-xl text-[1rem] leading-[1.8] text-pedra sm:text-[1.05rem]">{story.text}</p>
            </Reveal>
          </div>
        </div>

        <dl className="mt-20 grid gap-10 sm:mt-28 sm:grid-cols-3 sm:gap-8">
          {story.facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 120} className="flex flex-col border-t border-oliva/30 pt-6">
              <dt className="order-2 mt-3 max-w-[18rem] text-sm leading-relaxed text-pedra">{fact.label}</dt>
              <dd className="order-1 font-serif text-[clamp(3rem,9vw,4.6rem)] leading-none font-medium text-azulejo">{fact.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
