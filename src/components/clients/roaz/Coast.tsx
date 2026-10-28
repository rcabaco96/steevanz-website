"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roazPhotos } from "@/content/roaz/facts";
import { SplitText } from "./react-bits/SplitText";
import { roazSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The cliff edge of the chart: a jagged line drawn once (deterministic, so server and browser agree). */
function cliffPath(): string {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const points: string[] = ["M0 0", "H1000", "V38"];
  for (let x = 1000; x >= 0; x -= 8) {
    const coveBig = Math.sin(x / 61) * 9 + Math.sin(x / 23) * 4;
    points.push(`L${x} ${(46 + coveBig + rand() * 7).toFixed(1)}`);
  }
  points.push("L0 0Z");
  return points.join(" ");
}
const cliff = cliffPath();

// THE CHART. The route of the «Grutas e falésias» trip told as a nautical chart that slides sideways: the golden
// cliff edge along the top, the dashed route below it, the little boat sailing east as the page scrolls (GSAP pin +
// scrub), each stop lighting up as the boat reaches it, with its photo. The places are real. Without JavaScript
// and with reduced motion: a chart that scrolls sideways by hand, every stop lit.
export function Coast({ copy }: { copy: RoazCopy }) {
  const { coast } = copy;
  const root = useRef<HTMLElement>(null);
  const n = coast.stops.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const viewport = q("[data-viewport]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        viewport.style.overflowX = "hidden";
        const shift = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const stops = q("[data-stop]");
        gsap.set(stops, { opacity: 0.35 });
        gsap.set(q("[data-photo]"), { clipPath: "inset(100% 0% 0% 0%)" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${shift() + window.innerHeight * 0.5}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(track, { x: () => -shift(), duration: 1 }, 0)
          .fromTo(q("[data-boat]"), { x: 0 }, { x: () => (q("[data-route]")[0] as HTMLElement).clientWidth, duration: 1 }, 0)
          .fromTo(q("[data-wake]"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0);
        stops.forEach((stop, i) => {
          const at = Math.max(0, i / (n - 1) - 0.04);
          tl.to(stop, { opacity: 1, duration: 0.04 }, at).to(stop.querySelector("[data-photo]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out" }, at);
        });
        return () => {
          viewport.style.overflowX = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={roazSections.coast} aria-labelledby="rz-coast-title" className="rz-on-dark relative flex min-h-svh flex-col overflow-hidden bg-fundo pt-20 pb-8 text-sal [--rz-stop:15rem] sm:pt-28 sm:pb-10 sm:[--rz-stop:19rem]">
      {/* Depth lines of the chart. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:repeating-radial-gradient(ellipse_at_30%_-20%,transparent_0_38px,var(--color-agua)_38px_39px)]" />
      <div className="relative mx-auto w-full max-w-[90rem] px-5 sm:px-10">
        <p className="rz-label mb-4 text-falesia">{coast.eyebrow}</p>
        <h2 id="rz-coast-title" className="rz-title text-[clamp(2.4rem,9.5vw,6.8rem)]">
          <SplitText text={coast.title} splitType="chars" delay={30} className="block" />
          <span className="block text-agua">{coast.titleLine}</span>
        </h2>
        <p className="mt-3 max-w-lg text-[0.95rem] leading-snug text-sal/80 sm:mt-4 sm:text-base sm:leading-relaxed">{coast.intro}</p>
      </div>

      <div data-viewport className="relative mt-5 flex-1 overflow-x-auto [scrollbar-width:thin] sm:mt-10">
        <div data-track className="relative w-max px-5 will-change-transform sm:px-10">
          <div className="relative" style={{ width: `calc(${n} * var(--rz-stop))` }}>
            {/* The coast: land along the top, its cliff edge jagged. */}
            <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" className="block h-12 w-full sm:h-20">
              <path d={cliff} fill="var(--color-falesia)" />
              <path d={cliff} fill="none" stroke="var(--color-areia)" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.6" />
            </svg>
            {/* The route: dashed, filled in behind the boat as it goes. */}
            <div aria-hidden="true" className="relative mt-4 h-8 sm:mt-6">
              <span className="absolute inset-x-[calc(var(--rz-stop)/2)] top-1/2 block border-t-2 border-dashed border-sal/30" />
              <span data-wake className="absolute inset-x-[calc(var(--rz-stop)/2)] top-1/2 block border-t-2 border-agua" />
              <span data-route className="absolute inset-x-[calc(var(--rz-stop)/2)] top-1/2">
                <span data-boat className="absolute top-0 left-0 block will-change-transform" aria-label={coast.boatLabel}>
                  <svg viewBox="0 0 40 20" className="rz-rock -mt-3 -ml-6 block h-6 w-12 text-sal">
                    <path d="M40 10C33 15 25 17 16 17H2V3H16C25 3 33 5 40 10Z" fill="currentColor" />
                    <path d="M18 6.5h8v7h-8Z" fill="var(--color-fundo)" opacity="0.4" />
                  </svg>
                </span>
              </span>
            </div>
            <ol className="relative mt-2 flex">
              {coast.stops.map((stop, i) => {
                const photo = stop.image ? roazPhotos[stop.image] : null;
                return (
                  <li key={stop.id} data-stop className="flex w-[var(--rz-stop)] shrink-0 flex-col items-center px-2.5 text-center sm:px-4">
                    <span aria-hidden="true" className="-mt-[1.6rem] block size-3.5 rounded-full border-2 border-fundo bg-falesia" />
                    <span className="mt-3 font-stencil text-sm tracking-[0.2em] text-falesia">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 font-display text-[1.6rem] leading-none font-extrabold uppercase sm:text-[2rem]">{stop.name}</h3>
                    <p className="mt-1.5 max-w-[15rem] text-[0.88rem] leading-snug text-sal/75 sm:mt-2 sm:text-[0.92rem]">{stop.note}</p>
                    {photo ? (
                      <div data-photo className="relative mt-3 aspect-[16/10] w-full max-w-[17rem] sm:mt-4 sm:aspect-[4/3] overflow-hidden rounded-xl bg-fundo-2">
                        <Image src={photo.src} alt={stop.alt ?? ""} width={photo.width} height={photo.height} sizes="(min-width: 640px) 272px, 230px" className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
