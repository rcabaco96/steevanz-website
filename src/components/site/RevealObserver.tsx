"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sections with [data-reveal] fade in as they scroll into view. Safe by design (2026-10-11: a page
 * showed empty sections): nothing is hidden until this runs ("reveal-ready" is added here, not by a
 * script in <head>), so if the page's JavaScript fails or is late (a browser translating the page, a
 * slow phone) everything simply shows. What is already on screen shows at once (no flash), and
 * sections that appear later are watched too, so none stays invisible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const reveal = (element: Element) => element.classList.add("is-revealed");
    const onScreen = (element: Element) => {
      const box = element.getBoundingClientRect();
      return box.top < window.innerHeight && box.bottom > 0;
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const watch = (element: Element) => {
      if (element.classList.contains("is-revealed")) return;
      if (onScreen(element)) reveal(element);
      else observer.observe(element);
    };
    document.querySelectorAll("[data-reveal]").forEach(watch);
    root.classList.add("reveal-ready");
    // Sections rendered after this (streamed or client-only) are watched as they arrive.
    const added = new MutationObserver((mutations) => {
      for (const mutation of mutations)
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) watch(node);
          node.querySelectorAll("[data-reveal]").forEach(watch);
        });
    });
    added.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      added.disconnect();
    };
  }, [pathname]);

  return null;
}
