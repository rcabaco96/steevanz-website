"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./AdVideo.module.css";

// The Menu digital ad (720×1280, with music) in a phone-shaped frame with a fixed 9:16 ratio (no CLS).
// Poster first (lazy). The video only gets its source near the viewport (preload="none"), plays muted,
// inline and in a loop while on screen, and pauses off screen or in a hidden tab. «Ver com som»
// restarts it with sound. With reduced motion or Save-Data it never starts by itself: the poster
// shows a play button.

export interface AdVideoProps {
  src: string;
  poster: string;
  label: string;
  copy: { soundOn: string; soundOff: string; play: string };
}

function stillsOnly(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(connection?.saveData);
}

export function AdVideo({ src, poster, label, copy }: AdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const manual = stillsOnly() || !("IntersectionObserver" in window);
    if (manual) {
      // Decided once on the client: reduced motion / Save-Data only change after mount.
      queueMicrotask(() => setMode("manual"));
    }
    const load = () => {
      if (!el.getAttribute("src")) el.setAttribute("src", src);
    };
    const near = new IntersectionObserver(
      ([record]) => {
        if (record.isIntersecting && !manual) {
          load();
          near.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    const seen = new IntersectionObserver(
      ([record]) => {
        visibleRef.current = record.isIntersecting && record.intersectionRatio >= 0.35;
        if (!visibleRef.current) el.pause();
        else if (!manual || el.dataset.started) {
          load();
          el.play().catch(() => {});
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );
    if (!manual) near.observe(el);
    seen.observe(el);
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (visibleRef.current && (!manual || el.dataset.started)) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      near.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.pause();
    };
  }, [src]);

  const start = (withSound: boolean) => {
    const el = videoRef.current;
    if (!el) return;
    if (!el.getAttribute("src")) el.setAttribute("src", src);
    el.dataset.started = "1";
    setStarted(true);
    el.muted = !withSound;
    setSound(withSound);
    el.play().catch(() => {});
  };

  const toggleSound = () => {
    const el = videoRef.current;
    if (!el) return;
    if (sound) {
      el.muted = true;
      setSound(false);
      return;
    }
    el.currentTime = 0;
    start(true);
  };

  const showPlay = mode === "manual" && !started;

  return (
    <div className={styles.frame}>
      <div className={styles.screen}>
        <Image src={poster} alt="" fill sizes="(min-width: 1024px) 320px, 72vw" className={styles.media} />
        <video
          ref={videoRef}
          className={`${styles.media} ${styles.video}`}
          data-playing={playing ? "" : undefined}
          muted
          playsInline
          loop
          preload="none"
          aria-label={label}
          onPlaying={() => setPlaying(true)}
        />
        {showPlay ? (
          <button type="button" className={styles.play} onClick={() => start(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
            {copy.play}
          </button>
        ) : (
          <button type="button" className={styles.sound} onClick={toggleSound} aria-pressed={sound}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
              {sound ? (
                <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
              ) : (
                <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
              )}
            </svg>
            {sound ? copy.soundOff : copy.soundOn}
          </button>
        )}
      </div>
    </div>
  );
}
