import Image from "next/image";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda, platibandaPhotos, platibandaWhatsappHref } from "@/content/platibanda/facts";
import { ContactForm } from "./ContactForm";
import { facadeIn, polygon } from "./facade";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";
import { platibandaSections } from "./sections";

const facadeClip = polygon(facadeIn(0, 0, 100, 100));

export function HoursList({ copy, dark = false }: { copy: PlatibandaCopy; dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {platibanda.hours.map((row) => (
        <div key={row.days} className={`flex items-baseline justify-between gap-6 border-b pb-1.5 ${dark ? "border-cal/15" : "border-ria/10"}`}>
          <dt>{row.days}</dt>
          <dd className="font-semibold tabular-nums">
            {row.opens}–{row.closes}
          </dd>
        </div>
      ))}
      <div className={`flex items-baseline justify-between gap-6 pb-1.5 ${dark ? "text-cal/60" : "text-pedra"}`}>
        <dt>{platibanda.closed}</dt>
        <dd>{copy.contact.closedLabel}</dd>
      </div>
    </dl>
  );
}

// Contacts: the shop in the old town (a picture of Tavira in a house front), address, hours, phone and WhatsApp, and
// a short request that opens WhatsApp. Phones: heading and text, the picture, then the details and the form.
export function Contact({ copy }: { copy: PlatibandaCopy }) {
  const { contact } = copy;
  const photo = platibandaPhotos.taviraPraca;
  const label = "pb-label mb-2 flex items-center gap-2 text-ocre-deep";
  return (
    <section id={platibandaSections.contact} aria-labelledby="pb-contact-title" className="relative bg-cal pt-24 pb-10 sm:pt-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
            <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
            {contact.eyebrow}
          </p>
          <h2 id="pb-contact-title" className="font-display text-[clamp(2.2rem,7vw,4.2rem)] leading-[0.98] text-ria">
            {contact.title} <span className="text-telha">{contact.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-pedra">{contact.intro}</p>
          <Reveal className="mt-10">
            <div className="relative mx-auto aspect-[4/5] w-[min(100%,24rem)] lg:mx-0">
              <div className="absolute inset-0 overflow-hidden bg-areia" style={{ clipPath: facadeClip }}>
                <Image src={photo.src} alt={contact.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 24rem, 90vw" className="h-full w-full object-cover" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[6%] bg-ocre" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className={label}>
                <PinIcon width={15} height={15} /> {contact.addressLabel}
              </h3>
              <address className="leading-relaxed text-ria not-italic">
                {platibanda.street}
                <br />
                {platibanda.postalCode} {platibanda.locality}
              </address>
              <a
                href={platibanda.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-telha underline decoration-telha/40 underline-offset-4 hover:decoration-telha"
              >
                {contact.directions}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
            <div>
              <h3 className={label}>
                <ClockIcon width={15} height={15} /> {contact.hoursLabel}
              </h3>
              <div className="text-[0.95rem] text-ria">
                <HoursList copy={copy} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <h3 className={label}>
                <PhoneIcon width={15} height={15} /> {contact.phoneLabel}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <a href={platibanda.phoneHref} className="font-display text-2xl whitespace-nowrap text-ria hover:text-telha">
                  {platibanda.phoneDisplay}
                </a>
                <a
                  href={platibandaWhatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ria px-4 text-sm font-semibold text-cal hover:bg-ria-2"
                >
                  <ChatIcon width={16} height={16} /> WhatsApp
                  <span className="sr-only"> {copy.newTab}</span>
                </a>
              </div>
              <p className="mt-1 text-xs text-pedra">{contact.phoneNote}</p>
            </div>
          </div>
          <ContactForm copy={copy} />
          <p className="text-sm text-pedra">{contact.demoNote}</p>
        </div>
      </div>
    </section>
  );
}
