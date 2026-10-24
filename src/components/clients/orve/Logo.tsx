import type { ReactNode } from "react";

// Orvé's logo, drawn for this demo (a fictional business): a lowercase didone «orvé» — vertical stress, hairline
// serifs, the «r» ending in a drop — whose acute accent is a dew drop in copper. The letters take the text colour;
// the drop keeps the copper unless told otherwise. Same drawing as public/media/clients/orve/logo.svg.

interface WordmarkProps {
  /** Unique per page: the «é»'s opening is a mask, and masks are found by id. */
  id: string;
  className?: string;
  /** Colour of the drop (a CSS colour). */
  accent?: string;
  /** For the opening scene: lets the drop be animated on its own. */
  dropProps?: Record<string, string | boolean>;
  lettersProps?: Record<string, string | boolean>;
  children?: ReactNode;
}

export const wordmarkViewBox = { x: 22, y: 8, width: 292, height: 126 };
/** Where the drop lands (its round part), in the wordmark's own units. */
export const wordmarkDropCenter = { x: 284.3, y: 32 };

export function Wordmark({ id, className = "", accent = "var(--color-cobre)", dropProps, lettersProps, children }: WordmarkProps) {
  const { x, y, width, height } = wordmarkViewBox;
  return (
    <svg viewBox={`${x} ${y} ${width} ${height}`} className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="160">
          <rect width="400" height="160" fill="#fff" />
          <path d="M276 93 L318 93 L318 117 Z" fill="#000" />
        </mask>
      </defs>
      <g fill="currentColor" {...lettersProps}>
        <path fillRule="evenodd" d="M60 49a34 41 0 1 0 0.01 0Z M60 53a20 37 0 1 1 -0.01 0Z" />
        <path d="M112 50h14v77h8v3h-30v-3h8v-74h-8v-3z" />
        <path d="M126 70c4-12 13-19 24-19c-1 3-1 6 0 8c-9 0-17 5-22 14z" />
        <circle cx="152" cy="61" r="8.5" />
        <path d="M168 50h30v3h-6l18 58l15-58h-6v-3h22v3h-6l-23 79h-4l-26-79h-8z" />
        <g mask={`url(#${id})`}>
          <path fillRule="evenodd" d="M278 49a32 41 0 1 0 0.01 0Z M278 53a19 37 0 1 1 -0.01 0Z" />
        </g>
        <path d="M254 85h48v4h-48z" />
      </g>
      {children}
      <g {...dropProps}>
        <path fill={accent} transform="translate(286 29) rotate(30)" d="M0 -16C5 -7.5 8.5 -2 8.5 3.5A8.5 8.5 0 1 1 -8.5 3.5C-8.5 -2 -5 -7.5 0 -16Z" />
      </g>
    </svg>
  );
}

/** The wordmark with the line under it, as a single labelled image. */
export function Logo({ id, label, className = "", line, accent }: { id: string; label: string; className?: string; line?: string; accent?: string }) {
  return (
    <span role="img" aria-label={label} className={`flex flex-col items-center ${className}`}>
      <Wordmark id={id} className="w-full" accent={accent} />
      {line ? (
        <span aria-hidden="true" className="or-label mt-[7%] block text-[0.52em] whitespace-nowrap opacity-80">
          {line}
        </span>
      ) : null}
    </span>
  );
}
