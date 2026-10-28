import type { SVGProps } from "react";
import { facadePath, finialsIn } from "./facade";

// Platibanda's mark: a whitewashed house front crowned by its platibanda and two finials, a round window in the
// curve and a door framed by a painted band (the «barra» of Algarve houses). Drawn from the same outline as the
// site's masks (./facade.ts). The wordmark is the business name in Young Serif with «Casas do Sotavento» under it.

const box = [6, 6, 58, 60] as const;
const outline = facadePath(...box);
const [f1, f2] = finialsIn(...box);

interface EmblemProps extends SVGProps<SVGSVGElement> {
  /** Wall, line, band and door colours. */
  wall?: string;
  line?: string;
  barra?: string;
  door?: string;
}

export function Emblem({ wall = "var(--color-cal)", line = "var(--color-ria)", barra = "var(--color-ocre)", door = "var(--color-ria)", ...props }: EmblemProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path d={outline} fill={wall} stroke={line} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx={f1[0]} cy={f1[1]} r="2.6" fill={line} />
      <circle cx={f2[0]} cy={f2[1]} r="2.6" fill={line} />
      <circle cx="32" cy="23" r="3.4" fill={door} />
      <rect x="22.5" y="37" width="19" height="23" fill={barra} />
      <rect x="26.5" y="41" width="11" height="19" fill={door} />
    </svg>
  );
}

export const emblemOutline = outline;

export function Logo({
  className = "",
  emblemClassName = "w-9",
  tagline,
  onDark = false,
}: {
  className?: string;
  emblemClassName?: string;
  tagline?: string;
  onDark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Emblem
        className={`shrink-0 ${emblemClassName}`}
        wall={onDark ? "var(--color-cal)" : "var(--color-cal)"}
        line={onDark ? "var(--color-cal)" : "var(--color-ria)"}
        door="var(--color-ria)"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.45em] tracking-[-0.01em]">Platibanda</span>
        {tagline ? <span className="pb-label mt-1 text-[0.5em] opacity-80">{tagline}</span> : null}
      </span>
    </span>
  );
}
