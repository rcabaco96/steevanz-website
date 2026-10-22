import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { InstagramIcon } from "./icons";
import { Badge } from "./Logo";

// The footer: the badge, the line, Instagram, the complaints book and the Steevanz credit.
export function Footer({ copy }: { copy: LoboCopy }) {
  const { footer } = copy;
  return (
    <footer className="border-t border-areia/10 bg-abismo text-areia">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <Badge className="w-20 shrink-0" ink="var(--color-areia)" label={copy.logoLabel} />
          <p className="max-w-xs text-areia/75">{footer.tagline}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end">
          <a href={lobo.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-coral">
            <InstagramIcon width={18} height={18} />
            {footer.follow} · {lobo.instagramHandle}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <a href={lobo.complaints} target="_blank" rel="noopener noreferrer" className="text-areia/70 hover:text-coral">
            {footer.complaints}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <p className="text-areia/50">
            © {lobo.name}. {footer.rights}{" "}
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="underline decoration-coral/60 underline-offset-4 hover:text-coral">
              {footer.credit}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
