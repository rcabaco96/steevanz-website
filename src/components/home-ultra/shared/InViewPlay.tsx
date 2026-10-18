"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { useInView, type InViewOptions } from "./useInView";

// Wrapper for server-rendered children: sets data-play (or `attr`) on itself while in view, so the CSS
// inside runs only on screen. E.g.
//   <InViewPlay className={s.demo} threshold={0.4}>…CSS demo…</InViewPlay>
//   .demo .bar { animation-play-state: paused }  .demo[data-play] .bar { animation-play-state: running }

type Tag = "div" | "section" | "ul" | "ol" | "li" | "span" | "figure" | "footer" | "header" | "p";

export function InViewPlay({
  as = "div",
  className,
  style,
  id,
  children,
  ...options
}: InViewOptions & {
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}) {
  const ref = useInView<HTMLElement>(options);
  const Component = as as "div";
  return (
    <Component ref={ref as RefObject<HTMLDivElement>} className={className} style={style} id={id}>
      {children}
    </Component>
  );
}
