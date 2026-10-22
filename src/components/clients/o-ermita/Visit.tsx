import { ermita } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { AccessIcon, ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { MapEmbed } from "./MapEmbed";
import { Reveal } from "./Reveal";
import { ermitaSections } from "./sections";

export function AddressLines() {
  return (
    <>
      {ermita.hotel}
      <br />
      {ermita.street}, {ermita.village}
      <br />
      {ermita.postalCode} {ermita.locality}
    </>
  );
}

export function HoursList({ copy, dark = false }: { copy: ErmitaCopy; dark?: boolean }) {
  const { visit } = copy;
  const [lunch, dinner] = ermita.services;
  const rows = [
    { label: visit.lunch, time: `${lunch.opens}–${lunch.closes}` },
    { label: visit.dinner, time: `${dinner.opens}–${dinner.closes}` },
  ];
  return (
    <div>
      <p className={`font-semibold ${dark ? "text-cal" : "text-tinta"}`}>{visit.everyDay}</p>
      <dl className="mt-2 grid gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className={`flex items-baseline justify-between gap-6 border-b pb-1.5 ${dark ? "border-cal/15" : "border-oliva/20"}`}>
            <dt>{row.label}</dt>
            <dd className="font-serif text-xl tabular-nums">{row.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Where to find the restaurant: inside the hotel, in the Serra d'Ossa. Address, hours, phone (with the legal
// note on call costs), WhatsApp, accessibility, the way there and a map that only loads on request.
export function Visit({ copy }: { copy: ErmitaCopy }) {
  const { visit } = copy;
  const label = "oe-eyebrow mb-2 flex items-center gap-2 text-oliva";
  return (
    <section id={ermitaSections.visit} aria-labelledby="oe-visit-title" className="relative overflow-hidden bg-cal py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-20 lg:gap-y-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="oe-eyebrow mb-6 flex items-center gap-4 text-oliva">
            <span aria-hidden="true" className="h-px w-10 bg-oliva/60" />
            {visit.eyebrow}
          </p>
          <h2 id="oe-visit-title" className="font-serif text-[clamp(2.5rem,8.6vw,5rem)] leading-[0.98] font-medium tracking-[-0.01em]">
            {visit.title} <span className="block text-oliva italic">{visit.titleItalic}</span>
          </h2>
          <p className="mt-7 max-w-lg text-[1rem] leading-[1.8] text-pedra sm:text-[1.05rem]">{visit.intro}</p>
        </div>

        <Reveal className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center">
          <MapEmbed button={visit.mapButton} note={visit.mapNote} title={visit.mapTitle} entranceAlt={visit.entranceAlt} />
        </Reveal>

        <div className="grid gap-9 sm:grid-cols-2 lg:col-start-1 lg:row-start-2">
          <div>
            <h3 className={label}>
              <PinIcon width={16} height={16} /> {visit.addressLabel}
            </h3>
            <address className="leading-relaxed not-italic">
              <AddressLines />
            </address>
          </div>
          <div>
            <h3 className={label}>
              <ClockIcon width={16} height={16} /> {visit.hoursLabel}
            </h3>
            <HoursList copy={copy} />
            <p className="mt-3 font-serif text-lg text-pedra italic">{visit.bookingNote}</p>
          </div>
          <div>
            <h3 className={label}>
              <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
            </h3>
            <a href={ermita.phoneHref} className="font-serif text-[1.7rem] leading-tight hover:text-azulejo">
              {ermita.phoneDisplay}
            </a>
            <p className="mt-1 text-xs text-pedra">{visit.phoneNote}</p>
          </div>
          <div>
            <h3 className={label}>
              <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
            </h3>
            <a href={ermita.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-serif text-[1.7rem] leading-tight hover:text-azulejo">
              {ermita.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <p className="mt-1 text-xs text-pedra">{visit.whatsappNote}</p>
          </div>
          <div className="sm:col-span-2">
            <h3 className={label}>
              <AccessIcon width={16} height={16} /> {visit.accessLabel}
            </h3>
            <p className="leading-relaxed text-pedra">{visit.access}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:col-start-1 lg:row-start-3">
          <a
            href={ermita.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-azulejo px-6 text-[0.78rem] font-semibold tracking-[0.18em] text-cal uppercase transition-colors hover:bg-azulejo-deep"
          >
            <PinIcon /> {visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <a
            href={ermita.phoneHref}
            className="inline-flex h-14 items-center gap-2 rounded-full px-6 text-[0.78rem] font-semibold tracking-[0.18em] text-tinta uppercase ring-1 ring-tinta/30 transition-colors hover:bg-tinta hover:text-cal"
          >
            <PhoneIcon /> {copy.booking.call}
          </a>
        </div>
      </div>
    </section>
  );
}
