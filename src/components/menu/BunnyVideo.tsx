"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";

/** The pull zone that serves the dishes' own videos (Bunny Stream). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

/** Bunny can serve this dish's own video (its id and a pull zone are known). */
export const hasBunnyVideo = (bunny?: string): bunny is string => Boolean(bunny && pullZone);

/** A card plays once this much of it is on screen. */
const playAtRatio = 0.5;
/** A video loads once it's within this distance of the screen (a screen ahead), and is let go beyond it. */
const nearMargin = "100% 0px";

/**
 * A card's quality: Bunny's rendition that fills its box on this screen (its width × the screen's
 * density), 480p on a phone. One fixed rendition, small segments: it starts at once.
 */
function cardRendition(element: HTMLElement): string {
  const pixels = element.clientWidth * (window.devicePixelRatio || 1);
  return pixels <= 540 ? "480p" : pixels <= 800 ? "720p" : "1080p";
}

/**
 * A dish's own video from Bunny Stream. In the grid, the one rendition that fills the card (480p on a
 * phone; owner's iPhone, 2026-10-16: «há alguns que não chegam a carregar»: each card on Bunny's adaptive
 * stream took 1080p or 4K, and an iPhone gave up decoding several at once; the 720p MP4 was too heavy for
 * four cards at once). Full screen, Bunny's adaptive stream (HLS) up to the library's best resolution (owner: «quero
 * tipo 4k»): natively on an iPhone, hls.js elsewhere (loaded only then), capped to the screen's size.
 * Each video loads a screen ahead and is let go a screen behind (the phone never holds dozens of them);
 * its picture stays under it until it has frames playing, then it fades in (owner: «aparece só a imagem e
 * depois o vídeo», «pára com os flashes»). Silent, looping, inline: in the grid while half on screen, in
 * full screen when `playing` (its neighbours load ahead).
 */
export function BunnyVideo({ id, playing }: { id: string; playing?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls | null>(null);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const [shown, setShown] = useState(false);
  const full = playing !== undefined;
  const active = full ? playing : seen;
  const load = near || active;
  const base = `https://${pullZone}.b-cdn.net/${id}`;

  // Near the screen (loads), and half on it (a grid card plays).
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const nearby = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: nearMargin });
    const onScreen = new IntersectionObserver(([entry]) => setSeen(entry.intersectionRatio >= playAtRatio), { threshold: [0, playAtRatio, 1] });
    nearby.observe(element);
    onScreen.observe(element);
    return () => {
      nearby.disconnect();
      onScreen.disconnect();
    };
  }, []);

  // Loads the source when near, lets it go when far.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const mp4 = `${base}/play_720p.mp4`;
    if (!load) {
      if (!element.getAttribute("src") && !hls.current) return;
      hls.current?.destroy();
      hls.current = null;
      element.removeAttribute("src");
      element.load();
      setShown(false);
      return;
    }
    if (element.getAttribute("src") || hls.current) return;
    let cancelled = false;
    // Full screen: the adaptive stream (every rendition); a card: its one rendition.
    const stream = full ? `${base}/playlist.m3u8` : `${base}/${cardRendition(element)}/video.m3u8`;
    const attach = async () => {
      // An iPhone (Safari, and every iOS browser: all WebKit) plays HLS itself. Not Chrome or Edge:
      // they answer «maybe» too, but refused their own HLS (ERR_BLOCKED_BY_ORB, 2026-10-15).
      const canNative = element.canPlayType("application/vnd.apple.mpegurl") !== "";
      if (/Apple/.test(navigator.vendor) && canNative) {
        element.src = stream;
        return;
      }
      const { default: HlsPlayer } = await import("hls.js");
      if (cancelled) return;
      if (!HlsPlayer.isSupported()) {
        element.src = canNative ? stream : mp4;
        return;
      }
      const player = new HlsPlayer({ capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 12 });
      hls.current = player;
      player.on(HlsPlayer.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        player.destroy();
        hls.current = null;
        element.src = mp4;
      });
      player.loadSource(stream);
      player.attachMedia(element);
    };
    void attach();
    return () => {
      cancelled = true;
    };
  }, [load, full, base]);

  // Plays while active (once the source is there), pauses otherwise.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!active) {
      element.pause();
      return;
    }
    const play = () => void element.play().catch(() => {});
    play();
    // The source may only just be attaching (hls.js loads first): play once it can.
    element.addEventListener("canplay", play);
    return () => element.removeEventListener("canplay", play);
  }, [active, load]);

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
        preload="auto"
        disablePictureInPicture
        onTimeUpdate={(event) => {
          if (!shown && event.currentTarget.currentTime > 0) setShown(true);
        }}
        onError={(event) => {
          // The browser's own HLS failed: the MP4 instead (that one failing too leaves the picture).
          const element = event.currentTarget;
          if (!element.getAttribute("src")?.endsWith(".m3u8")) return;
          element.src = `${base}/play_720p.mp4`;
          if (active) void element.play().catch(() => {});
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
