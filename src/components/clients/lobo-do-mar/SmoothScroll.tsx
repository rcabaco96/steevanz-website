"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

// Lenis smooths the mouse wheel (touch scrolling stays native) and drives GSAP's ScrollTrigger from the same
// clock, so the scroll scenes never lag behind. Off when the visitor asks for reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let destroyed = false;
    let cleanup = () => {};
    void import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({ autoRaf: false, lerp: 0.11, anchors: { offset: -72 } });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);
  return null;
}
