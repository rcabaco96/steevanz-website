"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { MeadaCopy } from "@/content/meada/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One sentence, very large, sewn as it is read: a red running stitch runs under the words one after the other and
// each word goes from faint to ink as the thread passes under it (the scroll drives the needle). The two crossing
// strokes of a cross-stitch close it. Without JavaScript and with reduced motion the sentence is simply there.
export function Manifesto({ copy }: { copy: MeadaCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-text]")[0], start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        });
        q("[data-word]").forEach((word, i) => {
          tl.fromTo(word.querySelector("[data-ink]"), { opacity: 0.18 }, { opacity: 1, duration: 1 }, i)
            .fromTo(word.querySelector("[data-under]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, i);
        });
        gsap.fromTo(
          q("[data-cross] path"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.35, stagger: 0.25, ease: "power2.out", scrollTrigger: { trigger: q("[data-text]")[0], start: "bottom 50%", once: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={manifesto.eyebrow} className="relative overflow-hidden bg-algodao px-5 py-28 sm:px-8 sm:py-40">
      <div className="relative mx-auto max-w-[66rem]">
        <p className="md-label flex items-center gap-3 text-fio">
          <span aria-hidden="true" className="md-stitch w-10" />
          {manifesto.eyebrow}
        </p>
        <p data-text className="mt-8 font-display text-[clamp(1.9rem,6.2vw,4.3rem)] leading-[1.18] tracking-[-0.01em]">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="relative inline-block pb-[0.14em]">
                <span data-ink>{word}</span>
                <span data-under aria-hidden="true" className="md-stitch absolute inset-x-0 bottom-0 origin-left" />
              </span>{" "}
            </span>
          ))}
          <svg data-cross viewBox="0 0 24 24" aria-hidden="true" className="ml-1 inline-block size-[0.62em] align-baseline text-fio">
            <path d="M4 4l16 16" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" pathLength={1} />
            <path d="M20 4L4 20" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" pathLength={1} />
          </svg>
        </p>
      </div>
    </section>
  );
}
