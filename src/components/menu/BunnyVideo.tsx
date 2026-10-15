"use client";

import { useEffect, useRef, useState } from "react";

/** The pull zone that serves the dishes' own videos (Bunny Stream). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

/** Bunny can serve this dish's own video (its id and a pull zone are known). */
export const hasBunnyVideo = (bunny?: string): bunny is string => Boolean(bunny && pullZone);

/** A card plays once this much of it is on screen. */
const playAtRatio = 0.5;

/**
 * A dish's own video from Bunny Stream (owner, 2026-10-15): a plain MP4 (the phone decodes it
 * itself: no player to load, no ⏸, no YouTube overlays), with Bunny's thumbnail as poster. Silent,
 * looping, inline, nothing loaded until it plays. In the grid it plays while on screen
 * (IntersectionObserver) in 480p (a half-width card; light on 4G); in full screen `playing` decides
 * and it plays in 720p («480p não tem qualidade nenhuma»), the best MP4 Bunny makes, falling back to
 * 480p when the source was too small for a 720p file.
 */
export function BunnyVideo({ id, playing, quality = "480p" }: { id: string; playing?: boolean; quality?: "480p" | "720p" }) {
  const video = useRef<HTMLVideoElement>(null);
  const [rendition, setRendition] = useState(quality);

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
      src={`${base}/play_${rendition}.mp4`}
      onError={() => {
        if (rendition === "480p") return;
        setRendition("480p");
        // The new source starts again where it was meant to (playing or not).
        window.setTimeout(() => {
          if (playing) void video.current?.play().catch(() => {});
        });
      }}
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
