import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial, ferragialWhatsappHref } from "@/content/ferragial/facts";
import { Logo } from "./Logo";
import { HoursList } from "./Visit";

export function Footer({ copy }: { copy: FerragialCopy }) {
  const year = 2026;
  const link = "text-sm text-cal/85 underline decoration-cal/30 underline-offset-4 hover:decoration-cal";
  return (
    <footer className="fg-dark relative overflow-hidden bg-mosto text-cal">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo label={copy.logoLabel} line={ferragial.line} sun="var(--color-palha)" className="text-cal" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cal/70">{copy.footer.tagline}</p>
          <p className="mt-6 inline-flex rounded-full bg-cal/10 px-4 py-2 text-sm font-semibold text-palha">{copy.responsible}</p>
        </div>

        <div>
          <h2 className="fg-label mb-4 text-palha">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-cal/85 not-italic">
            {ferragial.street}
            <br />
            {ferragial.postalCode} {ferragial.locality}
            <br />
            {ferragial.region}
          </address>
          <a href={ferragial.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-10 items-center ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="fg-label mb-4 text-palha">{copy.footer.hours}</h2>
          <div className="text-sm text-cal/85">
            <HoursList dark />
          </div>
        </div>

        <div>
          <h2 className="fg-label mb-4 text-palha">{copy.footer.contacts}</h2>
          <p>
            <a href={ferragial.phoneHref} className="inline-flex min-h-10 items-center font-display text-2xl whitespace-nowrap hover:text-palha">
              {ferragial.phoneDisplay}
            </a>
            <span className="block text-xs text-cal/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-2">
            <a href={ferragialWhatsappHref()} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center ${link}`}>
              WhatsApp
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
          <p>
            <a href={`mailto:${ferragial.email}`} className={`inline-flex min-h-10 items-center ${link}`}>
              {ferragial.email}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-cal/8 px-5 py-4 text-sm leading-relaxed text-cal/75">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-cal/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 py-6 text-sm text-cal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {ferragial.fullName}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-cal/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={ferragial.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-cal px-3 font-medium text-mosto transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-cal">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
