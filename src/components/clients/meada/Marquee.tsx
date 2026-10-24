import type { MeadaCopy } from "@/content/meada/copy";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// Two bands of materials sewn across the page in opposite directions, drifting and speeding up (or turning back) with
// the scroll (React Bits' ScrollVelocity); a red cross-stitch between the words. Decorative: the words are all in
// the shop. Reduced motion: still.
export function Marquee({ copy }: { copy: MeadaCopy }) {
  const words = (offset: number) =>
    copy.marquee.map((word, i) => (
      <span key={word} className="flex items-center">
        <span className={`px-5 font-display text-[clamp(2.2rem,7vw,5rem)] leading-none sm:px-9 ${(i + offset) % 2 ? "text-tinta" : "text-fio"}`}>{word}</span>
        <svg viewBox="0 0 24 24" className="size-5 text-fio sm:size-7">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      </span>
    ));
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-algodao py-12 sm:py-16">
      <div className="md-stitch mx-4 opacity-50" />
      <div className="py-5 sm:py-7">
        <ScrollVelocity baseVelocity={2}>{words(0)}</ScrollVelocity>
      </div>
      <div className="py-5 sm:py-7">
        <ScrollVelocity baseVelocity={-1.6}>{words(1)}</ScrollVelocity>
      </div>
      <div className="md-stitch mx-4 opacity-50" />
    </div>
  );
}
