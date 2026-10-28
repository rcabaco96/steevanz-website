import type { SeteChavesCopy } from "@/content/sete-chaves/copy";
import {
  seteChaves,
  seteChavesMailHref,
  seteChavesWhatsappHref,
} from "@/content/sete-chaves/facts";
import { BookingForm } from "./BookingForm";
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { seteChavesSections } from "./sections";

/** An illustrated map of the valley (no third-party map, no cookies): the village, the stream, the road, the house. */
function ValleyMap({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 400 240"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <rect width="400" height="240" fill="var(--color-linho)" />
      <path
        d="M0 70C70 50 120 90 180 70S300 30 400 60V0H0Z"
        fill="var(--color-areia)"
        opacity="0.6"
      />
      <path
        d="M-10 200C60 170 110 190 160 150S240 120 290 130 360 110 410 120"
        fill="none"
        stroke="var(--color-bruma)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M40 -10C60 60 90 110 150 140S250 190 270 250"
        fill="none"
        stroke="var(--color-cal)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M150 140C200 120 250 100 300 92"
        fill="none"
        stroke="var(--color-cal)"
        strokeWidth="5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <g
        fill="var(--color-pedra)"
        fontFamily="sans-serif"
        fontSize="9"
        letterSpacing="2"
      >
        <text x="56" y="168">
          ALJEZUR
        </text>
        <text x="300" y="150">
          RIBEIRA
        </text>
        <text x="180" y="60">
          SERRA
        </text>
      </g>
      <g transform="translate(70 128)">
        <rect
          x="-8"
          y="-8"
          width="16"
          height="16"
          rx="3"
          fill="var(--color-pedra)"
          opacity="0.5"
        />
      </g>
      <g transform="translate(306 66)">
        <circle cy="18" r="24" fill="var(--color-latao)" opacity="0.18" />
        <path
          d="M-9 8A9 9 0 0 1 9 8V28Q9 32 5 32H-5Q-9 32 -9 28Z"
          fill="var(--color-latao)"
        />
        <circle cy="7" r="2.2" fill="var(--color-linho)" />
      </g>
    </svg>
  );
}

// Booking: the request form (BookingForm), and beside it everything to get here — the (fictional) address, how to
// arrive, phone, WhatsApp, email and an illustrated map. Phones: heading, the form, then the contacts card.
export function Booking({ copy }: { copy: SeteChavesCopy }) {
  const { booking, contact } = copy;
  const label = "sc-label mb-2 flex items-center gap-2 text-latao-deep";
  const link =
    "font-display text-[1.3rem] leading-tight break-words hover:text-latao-deep";
  return (
    <section
      id={seteChavesSections.book}
      aria-labelledby="sc-booking-title"
      className="relative bg-linho py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14">
        <div className="lg:col-span-2">
          <p className="sc-label mb-5 flex items-center gap-3 text-latao-deep">
            <span aria-hidden="true" className="h-px w-8 bg-latao/60" />
            {booking.eyebrow}
          </p>
          <h2
            id="sc-booking-title"
            className="font-display text-[clamp(2.6rem,9vw,5rem)] leading-[0.95] tracking-[-0.02em]"
          >
            {booking.title}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-tinta/75">
            {booking.intro}
          </p>
        </div>

        <BookingForm />

        <Reveal className="lg:self-start">
          <aside
            aria-labelledby="sc-contact-title"
            className="overflow-hidden rounded-[2rem] bg-cal"
          >
            <ValleyMap label={contact.mapLabel} />
            <div className="grid gap-7 p-6 sm:p-8">
              <h3
                id="sc-contact-title"
                className="font-display text-[1.6rem] leading-tight"
              >
                {contact.title}
              </h3>
              <div>
                <h4 className={label}>
                  <PinIcon width={16} height={16} /> {contact.addressLabel}
                </h4>
                <address className="leading-relaxed not-italic">
                  {seteChaves.street}, {seteChaves.place}
                  <br />
                  {seteChaves.postalCode} {seteChaves.locality}
                </address>
                <p className="mt-1 text-xs text-pedra">{contact.addressNote}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-tinta/75">
                  {contact.arrival}
                </p>
              </div>
              <div>
                <h4 className={label}>
                  <ClockIcon width={16} height={16} /> Check-in · Check-out
                </h4>
                <p className="font-display text-[1.3rem] leading-tight tabular-nums">
                  {seteChaves.checkIn.from}–{seteChaves.checkIn.to} ·{" "}
                  {seteChaves.checkOut}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <h4 className={label}>
                    <PhoneIcon width={16} height={16} /> {contact.phoneLabel}
                  </h4>
                  <a
                    href={seteChaves.phoneHref}
                    className={`${link} whitespace-nowrap`}
                  >
                    {seteChaves.phoneDisplay}
                  </a>
                </div>
                <div>
                  <h4 className={label}>
                    <ChatIcon width={16} height={16} /> {contact.whatsappLabel}
                  </h4>
                  <a
                    href={seteChavesWhatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link} whitespace-nowrap`}
                  >
                    {seteChaves.phoneDisplay}
                    <span className="sr-only"> {copy.newTab}</span>
                  </a>
                </div>
                <div>
                  <h4 className={label}>
                    <MailIcon width={16} height={16} /> {contact.emailLabel}
                  </h4>
                  <a
                    href={seteChavesMailHref()}
                    className={`${link} text-[1.05rem]`}
                  >
                    {seteChaves.email}
                  </a>
                </div>
              </div>
              <a
                href={seteChaves.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-xisto px-6 text-[0.78rem] font-semibold tracking-[0.12em] text-cal uppercase transition-colors hover:bg-tinta"
              >
                <PinIcon width={17} height={17} /> {contact.directions}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
