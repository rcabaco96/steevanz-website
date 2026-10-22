import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { ArrowIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { MapEmbed } from "./MapEmbed";
import { Reveal } from "./Reveal";
import { loboSections } from "./sections";

// Where and when: the address, the opening hours (closed on Monday), the phone, the e-mail and takeaway by phone,
// beside the map (loaded on request).
export function Visit({ copy }: { copy: LoboCopy }) {
  const { visit } = copy;
  return (
    <section id={loboSections.visit} aria-labelledby="lm-visit-title" className="bg-areia pt-24 pb-36 sm:pt-32 sm:pb-44">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="lm-eyebrow text-coral-deep">{visit.eyebrow}</p>
          <h2 id="lm-visit-title" className="mt-5 font-display text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.98] font-extrabold text-abismo uppercase">
            {visit.title}
          </h2>
          <dl className="mt-10 flex flex-col">
            <Reveal className="flex gap-4 border-t border-abismo/15 py-5">
              <dt className="sr-only">{visit.addressLabel}</dt>
              <PinIcon className="mt-0.5 shrink-0 text-coral-deep" />
              <dd>
                <p className="font-medium">{lobo.street}</p>
                <p className="text-calhau">
                  {lobo.postalCode} {lobo.locality}
                </p>
                <a
                  href={lobo.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 font-display text-[0.7rem] font-bold tracking-[0.18em] text-coral-deep uppercase"
                >
                  {visit.directions} <ArrowIcon width={16} height={16} />
                  <span className="sr-only"> {copy.newTab}</span>
                </a>
              </dd>
            </Reveal>
            <Reveal delay={80} className="flex gap-4 border-t border-abismo/15 py-5">
              <dt className="sr-only">{visit.hoursLabel}</dt>
              <ClockIcon className="mt-0.5 shrink-0 text-coral-deep" />
              <dd className="w-full">
                {visit.days.map((day) => (
                  <p key={day.label} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-0.5">
                    <span className="font-medium">{day.label}</span>
                    <span className={day.hours ? "tabular-nums" : "text-calhau"}>{day.hours ?? visit.closed}</span>
                  </p>
                ))}
              </dd>
            </Reveal>
            <Reveal delay={160} className="flex gap-4 border-t border-abismo/15 py-5">
              <dt className="sr-only">{visit.phoneLabel}</dt>
              <PhoneIcon className="mt-0.5 shrink-0 text-coral-deep" />
              <dd>
                <a href={lobo.phoneHref} className="font-display text-xl font-bold text-abismo">
                  {lobo.phoneDisplay}
                </a>
                <p className="text-sm text-calhau">{visit.phoneNote}</p>
                <p className="mt-2 text-calhau">{visit.takeaway}</p>
              </dd>
            </Reveal>
            <Reveal delay={240} className="flex gap-4 border-y border-abismo/15 py-5">
              <dt className="sr-only">{visit.emailLabel}</dt>
              <MailIcon className="mt-0.5 shrink-0 text-coral-deep" />
              <dd>
                <a href={`mailto:${lobo.email}`} className="font-medium break-all text-abismo underline decoration-coral underline-offset-4">
                  {lobo.email}
                </a>
              </dd>
            </Reveal>
          </dl>
        </div>
        <Reveal delay={120} className="lg:pt-16">
          <MapEmbed button={visit.mapButton} note={visit.mapNote} title={visit.mapTitle} alt={copy.gallery.photos[copy.gallery.photos.length - 1].alt} />
        </Reveal>
      </div>
    </section>
  );
}
