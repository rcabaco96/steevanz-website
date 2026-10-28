import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro, ponteiroWhatsappHref } from "@/content/ponteiro/facts";
import { Logo } from "./Logo";
import { HoursList } from "./Visit";

export function Footer({ copy }: { copy: PonteiroCopy }) {
  const year = 2026;
  const link = "text-sm text-papel/85 underline decoration-papel/30 underline-offset-4 hover:decoration-papel";
  return (
    <footer className="pn-on-dark relative overflow-hidden bg-noite text-papel">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-16 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo label={copy.logoLabel} className="text-[1.15rem] text-papel" markClassName="h-11 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-papel/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="pn-label mb-4 text-gema">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-papel/85 not-italic">
            {ponteiro.street}
            <br />
            {ponteiro.postalCode} {ponteiro.locality}
          </address>
          <a href={ponteiro.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-10 items-center ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="pn-label mb-4 text-gema">{copy.footer.hours}</h2>
          <div className="text-sm text-papel/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="pn-label mb-4 text-gema">{copy.footer.contacts}</h2>
          <p>
            <a href={ponteiro.phoneHref} className="font-display text-2xl whitespace-nowrap hover:text-gema">
              {ponteiro.phoneDisplay}
            </a>
            <span className="block text-xs text-papel/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={ponteiroWhatsappHref()} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center ${link}`}>
              WhatsApp · {ponteiro.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-noite-2 px-5 py-4 text-sm leading-relaxed text-papel/75">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-papel/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-papel/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {ponteiro.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-papel/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={ponteiro.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-papel px-3 font-semibold text-noite transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-papel">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
