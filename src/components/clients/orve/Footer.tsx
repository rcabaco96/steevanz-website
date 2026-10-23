import type { OrveCopy } from "@/content/orve/copy";
import { orve, orveWhatsappHref } from "@/content/orve/facts";
import { HoursList } from "./Booking";
import { Logo } from "./Logo";

export function Footer({ copy }: { copy: OrveCopy }) {
  const year = 2026;
  const link = "text-sm text-nacar/85 underline decoration-nacar/30 underline-offset-4 hover:decoration-nacar";
  return (
    <footer className="or-on-dark relative overflow-hidden bg-cacau text-nacar">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo id="or-mark-footer" label={copy.logoLabel} accent="var(--color-argila)" className="w-40 items-start text-nacar sm:w-48" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-nacar/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="or-label mb-4 text-argila">{copy.visit.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-nacar/85 not-italic">
            {orve.street}
            <br />
            {orve.postalCode} {orve.locality}
          </address>
          <a href={orve.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="or-label mb-4 text-argila">{copy.footer.hours}</h2>
          <div className="text-sm text-nacar/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="or-label mb-4 text-argila">{copy.footer.contacts}</h2>
          <p>
            <a href={orve.phoneHref} className="font-display text-2xl whitespace-nowrap hover:text-argila">
              {orve.phoneDisplay}
            </a>
            <span className="block text-xs text-nacar/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={orveWhatsappHref()} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp · {orve.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-cacau-2 px-5 py-4 text-sm leading-relaxed text-nacar/75">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-nacar/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-nacar/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {orve.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-nacar/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={orve.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-nacar px-3 font-medium text-cacau transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-nacar">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
