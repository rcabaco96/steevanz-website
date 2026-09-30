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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!element.getAttribute("src")) element.src = pickSource(element, video);
          void element.play().catch(() => undefined);
        } else if (!element.paused) {
          element.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [video]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={video.poster}
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
