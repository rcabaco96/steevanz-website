import type { SVGProps } from "react";

// Roaz's wordmark, drawn for the demo (no font file needed): ROAZ in stencil capitals, the lettering painted on a
// boat's hull, over a horizon line where the back and fin of a bottlenose dolphin («roaz») break the water.
// The letters take the current colour; the horizon and the dolphin take `accent`.

export const wordmarkViewBox = { x: -2, y: -2, width: 162, height: 76 };

const letters = [
  "M0 0H9V56H0Z",
  "M12 0H22C30 0 35 5 35 14V17C35 26 30 31 22 31H12V23H21C24.5 23 26 21 26 18V13C26 10 24.5 8 21 8H12Z",
  "M18.5 34H28L35.5 56H26Z",
  "M57 0V8C53 8 51 10 51 14V42C51 46 53 48 57 48V56C47 56 42 51 42 42V14C42 5 47 0 57 0Z",
  "M61 0C71 0 76 5 76 14V42C76 51 71 56 61 56V48C65 48 67 46 67 42V14C67 10 65 8 61 8Z",
  "M84 56L94.5 0H99.5L93.5 56Z",
  "M118 56L107.5 0H102.5L108.5 56Z",
  "M96.5 35H105.5V42H96.5Z",
  "M126 0H158V8H126Z",
  "M147 11H157.5L137 45H126.5Z",
  "M126 48H158V56H126Z",
];

export const wordmarkLetterPaths = letters;
export const wordmarkHorizon = "M0 70H158";
export const wordmarkDolphin =
  "M118 70C124 64.5 130 62.5 136 62.5C142 62.5 147 65.5 150 70Z M127.5 64.2C131 62 134.5 59.5 139 57C137.6 59.6 137.3 61.8 138 63.4Z";

/** The square mark (icons): the dolphin's back and fin over the horizon. viewBox 0 0 80 80. */
export const markHorizon = "M8 58H72";
export const markDolphin = "M14 58C22 46 32 40 42 40C52 40 60 46 66 58Z M28 44C36 37 44 30 56 22C52 30 50.5 37 52 42Z";

interface WordmarkProps extends SVGProps<SVGSVGElement> {
  accent?: string;
  /** Props for the letters' group (the opening animates them). */
  lettersProps?: Record<string, unknown>;
  horizonProps?: Record<string, unknown>;
  dolphinProps?: Record<string, unknown>;
}

export function Wordmark({ accent = "var(--color-falesia)", lettersProps, horizonProps, dolphinProps, ...props }: WordmarkProps) {
  const vb = wordmarkViewBox;
  return (
    <svg viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`} aria-hidden="true" focusable="false" {...props}>
      <g fill="currentColor" {...lettersProps}>
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={wordmarkHorizon} stroke={accent} strokeWidth="2.4" strokeLinecap="round" fill="none" {...horizonProps} />
      <path d={wordmarkDolphin} fill={accent} {...dolphinProps} />
    </svg>
  );
}

export function Mark({ background = "var(--color-falesia)", color = "var(--color-fundo)", ...props }: SVGProps<SVGSVGElement> & { background?: string; color?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" focusable="false" {...props}>
      <rect width="80" height="80" rx="18" fill={background} />
      <path d={markHorizon} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d={markDolphin} fill={color} />
    </svg>
  );
}

/** The wordmark with the line «Passeios de mar · Ferragudo» under it, for the footer and the 404. */
export function Logo({ label, line, className = "", accent }: { label: string; line: string; className?: string; accent?: string }) {
  return (
    <span role="img" aria-label={label} className={`inline-flex flex-col gap-3 ${className}`}>
      <Wordmark className="w-full" accent={accent} />
      <span aria-hidden="true" className="rz-label whitespace-nowrap opacity-80">
        {line}
      </span>
    </span>
  );
}
