import type { SVGProps } from "react";

// The Adega Ferragial's logo, drawn for this demo (a fictional business): the outline of a talha — the clay amphora
// the Alentejo still makes wine in — crossed by a straight line, which is both the level of the wine inside and the
// horizon of the plain, with half a sun rising on it. Next to it, «Ferragial» in Gloock. Same drawing as
// public/media/clients/ferragial/logo.svg and the icons.

/** The talha, in a 64 × 84 box: the rim, the neck, the round shoulders and the narrow foot. */
export const talhaViewBox = "0 0 64 84";
export const talhaRim = { x: 22, y: 2.5, width: 20, height: 5, rx: 2 };
export const talhaPath =
  "M25 7.5C25 13 10 17 8.5 33C7 50 17 64 26 74L27.5 78.5H36.5L38 74C47 64 57 50 55.5 33C54 17 39 13 39 7.5";
/** The horizon (and the wine's level) across the belly. */
export const talhaHorizonY = 44;
export const talhaHorizon = "M8.3 44H55.7";
/** Half a sun standing on the horizon. */
export const talhaSun = "M23.5 44A8.5 8.5 0 0 1 40.5 44Z";

interface MarkProps extends SVGProps<SVGSVGElement> {
  /** Colour of the sun (a CSS colour); the outline takes the text colour. */
  sun?: string;
  strokeSize?: number;
}

/** The talha mark alone (outline), decorative. */
export function TalhaMark({ sun = "var(--color-barro)", strokeSize: stroke = 2.6, className = "", ...rest }: MarkProps) {
  return (
    <svg viewBox={talhaViewBox} className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false" {...rest}>
      <rect {...talhaRim} fill="currentColor" />
      <path d={talhaPath} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
      <path d={talhaSun} fill={sun} />
      <path d={talhaHorizon} stroke="currentColor" strokeWidth={stroke * 0.7} />
    </svg>
  );
}

/** The mark and the name side by side, as a single labelled image. */
export function Logo({
  label,
  className = "",
  sun,
  line,
  size = "md",
  wordClassName = "",
}: {
  label: string;
  className?: string;
  sun?: string;
  line?: string;
  size?: "sm" | "md" | "lg";
  /** Extra classes for the name (e.g. to hide it on very narrow phones, where the mark stands alone). */
  wordClassName?: string;
}) {
  const mark = size === "sm" ? "h-9" : size === "lg" ? "h-16 sm:h-20" : "h-12";
  const word = size === "sm" ? "text-[1.55rem]" : size === "lg" ? "text-[2.6rem] sm:text-[3.4rem]" : "text-[2rem]";
  return (
    <span role="img" aria-label={label} className={`inline-flex items-center gap-[0.55em] ${className}`}>
      <TalhaMark className={`${mark} w-auto shrink-0`} sun={sun} />
      <span aria-hidden="true" className={`flex flex-col leading-none ${wordClassName}`}>
        <span className={`font-display ${word} leading-[0.9] tracking-[-0.01em]`}>Ferragial</span>
        {line ? <span className="fg-label mt-1.5 text-[0.56rem] tracking-[0.26em] opacity-75">{line}</span> : null}
      </span>
    </span>
  );
}
