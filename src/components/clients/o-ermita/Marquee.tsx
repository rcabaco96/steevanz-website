import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// Two strips of words that drift in opposite directions and speed up with the scroll (React Bits'
// ScrollVelocity), between the gallery and the visit. Decorative: the same words are on the page as text.
export function Marquee({ copy }: { copy: ErmitaCopy }) {
  const words = copy.marquee;
  const strip = (italic: boolean) =>
    words.map((word) => (
      <span key={word} className="flex items-center">
        <span className={`px-6 font-serif text-[clamp(2.6rem,9vw,6.5rem)] leading-none font-medium sm:px-10 ${italic ? "text-azulejo italic" : "text-transparent [-webkit-text-stroke:1.2px_var(--color-azulejo)]"}`}>
          {word}
        </span>
        <span className="oe-diamond text-ouro" />
      </span>
    ));
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 overflow-hidden bg-cal py-16 sm:gap-5 sm:py-24">
      <ScrollVelocity baseVelocity={2.4}>{strip(true)}</ScrollVelocity>
      <ScrollVelocity baseVelocity={-2.4}>{strip(false)}</ScrollVelocity>
    </div>
  );
}
