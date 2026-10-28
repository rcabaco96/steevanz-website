import type { MeadaCopy } from "@/content/meada/copy";
import { meada, meadaWhatsappHref } from "@/content/meada/facts";
import { Logo } from "./Logo";
import { HoursList } from "./Visit";

export function Footer({ copy }: { copy: MeadaCopy }) {
  const year = 2026;
  const link = "text-sm text-algodao/85 underline decoration-algodao/30 underline-offset-4 hover:decoration-algodao";
  return (
    <footer className="md-on-dark relative overflow-hidden bg-grafite text-algodao">
      <div className="md-stitch md-stitch-light opacity-60" />
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo id="md-mark-footer" label={copy.logoLabel} thread="var(--color-fio)" className="w-40 text-algodao sm:w-48" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-algodao/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="md-label mb-4 text-kraft">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-algodao/85 not-italic">
            {meada.street}
            <br />
            {meada.postalCode} {meada.locality}
          </address>
          <a href={meada.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="md-label mb-4 text-kraft">{copy.footer.hours}</h2>
          <div className="text-sm text-algodao/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="md-label mb-4 text-kraft">{copy.footer.contacts}</h2>
          <p>
            <a href={meada.phoneHref} className="font-mono text-xl whitespace-nowrap hover:text-kraft">
              {meada.phoneDisplay}
            </a>
            <span className="block text-xs text-algodao/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={meadaWhatsappHref()} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp · {meada.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-grafite-2 px-5 py-4 text-sm leading-relaxed text-algodao/75">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-dashed border-algodao/15">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-algodao/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {meada.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-algodao/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={meada.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-algodao px-3 font-medium text-tinta transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-algodao">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
