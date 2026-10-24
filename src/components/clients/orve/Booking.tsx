import type { OrveCopy } from "@/content/orve/copy";
import { orve, orvePhoneDisplay, orveWhatsappHref } from "@/content/orve/facts";
import { BookingForm } from "./BookingForm";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { orveSections } from "./sections";

export function HoursList({ copy, dark = false }: { copy: OrveCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {orve.hours.map((row, i) => (
        <div key={row.opens + row.closes} className={`flex items-baseline justify-between gap-6 border-b pb-1.5 ${dark ? "border-nacar/15" : "border-tinta/10"}`}>
          <dt>{copy.visit.hoursDays[i]}</dt>
          <dd className="font-display text-lg whitespace-nowrap tabular-nums">
            {row.opens}–{row.closes}
          </dd>
        </div>
      ))}
      <div className={`flex items-baseline justify-between gap-6 pb-1.5 ${dark ? "text-nacar/60" : "text-pedra"}`}>
        <dt>{copy.visit.closedDays}</dt>
        <dd>{copy.visit.closedLabel}</dd>
      </div>
    </dl>
  );
}

/** An illustrated map of the neighbourhood (no third-party map, no cookies): a few streets, a garden, the drop. */
function MapIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="240" fill="var(--color-linho)" />
      <g fill="none" stroke="var(--color-nacar)" strokeLinecap="round">
        <path d="M-10 70 C80 60 160 92 410 64" strokeWidth="14" />
        <path d="M-10 168 C120 150 230 190 410 160" strokeWidth="10" />
        <path d="M120 -10 C130 80 104 160 128 250" strokeWidth="10" />
        <path d="M262 -10 C250 70 286 150 270 250" strokeWidth="12" />
        <path d="M30 250 L190 -10" strokeWidth="6" />
      </g>
      <ellipse cx="196" cy="118" rx="44" ry="30" fill="var(--color-argila)" opacity="0.45" />
      <g fill="var(--color-pedra)" fontFamily="var(--font-sans)" fontSize="9" letterSpacing="2">
        <text x="168" y="122">JARDIM</text>
        <text x="226" y="54">RUA DO ORVALHO</text>
      </g>
      <g transform="translate(300 96)">
        <circle r="22" fill="var(--color-cobre)" opacity="0.15" />
        <path d="M0 -18c6 8 10 13 10 19a10 10 0 1 1-20 0c0-6 4-11 10-19Z" fill="var(--color-cobre)" />
      </g>
    </svg>
  );
}

// Booking: the request form (BookingForm), and beside it everything to get here — address, hours, phone, WhatsApp
// and an illustrated map. Phones: heading, the form, then the contacts card (its map first).
export function Booking({ copy }: { copy: OrveCopy }) {
  const { booking, visit } = copy;
  const label = "or-label mb-2 flex items-center gap-2 text-cobre";
  return (
    <section id={orveSections.book} aria-labelledby="or-booking-title" className="relative bg-linho py-24 sm:py-32">
      <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
        <div className="lg:col-span-2">
          <p className="or-label mb-6 flex items-center gap-4 text-cobre">
            <span aria-hidden="true" className="h-px w-10 bg-cobre/60" />
            {booking.eyebrow}
          </p>
          <h2 id="or-booking-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.96]">
            {booking.title} <span className="text-cobre italic">{booking.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-pedra">{booking.intro}</p>
        </div>

        <BookingForm copy={copy} />

        <Reveal className="lg:self-start">
          <aside aria-label={visit.addressLabel} className="overflow-hidden rounded-[2rem] bg-nacar">
            <MapIllustration label={visit.mapLabel} />
            <div className="grid gap-7 p-6 sm:p-8">
              <div>
                <h3 className={label}>
                  <PinIcon width={16} height={16} /> {visit.addressLabel}
                </h3>
                <address className="leading-relaxed not-italic">
                  {orve.street}
                  <br />
                  {orve.postalCode} {orve.locality} · {orve.neighbourhood}
                </address>
              </div>
              <div>
                <h3 className={label}>
                  <ClockIcon width={16} height={16} /> {visit.hoursLabel}
                </h3>
                <HoursList copy={copy} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <h3 className={label}>
                    <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
                  </h3>
                  <a href={orve.phoneHref} className="font-display text-[1.45rem] leading-tight whitespace-nowrap hover:text-cobre">
                    {orvePhoneDisplay(copy.locale)}
                  </a>
                  <p className="mt-1 text-xs text-pedra">{visit.phoneNote}</p>
                </div>
                <div>
                  <h3 className={label}>
                    <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
                  </h3>
                  <a href={orveWhatsappHref()} target="_blank" rel="noopener noreferrer" className="font-display text-[1.45rem] leading-tight whitespace-nowrap hover:text-cobre">
                    {orvePhoneDisplay(copy.locale)}
                    <span className="sr-only"> {copy.newTab}</span>
                  </a>
                </div>
              </div>
              <a
                href={orve.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tinta px-6 text-[0.8rem] font-medium tracking-[0.14em] text-nacar uppercase transition-colors hover:bg-cobre"
              >
                <PinIcon width={17} height={17} /> {visit.directions}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
