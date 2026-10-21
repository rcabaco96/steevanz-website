import { fabios } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { ArrowUpRightIcon, FacebookIcon, InstagramIcon, OwlIcon } from "./icons";

// Instagram, Facebook and Tripadvisor: links only (no ratings shown here, ever).
export function Social({ copy }: { copy: FabiosCopy }) {
  const { social } = copy;
  const cards = [
    { href: fabios.instagram, label: social.instagram, sub: fabios.instagramHandle, Icon: InstagramIcon, cls: "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_55%,#6228d7_100%)] text-cream" },
    { href: fabios.facebook, label: social.facebook, sub: "fabiosroadstop.fb", Icon: FacebookIcon, cls: "bg-sky-deep text-cream" },
    { href: fabios.tripadvisor, label: social.tripadvisor, sub: social.tripadvisorText, Icon: OwlIcon, cls: "bg-[#34e0a1] text-ink" },
  ];
  return (
    <section aria-labelledby="fr-social-title" className="relative overflow-hidden bg-cherry py-20 text-cream sm:py-28">
      <div aria-hidden="true" className="fr-checker absolute inset-x-0 top-0 h-4 [--s:16px] [--a:var(--color-cream)] [--b:var(--color-cherry)]" />
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <p className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-sun uppercase sm:text-sm">
          <span aria-hidden="true" className="h-0.5 w-10 bg-sun" />
          {social.eyebrow}
        </p>
        <h2 id="fr-social-title" className="max-w-3xl font-display text-[clamp(2.3rem,7vw,5rem)] leading-[0.95] uppercase">
          {social.title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3">
          {cards.map(({ href, label, sub, Icon, cls }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[var(--ease-diner)] hover:-translate-y-1.5 hover:-rotate-1 sm:min-h-[14rem] sm:p-8 ${cls}`}
              >
                <span className="flex items-start justify-between">
                  <Icon width={34} height={34} />
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-black/15 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRightIcon />
                  </span>
                </span>
                <span>
                  <span className="block font-display text-4xl uppercase sm:text-5xl">{label}</span>
                  <span className="mt-1 block text-sm font-semibold opacity-90 sm:text-base">{sub}</span>
                </span>
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
