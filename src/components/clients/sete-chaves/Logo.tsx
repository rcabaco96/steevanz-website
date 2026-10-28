import type { SVGProps } from "react";

// The mark: a brass key tag — round top with the hole for the ring, small round corners at the bottom — with the
// number 7 stamped into it and the ring through the hole. Drawn with plain shapes (no font), so the same drawing makes
// the favicon and the app icons. The wordmark beside it is set in Gloock.

/** The tag's outline in the mark's own units (viewBox 0 0 60 100), shared with the opening and the hero frame. */
export const fobPath = "M8 38A22 22 0 0 1 52 38V86Q52 96 42 96H18Q8 96 8 86Z";
export const fobInnerPath =
  "M12.5 38A17.5 17.5 0 0 1 47.5 38V85Q47.5 91.5 41 91.5H19Q12.5 91.5 12.5 85Z";
export const fobHole = { cx: 30, cy: 30, r: 5 };
export const sevenPath = "M20 50H40V54.2L29.4 84H23.6L34 55H20Z";

type FobProps = SVGProps<SVGSVGElement> & {
  /** What the number is drawn in (the tag's own colour shows through the hole). */
  ink?: string;
  /** The tag's fill (a gradient id or a colour). */
  fill?: string;
  /** Draw the ring through the hole. */
  ring?: boolean;
  /** Another number instead of the 7 (the rooms' keys), set in Gloock. */
  number?: number;
  title?: string;
  gradientId?: string;
};

export function FobMark({
  ink = "var(--color-xisto)",
  fill,
  ring = true,
  number,
  title,
  gradientId = "sc-brass",
  ...props
}: FobProps) {
  const id = gradientId;
  return (
    <svg
      viewBox="0 -2 60 102"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {fill ? null : (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#d9b066" />
            <stop offset="0.5" stopColor="#ad8139" />
            <stop offset="1" stopColor="#87622a" />
          </linearGradient>
        </defs>
      )}
      {ring ? (
        <circle
          cx="30"
          cy="17"
          r="13"
          fill="none"
          style={{ stroke: fill ?? `url(#${id})` }}
          strokeWidth="2.4"
        />
      ) : null}
      <path d={fobPath} style={{ fill: fill ?? `url(#${id})` }} />
      <path
        d={fobInnerPath}
        fill="none"
        style={{ stroke: ink }}
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      <circle
        {...fobHole}
        style={{ fill: "var(--sc-hole, var(--color-cal))", stroke: ink }}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      {number === undefined ? (
        <path d={sevenPath} style={{ fill: ink }} />
      ) : (
        <text
          x="30"
          y="80"
          textAnchor="middle"
          fontSize="34"
          style={{ fontFamily: "var(--font-display)", fill: ink }}
        >
          {number}
        </text>
      )}
    </svg>
  );
}

export function Wordmark({
  className = "",
  line,
  tone = "dark",
}: {
  className?: string;
  line?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 min-[400px]:gap-2.5 ${className}`}
    >
      <FobMark
        className="h-9 w-auto min-[400px]:h-10 shrink-0"
        gradientId={`sc-brass-${tone}`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.2rem] min-[400px]:text-[1.45rem] leading-none tracking-[-0.01em] ${tone === "dark" ? "text-tinta" : "text-cal"}`}
        >
          Sete Chaves
        </span>
        {line ? (
          <span
            className={`sc-label mt-1.5 text-[0.56rem] tracking-[0.28em] ${tone === "dark" ? "text-pedra" : "text-cal/70"}`}
          >
            {line}
          </span>
        ) : null}
      </span>
    </span>
  );
}
