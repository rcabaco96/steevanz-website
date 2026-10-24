import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo, prumoWhatsappHref } from "@/content/prumo/facts";
import { Wordmark } from "./Logo";
import { HoursList } from "./Visit";

// The footer: the wordmark, address, hours and contacts; the fictional-business note, the health note and the health
// regulator's registration as a placeholder; the complaints book and «Site por Steevanz».
export function Footer({ copy }: { copy: PrumoCopy }) {
  const year = 2026;
  const link = "text-sm text-cal/85 underline decoration-cal/30 underline-offset-4 hover:decoration-cal";
  return (
    <footer className="pr-on-dark relative overflow-hidden bg-ardosia text-cal">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Wordmark className="w-40 sm:w-48" ink="var(--color-cal)" bob="var(--color-latao-claro)" title={prumo.name} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cal/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="pr-label mb-4 text-latao-claro">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-cal/85 not-italic">
            {prumo.street}
            <br />
            {prumo.postalCode} {prumo.locality}
          </address>
          <a href={prumo.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-10 items-center ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="pr-label mb-4 text-latao-claro">{copy.footer.hours}</h2>
          <div className="text-sm text-cal/85">
            <HoursList dark />
          </div>
        </div>

        <div>
          <h2 className="pr-label mb-4 text-latao-claro">{copy.footer.contacts}</h2>
          <p>
            <a href={prumo.phoneHref} className="inline-flex min-h-11 items-center font-display text-2xl whitespace-nowrap hover:text-latao-claro">
              {prumo.phoneDisplay}
            </a>
            <span className="block text-xs text-cal/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3 flex flex-col items-start gap-1">
            <a href={prumoWhatsappHref()} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center ${link}`}>
              WhatsApp
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href={`mailto:${prumo.email}`} className={`inline-flex min-h-10 items-center ${link}`}>
              {prumo.email}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[84rem] flex-col gap-3 px-5 sm:px-8">
        <p className="rounded-2xl bg-ardosia-2 px-5 py-4 text-sm leading-relaxed text-cal/80">{copy.footer.fictional}</p>
        <p className="px-1 text-xs leading-relaxed text-cal/65">
          {copy.health.text} {copy.footer.regulator}
        </p>
      </div>

      <div className="mt-8 border-t border-cal/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-cal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {prumo.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-cal/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={prumo.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-cal px-3 font-semibold text-ardosia transition-colors hover:bg-white"
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
