"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type LenisLike = {
  scrollTo: (
    target: number,
    options?: { duration?: number; immediate?: boolean },
  ) => void;
};

/** The running Lenis, so a scene can glide to a point of its own (the key board's keys). */
let current: LenisLike | null = null;

/** Scrolls smoothly to a position (Lenis when it runs; the browser's smooth scroll otherwise; a jump with reduced motion). */
export function scrollToY(top: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    window.scrollTo(0, top);
  else if (current) current.scrollTo(top, { duration: 1.1 });
  else window.scrollTo({ top, behavior: "smooth" });
}

// Lenis smooths the mouse wheel (touch scrolling stays native) and drives GSAP's ScrollTrigger from the same
// clock, so the scroll scenes never lag behind. Off when the visitor asks for reduced motion.
// Back to the top, smoothly, whenever the page is reloaded or the route changes (owner, 2026-10-23): the browser
// may restore the old position on a reload; once the page has loaded it glides back up. A reload always goes up,
// even when a menu link left #section in the address (the hash is dropped, so the next reload does the same); only a
// link to a section opened from elsewhere stays there. With reduced motion it jumps.
export function SmoothScroll() {
  const lenisRef = useRef<LenisLike | null>(null);
  const firstRun = useRef(true);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let destroyed = false;
    let cleanup = () => {};
    if (!reduced) {
      void import("lenis").then(({ default: Lenis }) => {
        if (destroyed) return;
        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.11,
          anchors: { offset: -64 },
        });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        lenisRef.current = lenis;
        current = lenis;
        cleanup = () => {
          current = null;
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    }
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const reloaded =
      firstRun.current &&
      (
        performance.getEntriesByType("navigation")[0] as
          PerformanceNavigationTiming | undefined
      )?.type === "reload";
    firstRun.current = false;
    if (window.location.hash) {
      if (!reloaded) return;
      history.replaceState(
        history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let timer = 0;
    const toTop = () => {
      timer = window.setTimeout(() => {
        if (window.scrollY < 2) return;
        if (reduced) window.scrollTo(0, 0);
        else if (lenisRef.current)
          lenisRef.current.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120);
    };
    if (document.readyState === "complete") toTop();
    else window.addEventListener("load", toTop, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", toTop);
    };
  }, [pathname]);

  return null;
}
