// Text running round a circle and turning slowly, like a sticker on the diner's window.
// After React Bits' CircularText (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md): an SVG text
// path and a CSS rotation instead of per-letter JavaScript, so it costs nothing. Still with reduced motion.

import type { ReactNode } from "react";

interface CircularTextProps {
  text: string;
  id: string;
  className?: string;
  textClassName?: string;
  children?: ReactNode;
}

export function CircularText({ text, id, className = "", textClassName = "", children }: CircularTextProps) {
  const circumference = 2 * Math.PI * 41;
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="fr-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
        </defs>
        <text className={textClassName} textLength={circumference} lengthAdjust="spacingAndGlyphs">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      {children}
    </div>
  );
}
