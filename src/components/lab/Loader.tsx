"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "stz-intro-seen";

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
  const minTimeRef = useRef(1700);
  const revealRef = useRef(onReveal);

  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);

  useEffect(() => {
    startRef.current = performance.now();
    let repeat = false;
    try {
      repeat = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the full intro is fine then.
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    minTimeRef.current = repeat || reduced ? 450 : 1700;
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
    timers.push(window.setTimeout(() => setPhase("done"), wait + 380 + 1300));
    return () => {
      finishing.current = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [ready]);

  if (phase === "done") return null;

  return (
    <div className="loader" data-phase={phase} role="status" aria-label="A carregar a Steevanz">
      <div className="ld-mark">
        <span className="ld-word">
          <span>STEEVANZ</span>
        </span>
        <span className="loader-line" aria-hidden="true">
          <i />
        </span>
        <span className="ld-sub">Empresa portuguesa · desde 2021</span>
      </div>
    </div>
  );
}
