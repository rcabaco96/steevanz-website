import type { SVGProps } from "react";

// Meada's logo, drawn for this demo (a fictional business): «meada» written in one weight of thread — round,
// geometric lowercase letters with soft ends — and under it a running stitch in red thread that ends in a cross-stitch,
// the mark of Guimarães embroidery. The letters take the text colour; the thread keeps the red unless told otherwise.
// Same drawing as public/media/clients/meada/logo.svg.

export const wordmarkViewBox = "0 0 280 98";

/** The letters, one path per stroke (the opening draws them one after the other). */
export const wordmarkLetters = [
  "M6 30V70",
  "M6 44a11.5 11.5 0 0 1 23 0V70",
  "M29 44a11.5 11.5 0 0 1 23 0V70",
  "M62 50H102A20 20 0 1 0 96.14 64.14",
  "M152 50A20 20 0 1 0 112 50A20 20 0 1 0 152 50",
  "M152 30V70",
  "M202 50A20 20 0 1 0 162 50A20 20 0 1 0 202 50",
  "M202 6V70",
  "M252 50A20 20 0 1 0 212 50A20 20 0 1 0 252 50",
  "M252 30V70",
];

/** The running stitch under the word, and the cross-stitch at its end. */
export const wordmarkStitch = "M6 88H252";
export const wordmarkCross = ["M261 81L275 95", "M275 81L261 95"];

interface WordmarkProps {
  /** Unique per page: the running stitch is drawn through a mask, and masks are found by id. */
  id: string;
  className?: string;
  /** Colour of the thread (a CSS colour). */
  thread?: string;
  /** For the opening scene: lets each part be animated on its own. */
  letterProps?: SVGProps<SVGPathElement> & Record<string, unknown>;
  stitchProps?: SVGProps<SVGPathElement> & Record<string, unknown>;
  crossProps?: SVGProps<SVGPathElement> & Record<string, unknown>;
}

export function Wordmark({ id, className = "", thread = "var(--color-fio)", letterProps, stitchProps, crossProps }: WordmarkProps) {
  return (
    <svg viewBox={wordmarkViewBox} className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-10" y="70" width="300" height="40">
          <path d={wordmarkStitch} stroke="#fff" strokeWidth="10" fill="none" pathLength={1} {...stitchProps} />
        </mask>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {wordmarkLetters.map((d) => (
          <path key={d} d={d} pathLength={1} {...letterProps} />
        ))}
      </g>
      <g fill="none" stroke={thread} strokeLinecap="round">
        <path d={wordmarkStitch} strokeWidth="4" strokeDasharray="11 8" mask={`url(#${id})`} />
        {wordmarkCross.map((d) => (
          <path key={d} d={d} strokeWidth="4.2" pathLength={1} {...crossProps} />
        ))}
      </g>
    </svg>
  );
}

/** The wordmark with the line under it, as a single labelled image. */
export function Logo({ id, label, className = "", line = true, thread }: { id: string; label: string; className?: string; line?: boolean; thread?: string }) {
  return (
    <span role="img" aria-label={label} className={`flex flex-col items-start ${className}`}>
      <Wordmark id={id} className="w-full" thread={thread} />
      {line ? (
        <span aria-hidden="true" className="md-label mt-[6%] block text-[0.5em] whitespace-nowrap opacity-80">
          Casa &amp; Ofícios
        </span>
      ) : null}
    </span>
  );
}
