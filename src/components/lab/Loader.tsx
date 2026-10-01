"use client";

import { useEffect, useRef, useState } from "react";
import { FlowerMark } from "./FlowerMark";


const SESSION_KEY = "stz-intro-seen";

// Decided once per page load, even if the component mounts more than once.
let seenBefore: boolean | null = null;
let loadStart = 0;

type Phase = "loading" | "complete" | "opening" | "done";

/**
 * Intro loader. Everything that moves here is a CSS transform animation, so it
 * keeps running on the compositor even while the main thread is busy preparing
 * the 3D scene. JavaScript only decides when to finish: once the scene and fonts
 * are ready (and a minimum time has passed), the line completes and an iris
 * opens from the flower's centre onto the page.
 */
export function Loader({ ready, onReveal }: { ready: boolean; onReveal: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const startRef = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const minTimeRef = useRef(1700);
  const revealRef = useRef(onReveal);

  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);

  useEffect(() => {
    if (seenBefore === null) loadStart = performance.now();
    startRef.current = loadStart;
    let repeat = false;
    try {
      // Decide once per page load (effects can run twice in development).
      if (seenBefore === null) {
        seenBefore = sessionStorage.getItem(SESSION_KEY) === "1";
        sessionStorage.setItem(SESSION_KEY, "1");
      }
      repeat = seenBefore;
    } catch {
      // Storage can be unavailable (private mode); the full intro is fine then.
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The intro lasts ~1.9 s; repeat visits and reduced motion skip it.
    minTimeRef.current = repeat || reduced ? 400 : 1400;
    if ((repeat || reduced) && root.current) root.current.dataset.quick = "true";
    // Start the CSS sequence now that the page is live (not at first HTML paint).
    if (root.current) root.current.dataset.run = "true";
  }, []);

  // Runs once when everything is ready; the phase changes below must not cancel it.
  const finishing = useRef(false);
  useEffect(() => {
    if (!ready || finishing.current) return;
    finishing.current = true;
    const wait = Math.max(0, minTimeRef.current - (performance.now() - startRef.current));
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("complete"), wait));
    timers.push(
      window.setTimeout(() => {
        setPhase("opening");
        revealRef.current();
      }, wait + 380),
    );
    timers.push(window.setTimeout(() => setPhase("done"), wait + 380 + 900));
    return () => {
      finishing.current = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [ready]);

  if (phase === "done") return null;

  return (
    <div ref={root} className="loader" data-phase={phase} role="status" aria-label="A carregar a Steevanz">
      <div className="ld-stage" aria-hidden="true">
        <span className="ld-mark-slot">
          <FlowerMark size={64} />
        </span>
        <span className="ld-name">STEEVANZ</span>
      </div>
      <div className="ld-foot" aria-hidden="true">
        <span>Empresa portuguesa · desde 2021</span>
        <span className="loader-line">
          <i />
        </span>
      </div>
    </div>
  );
}
