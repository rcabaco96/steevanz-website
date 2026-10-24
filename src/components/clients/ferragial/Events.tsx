import type { FerragialCopy } from "@/content/ferragial/copy";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";
import { Reveal } from "./Reveal";

// Dates at the winery (examples), as a list of rows on schist; above them, the grape varieties of Vidigueira drift
// sideways on a straw band, speeding up or turning back with the scroll (React Bits' ScrollVelocity; still with
// reduced motion, no pause button; decorative: the varieties are all named in the wines).
export function Events({ copy }: { copy: FerragialCopy }) {
  const { events } = copy;
  return (
    <section aria-labelledby="fg-events-title" className="fg-dark relative overflow-hidden bg-xisto text-cal">
      <div aria-hidden="true" className="border-y border-xisto bg-palha py-5 text-xisto sm:py-7">
        <ScrollVelocity baseVelocity={2}>
          {events.castas.map((casta, i) => (
            <span key={casta} className="flex items-center">
              <span className={`px-6 font-display text-[clamp(2rem,6vw,4.2rem)] leading-none sm:px-9 ${i % 2 ? "text-tinto" : ""}`}>{casta}</span>
              <svg viewBox="0 0 24 12" className="h-3 w-6 text-barro sm:h-4 sm:w-8">
                <path d="M2 11.5h20" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 11.5a6 6 0 0 1 12 0Z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </ScrollVelocity>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="fg-label mb-5 text-palha">{events.eyebrow}</p>
            <h2 id="fg-events-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.95]">
              {events.title} <span className="text-barro-2">{events.titleAccent}</span>
            </h2>
          </div>
          <p className="text-sm text-cal/60">{events.note}</p>
        </div>
        <ul className="mt-12 border-t border-cal/15">
          {events.list.map((event, i) => (
            <li key={event.title} className="border-b border-cal/15">
              <Reveal delay={i * 80} className="grid gap-3 py-7 sm:grid-cols-[10.5rem_1fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-9">
                <p className="flex items-baseline gap-3 whitespace-nowrap">
                  <span className="font-display text-[2.4rem] leading-none text-palha">{event.date}</span>
                  <span className="text-sm text-cal/55">{event.year}</span>
                </p>
                <h3 className="font-display text-[1.7rem] leading-tight sm:text-[2rem]">{event.title}</h3>
                <p className="leading-relaxed text-cal/75">{event.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
