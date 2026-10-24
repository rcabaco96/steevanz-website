import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { Emblem } from "./Logo";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

// The places the agency works in, as a strip painted like a band round a door: it drifts sideways and speeds up
// (or turns back) with the scroll (React Bits' ScrollVelocity), a little house front between the names.
// Decorative: the places are written in the FAQ and the contacts.
export function Places({ copy }: { copy: PlatibandaCopy }) {
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-cal py-10 sm:py-14">
      <div className="-mx-4 rotate-[-1.5deg] border-y-[10px] border-ocre bg-telha py-4 text-cal sm:py-6">
        <ScrollVelocity baseVelocity={2.4}>
          {copy.places.map((place) => (
            <span key={place} className="flex items-center">
              <span className="px-6 font-display text-[clamp(2rem,6.5vw,4.6rem)] leading-none whitespace-nowrap sm:px-10">{place}</span>
              <Emblem className="h-8 w-8 sm:h-11 sm:w-11" wall="var(--color-cal)" line="var(--color-cal)" barra="var(--color-ocre)" door="var(--color-telha)" />
            </span>
          ))}
        </ScrollVelocity>
      </div>
    </div>
  );
}
