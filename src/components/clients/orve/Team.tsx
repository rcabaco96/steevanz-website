"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orvePhotos } from "@/content/orve/facts";
import { orveSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The team (fictional, said on the page): hands at work, each inside a dew drop. On large screens the three drops
// fall into place at different speeds as the page scrolls, like drops on a window; on phones each drop rises into
// view. Reduced motion: in place.
export function Team({ copy }: { copy: OrveCopy }) {
  const { team } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-person]").forEach((person, i) => {
          gsap.fromTo(
            person,
            { y: 120 + i * 90 },
            { y: i === 1 ? 60 : 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 0.6 } },
          );
        });
      });
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-person]").forEach((person) => {
          gsap.fromTo(person, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: person, start: "top 88%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={orveSections.team} aria-labelledby="or-team-title" className="relative overflow-hidden bg-nacar py-24 sm:py-32">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="or-label mb-6 flex items-center gap-4 text-cobre">
            <span aria-hidden="true" className="h-px w-10 bg-cobre/60" />
            {team.eyebrow}
          </p>
          <h2 id="or-team-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.96]">
            {team.title} <span className="text-cobre italic">{team.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-pedra">{team.intro}</p>
        </div>

        <ul className="mt-16 grid gap-16 sm:mt-20 md:grid-cols-3 md:gap-10 md:pb-16">
          {team.people.map((person) => {
            const photo = orvePhotos[person.image];
            return (
              <li key={person.name} data-person className="flex flex-col items-center text-center">
                <div className="relative w-[min(62vw,15rem)] p-[9%] md:w-[min(24vw,19rem)]">
                  <div className="or-drop relative aspect-square w-full bg-cacau shadow-[0_30px_60px_-30px_rgb(36_24_20/0.6)]">
                    <div className="or-drop-inner">
                      <Image src={photo.src} alt={person.alt} width={photo.width} height={photo.height} sizes="(min-width: 768px) 22vw, 70vw" className="h-full w-full object-cover" style={{ objectPosition: person.focus ?? "50% 30%" }} />
                    </div>
                  </div>
                </div>
                <h3 className="mt-6 font-display text-[1.9rem] leading-tight">{person.name}</h3>
                <p className="or-label mt-2 text-cobre">{person.role}</p>
                <p className="mt-4 max-w-xs leading-relaxed text-pedra">{person.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-14 text-center text-xs text-pedra/80">{team.note}</p>
      </div>
    </section>
  );
}
