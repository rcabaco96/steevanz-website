"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { finePointerDesktop, reducedMotion } from "./env";

// Desktop-only mouse tilt. pointermove sets a target in -1..1; a rAF loop lerps 0.1 per frame into
// --px/--py on this element and stops once the change is under 0.005. pointerleave returns to 0.
// Phones and reduced motion: nothing runs (zero cost). No deviceorientation.

export function PointerTilt({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointerDesktop() || reducedMotion()) return;
    const host = el.parentElement ?? el;
    const target = { x: 0, y: 0 };
    const value = { x: 0, y: 0 };
    let frame = 0;
    const step = () => {
      value.x += (target.x - value.x) * 0.1;
      value.y += (target.y - value.y) * 0.1;
      el.style.setProperty("--px", value.x.toFixed(4));
      el.style.setProperty("--py", value.y.toFixed(4));
      frame =
        Math.abs(target.x - value.x) > 0.005 || Math.abs(target.y - value.y) > 0.005 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
