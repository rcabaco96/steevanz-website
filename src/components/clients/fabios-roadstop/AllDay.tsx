"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { CountUp } from "./react-bits/CountUp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** 10h → 23h: the hours the kitchen is open (old site's opening hours). */
const OPEN_HOURS = 13;

const skies = [
  "linear-gradient(180deg,#bfe6f4 0%,#e4f5fa 55%,#fff4e1 100%)",
  "linear-gradient(180deg,#8fd0ec 0%,#d4eef5 50%,#fff4e1 100%)",
  "linear-gradient(180deg,#f7b267 0%,#f79d65 40%,#f4845f 70%,#c8231f 100%)",
  "linear-gradient(180deg,#060d18 0%,#0d1726 55%,#1a2742 100%)",
];

// «All-day kitchen» as one day on the road: while the page scrolls, the sky goes from morning to night, the
// sun crosses and sets, the classic car drives past and the hour on the sign moves from 10h to 21h. With
// reduced motion, the four moments are a plain list.
export function AllDay({ copy }: { copy: FabiosCopy }) {
  const { allDay } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const steps = q("[data-step]");
        const layers = q("[data-sky]");
        gsap.set(steps.slice(1), { autoAlpha: 0, yPercent: 30 });
        gsap.set(layers.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        const seg = 1;
        steps.forEach((step, i) => {
          if (i === 0) return;
          const at = i * seg - 0.35;
          tl.to(steps[i - 1], { autoAlpha: 0, yPercent: -30, duration: 0.3, ease: "power2.in" }, at)
            .to(step, { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: "power2.out" }, at + 0.3)
            .to(layers[i], { autoAlpha: 1, duration: 0.6 }, at);
        });
        const total = (steps.length - 1) * seg + 0.6;
        tl.fromTo(q("[data-sun]"), { x: 0, y: "34vh" }, { x: "40vw", y: "-4vh", duration: total * 0.45, ease: "sine.out" }, 0)
          .to(q("[data-sun]"), { x: "82vw", y: "62vh", duration: total * 0.4, ease: "sine.in" }, total * 0.45)
          .fromTo(q("[data-night]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, total - 0.95)
          .fromTo(q("[data-fg]"), { color: "#1c1512" }, { color: "#fff4e1", duration: 0.4 }, total - 0.95)
          .fromTo(q("[data-car]"), { x: "-35vw" }, { x: "112vw", duration: total }, 0)
          .fromTo(q("[data-road]"), { backgroundPositionX: "0px" }, { backgroundPositionX: "-1200px", duration: total }, 0)
          .fromTo(q("[data-lights]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, total - 0.9);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="cozinha-aberta"
      aria-labelledby="fr-allday-title"
      className="relative bg-cream motion-safe:h-[460svh] motion-reduce:h-auto"
    >
      <div className="relative overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        {/* Sky, one layer per moment of the day. */}
        {skies.map((sky, i) => (
          <div
            key={sky}
            data-sky
            aria-hidden="true"
            className={`absolute inset-0 ${i > 0 ? "motion-reduce:hidden" : ""}`}
            style={{ background: sky }}
          />
        ))}
        <div data-night aria-hidden="true" className="absolute inset-0 opacity-0 motion-reduce:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_12%_18%,#fff_60%,transparent),radial-gradient(1px_1px_at_32%_9%,#fff_60%,transparent),radial-gradient(1.5px_1.5px_at_58%_22%,#fff_60%,transparent),radial-gradient(1px_1px_at_74%_12%,#fff_60%,transparent),radial-gradient(1.5px_1.5px_at_88%_30%,#fff_60%,transparent),radial-gradient(1px_1px_at_22%_36%,#fff_60%,transparent),radial-gradient(1px_1px_at_46%_40%,#fff_60%,transparent),radial-gradient(1px_1px_at_66%_6%,#fff_60%,transparent)]" />
          <p className="fr-neon fr-neon-flicker absolute top-[48%] right-6 -rotate-6 text-[clamp(3rem,13vw,7rem)] leading-none sm:top-[40%] sm:right-[12%]">
            Open
          </p>
        </div>
        <div
          data-sun
          aria-hidden="true"
          className="absolute bottom-[38%] left-[4%] h-24 w-24 rounded-full bg-sun shadow-[0_0_80px_30px_rgb(251_209_27/0.55)] motion-reduce:hidden sm:h-36 sm:w-36"
        />

        <div
          data-fg
          className="relative mx-auto flex h-full max-w-[90rem] flex-col px-4 pt-24 pb-[8.5rem] text-ink sm:px-8 sm:pt-32 sm:pb-44 motion-reduce:py-24"
        >
          <p className="flex items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase sm:text-sm">
            <span aria-hidden="true" className="h-0.5 w-10 bg-current" />
            {allDay.eyebrow}
          </p>
          <h2 id="fr-allday-title" className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="font-display text-[clamp(5.5rem,24vw,15rem)] leading-[0.8]">
              <CountUp to={OPEN_HOURS} />
            </span>
            <span className="pb-[0.2em] font-display text-[clamp(2rem,7vw,4.5rem)] leading-none uppercase">
              {allDay.hoursUnit}
              <span className="block font-script text-[0.62em] leading-[1.3] normal-case">{allDay.title}</span>
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed font-medium sm:text-xl">
            {allDay.text} <strong className="font-bold">{allDay.monday}</strong>
          </p>

          <ol className="relative mt-auto motion-safe:h-[9.5rem] sm:motion-safe:h-[13rem] motion-reduce:mt-10 motion-reduce:grid motion-reduce:gap-6 sm:motion-reduce:grid-cols-2">
            {allDay.steps.map((step, i) => (
              <li
                key={step.time}
                data-step
                className={`flex items-end gap-4 sm:gap-8 lg:motion-safe:justify-end motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-0 ${
                  i > 0 ? "motion-safe:invisible motion-safe:opacity-0" : ""
                }`}
              >
                <span className="font-display text-[clamp(5rem,22vw,13rem)] leading-[0.78] tabular-nums">{step.time}</span>
                <span className="pb-1 sm:pb-3">
                  <span className="block font-display text-[clamp(1.6rem,6vw,3.2rem)] leading-none uppercase">{step.name}</span>
                  <span className="mt-1 block max-w-xs text-sm leading-snug font-medium opacity-85 sm:text-lg">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* The road and the car. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[5.5rem] motion-reduce:hidden sm:h-32">
          <div
            data-road
            className="absolute inset-x-0 bottom-0 h-12 bg-[#2a2a2e] sm:h-16"
            style={{
              backgroundImage: "linear-gradient(90deg,#f5f0e1 0 60px,transparent 60px 120px)",
              backgroundSize: "120px 4px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0 55%",
            }}
          />
          <div className="absolute inset-x-0 bottom-12 h-1.5 bg-[repeating-linear-gradient(90deg,#c8231f_0_18px,#fff4e1_18px_36px)] sm:bottom-16" />
          <div data-car className="absolute bottom-6 left-0 w-[11rem] sm:bottom-8 sm:w-[17rem]">
            <div
              data-lights
              className="absolute top-[42%] -right-[55%] h-16 w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_244_200/0.7),transparent)] opacity-0 blur-md"
            />
            <Image
              src={fabios.media.car}
              alt=""
              width={fabiosImageSize.car.width}
              height={fabiosImageSize.car.height}
              sizes="(min-width: 640px) 272px, 176px"
              className="relative h-auto w-full -scale-x-100 drop-shadow-[0_10px_8px_rgb(0_0_0/0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
