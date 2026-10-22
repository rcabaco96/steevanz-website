"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const motionAllowed = () => !window.matchMedia(reducedQuery).matches;

// One of the restaurant's own clips: the poster is in the HTML; the film is added in the browser only when motion is
// fine, and it only plays while it is on screen (it pauses off screen, saving phones' batteries and data).
export function AutoVideo({ src, poster, className = "", priority = false }: { src: string; poster: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const motion = useSyncExternalStore(subscribe, motionAllowed, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- the poster under the film, same size as the frame */}
      <img src={poster} alt="" aria-hidden="true" fetchPriority={priority ? "high" : "auto"} className={`absolute inset-0 h-full w-full object-cover ${className}`} />
      {motion ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload={priority ? "auto" : "metadata"}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      ) : null}
    </>
  );
}
