"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { afterLoadIdle, stillsOnly } from "./env";
import { videoDirector } from "./videoDirector";

// A muted, inline phone/brand video, poster first.
// - The poster renders immediately (next/image, or a <picture> when `wide` art direction is given), so it
//   can be the LCP element. The video only gets its src after window load + idle AND once it is within
//   200px of the viewport (preload="none" until then).
// - It plays while ≥50% visible, `active` is true and the video director grants it (one video at a time).
// - Save-Data or reduced motion: poster only, plus a 44px play button that starts it on tap.
// - Missing files: a failing video keeps the poster; a failing poster shows `fallback` (if given).
// - Decorative: aria-hidden. The visible label/tab names the content. No audio.

export interface LoopVideoProps {
  src: string;
  /** Used from 1024px on 2dppx screens. */
  src720?: string;
  poster: string;
  /** Intrinsic size of the poster/video (default 480×1038, the phone recordings). */
  width?: number;
  height?: number;
  /** Art direction (brand film): different file + poster when `query` matches (default min-width 768px). */
  wide?: { src: string; poster: string; query?: string };
  /** next/image sizes for the poster. */
  sizes?: string;
  /** LCP poster: preload + eager + fetchPriority high. */
  posterPriority?: boolean;
  posterAlt?: string;
  loop?: boolean;
  /** Section-level gate (current slide/tab). Default true. */
  active?: boolean;
  /** Director priority (higher wins). Hero 3, goals 2, menu 1, others 0. */
  priority?: number;
  /** Restart from 0 when `active` turns true again (default: true when loop is false). */
  restartOnActive?: boolean;
  onEnded?: () => void;
  onPlaying?: () => void;
  /** Rendered under the poster; visible when the poster file fails to load. */
  fallback?: ReactNode;
  playLabel?: string;
  className?: string;
  fit?: "cover" | "contain";
}

const subscribeNoop = () => () => {};

export function LoopVideo({
  src,
  src720,
  poster,
  width = 480,
  height = 1038,
  wide,
  sizes = "(min-width: 1024px) 300px, 62vw",
  posterPriority = false,
  posterAlt = "",
  loop = true,
  active = true,
  priority = 0,
  restartOnActive,
  onEnded,
  onPlaying,
  fallback,
  playLabel = "Ver vídeo",
  className = "",
  fit = "cover",
}: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const still = useSyncExternalStore(subscribeNoop, stillsOnly, () => false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [manual, setManual] = useState(false);
  const state = useRef({ visible: false, near: false, loaded: false, attached: false });
  const props = useRef({ active, priority, still, manual, onEnded, onPlaying });
  useEffect(() => {
    props.current = { active, priority, still, manual, onEnded, onPlaying };
  });
  const restart = restartOnActive ?? !loop;

  const chooseSrc = () => {
    if (wide && window.matchMedia(wide.query ?? "(min-width: 768px)").matches) return wide.src;
    if (src720 && window.matchMedia("(min-width: 1024px) and (min-resolution: 2dppx)").matches) return src720;
    return src;
  };

  const evaluate = () => {
    const el = videoRef.current;
    if (!el) return;
    const st = state.current;
    const p = props.current;
    const allowed = p.still ? p.manual : true;
    if (allowed && st.loaded && st.near && !st.attached) {
      el.src = chooseSrc();
      st.attached = true;
    }
    if (allowed && st.attached && st.visible && p.active) videoDirector.request(el, p.priority);
    else videoDirector.release(el);
  };

  // Observers: near (200px) attaches the src, visible (≥50%) plays.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const st = state.current;
    const cancelIdle = afterLoadIdle(() => {
      st.loaded = true;
      evaluate();
    });
    const near = new IntersectionObserver(
      ([entry]) => {
        st.near = entry.isIntersecting;
        evaluate();
      },
      { rootMargin: "200px 0px" },
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        st.visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        evaluate();
      },
      { threshold: [0, 0.5] },
    );
    near.observe(el);
    visible.observe(el);
    return () => {
      cancelIdle();
      near.disconnect();
      visible.disconnect();
      videoDirector.release(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A poster that failed before hydration never fires onError: catch it here.
  useEffect(() => {
    const img = posterRef.current;
    if (img && img.complete && img.naturalWidth === 0) setPosterFailed(true);
  }, []);

  // A video that failed before hydration (missing file) never fires onError either.
  useEffect(() => {
    const el = videoRef.current;
    if (el?.error) setVideoFailed(true);
  }, []);

  // Section gate changes (slide/tab).
  useEffect(() => {
    const el = videoRef.current;
    if (el && active && restart && el.currentTime > 0) el.currentTime = 0;
    evaluate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, manual]);

  const showVideo = playing && !videoFailed;
  const posterNode = wide ? (
    <picture>
      <source media={wide.query ?? "(min-width: 768px)"} srcSet={wide.poster} />
      <img
        ref={posterRef}
        src={poster}
        alt={posterAlt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={posterPriority ? "high" : undefined}
        loading={posterPriority ? "eager" : "lazy"}
        onError={() => setPosterFailed(true)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit }}
      />
    </picture>
  ) : (
    <Image
      ref={posterRef}
      src={poster}
      alt={posterAlt}
      width={width}
      height={height}
      sizes={sizes}
      preload={posterPriority || undefined}
      loading={posterPriority ? "eager" : "lazy"}
      fetchPriority={posterPriority ? "high" : undefined}
      onError={() => setPosterFailed(true)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit }}
    />
  );

  return (
    <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {fallback ? <div style={{ position: "absolute", inset: 0 }}>{fallback}</div> : null}
      {posterFailed ? null : posterNode}
      <video
        ref={videoRef}
        aria-hidden="true"
        tabIndex={-1}
        muted
        playsInline
        loop={loop}
        preload="none"
        width={width}
        height={height}
        disablePictureInPicture
        onPlaying={() => {
          setPlaying(true);
          props.current.onPlaying?.();
        }}
        onEnded={() => {
          if (!loop) props.current.onEnded?.();
        }}
        onError={() => setVideoFailed(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: fit,
          opacity: showVideo ? 1 : 0,
          transition: "opacity 300ms ease-out",
        }}
      />
      {still && !manual && !videoFailed ? (
        <button
          type="button"
          onClick={() => setManual(true)}
          aria-label={playLabel}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            width: 44,
            height: 44,
            borderRadius: 999,
            border: 0,
            display: "grid",
            placeItems: "center",
            background: "rgb(251 247 241 / 0.92)",
            color: "#7a2d60",
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
