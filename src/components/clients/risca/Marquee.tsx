import type { RiscaCopy } from "@/content/risca/copy";
import { cutAngle } from "./Logo";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// Two strips of services crossing at the angle of the cut — ink over vermilion — drifting sideways and speeding up
// (or turning back) with the scroll (React Bits' ScrollVelocity). Decorative: the words are all in the price list.
export function Marquee({ copy }: { copy: RiscaCopy }) {
  const tilt = cutAngle / 3;
  const words = (dark: boolean) =>
    copy.marquee.map((word, i) => (
      <span key={word} className="flex items-center">
        <span className={`px-5 text-[clamp(2.2rem,8vw,5.4rem)] leading-none sm:px-8 ${i % 2 ? "rc-serif" : "rc-display"} ${dark ? "text-gesso" : "text-tinta"}`}>{word}</span>
        <span className={`h-[3px] w-8 -rotate-[14deg] sm:w-12 ${dark ? "bg-vermelhao" : "bg-tinta"}`} />
      </span>
    ));
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-gesso py-16 sm:py-24">
      <div className="-mx-6 bg-vermelhao py-4 sm:py-6" style={{ rotate: `${-tilt}deg` }}>
        <ScrollVelocity baseVelocity={-2}>{words(false)}</ScrollVelocity>
      </div>
      <div className="-mx-6 -mt-6 bg-tinta py-4 sm:-mt-10 sm:py-6" style={{ rotate: `${tilt}deg` }}>
        <ScrollVelocity baseVelocity={2.4}>{words(true)}</ScrollVelocity>
      </div>
    </div>
  );
}
