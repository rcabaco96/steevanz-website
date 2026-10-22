import { ermita } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { Logo } from "./Logo";
import { AddressLines, HoursList } from "./Visit";

export function Footer({ copy }: { copy: ErmitaCopy }) {
  const year = 2026;
  const link = "text-sm text-cal/85 underline decoration-cal/30 underline-offset-4 hover:decoration-cal";
  return (
    <footer className="relative overflow-hidden bg-noite text-cal">
      <div aria-hidden="true" className="oe-azulejo oe-barra opacity-90" />
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 pt-16 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo label={copy.logoLabel} className="w-44 text-cal sm:w-52" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cal/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="oe-eyebrow mb-4 text-ouro">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-cal/85 not-italic">
            <AddressLines />
          </address>
          <a href={ermita.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="oe-eyebrow mb-4 text-ouro">{copy.footer.hours}</h2>
          <div className="text-sm text-cal/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="oe-eyebrow mb-4 text-ouro">{copy.footer.contacts}</h2>
          <p>
            <a href={ermita.phoneHref} className="font-serif text-2xl hover:text-ouro">
              {ermita.phoneDisplay}
            </a>
            <span className="block text-xs text-cal/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={ermita.whatsappHref} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp · {ermita.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
          <p className="mt-3">
            <a href={ermita.hotelUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {copy.footer.hotel}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-cal/10">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-6 text-sm text-cal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {ermita.name}. {copy.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={ermita.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-sm bg-cal px-3 py-1.5 font-semibold text-noite transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="hover:text-cal">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
