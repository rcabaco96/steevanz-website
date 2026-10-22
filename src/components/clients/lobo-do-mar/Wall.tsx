"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { BagIcon, SnowIcon, SunIcon, WifiIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serviceIcons = [SunIcon, SnowIcon, BagIcon, WifiIcon];

// The line on the restaurant's wall, very large: a coral marker runs under it word by word as it is read (the
// scroll drives it), the photo of the wall opening out of a circle beside it. Then the four things the house
// offers, rising one after another. Reduced motion: the line already marked, everything in place.
export function Wall({ copy }: { copy: LoboCopy }) {
  const { wall, services } = copy;
  const root = useRef<HTMLElement>(null);
  const words = wall.line.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(q("[data-mark]"), { scaleX: 0 }, { scaleX: 1, ease: "none", stagger: 0.25, scrollTrigger: { trigger: q("[data-line]")[0], start: "top 75%", end: "bottom 40%", scrub: 0.6 } });
        gsap.fromTo(q("[data-photo]"), { clipPath: "circle(18% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "none", scrollTrigger: { trigger: q("[data-photo]")[0], start: "top 85%", end: "center 45%", scrub: 0.6 } });
        gsap.fromTo(q("[data-service]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: q("[data-services]")[0], start: "top 85%", once: true } });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.selector(root)("[data-mark]"), { scaleX: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="lm-wall-title" className="relative overflow-hidden bg-areia py-24 sm:py-36">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <figure>
            <p className="lm-eyebrow text-coral-deep">{wall.eyebrow}</p>
            <blockquote data-line className="mt-6 font-display text-[clamp(2rem,6.4vw,4.8rem)] leading-[1.06] font-extrabold tracking-[-0.01em] text-abismo">
              <h2 id="lm-wall-title" className="contents">
                «
                {words.map((word, i) => (
                  <span key={i}>
                    <span className="relative inline-block">
                      <span data-mark aria-hidden="true" className="absolute inset-x-[-0.06em] bottom-[0.06em] -z-0 h-[0.36em] origin-left scale-x-0 rounded-sm bg-coral/80" />
                      <span className="relative">{word}</span>
                    </span>{" "}
                  </span>
                ))}
                »
              </h2>
            </blockquote>
            <figcaption className="mt-6 font-display text-xs tracking-[0.2em] text-calhau uppercase">{wall.source}</figcaption>
          </figure>
          <div data-photo className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem]">
            <Image src={lobo.media.wall} alt={wall.alt} width={loboPhotoSize.tall.width} height={loboPhotoSize.tall.height} sizes="(min-width: 1024px) 28vw, 80vw" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>

        <div data-services className="mt-24 sm:mt-32">
          <p className="lm-eyebrow text-coral-deep">{services.eyebrow}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.map((item, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              return (
                <li key={item.title} data-service className="group rounded-[1.6rem] bg-abismo p-6 text-areia transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-coral text-abismo transition-transform duration-500 group-hover:rotate-12">
                    <Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-bold uppercase">{item.title}</h3>
                  <p className="mt-2 text-areia/75">{item.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
