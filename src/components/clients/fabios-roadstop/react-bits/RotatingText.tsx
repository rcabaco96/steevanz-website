"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// One word that flips to the next every few seconds, letter by letter.
// Adapted from React Bits' RotatingText (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md).
// Screen readers get the whole list once; with reduced motion the first word stays.

interface RotatingTextProps {
  words: readonly string[];
  interval?: number;
  className?: string;
}

export function RotatingText({ words, interval = 2400, className = "" }: RotatingTextProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(timer);
  }, [reduced, words.length, interval]);

  const word = words[index];
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span key={word} aria-hidden="true" className="inline-flex whitespace-nowrap">
          {Array.from(word).map((char, i) => (
            <m.span
              key={`${word}-${i}`}
              className="inline-block"
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 380, delay: i * 0.025 }}
            >
              {char === " " ? " " : char}
            </m.span>
          ))}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
