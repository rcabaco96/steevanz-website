import type { RoazCopy } from "@/content/roaz/copy";
import { roaz, roazWhatsappHref } from "@/content/roaz/facts";
import { BookingForm } from "./BookingForm";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { roazSections } from "./sections";

export function HoursList({ dark = false }: { dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {roaz.hours.map((row) => (
        <div key={row.days} className={`flex flex-wrap items-baseline justify-between gap-x-6 border-b pb-1.5 ${dark ? "border-sal/15" : "border-tinta/10"}`}>
          <dt>{row.days}</dt>
          <dd className={dark ? "text-sal/85" : "font-medium"}>{row.time}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An illustrated map of Ferragudo's waterfront (no third-party map, no cookies): the Arade, the pier, the kiosk. */
function MapIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="240" fill="var(--color-agua-claro)" />
      {/* Land on the east bank (Ferragudo) and the coast to the south. */}
      <path d="M170 0H400V240H290C280 214 262 196 236 186C214 178 196 160 190 132C184 100 176 60 170 0Z" fill="var(--color-areia)" />
      <path d="M0 0H70C76 40 74 80 62 120C52 150 30 170 0 178Z" fill="var(--color-areia-2)" />
      <g fill="none" stroke="var(--color-sal)" strokeLinecap="round">
        <path d="M230 20C250 60 300 70 330 110S360 190 400 200" strokeWidth="8" />
        <path d="M250 0C246 40 270 90 262 150" strokeWidth="6" />
      </g>
      <g fill="var(--color-pedra)" fontFamily="var(--font-stencil)" fontSize="11" letterSpacing="2.5">
        <text x="92" y="70" transform="rotate(-80 92 70)">RIO ARADE</text>
        <text x="282" y="58">FERRAGUDO</text>
        <text x="110" y="222">OCEANO</text>
      </g>
      {/* The pier. */}
      <path d="M186 104H146" stroke="var(--color-fundo)" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(196 104)">
        <circle r="20" fill="var(--color-falesia)" opacity="0.25" />
        <circle r="9" fill="var(--color-falesia)" stroke="var(--color-fundo)" strokeWidth="3" />
      </g>
      <path d="M150 150c8-6 16-6 24 0" stroke="var(--color-fundo)" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}

// Booking: the request (BookingForm, the «Sistema de reservas online» demo) and beside it everything to get to the
// pier — meeting point, kiosk hours, phone, WhatsApp, an illustrated map and the map link. Phones: heading, the
// form, then the contacts card (its map first).
export function Booking({ copy }: { copy: RoazCopy }) {
  const { booking, visit } = copy;
  const label = "rz-label mb-2 flex items-center gap-2 text-agua-claro";
  return (
    <section id={roazSections.book} aria-labelledby="rz-booking-title" className="rz-on-dark relative overflow-hidden bg-fundo py-24 text-sal sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-radial-gradient(ellipse_at_80%_-10%,transparent_0_44px,var(--color-agua)_44px_45px)]" />
      <div className="relative mx-auto grid max-w-[84rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14">
        <div className="lg:col-span-2">
          <p className="rz-label mb-5 text-falesia">{booking.eyebrow}</p>
          <h2 id="rz-booking-title" className="rz-title text-[clamp(2.8rem,10vw,6.4rem)]">
            {booking.title} <span className="block text-agua">{booking.titleLine}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-sal/80">{booking.intro}</p>
          <p className="rz-label mt-6 inline-flex rounded-full bg-sal/10 px-4 py-2 text-[0.7rem] text-agua-claro">{booking.product}</p>
        </div>

        <div className="text-tinta">
          <BookingForm copy={copy} />
        </div>

        <Reveal className="lg:self-start">
          <aside aria-label={visit.meetingLabel} className="overflow-hidden rounded-[2rem] bg-fundo-2 ring-1 ring-sal/10">
            <MapIllustration label={visit.mapLabel} />
            <div className="grid gap-7 p-6 sm:p-8">
              <div>
                <h3 className={label}>
                  <PinIcon width={16} height={16} /> {visit.meetingLabel}
                </h3>
                <address className="leading-relaxed not-italic">
                  {roaz.meetingPoint}
                  <br />
                  {roaz.street} · {roaz.postalCode} {roaz.locality}
                </address>
              </div>
              <div>
                <h3 className={label}>
                  <ClockIcon width={16} height={16} /> {visit.hoursLabel}
                </h3>
                <HoursList dark />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <h3 className={label}>
                    <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
                  </h3>
                  <a href={roaz.phoneHref} className="font-stencil text-[1.5rem] leading-tight font-bold whitespace-nowrap hover:text-falesia">
                    {roaz.phoneDisplay}
                  </a>
                  <p className="mt-1 text-xs text-sal/60">{visit.phoneNote}</p>
                </div>
                <div>
                  <h3 className={label}>
                    <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
                  </h3>
                  <a href={roazWhatsappHref()} target="_blank" rel="noopener noreferrer" className="font-stencil text-[1.5rem] leading-tight font-bold whitespace-nowrap hover:text-falesia">
                    {roaz.whatsappDisplay}
                    <span className="sr-only"> {copy.newTab}</span>
                  </a>
                </div>
              </div>
              <a
                href={roaz.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sal px-6 font-display text-[1.1rem] font-bold tracking-[0.08em] text-fundo uppercase transition-colors hover:bg-falesia"
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
