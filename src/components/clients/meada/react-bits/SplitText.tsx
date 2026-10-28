"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useRef, type ElementType } from "react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

// Letters (or words) that rise into place when the heading scrolls into view.
// Adapted from React Bits' SplitText (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md), trimmed to
// the «rise» effect (no mask: it would clip the accents of tall capitals). The text stays readable without JavaScript and with reduced motion.

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  splitType?: "chars" | "words";
  /** Stagger between pieces, in ms. */
  delay?: number;
  duration?: number;
}

export function SplitText({ text, as: Tag = "span", className = "", splitType = "chars", delay = 28, duration = 1 }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let split: GSAPSplitText | null = null;
      let cancelled = false;
      const run = () => {
        if (cancelled) return;
        split = new GSAPSplitText(el, {
          type: splitType === "chars" ? "words, chars" : "words",
          charsClass: "inline-block",
          wordsClass: "inline-block",
          reduceWhiteSpace: false,
        });
        const pieces = splitType === "chars" ? split.chars : split.words;
        gsap.from(pieces, {
          yPercent: 70,
          rotate: 8,
          opacity: 0,
          duration,
          ease: "power4.out",
          stagger: delay / 1000,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      };
      if (document.fonts?.status === "loaded") run();
      else void document.fonts.ready.then(run);
      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [text, splitType, delay, duration] },
  );

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
