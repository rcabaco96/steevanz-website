"use client";

import { useEffect, useRef, useState } from "react";
import { FlowerMark } from "./SiteChrome";

const WORDS = ["Placas NFC", "Websites", "Software", "Inteligência artificial", "STEEVANZ"];
const SESSION_KEY = "stz-intro-seen";

type Phase = "loading" | "opening" | "done";

/**
 * Intro loader: the flower mark opens petal by petal while the services cycle
 * underneath and a counter tracks real readiness (fonts + first 3D frames).
 * It exits as an iris opening from the flower's centre, straight onto the 3D scene.
 */
export function Loader({ ready, onReveal }: { ready: boolean; onReveal: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [word, setWord] = useState(0);
  const counter = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(ready);
  const revealRef = useRef(onReveal);

  useEffect(() => {
    readyRef.current = ready;
    revealRef.current = onReveal;
  }, [ready, onReveal]);

  useEffect(() => {
    let repeat = false;
    try {
      repeat = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the full intro is fine then.
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = repeat || reduced ? 600 : 2100;
    const start = performance.now();
    let value = 0;
    let frame = 0;
    let opened = false;
    let doneTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const cap = readyRef.current ? 100 : 88;
      value += (cap - value) * (readyRef.current ? 0.12 : 0.025);
      if (counter.current) counter.current.textContent = String(Math.min(100, Math.round(value))).padStart(3, "0");
      if (!opened && readyRef.current && value > 99.4 && elapsed > minTime) {
        opened = true;
        if (counter.current) counter.current.textContent = "100";
        setPhase("opening");
        revealRef.current();
        doneTimer = window.setTimeout(() => setPhase("done"), reduced ? 400 : 1300);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const words = window.setInterval(() => setWord((w) => Math.min(WORDS.length - 1, w + 1)), repeat ? 140 : 430);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(words);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="loader" data-phase={phase} role="status" aria-live="polite" aria-label="A carregar a Steevanz">
      <div className="loader-center">
        <span className="loader-mark">
          <FlowerMark size={72} />
        </span>
        <span className="loader-word" key={word}>
          {WORDS[word]}
        </span>
      </div>
      <div className="loader-base">
        <span>Casa de software portuguesa</span>
        <span className="loader-count">
          <span ref={counter}>000</span>
        </span>
      </div>
    </div>
  );
}
