"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { ArrowIcon } from "./icons";
import { openCategoryEvent, riscaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Where each swatch ends up when the fan is open: evenly spread over ±spread degrees. */
function angles(count: number, spread: number) {
  return Array.from({ length: count }, (_, i) => -spread + (2 * spread * i) / (count - 1));
}

// The colourist's swatch ring. Nine locks of hair (drawn strands over each colour) closed on one rivet; scrolling
// opens them into a fan (GSAP scrub; on large screens the scene holds while it opens), each name turning up on its
// tab. Beside it: how the colour is chosen — diagnosis, sensitivity test, upkeep. Phones: heading, the fan, then the
// steps. Reduced motion and no JavaScript: the fan is drawn open.
export function Colour({ copy }: { copy: RiscaCopy }) {
  const { colour } = copy;
  const root = useRef<HTMLElement>(null);
  const count = colour.swatches.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          large: "(min-width: 1024px) and (min-height: 720px)",
          small: "(max-width: 639px)",
        },
        (ctx) => {
          const { motion, large, small } = ctx.conditions as { motion: boolean; large: boolean; small: boolean };
          const open = angles(count, small ? 46 : 60);
          const swatches = q("[data-swatch]");
          if (!motion) {
            gsap.set(swatches, { rotate: (i: number) => open[i] });
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: large
              ? { trigger: el, start: "top top", end: "+=90%", pin: true, scrub: 0.6, anticipatePin: 1 }
              : { trigger: q("[data-fan]")[0], start: "top 85%", end: "bottom 45%", scrub: 0.6 },
          });
          tl.fromTo(swatches, { rotate: (i: number) => (i - count / 2) * 1.5 }, { rotate: (i: number) => open[i], ease: "power2.out", duration: 1, stagger: 0.02 }, 0)
            .fromTo(q("[data-swatch-name]"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.04 }, 0.5)
            .fromTo(q("[data-rivet]"), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 0);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const swatchBox: CSSProperties = {
    height: "var(--fan-h)",
    width: "calc(var(--fan-h) * 0.18)",
    marginLeft: "calc(var(--fan-h) * -0.09)",
    transformOrigin: "50% calc(100% - var(--fan-h) * 0.09)",
  };
  const fanVars = { "--fan-h": "clamp(11rem, 44vw, 25rem)" } as CSSProperties;
  const openSpread = angles(count, 60);

  return (
    <section id={riscaSections.colour} ref={root} aria-labelledby="rc-colour-title" className="relative overflow-hidden bg-papel py-24 lg:flex lg:min-h-svh lg:items-center lg:py-20">
      <div className="mx-auto grid w-full max-w-[92rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao-escuro">
            <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
            {colour.eyebrow}
          </p>
          <h2 id="rc-colour-title" className="text-[clamp(3.2rem,12vw,7.6rem)] leading-[0.86]">
            <span className="rc-display block">{colour.title}</span>
            <span className="rc-serif block text-[0.8em]">{colour.titleSerif}</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cinza">{colour.intro}</p>
        </div>

        {/* The fan (media: second on phones, on the right on large screens). */}
        <div data-fan role="img" aria-label={colour.fanLabel} className="relative mx-auto flex w-full justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1" style={fanVars}>
          <div className="relative w-full max-w-[34rem]" style={{ height: "calc(var(--fan-h) * 1.12)" }}>
            {colour.swatches.map((s, i) => (
              <div
                key={s.name}
                data-swatch
                className="absolute bottom-0 left-1/2 shadow-[0_10px_24px_-14px_rgb(18_17_16/0.6)]"
                style={{ ...swatchBox, transform: `rotate(${openSpread[i]}deg)`, zIndex: i }}
              >
                <div
                  className="rc-strands absolute inset-x-0 top-0 h-[74%] rounded-t-[40%_14%]"
                  style={{ "--from": s.from, "--to": s.to } as CSSProperties}
                />
                <div className="absolute inset-x-0 bottom-0 flex h-[26%] items-start justify-center bg-gesso pt-[8%]">
                  <span data-swatch-name className="max-w-full truncate px-0.5 text-[clamp(0.42rem,1.5vw,0.6rem)] font-semibold tracking-[0.04em] text-tinta uppercase">
                    {s.name}
                  </span>
                </div>
              </div>
            ))}
            <span
              data-rivet
              aria-hidden="true"
              className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-tinta ring-4 ring-gesso"
              style={{ bottom: "calc(var(--fan-h) * 0.09)", width: "calc(var(--fan-h) * 0.07)", height: "calc(var(--fan-h) * 0.07)" }}
            />
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ol className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {colour.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-tinta/20 pt-4">
                <span className="rc-display text-[2.2rem] leading-none text-vermelhao-escuro">0{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-[0.93rem] leading-relaxed text-cinza">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            href={`#${riscaSections.services}`}
            onClick={() => window.dispatchEvent(new CustomEvent(openCategoryEvent, { detail: "cor" }))}
            className="mt-8 inline-flex h-12 items-center gap-3 bg-tinta px-6 text-[0.8rem] font-bold tracking-[0.14em] text-gesso uppercase transition-colors hover:bg-vermelhao hover:text-tinta"
          >
            {colour.prices}
            <ArrowIcon width={16} height={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
