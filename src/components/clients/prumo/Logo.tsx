import type { SVGProps } from "react";

// Prumo's wordmark, drawn by hand on a grid (no font): lowercase monoline letters «prumo», round ends, a calm
// geometric hand. The stem of the «p» drops below the line as a fine thread and ends in a brass plumb bob — the
// «fio de prumo» physiotherapists still hang in front of a posture grid to see how a body stands. The same paths make
// the favicon, icons and the link preview image (public/media/clients/prumo).

/** The letters, one monoline path each (stroke, no fill). */
export const prumoLetters = [
  // p: the stem from the x-height to the baseline, the bowl.
  "M5 23V58",
  "M5 40a17 17 0 1 0 34 0a17 17 0 1 0 -34 0",
  // r
  "M52 58V39Q52 23 70 23",
  // u
  "M82 23V40a17 17 0 0 0 34 0V23M116 23V58",
  // m
  "M128 23V58M128 38a13 13 0 0 1 26 0V58M154 38a13 13 0 0 1 26 0V58",
  // o
  "M192 40a17 17 0 1 0 34 0a17 17 0 1 0 -34 0",
] as const;

/** The thread under the «p» (it hangs from the end of the stem) and the plumb bob. */
export const prumoThread = { x: 5, top: 58, bottom: 92 };
export const prumoBob = "M0 90.5h10a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1 -1.5 1.5h-10a1.5 1.5 0 0 1 -1.5 -1.5v-2.2a1.5 1.5 0 0 1 1.5 -1.5ZM-1.2 97.4h12.4L6.3 115.2a1.35 1.35 0 0 1 -2.6 0Z";

export const prumoViewBox = { x: -6, y: 15, width: 240, height: 106 };
export const prumoStroke = 7;

interface WordmarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Colour of the letters. */
  ink?: string;
  /** Colour of the plumb bob. */
  bob?: string;
  /** Without the thread and the bob (a header on a short bar). */
  short?: boolean;
  lettersProps?: Record<string, unknown>;
  plumbProps?: Record<string, unknown>;
  title?: string;
}

export function Wordmark({ ink = "currentColor", bob = "var(--color-latao)", short = false, lettersProps, plumbProps, title, ...svg }: WordmarkProps) {
  const vb = prumoViewBox;
  const height = short ? 66 : vb.height;
  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${height}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      overflow="visible"
      {...svg}
    >
      <g fill="none" stroke={ink} strokeWidth={prumoStroke} strokeLinecap="round" strokeLinejoin="round" {...lettersProps}>
        {prumoLetters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {short ? null : (
        <g {...plumbProps}>
          <line x1={prumoThread.x} y1={prumoThread.top} x2={prumoThread.x} y2={prumoThread.bottom} stroke={ink} strokeWidth="1.4" />
          <path d={prumoBob} fill={bob} />
        </g>
      )}
    </svg>
  );
}

/** The bob alone (the scroll marker beside the treatments, the stamps of the client card). */
export function Bob({ color = "var(--color-latao)", ...svg }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg viewBox="-2.5 89.5 15 27" aria-hidden="true" {...svg}>
      <path d={prumoBob} fill={color} />
    </svg>
  );
}
