import type { RoazCopy } from "@/content/roaz/copy";
import { roaz, roazWhatsappHref } from "@/content/roaz/facts";
import { HoursList } from "./Booking";
import { Logo } from "./Logo";
import { roazSections } from "./sections";

export function Footer({ copy }: { copy: RoazCopy }) {
  const year = 2026;
  const link = "text-sm text-sal/85 underline decoration-sal/30 underline-offset-4 hover:decoration-sal";
  const pageLinks = [
    { id: roazSections.tours, label: copy.nav.tours },
    { id: roazSections.coast, label: copy.nav.coast },
    { id: roazSections.waitlist, label: copy.waitlist.eyebrow },
    { id: roazSections.aboard, label: copy.nav.aboard },
    { id: roazSections.book, label: copy.nav.book },
    { id: roazSections.faq, label: copy.nav.faq },
  ];
  return (
    <footer className="rz-on-dark relative overflow-hidden bg-fundo text-sal">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo label={copy.logoLabel} line={copy.tagline} className="w-44 items-start text-sal sm:w-52" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-sal/70">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="rz-label mb-4 text-falesia">{copy.visit.meetingLabel}</h2>
          <address className="text-sm leading-relaxed text-sal/85 not-italic">
            {roaz.meetingPoint}
            <br />
            {roaz.street}
            <br />
            {roaz.postalCode} {roaz.locality} · {roaz.region}
          </address>
          <a href={roaz.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${link}`}>
            {copy.visit.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <h2 className="rz-label mt-8 mb-4 text-falesia">{copy.footer.hours}</h2>
          <div className="text-sm">
            <HoursList dark />
          </div>
        </div>

        <div>
          <h2 className="rz-label mb-4 text-falesia">{copy.footer.contacts}</h2>
          <p>
            <a href={roaz.phoneHref} className="font-stencil text-2xl font-bold whitespace-nowrap hover:text-falesia">
              {roaz.phoneDisplay}
            </a>
            <span className="block text-xs text-sal/60">{copy.visit.phoneNote}</span>
          </p>
          <p className="mt-3">
            <a href={roazWhatsappHref()} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp · {roaz.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
          <p className="mt-3 text-sm text-sal/85">{roaz.email}</p>
        </div>

        <nav aria-label={copy.footer.links}>
          <h2 className="rz-label mb-4 text-falesia">{copy.footer.links}</h2>
          <ul className="grid gap-1">
            {pageLinks.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-10 items-center font-display text-lg font-semibold uppercase hover:text-falesia">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-fundo-2 px-5 py-4 text-sm leading-relaxed text-sal/80">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-sal/10">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-6 text-sm text-sal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {roaz.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-sal/50">
              {copy.footer.licence} · {copy.footer.credits}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={roaz.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-sal px-3 font-medium text-fundo transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-sal">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
