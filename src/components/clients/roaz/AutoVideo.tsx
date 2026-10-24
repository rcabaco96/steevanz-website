"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const list = window.matchMedia(reducedQuery);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

interface AutoVideoProps {
  src: string;
  poster: { src: string; width: number; height: number };
  alt: string;
  sizes: string;
  className?: string;
}

// A short silent loop over its own still: the still is the first paint (and all there is with reduced motion or
// without JavaScript); the film is only loaded when it comes near the screen, and pauses when it leaves.
export function AutoVideo({ src, poster, alt, sizes, className = "" }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    const el = box.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          void ref.current?.play().catch(() => {});
        } else ref.current?.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk, near]);

  return (
    <div ref={box} className={`absolute inset-0 ${className}`}>
      <Image src={poster.src} alt={alt} width={poster.width} height={poster.height} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" />
      {motionOk && near ? (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </div>
  );
}
