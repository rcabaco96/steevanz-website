"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./novo.module.css";

// The brand film in the hero: the vertical cut on phones, the 16:9 cut on wide screens. The poster
// comes first (a <picture>, so it can be the LCP and only the right one downloads); the film loads
// after, muted, inline and looping, and only plays while the hero is on screen. With reduced motion
// or Save-Data it stays a still.

export interface BrandFilm {
  mobile: { mp4: string; poster: string };
  desktop: { mp4: string; poster: string };
}

const WIDE = "(min-width: 768px)";

export function BrandVideo({ film, label }: { film: BrandFilm; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    const wide = window.matchMedia(WIDE);
    let visible = false;
    const pick = () => {
      const src = wide.matches ? film.desktop.mp4 : film.mobile.mp4;
      if (el.getAttribute("src") !== src) {
        setPlaying(false);
        el.setAttribute("src", src);
        if (visible) el.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          pick();
          el.play().catch(() => {});
        } else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    wide.addEventListener("change", pick);
    const onVisibility = () => (document.hidden ? el.pause() : visible && el.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", pick);
      document.removeEventListener("visibilitychange", onVisibility);
      el.pause();
    };
  }, [film]);

  return (
    <div className={styles.film}>
      <picture>
        <source media={WIDE} srcSet={film.desktop.poster} />
        <img src={film.mobile.poster} alt="" className={styles.filmMedia} fetchPriority="high" decoding="async" />
      </picture>
      <video
        ref={videoRef}
        className={`${styles.filmMedia} ${styles.filmVideo}`}
        data-playing={playing ? "" : undefined}
        muted
        playsInline
        loop
        preload="none"
        aria-label={label}
        onPlaying={() => setPlaying(true)}
      />
    </div>
  );
}
