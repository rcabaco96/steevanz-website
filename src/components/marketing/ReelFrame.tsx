"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";

/** When the frame is nudged after mounting and after loading (ms): the embed lays itself out late. */
const nudgeDelays = [600, 1500, 3000, 5000, 8000];

/**
 * Instagram's embed sizes its video once when it loads and often gets it wrong until the frame is
 * resized (checked on 2026-10-14). So the frame grows by 1 px and back a few times: the embed lays
 * itself out again at the real width. Done on mount too, because a frame above the fold can finish
 * loading before the page is hydrated (its onLoad never reaches React).
 */
export function ReelFrame({ src, title, style }: { src: string; title: string; style: CSSProperties }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const timers = useRef<number[]>([]);
  const relayout = useCallback(() => {
    for (const delay of nudgeDelays) {
      timers.current.push(
        window.setTimeout(() => {
          const element = frame.current;
          if (!element) return;
          element.style.paddingRight = "1px";
          // Held for a few frames: a change undone within one frame is never seen as a resize.
          window.setTimeout(() => {
            element.style.paddingRight = "";
          }, 120);
        }, delay),
      );
    }
  }, []);
  useEffect(() => {
    relayout();
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, [relayout]);
  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      loading="lazy"
      scrolling="no"
      allow="encrypted-media; picture-in-picture; web-share"
      onLoad={relayout}
      className="absolute border-0"
      style={style}
    />
  );
}
