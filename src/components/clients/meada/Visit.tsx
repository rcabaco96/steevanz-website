import Image from "next/image";
import type { MeadaCopy } from "@/content/meada/copy";
import { meada, meadaPhotos, meadaWhatsappHref } from "@/content/meada/facts";
import { ChatIcon, ClockIcon, GiftIcon, PhoneIcon, PinIcon, StoreIcon, TruckIcon } from "./icons";
import { Reveal } from "./Reveal";
import { meadaSections } from "./sections";

export function HoursList({ copy, dark = false }: { copy: MeadaCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {meada.hours.map((row) => (
        <div key={row.days} className={`flex items-baseline justify-between gap-6 border-b border-dashed pb-1.5 ${dark ? "border-algodao/20" : "border-tinta/20"}`}>
          <dt>{row.days}</dt>
          <dd className="font-mono whitespace-nowrap tabular-nums">
            {row.opens}–{row.closes}
          </dd>
        </div>
      ))}
      <div className={`flex items-baseline justify-between gap-6 pb-1.5 ${dark ? "text-algodao/60" : "text-cinza"}`}>
        <dt>{meada.closed}</dt>
        <dd>{copy.visit.closedLabel}</dd>
      </div>
    </dl>
  );
}

/** An illustrated map of the old town (no third-party map, no cookies): stone streets, a square, the cross-stitch. */
function MapIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="240" fill="var(--color-cru)" />
      <g fill="none" stroke="var(--color-algodao)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-10 92 L120 84 L210 112 L410 96" strokeWidth="13" />
        <path d="M60 -10 L84 70 L72 160 L96 250" strokeWidth="9" />
        <path d="M210 112 L232 -10" strokeWidth="8" />
        <path d="M210 112 L196 250" strokeWidth="10" />
        <path d="M300 104 L330 250" strokeWidth="7" />
        <path d="M-10 190 L72 160 L196 176 L410 168" strokeWidth="8" />
      </g>
      <rect x="236" y="122" width="62" height="40" rx="4" fill="var(--color-cru-2)" />
      <g fill="var(--color-cinza)" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="1.6">
        <text x="238" y="178">LARGO DAS TECEDEIRAS</text>
        <text x="16" y="80">CENTRO HISTÓRICO</text>
      </g>
      <g transform="translate(267 142)" stroke="var(--color-fio)" strokeWidth="4" strokeLinecap="round">
        <circle r="17" fill="var(--color-algodao)" stroke="none" />
        <path d="M-7 -7L7 7M7 -7L-7 7" />
      </g>
    </svg>
  );
}

const serviceIcons = { store: StoreIcon, truck: TruckIcon, gift: GiftIcon };

// How to buy and where to find the shop: pick-up, delivery and gift wrapping; then the shop itself (a photo of
// its wall, address, hours, phone, WhatsApp, an illustrated map, who is at the counter). Phones: heading and intro,
// the picture, then the rest.
export function Visit({ copy }: { copy: MeadaCopy }) {
  const { services, visit, team } = copy;
  const label = "md-label mb-2 flex items-center gap-2 text-fio";
  const photo = meadaPhotos.lojaParede;
  return (
    <section id={meadaSections.visit} aria-labelledby="md-visit-title" className="relative bg-algodao pt-24 pb-8 sm:pt-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="md-label mb-6 flex items-center gap-3 text-fio">
          <span aria-hidden="true" className="md-stitch w-10" />
          {services.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(2.4rem,8vw,4.6rem)] leading-[0.98]">
          {services.title} <span className="text-fio">{services.titleItalic}</span>
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {services.list.map((service, i) => {
            const Icon = serviceIcons[service.icon];
            return (
              <li key={service.title}>
                <Reveal delay={i * 90} className="h-full">
                  <div className="h-full border-t-2 border-dashed border-fio/60 pt-5">
                    <Icon width={26} height={26} className="text-fio" />
                    <h3 className="mt-4 font-display text-[1.45rem] leading-snug">{service.title}</h3>
                    <p className="mt-2 leading-relaxed text-cinza">{service.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto mt-24 grid max-w-[84rem] gap-10 px-5 sm:mt-32 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <p className="md-label mb-6 flex items-center gap-3 text-fio">
            <span aria-hidden="true" className="md-stitch w-10" />
            {visit.eyebrow}
          </p>
          <h2 id="md-visit-title" className="font-display text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.96]">
            {visit.title} <span className="text-fio">{visit.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-cinza">{visit.intro}</p>
          <Reveal className="mt-8">
            <div className="relative aspect-[4/3] overflow-hidden bg-cru">
              <Image src={photo.src} alt={visit.photoAlt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 45vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </Reveal>
          <div className="mt-8">
            <h3 className="font-display text-xl">{team.title}</h3>
            <ul className="mt-3 grid gap-2">
              {team.people.map((person) => (
                <li key={person.name} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-fio">✕</span>
                  <span>
                    <span className="font-medium">{person.name}</span> <span className="text-cinza">· {person.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-cinza">{team.note}</p>
          </div>
        </div>

        <Reveal className="lg:self-start">
          <aside aria-label={visit.addressLabel} className="overflow-hidden bg-cru">
            <MapIllustration label={visit.mapLabel} />
            <div className="grid gap-7 p-6 sm:p-8">
              <div>
                <h3 className={label}>
                  <PinIcon width={16} height={16} /> {visit.addressLabel}
                </h3>
                <address className="leading-relaxed not-italic">
                  {meada.street}
                  <br />
                  {meada.postalCode} {meada.locality} · {meada.neighbourhood}
                </address>
              </div>
              <div>
                <h3 className={label}>
                  <ClockIcon width={16} height={16} /> {visit.hoursLabel}
                </h3>
                <HoursList copy={copy} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className={label}>
                    <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
                  </h3>
                  <a href={meada.phoneHref} className="font-mono text-[1.15rem] whitespace-nowrap hover:text-fio">
                    {meada.phoneDisplay}
                  </a>
                  <p className="mt-1 text-xs text-cinza">{visit.phoneNote}</p>
                </div>
                <div>
                  <h3 className={label}>
                    <ChatIcon width={16} height={16} /> {visit.whatsappLabel}
                  </h3>
                  <a href={meadaWhatsappHref()} target="_blank" rel="noopener noreferrer" className="font-mono text-[1.15rem] whitespace-nowrap hover:text-fio">
                    {meada.whatsappDisplay}
                    <span className="sr-only"> {copy.newTab}</span>
                  </a>
                </div>
              </div>
              <a
                href={meada.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-grafite px-6 font-mono text-[0.78rem] tracking-[0.12em] text-algodao uppercase transition-colors hover:bg-fio"
              >
                <PinIcon width={17} height={17} /> {visit.directions}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
              <p className="text-xs text-cinza">{visit.demoContacts}</p>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
