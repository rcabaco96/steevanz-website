import type { RoazCopy } from "@/content/roaz/copy";
import { FinIcon } from "./icons";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// Two strips of the trips' names going opposite ways, like the wake on both sides of a bow, speeding up (or turning
// back) with the scroll (React Bits' ScrollVelocity). Decorative: the words are all in the trips above.
export function Marquee({ copy }: { copy: RoazCopy }) {
  const words = copy.marquee;
  const strip = (outline: boolean) =>
    words.map((word) => (
      <span key={word} className="flex items-center">
        <span
          className={`px-5 font-display text-[clamp(2.6rem,9vw,6.4rem)] leading-none font-extrabold uppercase sm:px-8 ${
            outline ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-fundo)]" : "text-fundo"
          }`}
        >
          {word}
        </span>
        <FinIcon width={34} height={34} className="text-fundo" />
      </span>
    ));
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-falesia py-8 sm:py-12">
      <ScrollVelocity baseVelocity={2}>{strip(false)}</ScrollVelocity>
      <ScrollVelocity baseVelocity={-2} className="mt-2">
        {strip(true)}
      </ScrollVelocity>
    </div>
  );
}
