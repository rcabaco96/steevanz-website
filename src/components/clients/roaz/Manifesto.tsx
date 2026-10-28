"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { FinIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One sentence, very large, whose words surface one after another as it is read — each word sits on its own water
// line and comes up from under it, like a dolphin breaking the surface (the scroll drives it). A horizon draws
// itself under the sentence. Without JavaScript and with reduced motion the sentence is simply there.
export function Manifesto({ copy }: { copy: RoazCopy }) {
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
          { yPercent: 105, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: { trigger: q("[data-text]")[0], start: "top 85%", end: "bottom 55%", scrub: 0.7 },
          },
        );
        gsap.fromTo(
          q("[data-line]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: q("[data-text]")[0], start: "top 80%", end: "bottom 50%", scrub: 0.7 } },
        );
        gsap.fromTo(q("[data-fin]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, ease: "back.out(2)", duration: 1, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={manifesto.eyebrow} className="relative overflow-hidden bg-sal px-5 py-24 sm:px-8 sm:py-36">
      <div className="relative mx-auto max-w-[72rem]">
        <div className="flex items-center gap-4 text-ocre">
          <span data-fin className="inline-flex">
            <FinIcon width={34} height={34} />
          </span>
          <p className="rz-label">{manifesto.eyebrow}</p>
        </div>
        <p data-text className="rz-title mt-8 text-[clamp(2.3rem,8.4vw,6.4rem)] leading-[0.98] text-fundo">
          {words.map((word, i) => (
            <span key={i}>
              <span className="rz-surface">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>{" "}
            </span>
          ))}
        </p>
        <span data-line aria-hidden="true" className="mt-10 block h-0.5 origin-left bg-falesia" />
      </div>
    </section>
  );
}
