"use client";

import { useEffect, useRef } from "react";

/**
 * Put inside a strip that scrolls sideways on phones (tabs, chips): brings the item marked
 * aria-current="page" into view, so the open tab is never hidden past the right edge. Only the strip
 * scrolls, never the page; `watch` repeats it when the current item changes without a remount.
 */
export function KeepCurrentInView({ watch }: { watch?: string }) {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const strip = marker.current?.parentElement;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !current || strip.scrollWidth <= strip.clientWidth) return;
    const box = strip.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.left >= box.left && item.right <= box.right) return;
    strip.scrollLeft += item.left + item.width / 2 - (box.left + box.width / 2);
  }, [watch]);
  return <span ref={marker} hidden />;
}
