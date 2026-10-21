"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const tilts = ["-rotate-[5deg]", "rotate-[4deg]", "-rotate-[2deg]"];
const offsets = ["lg:mt-0", "lg:mt-24", "lg:mt-8"];

// The ambience: the diner's interior opens up from a framed card to the full width as it scrolls in, and
// three polaroids of the film float past at different speeds.
export function Experience({ copy, aboutHref }: { copy: FabiosCopy; aboutHref: string }) {
  const { experience } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(9% 12% 9% 12% round 36px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-frame]")[0], start: "top 85%", end: "center 45%", scrub: 0.5 },
          },
        );
        gsap.fromTo(
          q("[data-frame] img"),
          { scale: 1.12 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: q("[data-frame]")[0], start: "top bottom", end: "bottom top", scrub: 0.5 } },
        );
        q("[data-speed]").forEach((el) => {
          const speed = Number((el as HTMLElement).dataset.speed);
          gsap.fromTo(
            el,
            { y: 80 * speed },
            { y: -80 * speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const polaroidSrc = { facade: fabios.media.facade, eating: fabios.media.eating, menuArt: fabios.media.menuArt } as const;

  const cta = (
    <Magnet>
      <a
        href={aboutHref}
        className="group inline-flex h-14 items-center gap-3 rounded-full bg-cherry pr-2 pl-7 text-lg font-bold text-cream transition-colors hover:bg-cherry-deep"
      >
        {experience.cta}
        <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-cherry transition-transform duration-500 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </a>
    </Magnet>
  );

  return (
    <section ref={root} id="experiencia" aria-labelledby="fr-exp-title" className="relative overflow-hidden bg-booth-soft py-24 sm:py-36">
      <div aria-hidden="true" className="fr-checker absolute inset-x-0 top-0 h-5 [--s:20px] opacity-90" />
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div className="relative">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-sky-deep uppercase sm:text-sm">
              <span aria-hidden="true" className="h-0.5 w-10 bg-sky-deep" />
              {experience.eyebrow}
            </p>
            <h2 id="fr-exp-title" className="font-display text-[clamp(3rem,11vw,8.2rem)] leading-[0.86] uppercase">
              <SplitText text={experience.title} className="block" />{" "}
              <span className="mt-1 block -rotate-2 font-script text-[0.6em] leading-[1.15] text-cherry normal-case">
                {experience.titleScript}
              </span>
            </h2>
          </div>
          <div className="relative lg:pb-3">
            <p
              aria-hidden="true"
              className="fr-neon fr-neon-flicker fr-neon-blue pointer-events-none absolute -top-28 right-2 hidden rotate-[-8deg] text-6xl lg:block xl:text-7xl"
            >
              Diner
            </p>
            <p className="max-w-lg text-lg leading-relaxed text-ink/80 sm:text-xl">{experience.text}</p>
            <div className="mt-8 hidden lg:block">{cta}</div>
          </div>
        </div>
      </div>

      <div className="mt-14 px-0 sm:mt-20 sm:px-4">
        <div data-frame className="relative mx-auto aspect-[4/5] max-w-[84rem] overflow-hidden sm:aspect-[16/9] lg:aspect-[1476/777]">
          <Image
            src={fabios.media.interior}
            alt={experience.interiorAlt}
            width={fabiosImageSize.interior.width}
            height={fabiosImageSize.interior.height}
            sizes="(max-width: 639px) 240vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover object-[30%_50%] will-change-transform"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(13_23_38/0.35))]" />
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <ul className="-mt-16 grid grid-cols-2 gap-x-3 gap-y-6 sm:-mt-24 sm:grid-cols-3 sm:gap-8 lg:-mt-32 lg:gap-14">
          {experience.polaroids.map((p, i) => (
            <li
              key={p.image}
              data-speed={[0.6, 1.2, 0.9][i]}
              className={`relative ${offsets[i]} ${i === 2 ? "col-span-2 mx-auto w-[62%] sm:col-span-1 sm:w-auto" : ""}`}
            >
              <figure className={`fr-polaroid relative ${tilts[i]} transition-transform duration-500 hover:rotate-0 max-sm:pb-12`}>
                <Image
                  src={polaroidSrc[p.image]}
                  alt={p.alt}
                  width={fabiosImageSize.still.width}
                  height={fabiosImageSize.still.height}
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 30vw, 46vw"
                  className="aspect-[4/3] h-auto w-full object-cover"
                />
                <figcaption className="absolute inset-x-2.5 bottom-1.5 font-script text-[1.05rem] leading-[1.1] text-ink sm:inset-x-3 sm:bottom-2.5 sm:text-2xl">
                  {p.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="mt-14 lg:hidden">{cta}</div>
      </div>
    </section>
  );
}
