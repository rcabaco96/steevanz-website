"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialPhotos } from "@/content/ferragial/facts";
import { ArrowIcon } from "./icons";
import { talhaHorizonY, talhaPath, talhaRim } from "./Logo";
import { ferragialSections, pickExperienceEvent } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The «mãe»: the skins floating in the must, which sink as the wine settles (talha units). */
const skins = [
  [22, 50, 1.6],
  [30, 47, 1.2],
  [38, 52, 1.5],
  [44, 48, 1.1],
  [27, 56, 1.3],
  [35, 58, 1.7],
  [42, 57, 1.2],
  [19, 54, 1],
  [47, 53, 1.4],
  [32, 51, 1],
] as const;

// How vinho de talha is made, in four steps, around one big talha. The scene holds still (GSAP pin + scrub) while
// the talha's outline is drawn in clay, the must rises inside it up to the logo's horizon line, the skins — the
// «mãe» — sink to the bottom, and finally a drop runs from the tap at its foot for São Martinho. The steps light up
// one by one beside it (on phones they replace each other under the talha). Reduced motion or a short screen: the
// talha full and the four steps listed.
export function Talha({ copy }: { copy: FerragialCopy }) {
  const { talha } = copy;
  const root = useRef<HTMLElement>(null);
  const photo = ferragialPhotos.talha;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
        el.classList.add("is-armed");
        const steps = q("[data-step]");
        const narrow = window.matchMedia("(max-width: 1023px)").matches;
        const dim = narrow ? 0 : 0.28;
        gsap.set(steps, { opacity: dim });
        gsap.set(steps[0], { opacity: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-outline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.22 }, 0)
          .fromTo(q("[data-clay]"), { opacity: 0 }, { opacity: 0.32, duration: 0.15 }, 0.12)
          .fromTo(q("[data-must]"), { y: 40 }, { y: 0, duration: 0.3, ease: "power1.out" }, 0.18)
          .fromTo(q("[data-skin]"), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.3)
          .to(q("[data-skin]"), { y: (i: number) => 74 - skins[i][1], x: (i: number) => (32 - skins[i][0]) * 0.75, duration: 0.25, stagger: 0.01, ease: "power2.in" }, 0.5)
          .fromTo(q("[data-drop]"), { y: 0, opacity: 0 }, { y: 9, opacity: 1, duration: 0.12, ease: "power2.in" }, 0.82)
          .fromTo(q("[data-date]"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.1 }, 0.84);
        const at = [0, 0.27, 0.52, 0.78];
        steps.forEach((step, i) => {
          if (i === 0) return;
          tl.to(steps[i - 1], { opacity: dim, duration: 0.05 }, at[i] - 0.03).to(step, { opacity: 1, duration: 0.05 }, at[i]);
        });
        tl.to({}, { duration: 0.08 });
        return () => el.classList.remove("is-armed");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const closed = `${talhaPath}Z`;

  return (
    <section
      ref={root}
      id={ferragialSections.talha}
      aria-labelledby="fg-talha-title"
      className="fg-dark group/talha relative overflow-hidden bg-mosto text-cal [@media(min-height:600px)]:min-h-svh"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_25%_60%,rgb(180_83_42/0.32),transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[inherit] max-w-[90rem] content-center gap-6 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-0 [@media(min-height:600px)]:pt-[max(5rem,10svh)] [@media(min-height:600px)]:pb-[max(1.5rem,5svh)] lg:[@media(min-height:600px)]:py-[max(5rem,9svh)]">
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <p className="fg-label mb-4 text-palha">{talha.eyebrow}</p>
          <h2 id="fg-talha-title" className="font-display text-[clamp(2.3rem,8.4vw,4.4rem)] leading-[0.95]">
            {talha.title} <span className="text-barro-2">{talha.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-cal/78 max-lg:group-[.is-armed]/talha:hidden">{talha.intro}</p>
        </div>

        <div className="relative flex justify-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:items-center">
          <svg
            viewBox="-6 -4 76 100"
            role="img"
            aria-label={talha.alt}
            className="h-[min(56vw,30svh)] w-auto overflow-visible lg:h-[min(72svh,40rem)] [@media(max-height:599px)]:h-64"
          >
            <defs>
              <clipPath id="fg-talha-inside">
                <path d={closed} />
              </clipPath>
            </defs>
            <g clipPath="url(#fg-talha-inside)">
              <rect x="0" y="0" width="64" height="84" fill="#2b1a17" />
              <image data-clay href={photo.src} x="-14" y="-4" width="92" height="92" preserveAspectRatio="xMidYMid slice" opacity="0.32" />
              <g data-must>
                <rect x="0" y={talhaHorizonY} width="64" height="44" fill="url(#fg-must)" />
                <path d={`M0 ${talhaHorizonY}H64`} stroke="var(--color-palha)" strokeWidth="0.6" opacity="0.9" />
              </g>
              {skins.map(([cx, cy, r], i) => (
                <circle key={i} data-skin cx={cx} cy={cy} r={r} fill="#1a0509" opacity="0.9" />
              ))}
            </g>
            <linearGradient id="fg-must" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7a1a2c" />
              <stop offset="1" stopColor="#3a0a17" />
            </linearGradient>
            <rect {...talhaRim} fill="var(--color-barro-2)" />
            <path data-outline d={talhaPath} fill="none" stroke="var(--color-barro-2)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
            {/* The tap near the foot, and the drop of São Martinho. */}
            <path d="M39.5 70h8v2.4h-8z" fill="var(--color-barro-2)" />
            <circle data-drop cx="46.5" cy="75.5" r="1.3" fill="#7a1a2c" />
            <text data-date x="50" y="90" fontFamily="var(--font-sans)" fontSize="3.4" letterSpacing="0.6" fill="var(--color-palha)">
              11 NOV
            </text>
          </svg>
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <ol className="grid gap-5 lg:mt-7">
            {talha.steps.map((step) => (
              <li key={step.n} data-step className="max-w-lg group-[.is-armed]/talha:max-lg:[grid-area:1/1]">
                <p className="flex items-baseline gap-4">
                  <span className="fg-label text-palha">{step.n}</span>
                  <span className="font-display text-[clamp(1.5rem,4.6vw,2.1rem)] leading-tight">{step.title}</span>
                </p>
                <p className="mt-2 pl-[2.1rem] leading-relaxed text-cal/78">{step.text}</p>
              </li>
            ))}
          </ol>

          <a
            href={`#${ferragialSections.book}`}
            onClick={() => window.dispatchEvent(new CustomEvent(pickExperienceEvent, { detail: "talha" }))}
            className="group mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-cal px-6 text-[0.78rem] font-semibold tracking-[0.12em] text-mosto uppercase transition-colors hover:bg-palha lg:mt-7"
          >
            {talha.cta}
            <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </section>
  );
}
