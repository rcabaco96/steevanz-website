import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda, platibandaWhatsappHref } from "@/content/platibanda/facts";
import { HoursList } from "./Contact";
import { facadePath } from "./facade";
import { Logo } from "./Logo";

/** A row of house fronts of different sizes along the top of the footer (left edge, width, height), with doors. */
const doorColours = ["var(--color-ocre)", "var(--color-telha)", "var(--color-anil)"];
const skyline = [0, 1, 2, 3, 4, 5, 6, 7].reduce<{ left: number; w: number; h: number }[]>((acc, i) => {
  const prev = acc.at(-1);
  const left = prev ? prev.left + prev.w + 8 : 0;
  return [...acc, { left, w: 120 + ((i * 37) % 60), h: 70 + ((i * 53) % 50) }];
}, []);

// The footer: a row of house fronts along the top edge, then the agency's details, the AMI licence placeholder (a
// real agency must show its own number; never invented here), the fictional-business note and «Site por Steevanz».
export function Footer({ copy }: { copy: PlatibandaCopy }) {
  const year = 2026;
  const link = "text-sm text-cal/85 underline decoration-cal/30 underline-offset-4 hover:decoration-cal";
  return (
    <footer className="pb-on-dark relative overflow-hidden bg-ria text-cal">
      <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" className="block h-16 w-full bg-cal sm:h-24">
        {skyline.map(({ left, w, h }, i) => (
          <g key={i}>
            <path d={facadePath(left, 120 - h, left + w, 121)} fill="var(--color-ria-2)" />
            <rect x={left + w / 2 - 10} y={120 - h * 0.34} width="20" height={h * 0.34} fill={doorColours[i % 3]} />
          </g>
        ))}
      </svg>
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pt-16 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Logo onDark emblemClassName="w-11" tagline={copy.logoTagline} className="text-[1.15rem]" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cal/70">{copy.footer.tagline}</p>
          <p className="mt-4 inline-block rounded-md bg-ria-2 px-3 py-1.5 text-xs text-cal/80">{platibanda.ami}</p>
        </div>

        <div>
          <h2 className="pb-label mb-4 text-ocre">{copy.contact.addressLabel}</h2>
          <address className="text-sm leading-relaxed text-cal/85 not-italic">
            {platibanda.street}
            <br />
            {platibanda.postalCode} {platibanda.locality}
          </address>
          <a href={platibanda.directions} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-10 items-center ${link}`}>
            {copy.contact.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </div>

        <div>
          <h2 className="pb-label mb-4 text-ocre">{copy.footer.hours}</h2>
          <div className="text-sm text-cal/85">
            <HoursList copy={copy} dark />
          </div>
        </div>

        <div>
          <h2 className="pb-label mb-4 text-ocre">{copy.footer.contacts}</h2>
          <p>
            <a href={platibanda.phoneHref} className="font-display text-2xl whitespace-nowrap hover:text-ocre">
              {platibanda.phoneDisplay}
            </a>
          </p>
          <p className="mt-3">
            <a href={platibandaWhatsappHref()} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center ${link}`}>
              WhatsApp · {platibanda.whatsappDisplay}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${platibanda.email}`} className={`inline-flex min-h-10 items-center ${link}`}>
              {platibanda.email}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="rounded-2xl bg-ria-2 px-5 py-4 text-sm leading-relaxed text-cal/78">{copy.footer.fictional}</p>
      </div>

      <div className="mt-8 border-t border-cal/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-5 py-6 text-sm text-cal/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {platibanda.name}. {copy.footer.rights}
            </p>
            <p className="mt-1 text-xs text-cal/50">{copy.footer.credits}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={platibanda.complaints}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-md bg-cal px-3 font-semibold text-ria transition-colors hover:bg-white"
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
