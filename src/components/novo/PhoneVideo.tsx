"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PhoneClip } from "@/content/novo-home";
import styles from "./novo.module.css";

// A phone screen that plays real product recordings. Poster first (an <img>, so it can be the LCP),
// the video only loads once the phone is on screen, it is muted and inline, and only ONE video on
// the page plays at a time: the most visible one. With reduced motion or Save-Data, only the stills.

type Entry = { el: HTMLVideoElement; ratio: number; min: number; start: () => void };
const entries = new Set<Entry>();
let scheduled = false;

function pickPlaying() {
  scheduled = false;
  let best: Entry | null = null;
  for (const entry of entries) {
    if (entry.ratio < entry.min) continue;
    if (!best || entry.ratio > best.ratio) best = entry;
  }
  for (const entry of entries) {
    if (entry === best) entry.start();
    else if (!entry.el.paused) entry.el.pause();
  }
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(pickPlaying);
}

function stillsOnly(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(connection?.saveData);
}

export function PhoneVideo({
  clips,
  priority = false,
  index,
  onIndexChange,
  sizes = "(min-width: 1024px) 320px, 260px",
  minVisible = 0.5,
}: {
  clips: PhoneClip[];
  priority?: boolean;
  /** Controlled clip index (optional). */
  index?: number;
  onIndexChange?: (index: number) => void;
  sizes?: string;
  minVisible?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ownIndex, setOwnIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = index ?? ownIndex;
  const currentRef = useRef(current);
  const onIndexRef = useRef(onIndexChange);
  useEffect(() => {
    currentRef.current = current;
    onIndexRef.current = onIndexChange;
  });
  const clip = clips[current] ?? clips[0];

  useEffect(() => {
    const el = videoRef.current;
    if (!el || stillsOnly() || !("IntersectionObserver" in window)) return;
    const entry: Entry = {
      el,
      ratio: 0,
      min: minVisible,
      start: () => {
        const want = clips[currentRef.current]?.src;
        if (want && el.getAttribute("src") !== want) el.setAttribute("src", want);
        if (el.paused) el.play().catch(() => {});
      },
    };
    entries.add(entry);
    const observer = new IntersectionObserver(
      ([record]) => {
        entry.ratio = record.isIntersecting ? record.intersectionRatio : 0;
        schedule();
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9] },
    );
    observer.observe(el);
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      entries.delete(entry);
      document.removeEventListener("visibilitychange", onVisibility);
      el.pause();
    };
  }, [clips, minVisible]);

  // A new clip (ended, or chosen from outside): swap the source and keep playing if we were.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !el.getAttribute("src")) return;
    const want = clips[current]?.src;
    if (!want || el.getAttribute("src") === want) return;
    const wasPlaying = !el.paused;
    setPlaying(false);
    el.setAttribute("src", want);
    if (wasPlaying) el.play().catch(() => {});
  }, [current, clips]);

  const onEnded = () => {
    if (clips.length < 2) return;
    const next = (currentRef.current + 1) % clips.length;
    if (index === undefined) setOwnIndex(next);
    onIndexRef.current?.(next);
  };

  return (
    <div className={styles.screen}>
      <Image
        key={clip.poster}
        src={clip.poster}
        alt=""
        fill
        sizes={sizes}
        priority={priority && current === 0}
        className={styles.screenMedia}
      />
      <video
        ref={videoRef}
        className={`${styles.screenMedia} ${styles.screenVideo}`}
        data-playing={playing ? "" : undefined}
        muted
        playsInline
        loop={clips.length < 2}
        preload="none"
        aria-label={clip.label}
        onPlaying={() => setPlaying(true)}
        onEnded={onEnded}
      />
    </div>
  );
}
