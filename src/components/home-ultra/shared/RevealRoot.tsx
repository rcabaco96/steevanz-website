"use client";

import { useEffect } from "react";

// One reveal system for the page. Marks the home root with data-hu-js (the hiding CSS only applies under
// it, so the page reads fully without JS) and sets data-shown on every [data-hu-reveal] as it enters.
// Elements already on screen are shown at once. Reduced motion: everything is shown immediately.

export function RevealRoot() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-ultra]");
    if (!root) return;
    const pending = () => Array.from(root.querySelectorAll<HTMLElement>("[data-hu-reveal]:not([data-shown])"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      pending().forEach((el) => el.setAttribute("data-shown", ""));
      root.setAttribute("data-hu-js", "");
      return;
    }
    const vh = window.innerHeight;
    for (const el of pending()) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.setAttribute("data-shown", "");
    }
    root.setAttribute("data-hu-js", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    pending().forEach((el) => io.observe(el));
    // Reveal targets mounted later by client islands (sector switch, tabs) are picked up too.
    const mo = new MutationObserver(() => pending().forEach((el) => io.observe(el)));
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
