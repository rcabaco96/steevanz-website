"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";

/** The pull zone that serves the dishes' own videos (Bunny Stream). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

/** Bunny can serve this dish's own video (its id and a pull zone are known). */
export const hasBunnyVideo = (bunny?: string): bunny is string => Boolean(bunny && pullZone);

/** A card plays once this much of it is on screen. */
const playAtRatio = 0.5;

/**
 * A dish's own video from Bunny Stream (owner, 2026-10-15): Bunny's adaptive stream (HLS), like
 * Instagram's: it starts at once and rises to the best quality the screen and the network allow,
 * up to the library's highest resolution (owner: «quero tipo 4k, os clientes vão gravar com
 * iPhone»). The phone decodes it itself: no player to load, no ⏸, no YouTube overlays. An iPhone
 * plays HLS natively; elsewhere hls.js (loaded only when a Bunny video plays) caps the quality to
 * the box's size × the screen's density, so a grid card doesn't pull full-screen quality. The 720p
 * MP4 is the fallback. Silent, looping, inline, nothing loaded until it plays: in the grid while on
 * screen (IntersectionObserver), in full screen when `playing`.
 */
export function BunnyVideo({ id, playing }: { id: string; playing?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls | null>(null);
  const [seen, setSeen] = useState(false);
  // The video shows only once it has frames on screen: until then its picture (no white flash on an
  // iPhone, owner 2026-10-15: «faz um flash branco», «pára com os flashes»).
  const [shown, setShown] = useState(false);
  const active = playing ?? seen;
  const activeNow = useRef(active);
  useEffect(() => {
    activeNow.current = active;
  }, [active]);
  const base = `https://${pullZone}.b-cdn.net/${id}`;

  // The browser's own HLS failed (or the stream did): the MP4 instead; that one failing too leaves the picture.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const onError = () => {
      if (!element.src.endsWith(".m3u8")) return;
      element.src = `${base}/play_720p.mp4`;
      if (activeNow.current) void element.play().catch(() => {});
    };
    element.addEventListener("error", onError);
    return () => element.removeEventListener("error", onError);
  }, [base]);

  // In the grid: on screen or not.
  useEffect(() => {
    const element = video.current;
    if (!element || playing !== undefined) return;
    const observer = new IntersectionObserver(([entry]) => setSeen(entry.intersectionRatio >= playAtRatio), { threshold: [0, playAtRatio, 1] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [playing]);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!active) {
      element.pause();
      return;
    }
    let cancelled = false;
    const play = () => void element.play().catch(() => {});
    const fallback = () => {
      hls.current?.destroy();
      hls.current = null;
      element.src = `${base}/play_720p.mp4`;
      play();
    };
    const native = () => {
      element.src = `${base}/playlist.m3u8`;
      play();
    };
    const start = async () => {
      if (element.src || hls.current) return play();
      // An iPhone (Safari, and every iOS browser: all WebKit) plays HLS itself. Not Chrome or Edge:
      // they now answer «maybe» too, but their own HLS was refused (ERR_BLOCKED_BY_ORB, 2026-10-15).
      const apple = /Apple/.test(navigator.vendor);
      const canNative = element.canPlayType("application/vnd.apple.mpegurl") !== "";
      if (apple && canNative) return native();
      const { default: HlsPlayer } = await import("hls.js");
      if (cancelled) return;
      if (!HlsPlayer.isSupported()) return canNative ? native() : fallback();
      const player = new HlsPlayer({ capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 12 });
      hls.current = player;
      player.on(HlsPlayer.Events.ERROR, (_event, data) => {
        if (data.fatal) fallback();
      });
      player.loadSource(`${base}/playlist.m3u8`);
      player.attachMedia(element);
      play();
    };
    void start();
    return () => {
      cancelled = true;
    };
  }, [active, base]);

  useEffect(
    () => () => {
      hls.current?.destroy();
      hls.current = null;
    },
    [],
  );

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- Bunny's own picture of the video */}
      <img src={`${base}/thumbnail.jpg`} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        onTimeUpdate={(event) => {
          if (!shown && event.currentTarget.currentTime > 0) setShown(true);
        }}
        className={`absolute inset-0 h-full w-full object-cover ${shown ? "" : "opacity-0"}`}
      />
    </>
  );
}
