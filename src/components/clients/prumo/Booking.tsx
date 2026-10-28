import type { PrumoCopy } from "@/content/prumo/copy";
import { BookingForm } from "./BookingForm";
import { CheckIcon } from "./icons";
import { Bob } from "./Logo";
import { Reveal } from "./Reveal";
import { prumoSections } from "./sections";

// The online booking («Sistema de reservas online»): treatment, therapist, day and hour, on slate with the posture
// grid. The form is a demonstration (BookingForm.tsx).
export function Booking({ copy }: { copy: PrumoCopy }) {
  const { booking } = copy;
  return (
    <section id={prumoSections.book} aria-labelledby="pr-book-title" className="pr-on-dark pr-grid pr-grid-dark relative bg-ardosia pt-24 pb-24 text-cal sm:pt-32 sm:pb-32">
      <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="pr-label mb-6 flex items-center gap-4 text-latao-claro">
            <span aria-hidden="true" className="h-px w-10 bg-latao-claro" />
            {booking.eyebrow}
          </p>
          <h2 id="pr-book-title" className="font-display text-[clamp(2.7rem,9.5vw,5.2rem)] leading-[0.98] tracking-[-0.015em]">
            {booking.title} <span className="block text-latao-claro italic">{booking.titleItalic}</span>
          </h2>
          <p className="mt-6 max-w-md text-[1.02rem] leading-[1.75] text-cal/80">{booking.intro}</p>
          <ul className="mt-7 flex flex-col gap-3">
            {booking.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-cal/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-latao-claro text-ardosia">
                  <CheckIcon width={14} height={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="pr-sway mt-10 hidden w-fit flex-col items-center lg:flex">
            <span className="block h-16 w-px bg-cal/40" />
            <Bob className="h-12 w-auto" color="var(--color-latao-claro)" />
          </div>
        </div>
        <Reveal className="min-w-0 text-tinta">
          <BookingForm copy={copy} />
        </Reveal>
      </div>
    </section>
  );
}
