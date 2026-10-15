"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// A card that leans towards the mouse with a soft glare (after React Bits' TiltedCard, MIT + Commons
// Clause, © David Haz). Mouse only: on a phone, cards just scroll. No library: CSS variables and a transition.

export function TiltCard({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--tx", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ty", `${(-(y - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--ga", "1");
    el.style.setProperty("--s", "1.03");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
    el.style.setProperty("--ga", "0");
    el.style.setProperty("--s", "1");
  };

  return (
    <div className="[perspective:900px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        className={`relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:rotateY(var(--tx,0deg))_rotateX(var(--ty,0deg))_scale(var(--s,1))] [transform-style:preserve-3d] motion-reduce:[transform:none] ${className}`}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--ga,0)] transition-opacity duration-500 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.35),transparent_55%)]"
        />
      </div>
    </div>
  );
}
