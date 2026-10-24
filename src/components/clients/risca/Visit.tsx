import type { RiscaCopy } from "@/content/risca/copy";
import { risca, riscaWhatsappHref } from "@/content/risca/facts";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { riscaSections } from "./sections";

export function HoursList({ copy, dark = false }: { copy: RiscaCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {risca.hours.map((row) => (
        <div key={row.days} className={`flex items-baseline justify-between gap-6 border-b pb-1.5 ${dark ? "border-gesso/15" : "border-tinta/15"}`}>
          <dt>{row.days}</dt>
          <dd className="font-semibold tabular-nums">
            {row.opens}–{row.closes}
          </dd>
        </div>
      ))}
      <div className={`flex items-baseline justify-between gap-6 pb-1.5 ${dark ? "text-gesso/55" : "text-cinza"}`}>
        <dt>{risca.closed}</dt>
        <dd>{copy.visit.closedLabel}</dd>
      </div>
    </dl>
  );
}

/** An illustrated map of the neighbourhood (no third-party map, no cookies): a grid of streets crossed by one slanted
 * street, the salon's, and the mark. */
function MapIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="260" fill="var(--color-grafite)" />
      <g fill="none" stroke="var(--color-grafite-2)" strokeWidth="12" strokeLinecap="square">
        <path d="M-10 52H410M-10 132H410M-10 214H410" />
        <path d="M70 -10V270M170 -10V270M262 -10V270M346 -10V270" />
      </g>
      <path d="M-20 228 L420 34" stroke="var(--color-gesso)" strokeOpacity="0.85" strokeWidth="9" />
      <path d="M-20 228 L420 34" stroke="var(--color-vermelhao)" strokeWidth="2" />
      <g fill="var(--color-gesso)" fillOpacity="0.55" fontFamily="var(--font-sans)" fontSize="9" letterSpacing="2">
        <text x="20" y="40">CEDOFEITA</text>
        <text x="300" y="250">PORTO</text>
      </g>
      <text x="60" y="180" transform="rotate(-23.8 60 180)" fill="var(--color-gesso)" fontFamily="var(--font-sans)" fontSize="9" letterSpacing="2">
        RUA DA RISCA
      </text>
      <g transform="translate(232 128)">
        <circle r="20" fill="var(--color-vermelhao)" opacity="0.22" />
        <circle r="8" fill="var(--color-vermelhao)" />
      </g>
    </svg>
  );
}

// Visiting: address, hours, phone, WhatsApp (in the salon's own colours, never green) and an illustrated map.
// Phones: heading, the map, then the details.
export function Visit({ copy }: { copy: RiscaCopy }) {
  const { visit } = copy;
  const label = "rc-label mb-3 flex items-center gap-2 text-vermelhao";
  return (
    <section id={riscaSections.visit} aria-labelledby="rc-visit-title" className="rc-on-dark bg-tinta py-24 text-gesso sm:py-32">
      <div className="mx-auto grid max-w-[92rem] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="rc-label mb-5 flex items-center gap-4 text-gesso/60">
            <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
            {visit.eyebrow}
          </p>
          <h2 id="rc-visit-title" className="text-[clamp(3rem,11vw,7rem)] leading-[0.86]">
            <span className="rc-display block">{visit.title}</span>
            <span className="rc-serif block text-[0.86em] text-vermelhao">{visit.titleSerif}</span>
          </h2>
          <Reveal className="mt-10">
            <MapIllustration label={visit.mapLabel} />
            <p className="mt-2 text-xs text-gesso/50">{visit.note}</p>
          </Reveal>
        </div>

        <div className="grid content-start gap-9 lg:pt-6">
          <div>
            <h3 className={label}>
              <PinIcon width={16} height={16} /> {visit.addressLabel}
            </h3>
            <address className="text-[1.15rem] leading-relaxed not-italic">
              {risca.street}
              <br />
              {risca.postalCode} {risca.locality} · {risca.neighbourhood}
            </address>
          </div>
          <div>
            <h3 className={label}>
              <ClockIcon width={16} height={16} /> {visit.hoursLabel}
            </h3>
            <HoursList copy={copy} dark />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className={label}>
                <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
              </h3>
              <a href={risca.phoneHref} className="rc-display text-[2.1rem] whitespace-nowrap hover:text-vermelhao">
                {risca.phoneDisplay}
              </a>
              <p className="mt-1 text-xs text-gesso/55">{visit.phoneNote}</p>
            </div>
            <div>
              <h3 className={label}>
                <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
              </h3>
              <a href={riscaWhatsappHref()} target="_blank" rel="noopener noreferrer" className="rc-display text-[2.1rem] whitespace-nowrap hover:text-vermelhao">
                {risca.whatsappDisplay}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
          </div>
          <a
            href={risca.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="rc-slant inline-flex h-14 w-fit items-center gap-3 bg-vermelhao pr-10 pl-6 text-[0.82rem] font-bold tracking-[0.14em] text-tinta uppercase transition-colors hover:bg-gesso"
          >
            <PinIcon width={17} height={17} /> {visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
