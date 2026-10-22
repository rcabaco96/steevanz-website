import { useId } from "react";

// The restaurant's badge, redrawn as a vector from its own logo (only a 40 px copy exists online): «LOBO DO MAR»
// round the top, crossed knife and fork, a fish, a lifebuoy each side and «RESTAURANTE» round the bottom, in its
// navy and coral. `ink` paints the letters and the cutlery (navy on light, sand on dark).
export function Badge({ className = "", ink = "currentColor", accent = "var(--color-coral)", label }: { className?: string; ink?: string; accent?: string; label?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <path id={`${id}-top`} d="M 21 100 A 79 79 0 0 1 179 100" />
        <path id={`${id}-bottom`} d="M 38 112 A 62 62 0 0 0 162 112" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="1.5 4.2" strokeLinecap="round" />
      <circle cx="100" cy="100" r="58" fill="none" stroke={accent} strokeWidth="1.6" />
      <text fill={ink} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19.5, letterSpacing: 1.6 }}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          LOBO DO MAR
        </textPath>
      </text>
      <text fill={ink} style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 10.5, letterSpacing: 5 }}>
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          RESTAURANTE
        </textPath>
      </text>
      {/* Crossed knife and fork. */}
      <g stroke={ink} strokeWidth="5" strokeLinecap="round">
        <path d="M74 132 128 70" />
        <path d="M126 132 76 74" />
      </g>
      <g fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round">
        <path d="M70 66v12M76 64v14M82 66v12M70 78c0 4 12 4 12 0" />
      </g>
      <path d="M128 70c4-6 9-9 12-8-1 5-5 9-12 8Z" fill={ink} />
      {/* The fish over the cutlery. */}
      <path d="M86 58c6-6 18-6 26 0-8 6-20 6-26 0Zm26 0 8-5v10Z" fill={accent} />
      {/* Lifebuoys. */}
      {[56, 144].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="100" r="8.5" fill="none" stroke={accent} strokeWidth="5" />
          <circle cx={cx} cy="100" r="8.5" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="4.45 8.9" opacity="0.9" />
        </g>
      ))}
      {/* A small wave under the cutlery. */}
      <path d="M78 146c5-4 9-4 14 0s9 4 14 0 9-4 14 0" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** The name as a wordmark, for the header. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display leading-none font-extrabold tracking-[0.06em] uppercase ${className}`}>
      Lobo <span className="text-coral">do</span> Mar
    </span>
  );
}
