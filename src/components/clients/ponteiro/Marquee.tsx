import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { Mark } from "./Logo";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// The things people ask for at the counter, in a strip that drifts sideways and speeds up (or turns back) with the
// scroll (React Bits' ScrollVelocity); the little clock between the words, each showing another hour. Decorative:
// the words are all in the carta.
export function Marquee({ copy }: { copy: PonteiroCopy }) {
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y-2 border-tinta bg-gema py-6 sm:py-8">
      <ScrollVelocity baseVelocity={2.4}>
        {copy.marquee.map((word, i) => (
          <span key={word} className="flex items-center">
            <span className={`px-6 font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-none sm:px-10 ${i % 2 ? "italic" : ""}`}>{word}</span>
            <Mark className="h-9 w-auto text-tinta sm:h-12" accent="var(--color-ginja)" angle={(i * 47) % 360} />
          </span>
        ))}
      </ScrollVelocity>
    </div>
  );
}
