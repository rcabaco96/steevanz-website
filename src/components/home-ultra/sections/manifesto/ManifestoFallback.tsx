"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { reducedMotion } from "../../shared/env";

// Renders the manifesto <p>. Its only job is the fallback for browsers WITHOUT CSS scroll-driven
// animations (Firefox, older Safari): while the paragraph is on screen, a passive scroll listener
// (one rAF per frame at most) writes a single --p (0..1) on it; CSS turns --p into per-word opacity.
// Supported browsers or reduced motion: it does nothing (the CSS path or the all-lit state applies).
//
// --p mirrors the CSS ranges: words light up between cover 12% and cover 54% of the paragraph's
// view timeline, so p = (cover - 0.12) / 0.42, clamped.
const START = 0.12;
const SPAN = 0.42;

export function ManifestoFallback({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return;
    if (reducedMotion() || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const cover = (vh - rect.top) / (vh + rect.height);
      const p = Math.min(1, Math.max(0, (cover - START) / SPAN));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
    };
    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      update(); // settle on the exact state for where it left the screen
    };

    update();
    el.setAttribute("data-mf", "");
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start();
        else stop();
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
      el.removeAttribute("data-mf");
      el.style.removeProperty("--p");
    };
  }, []);

  return (
    <p ref={ref} className={className} style={style}>
      {children}
    </p>
  );
}
