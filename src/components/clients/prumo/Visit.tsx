import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo, prumoWhatsappHref } from "@/content/prumo/facts";
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { prumoSections } from "./sections";

export function HoursList({ dark = false }: { dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {prumo.hours.map((h) => (
        <div key={h.days} className="flex justify-between gap-6">
          <dt>{h.days}</dt>
          <dd className="whitespace-nowrap tabular-nums">
            {h.opens}–{h.closes}
          </dd>
        </div>
      ))}
      <div className={`flex justify-between gap-6 ${dark ? "text-cal/60" : "text-pedra"}`}>
        <dt>{prumo.closed}</dt>
        <dd>—</dd>
      </div>
    </dl>
  );
}

// How to visit: address and directions, hours, contacts (placeholders of a fictional business; WhatsApp in the
// clinic's slate, never green), access, and the insurers and agreements as a placeholder list.
export function Visit({ copy }: { copy: PrumoCopy }) {
  const { visit } = copy;
  const link = "underline decoration-tinta/30 underline-offset-4 hover:decoration-tinta";
  const card = "rounded-[1.6rem] bg-cal p-6 sm:p-7";
  const head = "pr-label mb-4 flex items-center gap-2.5 text-latao-fundo";
  return (
    <section id={prumoSections.visit} aria-labelledby="pr-visit-title" className="bg-anca pt-24 pb-24 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
          <span aria-hidden="true" className="h-px w-10 bg-latao" />
          {visit.eyebrow}
        </p>
        <h2 id="pr-visit-title" className="font-display text-[clamp(2.7rem,9.5vw,5.2rem)] leading-[0.98] tracking-[-0.015em]">
          {visit.title} <span className="text-latao-fundo italic">{visit.titleItalic}</span>
        </h2>

        <Reveal className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className={card}>
            <h3 className={head}>
              <PinIcon width={17} height={17} /> {visit.addressLabel}
            </h3>
            <address className="font-display text-[1.35rem] leading-snug not-italic">
              {prumo.street}
              <br />
              {prumo.postalCode} {prumo.locality}
            </address>
            <p className="mt-1 text-pedra">{prumo.neighbourhood}</p>
            <a href={prumo.directions} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex min-h-10 items-center font-semibold ${link}`}>
              {visit.directions}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-pedra">{visit.access}</p>
          </div>

          <div className={card}>
            <h3 className={head}>
              <ClockIcon width={17} height={17} /> {visit.hoursLabel}
            </h3>
            <HoursList />
          </div>

          <div className={card}>
            <h3 className={head}>
              <PhoneIcon width={17} height={17} /> {visit.contactsLabel}
            </h3>
            <a href={prumo.phoneHref} className="flex min-h-11 items-center font-display text-[1.45rem] whitespace-nowrap hover:text-latao-fundo">
              {prumo.phoneDisplay}
            </a>
            <p className="text-xs text-pedra">{visit.phoneNote}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={prumoWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2.5 self-start rounded-full bg-ardosia px-5 font-semibold text-cal transition-colors hover:bg-ardosia-3"
              >
                <ChatIcon width={17} height={17} /> {visit.whatsapp}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
              <a href={`mailto:${prumo.email}`} className={`inline-flex min-h-10 items-center gap-2 ${link}`}>
                <MailIcon width={17} height={17} /> {prumo.email}
              </a>
            </div>
          </div>

          <div className={`${card} md:col-span-2 lg:col-span-3`}>
            <h3 className={head}>{visit.insurance.title}</h3>
            <p className="max-w-2xl leading-relaxed text-pedra">{visit.insurance.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {visit.insurance.list.map((item) => (
                <li key={item} className="rounded-full border border-dashed border-tinta/30 px-4 py-2 text-[0.92rem] text-tinta">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
