import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// Two strips of words drifting in opposite directions and speeding up with the scroll (React Bits'
// ScrollVelocity), on the coral of the badge. Decorative: the same words are on the page as text.
export function Marquee({ copy }: { copy: LoboCopy }) {
  const strip = (outline: boolean) =>
    copy.marquee.map((word) => (
      <span key={word} className="flex items-center">
        <span className={`px-5 font-display text-[clamp(2.4rem,8vw,6rem)] leading-none font-extrabold uppercase sm:px-8 ${outline ? "lm-outline text-abismo" : "text-abismo"}`}>{word}</span>
        <svg viewBox="0 0 40 20" className="h-6 w-12 text-areia sm:h-8 sm:w-16" aria-hidden="true">
          <path d="M2 12c6-8 12-8 18 0s12 8 18 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
    ));
  return (
    <div aria-hidden="true" className="flex flex-col gap-2 overflow-hidden bg-coral py-10 sm:gap-4 sm:py-14">
      <ScrollVelocity baseVelocity={-2.6}>{strip(false)}</ScrollVelocity>
      <ScrollVelocity baseVelocity={2.6}>{strip(true)}</ScrollVelocity>
    </div>
  );
}
