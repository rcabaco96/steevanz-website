import type { OrveCopy } from "@/content/orve/copy";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// One strip of treatments, tilted a little, drifting sideways and speeding up (or turning back) with the scroll
// (React Bits' ScrollVelocity); a copper drop between the words. Decorative: the words are all in the price list.
export function Marquee({ copy }: { copy: OrveCopy }) {
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-argila py-10 sm:py-14">
      <div className="-mx-4 -rotate-2 bg-nacar py-5 sm:py-7">
        <ScrollVelocity baseVelocity={2.2}>
          {copy.marquee.map((word, i) => (
            <span key={word} className="flex items-center">
              <span className={`px-6 font-display text-[clamp(2.2rem,7vw,5rem)] leading-none sm:px-10 ${i % 2 ? "text-tinta" : "text-cobre italic"}`}>{word}</span>
              <svg viewBox="0 0 24 30" className="h-5 w-4 text-argila-2 sm:h-7 sm:w-5">
                <path d="M12 0c5 7 9 12 9 18a9 9 0 1 1-18 0c0-6 4-11 9-18Z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </ScrollVelocity>
      </div>
    </div>
  );
}
