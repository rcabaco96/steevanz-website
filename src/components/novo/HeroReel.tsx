"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Plays the hero's three muted loops (video[data-col][data-strip] inside), posters first:
// - nothing loads before the page has loaded and gone idle; then the computer columns (≥1024px) get the tall
//   «-col» files and phones the short «-strip» ones, swapped if the window crosses 1024px;
// - they play only while the hero is on screen and the tab is visible, and the card animations pause with them
//   ([data-paused], read by hero.module.css);
// - reduced motion or Save-Data: posters only, never a video.

type Connection = { saveData?: boolean };

export function HeroReel({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video[data-col][data-strip]"));
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean((navigator as Navigator & { connection?: Connection }).connection?.saveData);
    let ready = false;
    let visible = true;

    const sync = () => {
      const still = reduce.matches || saveData;
      for (const video of videos) {
        if (still || !ready) {
          video.pause();
          continue;
        }
        const src = (wide.matches ? video.dataset.col : video.dataset.strip) ?? "";
        if (video.dataset.current !== src) {
          video.dataset.current = src;
          video.removeAttribute("data-playing");
          video.src = src;
        }
        // React does not render «muted» on the server; set it before playing so autoplay is allowed.
        video.muted = true;
        if (visible && !document.hidden) video.play().catch(() => {});
        else video.pause();
      }
    };

    const onPlaying = (event: Event) => (event.currentTarget as HTMLVideoElement).setAttribute("data-playing", "");
    for (const video of videos) video.addEventListener("playing", onPlaying);

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            root.toggleAttribute("data-paused", !visible);
            sync();
          })
        : null;
    observer?.observe(root);

    // After window load + idle, so the posters and the title paint first.
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      const go = () => {
        ready = true;
        sync();
      };
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 2500 });
      else timer = setTimeout(go, 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    wide.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer?.disconnect();
      window.removeEventListener("load", start);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      wide.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      for (const video of videos) {
        video.removeEventListener("playing", onPlaying);
        video.pause();
      }
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
