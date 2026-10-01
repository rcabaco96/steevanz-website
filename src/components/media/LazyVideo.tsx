"use client";

import { useEffect, useRef } from "react";
import type { MediaVideo } from "@/content/media";

interface LazyVideoProps {
  video: MediaVideo;
  label: string;
  className?: string;
}

function pickSource(element: HTMLVideoElement, video: MediaVideo): string {
  if (video.webm && element.canPlayType('video/webm; codecs="vp9"')) return video.webm;
  return video.mp4;
}

export function LazyVideo({ video, label, className = "" }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!element.paused) element.pause();
          return;
        }
        if (!element.getAttribute("poster")) element.poster = video.poster;
        if (prefersReducedMotion) return;
        if (!element.getAttribute("src")) element.src = pickSource(element, video);
        void element.play().catch(() => undefined);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [video]);

  return (
    <video
      ref={videoRef}
      className={`bg-surface-2 ${className}`}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
