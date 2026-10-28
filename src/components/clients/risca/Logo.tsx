import type { SVGProps } from "react";

// The «RISCA» wordmark, drawn by hand on a grid: heavy condensed capitals, struck through by one straight line — the
// parting of the hair («a risca») and the stroke of a pen that crosses something out («riscar»). Above the line the
// letters slide a little along it, as if cut by the scissors. Same drawing as public/media/clients/risca/logo.svg.

/** The letters' strokes, in the wordmark's own units (each letter on a 44 × 100 cell). */
export const wordmarkLetters = [
  "M7.5 106V7.5H25a17.5 17.5 0 0 1 0 35H7.5M24 42.5L38.5 106",
  "M58.5 -6V106",
  "M114 22Q114 7.5 96 7.5Q80.5 7.5 80.5 27Q80.5 45 96 49Q111.5 53 111.5 72Q111.5 92.5 95.5 92.5Q79 92.5 78.5 78",
  "M166 24Q165 7.5 147.5 7.5Q131.5 7.5 131.5 30V70Q131.5 92.5 147.5 92.5Q165 92.5 166 76",
  "M181.5 106L194 7.5H206L218.5 106M188 70H212",
];
/** The cut: one straight line through the middle of the letters, about 14° (rise 64 over 252). */
export const wordmarkCut = { x1: -14, y1: 82, x2: 238, y2: 18 };
export const wordmarkViewBox = { x: -20, y: -14, width: 264, height: 128 };
/** The cut's angle in degrees (negative: it rises to the right). Used by every slanted mask of the site. */
export const cutAngle = (-Math.atan2(wordmarkCut.y1 - wordmarkCut.y2, wordmarkCut.x2 - wordmarkCut.x1) * 180) / Math.PI;

function Letters() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinejoin="miter" strokeMiterlimit="10">
      {wordmarkLetters.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

interface WordmarkProps extends Omit<SVGProps<SVGSVGElement>, "id"> {
  /** Unique prefix for the clip paths (several wordmarks share a page). */
  id: string;
  /** Colour of the line; «none» hides it. */
  accent?: string;
  /** false: whole letters, no cut (the opening cuts them itself). */
  cut?: boolean;
  lineProps?: SVGProps<SVGLineElement> & Record<`data-${string}`, unknown>;
}

export function Wordmark({ id, accent = "var(--color-vermelhao)", cut = true, lineProps, className, ...rest }: WordmarkProps) {
  const c = wordmarkCut;
  const vb = wordmarkViewBox;
  return (
    <svg viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`} className={className} aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <clipPath id={`${id}-box`}>
          <rect x="-2" y="0" width="230" height="100" />
        </clipPath>
        <clipPath id={`${id}-lo`}>
          <polygon points={`-20,${c.y1 + 3} 244,${c.y2} 244,140 -20,140`} />
        </clipPath>
        <clipPath id={`${id}-hi`}>
          <polygon points={`-20,-40 244,-40 244,${c.y2 - 1.6} -20,${c.y1 - 1.6}`} />
        </clipPath>
      </defs>
      {cut ? (
        <>
          <g clipPath={`url(#${id}-box)`}>
            <g clipPath={`url(#${id}-lo)`}>
              <Letters />
            </g>
          </g>
          <g transform="translate(4 -1)">
            <g clipPath={`url(#${id}-box)`}>
              <g clipPath={`url(#${id}-hi)`}>
                <Letters />
              </g>
            </g>
          </g>
        </>
      ) : (
        <g clipPath={`url(#${id}-box)`}>
          <Letters />
        </g>
      )}
      {accent !== "none" ? <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={accent} strokeWidth="2.6" {...lineProps} /> : null}
    </svg>
  );
}

/** The wordmark with a line of text under it, for the footer. */
export function Logo({ id, label, className = "", accent }: { id: string; label: string; className?: string; accent?: string }) {
  return (
    <span role="img" aria-label={label} className={`flex flex-col gap-3 ${className}`}>
      <Wordmark id={id} accent={accent} className="w-full" />
      <span aria-hidden="true" className="rc-label opacity-70">
        Cabeleireiro e barbearia · Porto
      </span>
    </span>
  );
}
