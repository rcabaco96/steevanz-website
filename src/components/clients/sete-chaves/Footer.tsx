import { steevanzLinks, type SeteChavesCopy } from "@/content/sete-chaves/copy";
import {
  seteChaves,
  seteChavesMailHref,
  seteChavesWhatsappHref,
} from "@/content/sete-chaves/facts";
import { Wordmark } from "./Logo";

export function Footer({ copy }: { copy: SeteChavesCopy }) {
  const year = 2026;
  const link =
    "text-sm text-cal/85 underline decoration-cal/30 underline-offset-4 hover:decoration-cal";
  return (
    <footer className="sc-on-dark relative overflow-hidden bg-xisto text-cal">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Wordmark tone="light" line={copy.logoLine} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cal/70">
            {copy.footer.tagline}
          </p>
        </div>

        <div>
          <h2 className="sc-label mb-4 text-latao-claro">
            {copy.footer.visit}
          </h2>
          <address className="text-sm leading-relaxed text-cal/85 not-italic">
            {seteChaves.street}
            <br />
            {seteChaves.place}, {seteChaves.postalCode} {seteChaves.locality}
          </address>
          <p className="mt-1 text-xs text-cal/55">{copy.contact.addressNote}</p>
          <a
            href={seteChaves.directions}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-flex min-h-10 items-center ${link}`}
          >
            {copy.contact.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="sc-label mb-4 text-latao-claro">{copy.footer.stay}</h2>
          <dl className="grid gap-1.5 text-sm text-cal/85">
            <div className="flex justify-between gap-6 border-b border-cal/10 pb-1.5">
              <dt>Check-in</dt>
              <dd className="tabular-nums">
                {seteChaves.checkIn.from}–{seteChaves.checkIn.to}
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-cal/10 pb-1.5">
              <dt>Check-out</dt>
              <dd className="tabular-nums">{seteChaves.checkOut}</dd>
            </div>
            <div className="flex justify-between gap-6 pb-1.5">
              <dt>{copy.rules.items[2].label}</dt>
              <dd className="tabular-nums">
                {seteChaves.quiet.from}–{seteChaves.quiet.to}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="sc-label mb-4 text-latao-claro">
            {copy.footer.contacts}
          </h2>
          <p>
            <a
              href={seteChaves.phoneHref}
              className="font-display text-[1.45rem] whitespace-nowrap hover:text-latao-claro"
            >
              {seteChaves.phoneDisplay}
            </a>
          </p>
          <p className="mt-2 flex flex-col items-start">
            <a
              href={seteChavesWhatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-10 items-center ${link}`}
            >
              WhatsApp
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a
              href={seteChavesMailHref()}
              className={`inline-flex min-h-10 items-center break-all ${link}`}
            >
              {seteChaves.email}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-xisto-2 px-5 py-4 text-sm leading-relaxed text-cal/75">
          {copy.footer.fictional}
        </p>
      </div>

      <div className="mt-8 border-t border-cal/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-cal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {seteChaves.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-cal/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={seteChaves.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-cal px-3 font-medium text-xisto transition-colors hover:bg-white"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a
              href={steevanzLinks.site}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-10 items-center hover:text-cal"
            >
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
