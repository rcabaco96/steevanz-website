import type { CSSProperties, SVGProps } from "react";

/** The centre of the clock inside the «p», in the mark's own units (viewBox 0 0 100 132). */
export const markCenter = { x: 56, y: 50 } as const;

interface MarkProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Where the single hand points, in degrees clockwise from twelve (a one-hand clock: 30° per hour). */
  angle?: number;
  /** Colour of the hand and its pin. */
  accent?: string;
  /** Extra attributes for the hand's group (e.g. a data attribute an animation looks for). */
  handProps?: SVGProps<SVGGElement> & Record<`data-${string}`, string | boolean>;
  title?: string;
}

// Ponteiro's mark: a lowercase «p» whose bowl is the face of a one-hand clock — the hand («o ponteiro») tells the
// hour of the house. The header turns it with the scroll; still, it rests at two o'clock (closing time on Friday
// and Saturday nights).
export function Mark({ angle = 60, accent = "var(--color-gema)", handProps, title, className, ...props }: MarkProps) {
  // The angle comes from a CSS variable when an ancestor sets one (--pn-hand: the header's scroll clock, the opening).
  const handStyle: CSSProperties = {
    transform: `rotate(var(--pn-hand, ${angle}deg))`,
    transformOrigin: `${markCenter.x}px ${markCenter.y}px`,
    transformBox: "view-box",
  };
  return (
    <svg viewBox="0 0 100 132" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <rect x="14" y="22" width="12" height="106" rx="6" fill="currentColor" />
      <circle cx={markCenter.x} cy={markCenter.y} r="36" fill="none" stroke="currentColor" strokeWidth="12" />
      <g fill="currentColor" opacity="0.55">
        <circle cx="56" cy="26" r="2.4" />
        <circle cx="80" cy="50" r="2.4" />
        <circle cx="56" cy="74" r="2.4" />
      </g>
      <g data-hand style={handStyle} {...handProps}>
        <path d={`M${markCenter.x} ${markCenter.y + 5}V${markCenter.y - 23}`} stroke={accent} strokeWidth="6.5" strokeLinecap="round" />
      </g>
      <circle cx={markCenter.x} cy={markCenter.y} r="5" fill={accent} />
    </svg>
  );
}

/** The mark and the name, side by side (the name in the display serif). */
export function Logo({
  className = "",
  markClassName = "h-9 w-auto",
  accent,
  angle,
  label,
}: {
  className?: string;
  markClassName?: string;
  accent?: string;
  angle?: number;
  label: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label={label}>
      <Mark className={markClassName} accent={accent} angle={angle} />
      <span aria-hidden="true" className="font-display text-[1.9em] leading-none tracking-[-0.01em]">
        Ponteiro
      </span>
    </span>
  );
}
