import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ReservationForm } from "./ReservationForm";
import { SplitText } from "./react-bits/SplitText";
import { ponteiroSections } from "./sections";
import { Waitlist } from "./Waitlist";

// Reservations and the waitlist side by side: book a table ahead, or join the queue at the door. Phones: the heading,
// the form, then the waitlist card.
export function Reservas({ copy }: { copy: PonteiroCopy }) {
  const { reservas } = copy;
  return (
    <section id={ponteiroSections.book} aria-labelledby="pn-book-title" className="relative bg-marmore py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <div className="lg:col-span-2">
          <p className="pn-label mb-5 flex items-center gap-4 text-ginja">
            <span aria-hidden="true" className="h-px w-10 bg-ginja/50" />
            {reservas.eyebrow}
          </p>
          <h2 id="pn-book-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            <SplitText text={reservas.title} splitType="words" delay={60} /> <span className="text-ginja italic">{reservas.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-tinta/75">{reservas.intro}</p>
        </div>
        <ReservationForm copy={copy} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Waitlist copy={copy} />
        </div>
      </div>
    </section>
  );
}
