"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { DropIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One sentence, very large, whose words fill with copper from the bottom up as it is read — like glasses filling,
// one after the other (the scroll drives it). A few drops slide down the glass at the sides. Without JavaScript and
// with reduced motion the sentence is simply filled and the drops are not there.
export function Manifesto({ copy }: { copy: OrveCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-word]"),
          { backgroundPosition: "0% 0%" },
          {
            backgroundPosition: "0% 100%",
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: q("[data-text]")[0], start: "top 80%", end: "bottom 40%", scrub: 0.6 },
          },
        );
        gsap.fromTo(q("[data-drop-mark]"), { y: -40, opacity: 0 }, { y: 0, opacity: 1, ease: "bounce.out", duration: 1.1, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const drops = [
    { left: "6%", size: 14, dur: "16s", delay: "-3s" },
    { left: "12%", size: 8, dur: "22s", delay: "-11s" },
    { left: "88%", size: 18, dur: "19s", delay: "-6s" },
    { left: "94%", size: 9, dur: "25s", delay: "-15s" },
  ];

  return (
    <section ref={root} aria-label={manifesto.eyebrow} className="relative overflow-hidden bg-nacar px-5 py-28 sm:px-8 sm:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {drops.map((d) => (
          <span
            key={d.left}
            className="or-slide or-bead absolute top-0 rounded-full bg-orvalho/70"
            style={{ left: d.left, width: d.size, height: d.size * 1.15, ["--dur" as string]: d.dur, ["--delay" as string]: d.delay }}
          />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-[62rem] flex-col items-center text-center">
        <DropIcon data-drop-mark width={28} height={28} className="text-cobre" />
        <p className="or-label mt-6 text-pedra">{manifesto.eyebrow}</p>
        <p data-text className="mt-8 font-display text-[clamp(1.85rem,6vw,4rem)] leading-[1.14] tracking-[-0.01em]">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="or-fill inline-block pb-[0.08em]">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
