"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { SunIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One sentence, very large, whose words come up one after the other from behind their own line, the way the sun
// clears the plain (the scroll drives it). A thin horizon is drawn under the sentence as it is read. Without
// JavaScript and with reduced motion the sentence is simply there.
export function Manifesto({ copy }: { copy: FerragialCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const text = q("[data-text]")[0];
        gsap.fromTo(
          q("[data-word-inner]"),
          { yPercent: 105, opacity: 0.2 },
          { yPercent: 0, opacity: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: text, start: "top 82%", end: "bottom 45%", scrub: 0.6 } },
        );
        gsap.fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: text, start: "top 70%", end: "bottom 45%", scrub: 0.6 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={manifesto.eyebrow} className="fg-cal relative overflow-hidden px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[70rem]">
        <p className="fg-label flex items-center gap-3 text-barro">
          <SunIcon width={22} height={22} />
          {manifesto.eyebrow}
        </p>
        <p data-text className="mt-8 font-display text-[clamp(1.9rem,6.2vw,4.6rem)] leading-[1.08] tracking-[-0.012em] text-tinta">
          {words.map((word, i) => (
            <span key={i}>
              <span className="fg-word">
                <span data-word-inner className="inline-block">
                  {word}
                </span>
              </span>{" "}
            </span>
          ))}
        </p>
        <span data-rule aria-hidden="true" className="mt-10 block h-px origin-left bg-tinta/30" />
      </div>
    </section>
  );
}
