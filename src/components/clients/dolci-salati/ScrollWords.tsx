"use client";

import { m, LazyMotion, domAnimation, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";

// A sentence whose words light up one by one as it scrolls through the screen (after React Bits'
// ScrollReveal, MIT + Commons Clause, © David Haz; motion instead of GSAP). The words are server-rendered
// at a faint opacity, so the sentence reads even before this runs.

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <m.span aria-hidden="true" className="inline-block" style={{ opacity, y }}>
      {word}
    </m.span>
  );
}

export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const words = text.split(" ");
  if (reduced) return <p ref={ref} className={className}>{text}</p>;
  return (
    <LazyMotion features={domAnimation} strict>
      <p ref={ref} className={className}>
        <span className="sr-only">{text}</span>
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <Word word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />{" "}
          </Fragment>
        ))}
      </p>
    </LazyMotion>
  );
}
