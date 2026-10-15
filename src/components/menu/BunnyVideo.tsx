"use client";

import { useEffect, useRef } from "react";

/** The pull zone that serves the dishes' own videos (Bunny Stream). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

/** Bunny can serve this dish's own video (its id and a pull zone are known). */
export const hasBunnyVideo = (bunny?: string): bunny is string => Boolean(bunny && pullZone);

/** A card plays once this much of it is on screen. */
const playAtRatio = 0.5;

/**
 * A dish's own video from Bunny Stream (owner, 2026-10-15): a plain MP4 (480p, the phone decodes it
 * itself: no player to load, no ⏸, no YouTube overlays), with Bunny's thumbnail as poster. Silent,
 * looping, inline, nothing loaded until it plays. In the grid it plays while on screen
 * (IntersectionObserver); in full screen `playing` decides.
 */
export function BunnyVideo({ id, playing }: { id: string; playing?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || playing !== undefined) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= playAtRatio) void element.play().catch(() => {});
        else element.pause();
      },
      { threshold: [0, playAtRatio, 1] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [playing]);

  useEffect(() => {
    const element = video.current;
    if (!element || playing === undefined) return;
    if (playing) void element.play().catch(() => {});
    else element.pause();
  }, [playing]);

  const base = `https://${pullZone}.b-cdn.net/${id}`;
  return (
    <video
      ref={video}
      src={`${base}/play_480p.mp4`}
      poster={`${base}/thumbnail.jpg`}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
