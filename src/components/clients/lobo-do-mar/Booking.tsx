import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { MailIcon, PhoneIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { Reveal } from "./Reveal";
import { WaveEdge } from "./WaveEdge";

// The last call before the footer, rising like the tide over the visit: book by phone (the restaurant's own
// line) or by e-mail.
export function Booking({ copy }: { copy: LoboCopy }) {
  const { booking } = copy;
  return (
    <section aria-labelledby="lm-booking-title" className="relative bg-abismo pb-24 text-areia sm:pb-32">
      <WaveEdge className="absolute bottom-[calc(100%-1px)] left-0 text-abismo" />
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-16 text-center sm:px-8">
        <p className="lm-eyebrow text-coral">{booking.eyebrow}</p>
        <h2 id="lm-booking-title" className="mt-5 font-display text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.95] uppercase">
          {booking.title}
        </h2>
        <p className="mt-6 max-w-md text-areia/80">{booking.text}</p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Magnet className="w-full sm:w-auto">
            <a
              href={lobo.phoneHref}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-coral px-8 text-[0.8rem] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-coral-deep sm:w-auto"
            >
              <PhoneIcon width={18} height={18} />
              {booking.call} · {lobo.phoneShort}
            </a>
          </Magnet>
          <a
            href={`mailto:${lobo.email}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-[0.8rem] font-bold tracking-[0.14em] uppercase ring-1 ring-areia/45 transition-colors hover:bg-areia/10"
          >
            <MailIcon width={18} height={18} />
            {booking.email}
          </a>
        </div>
        <p className="mt-3 text-xs text-areia/60">{copy.visit.phoneNote}</p>
      </Reveal>
    </section>
  );
}
