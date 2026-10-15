"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./dolci.module.css";

// The reels' row: swiped on a phone (scroll snap); on a computer, two arrows move it a few cards at a time.

export function ReelRail({ children, label, prev, next }: { children: ReactNode; label: string; prev: string; next: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    const update = () => setEdges({ start: rail.scrollLeft < 8, end: rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8 });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const move = (direction: 1 | -1) => {
    const rail = ref.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const button =
    "grid h-11 w-11 place-items-center rounded-full border border-[var(--dz-line)] bg-[var(--dz-surface)] text-[var(--dz-ink)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--dz-ink)] disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="relative">
      <ul ref={ref} className={`${styles.noScrollbar} mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pt-4 pb-8 sm:scroll-px-8 sm:px-8 lg:mx-auto lg:max-w-6xl`} aria-label={label}>
        {children}
      </ul>
      <div className="mx-auto hidden max-w-6xl justify-end gap-2 px-8 sm:flex">
        <button type="button" className={button} onClick={() => move(-1)} disabled={edges.start} aria-label={prev}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" className={button} onClick={() => move(1)} disabled={edges.end} aria-label={next}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
