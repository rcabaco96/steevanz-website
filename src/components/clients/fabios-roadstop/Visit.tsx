import { fabios } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { MapEmbed } from "./MapEmbed";
import { SplitText } from "./react-bits/SplitText";

export function AddressLines() {
  return (
    <>
      Edifício Mar Salgado
      <br />
      R. Dr. Manuel Arriaga, lote 1, loja E
      <br />
      {fabios.postalCode} {fabios.locality}
    </>
  );
}

export function HoursTable({ copy, dark = false }: { copy: FabiosCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {copy.visit.hours.map((row) => (
        <div key={row.days} className={`flex items-baseline justify-between gap-4 border-b border-dashed pb-1.5 ${dark ? "border-cream/25" : "border-ink/20"}`}>
          <dt className="font-medium">{row.days}</dt>
          <dd className="font-display text-xl tracking-wide tabular-nums uppercase">{row.time}</dd>
        </div>
      ))}
    </dl>
  );
}

// Where to find the restaurant: address, opening hours, phone (with the legal note on call costs), email,
// the way there and a map that only loads on request.
export function Visit({ copy, headingLevel = 2 }: { copy: FabiosCopy; headingLevel?: 1 | 2 }) {
  const { visit } = copy;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="visite-nos" aria-labelledby="fr-visit-title" className="relative overflow-hidden bg-cream py-24 sm:py-36">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-cherry uppercase sm:text-sm">
            <span aria-hidden="true" className="h-0.5 w-10 bg-cherry" />
            {visit.eyebrow}
          </p>
          <Heading id="fr-visit-title" className="font-display text-[clamp(3rem,11vw,8rem)] leading-[0.86] uppercase">
            <SplitText text={visit.title} className="block" />{" "}
            <span className="mt-1 block -rotate-2 font-script text-[0.62em] leading-[1.15] text-cherry normal-case">
              {visit.titleScript}
            </span>
          </Heading>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-muted uppercase">
                <PinIcon width={16} height={16} /> {visit.addressLabel}
              </h3>
              <address className="text-lg leading-relaxed not-italic">
                <AddressLines />
              </address>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-muted uppercase">
                <ClockIcon width={16} height={16} /> {visit.hoursLabel}
              </h3>
              <HoursTable copy={copy} />
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-muted uppercase">
                <PhoneIcon width={16} height={16} /> {visit.phoneLabel}
              </h3>
              <a href={fabios.phoneHref} className="font-display text-3xl tracking-wide hover:text-cherry">
                {fabios.phoneDisplay}
              </a>
              <p className="mt-1 text-sm text-muted">{visit.phoneNote}</p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-muted uppercase">
                <MailIcon width={16} height={16} /> {visit.emailLabel}
              </h3>
              <a href={`mailto:${fabios.email}`} className="text-lg font-semibold break-all underline decoration-cherry/40 underline-offset-4 hover:text-cherry">
                {fabios.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:pt-16">
          <MapEmbed button={visit.mapButton} note={visit.mapNote} title={visit.mapTitle} facadeAlt={visit.facadeAlt} />
          <p className="font-script text-2xl text-cherry sm:text-3xl">{visit.facadeCaption}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={fabios.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-cherry px-6 text-lg font-bold text-cream transition-colors hover:bg-cherry-deep"
            >
              <PinIcon /> {visit.directions}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a
              href={fabios.phoneHref}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-6 text-lg font-bold text-cream transition-colors hover:bg-cherry"
            >
              <PhoneIcon /> {visit.call}
            </a>
            <a
              href={`mailto:${fabios.email}`}
              className="inline-flex h-14 items-center gap-2 rounded-full px-6 text-lg font-bold text-ink ring-2 ring-ink/80 transition-colors hover:bg-ink hover:text-cream"
            >
              <MailIcon /> {visit.write}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
