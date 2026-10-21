import Image from "next/image";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { FacebookIcon, InstagramIcon, OwlIcon } from "./icons";
import type { FabiosLinks } from "./links";
import { AddressLines, HoursTable } from "./Visit";

export function Footer({ copy, links }: { copy: FabiosCopy; links: FabiosLinks }) {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      <Image
        src={fabios.media.sign}
        alt=""
        width={fabiosImageSize.sign.width}
        height={fabiosImageSize.sign.height}
        sizes="320px"
        className="pointer-events-none absolute right-[-3rem] bottom-[-7rem] hidden w-80 rotate-[8deg] opacity-[0.18] xl:block"
      />
      <div aria-hidden="true" className="fr-checker h-4 [--s:16px] [--a:var(--color-cream)] [--b:var(--color-night)]" />
      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 pt-16 pb-10 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Image
            src={fabios.media.logo}
            alt={copy.logoAlt}
            width={fabiosImageSize.logo.width}
            height={fabiosImageSize.logo.height}
            sizes="176px"
            className="h-auto w-40 sm:w-44"
          />
          <p className="mt-5 max-w-xs text-cream/75">{copy.footer.tagline}</p>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl tracking-wide text-sun uppercase">{copy.visit.addressLabel}</h2>
          <address className="leading-relaxed text-cream/85 not-italic">
            <AddressLines />
          </address>
          <p className="mt-4">
            <a href={fabios.phoneHref} className="font-display text-2xl tracking-wide hover:text-sun">
              {fabios.phoneDisplay}
            </a>
            <span className="block text-xs text-cream/60">{copy.visit.phoneNote}</span>
          </p>
          <a href={`mailto:${fabios.email}`} className="mt-2 inline-block text-cream/85 underline decoration-cream/30 underline-offset-4 hover:text-sun">
            {fabios.email}
          </a>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl tracking-wide text-sun uppercase">{copy.visit.hoursLabel}</h2>
          <div className="text-cream/85">
            <HoursTable copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl tracking-wide text-sun uppercase">{copy.footer.follow}</h2>
          <ul className="flex gap-2">
            {[
              { href: fabios.instagram, label: copy.social.instagram, Icon: InstagramIcon },
              { href: fabios.facebook, label: copy.social.facebook, Icon: FacebookIcon },
              { href: fabios.tripadvisor, label: copy.social.tripadvisor, Icon: OwlIcon },
            ].map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-cream/25 transition-colors hover:bg-cream hover:text-night"
                >
                  <Icon />
                  <span className="sr-only">
                    {label} {copy.newTab}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid gap-2 text-cream/85">
            <li>
              <a href={links.menu} className="hover:text-sun">
                {copy.footer.menu}
              </a>
            </li>
            <li>
              <a href={links.about} className="hover:text-sun">
                {copy.nav.about}
              </a>
            </li>
            <li>
              <a href={links.contact} className="hover:text-sun">
                {copy.nav.contact}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-4 py-6 text-sm text-cream/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {fabios.name}. {copy.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={fabios.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-cream px-3 py-1.5 font-semibold text-night transition-colors hover:bg-sun"
            >
              {copy.footer.complaints}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="hover:text-cream">
              {copy.footer.credit}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
