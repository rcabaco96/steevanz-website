"use client";

import { useEffect, useRef, type RefObject } from "react";

// Shared IntersectionObservers (one per threshold/rootMargin pair). The hook writes an attribute on the
// element (default data-play) instead of re-rendering, so CSS drives the animation through
// animation-play-state or attribute selectors. Pass onChange when the component itself needs to know.

type Callback = (entry: IntersectionObserverEntry) => void;
const observers = new Map<string, { io: IntersectionObserver; callbacks: Map<Element, Callback> }>();

function observe(el: Element, threshold: number, rootMargin: string, cb: Callback) {
  const key = `${threshold}|${rootMargin}`;
  let record = observers.get(key);
  if (!record) {
    const callbacks = new Map<Element, Callback>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => callbacks.get(entry.target)?.(entry)),
      { threshold, rootMargin },
    );
    record = { io, callbacks };
    observers.set(key, record);
  }
  const { io, callbacks } = record;
  callbacks.set(el, cb);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

export interface InViewOptions {
  /** Attribute set while in view (removed when out, unless `once`). Default "data-play". null = none. */
  attr?: string | null;
  /** Visible fraction needed. Default 0.4. */
  threshold?: number;
  rootMargin?: string;
  /** Keep the attribute once set and stop observing. */
  once?: boolean;
  onChange?: (inView: boolean, entry: IntersectionObserverEntry) => void;
}

export function useInView<T extends Element = HTMLDivElement>({
  attr = "data-play",
  threshold = 0.4,
  rootMargin = "0px",
  once = false,
  onChange,
}: InViewOptions = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      if (attr) el.setAttribute(attr, "");
      return;
    }
    let stop: (() => void) | null = null;
    stop = observe(el, threshold, rootMargin, (entry) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= Math.min(threshold, 0.999) - 0.001;
      if (attr) {
        if (inView) el.setAttribute(attr, "");
        else if (!once) el.removeAttribute(attr);
      }
      onChangeRef.current?.(inView, entry);
      if (inView && once) stop?.();
    });
    return () => stop?.();
  }, [attr, threshold, rootMargin, once]);

  return ref;
}
