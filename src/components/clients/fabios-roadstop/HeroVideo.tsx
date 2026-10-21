"use client";

import { useEffect, useRef, useState } from "react";
import { fabios } from "@/content/fabios-roadstop/facts";

interface HeroVideoProps {
  label: string;
  pauseLabel: string;
  playLabel: string;
}

// The restaurant's own 35-second film behind the hero. The poster (its first frame) is the page's largest
// image and paints first; the video only starts loading once the page has loaded, never with reduced
// motion, data saving or a slow (2G/3G) connection. It loops between two moments (skipping the white end card) and pauses when the
// hero is off screen or the tab is hidden.
export function HeroVideo({ label, pauseLabel, playLabel }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = connection?.saveData || /(^|-)2g$|^3g$/.test(connection?.effectiveType ?? "");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || slow) return;
    let idle = 0;
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setSrc(fabios.media.video)) as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    const { from, to } = fabios.videoLoop;
    const onMeta = () => {
      video.currentTime = from;
      void video.play().catch(() => {});
    };
    const onTime = () => {
      if (video.currentTime >= to) video.currentTime = from;
    };
    const onPlaying = () => setVisible(true);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("playing", onPlaying);

    const observer = new IntersectionObserver(([entry]) => {
      if (userPaused.current) return;
      if (entry.isIntersecting && document.visibilityState === "visible") void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    const onVisibility = () => {
      if (userPaused.current) return;
      if (document.visibilityState === "visible") void video.play().catch(() => {});
      else video.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("playing", onPlaying);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      setPaused(false);
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      setPaused(true);
      video.pause();
    }
  };

  if (!src) return null;
  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-label={label}
        disablePictureInPicture
        className={`absolute inset-0 h-full w-full scale-[1.04] object-cover transition-opacity duration-[1400ms] lg:blur-[1.2px] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      {visible ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className="absolute right-4 bottom-[5.4rem] z-20 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-cream ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-black/55 sm:right-8"
          aria-label={paused ? playLabel : pauseLabel}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 4l15 8-15 8z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
