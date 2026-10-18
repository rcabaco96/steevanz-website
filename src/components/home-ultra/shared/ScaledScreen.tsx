"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import s from "./ultra.module.css";

// Renders children as a 390×844 CSS-px phone layout scaled to the phone screen's width, from the
// top-left corner (transform only, so it never causes layout shift). A ResizeObserver writes --hu-scale;
// the first paint uses `initialScale` (default 0.56 ≈ a 15rem phone).
// Use inside <PhoneFrame>: <PhoneFrame><ScaledScreen><StampCard …/></ScaledScreen></PhoneFrame>

export function ScaledScreen({
  children,
  initialScale = 0.56,
  height = 844,
  className = "",
  style,
}: {
  children: ReactNode;
  initialScale?: number;
  /** Layout height in CSS px at 390 wide (taller content is clipped by the screen). */
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const screen = el?.parentElement;
    if (!el || !screen || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      if (width > 0) el.style.setProperty("--hu-scale", String(width / 390));
    });
    ro.observe(screen);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${s.scaled} ${className}`}
      style={{ "--hu-scale": initialScale, height, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
