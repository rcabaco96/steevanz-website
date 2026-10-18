"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { finePointerDesktop, reducedMotion } from "../../shared/env";

// The case phone leans towards the mouse (pattern from the Dolci site's TiltCard, re-themed: no glare).
// Desktop mouse only (≥1024px, hover + fine pointer), never under reduced motion. Sets --rx/--ry
// (max 8deg); the CSS in DolciCase.module.css applies them with a 500ms ease-out transition.

const MAX = 8;

export function CaseTilt({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el || !finePointerDesktop() || reducedMotion()) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--ry", `${(x * MAX * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * MAX * 2).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={ref} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
