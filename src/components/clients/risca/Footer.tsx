import type { RiscaCopy } from "@/content/risca/copy";
import { risca, riscaWhatsappHref } from "@/content/risca/facts";
import { Logo } from "./Logo";
import { HoursList } from "./Visit";

export function Footer({ copy }: { copy: RiscaCopy }) {
  const year = 2026;
  const link = "text-sm text-gesso/85 underline decoration-gesso/30 underline-offset-4 hover:decoration-vermelhao";
  return (
    <footer className="rc-on-dark relative overflow-hidden border-t border-gesso/10 bg-tinta text-gesso">
      <div className="mx-auto grid max-w-[92rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo id="rc-mark-footer" label={copy.logoLabel} className="w-44 text-gesso sm:w-52" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-gesso/65">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="rc-label mb-4 text-vermelhao">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-gesso/85 not-italic">
            {risca.street}
            <br />
            {risca.postalCode} {risca.locality}
          </address>
          <a href={risca.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-10 items-center ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="rc-label mb-4 text-vermelhao">{copy.footer.hours}</h2>
          <div className="text-sm text-gesso/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="rc-label mb-4 text-vermelhao">{copy.footer.contacts}</h2>
          <p>
            <a href={risca.phoneHref} className="rc-display inline-flex min-h-11 items-center text-[1.7rem] whitespace-nowrap hover:text-vermelhao">
              {risca.phoneDisplay}
            </a>
            <span className="block text-xs text-gesso/55">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={riscaWhatsappHref()} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center ${link}`}>
              WhatsApp · {risca.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <p className="border-l-2 border-vermelhao bg-grafite px-5 py-4 text-sm leading-relaxed text-gesso/75">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-gesso/10">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-6 text-sm text-gesso/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {risca.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-gesso/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={risca.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center bg-gesso px-3 font-semibold text-tinta transition-colors hover:bg-vermelhao"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-gesso">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
