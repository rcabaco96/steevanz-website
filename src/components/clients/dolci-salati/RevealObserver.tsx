"use client";

import { useEffect } from "react";

// One observer for the whole page: elements marked data-reveal fade and rise in as they enter the screen
// (data-reveal="blur" also unblurs, "clip" opens like a window). Until this runs, and without JavaScript,
// everything is simply visible: the hiding rule only applies once the root has data-reveal-ready.
export function RevealObserver({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || !("IntersectionObserver" in window)) return;
    const viewport = window.innerHeight;
    const targets = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    // Whatever is already on screen stays shown: no flash.
    for (const el of targets) if (el.getBoundingClientRect().top < viewport) el.setAttribute("data-shown", "");
    root.setAttribute("data-reveal-ready", "");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of targets) if (!el.hasAttribute("data-shown")) observer.observe(el);
    return () => observer.disconnect();
  }, [rootId]);
  return null;
}
