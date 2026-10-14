"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/** When the frame is nudged after it appears and after it loads (ms): the embed lays itself out late. */
const nudgeDelays = [600, 1500, 3000, 5000, 8000];
/**
 * Each Instagram embed costs ~56 requests and ~1.9 MB before the video (measured on 2026-10-14), and
 * the browser's own lazy loading starts iframes far ahead of the screen. So a frame is only created
 * when its card is about to come into view.
 */
const loadAhead = "300px 0px";

/**
 * Instagram's embed sizes its video once when it loads and often gets it wrong until the frame is
 * resized (checked on 2026-10-14). So the frame grows by 1 px and back a few times: the embed lays
 * itself out again at the real width. Until it has loaded, the card shows a skeleton.
 */
export function ReelFrame({ src, title, style }: { src: string; title: string; style: CSSProperties }) {
  const holder = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const timers = useRef<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: loadAhead },
    );
    observer.observe(element);
    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div ref={holder} className="absolute inset-0" aria-busy={!loaded || undefined}>
      {!loaded ? (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-surface-2">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-bg/70 to-transparent" />
        </div>
      ) : null}
      {visible ? (
        <iframe
          ref={frame}
          src={src}
          title={title}
          scrolling="no"
          allow="encrypted-media; picture-in-picture; web-share"
          onLoad={() => {
            relayout();
            // The embed draws its video a moment after the frame's load event.
            window.setTimeout(() => setLoaded(true), 700);
          }}
          className={`absolute border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={style}
        />
      ) : null}
    </div>
  );
}
