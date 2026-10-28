import type { PrumoCopy } from "@/content/prumo/copy";
import { Bob } from "./Logo";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// A strip of the clinic's disciplines drifting sideways, faster (or backwards) with the scroll (React Bits
// ScrollVelocity); a small plumb bob between the words. Still with reduced motion; no pause button (owner's rule).
export function Marquee({ copy }: { copy: PrumoCopy }) {
  return (
    <div className="border-y border-tinta/10 bg-cal py-6 sm:py-8">
      <p className="sr-only">{copy.marquee.join(", ")}</p>
      <ScrollVelocity baseVelocity={2.2} copies={4} className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-none text-tinta">
        {copy.marquee.map((word, i) => (
          <span key={word} aria-hidden="true" className="flex items-center">
            <span className={`px-6 sm:px-9 ${i % 2 ? "italic text-latao-fundo" : ""}`}>{word}</span>
            <Bob className="h-7 w-auto sm:h-9" />
          </span>
        ))}
      </ScrollVelocity>
    </div>
  );
}
