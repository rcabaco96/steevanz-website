import { ermita } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { ChatIcon, PhoneIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { Reveal } from "./Reveal";

// The last call before the footer: book on WhatsApp (the restaurant's own booking line) or by phone.
export function Booking({ copy }: { copy: ErmitaCopy }) {
  const { booking } = copy;
  return (
    <section aria-labelledby="oe-booking-title" className="relative isolate overflow-hidden bg-azulejo py-24 text-cal sm:py-32">
      <div aria-hidden="true" className="oe-azulejo-dark absolute inset-0 -z-10 opacity-[0.12]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_50%,rgb(31_63_122/0.92)_30%,rgb(31_63_122/0.35)_100%)]" />
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
        <p className="oe-eyebrow text-ouro">{booking.eyebrow}</p>
        <h2 id="oe-booking-title" className="mt-5 font-serif text-[clamp(2.8rem,10vw,5.6rem)] leading-[0.98] font-medium italic">
          {booking.title}
        </h2>
        <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-cal/85 sm:text-[1.05rem]">{booking.text}</p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Magnet className="w-full sm:w-auto">
            <a
              href={ermita.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-cal px-4 text-[0.74rem] font-semibold tracking-[0.12em] whitespace-nowrap min-[360px]:px-7 min-[360px]:text-[0.8rem] min-[360px]:tracking-[0.18em] text-azulejo-deep uppercase transition-colors hover:bg-white sm:w-auto"
            >
              <ChatIcon width={18} height={18} />
              {booking.whatsapp}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </Magnet>
          <a
            href={ermita.phoneHref}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-[0.8rem] font-semibold tracking-[0.18em] uppercase ring-1 ring-cal/50 transition-colors hover:bg-cal/10"
          >
            <PhoneIcon width={17} height={17} />
            {booking.call} · {ermita.phoneShort}
          </a>
        </div>
        <p className="mt-3 text-xs text-cal/70">{copy.visit.phoneNote}</p>
      </Reveal>
    </section>
  );
}
