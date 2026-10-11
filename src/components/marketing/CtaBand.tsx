import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

interface CtaBandProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

// Colours set inline (2026-10-11): the arbitrary `text-[#f7f1e8]` class was missing from the built CSS,
// so the title, text and WhatsApp button showed in the box's own dark colour.
const light = "#f7f1e8";

export function CtaBand({ eyebrow, title, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="py-16 sm:py-24">
      <div className="container-page">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[2rem] px-6 py-14 sm:px-14 sm:py-20"
          style={{ backgroundColor: "#1d1220", color: light }}
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(227,154,198,0.35),transparent_65%),radial-gradient(50%_70%_at_0%_100%,rgba(233,198,133,0.25),transparent_60%)]" />
          <div aria-hidden="true" className="absolute -right-24 -bottom-24 -z-10 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-10 -bottom-10 -z-10 h-52 w-52 rounded-full border border-white/10" />
          <p className="font-mono text-xs tracking-[0.16em] text-[#e9c685] uppercase">{eyebrow}</p>
          <h2 id="cta-title" className="display mt-4 max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(247, 241, 232, 0.8)" }}>
            {body}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryHref} size="lg" className="bg-[#e9c685]! text-[#1d1220]! hover:bg-[#f1d59f]!">
              {primaryLabel}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </ButtonLink>
            {secondaryLabel && secondaryHref ? (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/25 px-7 font-semibold transition-colors hover:bg-white/10"
                style={{ color: light }}
              >
                <WhatsAppIcon size={18} />
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
