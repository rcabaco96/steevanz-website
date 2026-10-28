import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro, ponteiroWhatsappHref } from "@/content/ponteiro/facts";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { ponteiroSections } from "./sections";

export function HoursList({ copy, dark = false }: { copy: PonteiroCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {ponteiro.hours.map((row) => (
        <div key={row.days} className={`flex items-baseline justify-between gap-6 border-b pb-1.5 ${dark ? "border-papel/15" : "border-tinta/10"}`}>
          <dt>{row.days}</dt>
          <dd className="font-display text-xl tabular-nums">
            {row.opens}–{row.closes}
          </dd>
        </div>
      ))}
      <div className={`flex items-baseline justify-between gap-6 pb-1.5 ${dark ? "text-papel/60" : "text-cinza"}`}>
        <dt>{ponteiro.closed}</dt>
        <dd>{copy.visit.closedLabel}</dd>
      </div>
    </dl>
  );
}

/** An illustrated map of the parish (no third-party map, no cookies): a few streets, a garden, the clock. */
function MapIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="240" fill="var(--color-gema-soft)" />
      <g fill="none" stroke="var(--color-papel)" strokeLinecap="round">
        <path d="M-10 60 C90 72 200 40 410 70" strokeWidth="14" />
        <path d="M-10 180 C110 166 250 200 410 172" strokeWidth="10" />
        <path d="M96 -10 C110 90 84 150 104 250" strokeWidth="10" />
        <path d="M300 -10 C290 70 318 160 296 250" strokeWidth="12" />
        <path d="M150 250 L360 -10" strokeWidth="6" />
      </g>
      <rect x="128" y="96" width="92" height="56" rx="18" fill="var(--color-canela)" opacity="0.8" />
      <g fill="var(--color-cinza)" fontFamily="var(--font-sans)" fontSize="9" letterSpacing="2" fontWeight="600">
        <text x="140" y="128">JARDIM</text>
        <text x="186" y="44">TRAVESSA DAS HORAS</text>
      </g>
      <g transform="translate(250 110)">
        <circle r="26" fill="var(--color-ginja)" opacity="0.14" />
        <circle r="15" fill="var(--color-ginja)" />
        <path d="M0 0 L7 -7" stroke="var(--color-gema)" strokeWidth="3" strokeLinecap="round" />
        <circle r="2.5" fill="var(--color-gema)" />
      </g>
    </svg>
  );
}

// How to come: address and an illustrated map, the hours, the phone and WhatsApp (in the house's colours: never the
// WhatsApp green). Phones: the heading, the map, then the details.
export function Visit({ copy }: { copy: PonteiroCopy }) {
  const { visit } = copy;
  const label = "pn-label mb-3 flex items-center gap-2 text-ginja";
  return (
    <section id={ponteiroSections.visit} aria-labelledby="pn-visit-title" className="bg-papel pb-24 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal className="overflow-hidden rounded-[1.8rem] bg-marmore lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-10">
            <h2 id="pn-visit-title" className="font-display text-[clamp(2.4rem,8vw,4.4rem)] leading-[0.95]">
              {visit.eyebrow} <span className="text-ginja italic">{ponteiro.name}</span>
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl lg:hidden">
              <MapIllustration label={visit.mapLabel} />
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className={label}>
                  <PinIcon width={16} height={16} /> {visit.addressLabel}
                </h3>
                <address className="leading-relaxed not-italic">
                  {ponteiro.street}
                  <br />
                  {ponteiro.postalCode} {ponteiro.locality} · {ponteiro.neighbourhood}
                </address>
                <a
                  href={ponteiro.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-tinta px-5 text-[0.92rem] font-semibold text-papel transition-colors hover:bg-ginja"
                >
                  <PinIcon width={17} height={17} /> {visit.directions}
                  <span className="sr-only"> {copy.newTab}</span>
                </a>
              </div>
              <div>
                <h3 className={label}>
                  <ClockIcon width={16} height={16} /> {visit.hoursLabel}
                </h3>
                <HoursList copy={copy} />
              </div>
              <div>
                <h3 className={label}>
                  <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
                </h3>
                <a href={ponteiro.phoneHref} className="font-display text-[1.6rem] leading-tight whitespace-nowrap hover:text-ginja">
                  {ponteiro.phoneDisplay}
                </a>
                <p className="mt-1 text-xs text-cinza">{visit.phoneNote}</p>
              </div>
              <div>
                <h3 className={label}>
                  <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
                </h3>
                <a href={ponteiroWhatsappHref()} target="_blank" rel="noopener noreferrer" className="font-display text-[1.6rem] leading-tight whitespace-nowrap hover:text-ginja">
                  {ponteiro.whatsappDisplay}
                  <span className="sr-only"> {copy.newTab}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <MapIllustration label={visit.mapLabel} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
