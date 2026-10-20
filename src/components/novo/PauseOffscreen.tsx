"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Pauses the CSS animations inside while they are off screen (the CSS reads [data-paused]).

export function PauseOffscreen({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([record]) => {
      if (record.isIntersecting) el.removeAttribute("data-paused");
      else el.setAttribute("data-paused", "");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} data-paused="">
      {children}
    </div>
  );
}
