import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { KindIcon } from "./KindIcon";

/** The Steevanz accent as the pages' brand colour (follows light and dark mode). Never the business's own. */
export const brandStyle = { "--brand": "var(--accent)", "--brand-text": "var(--accent-contrast)" } as CSSProperties;

export const brandButton =
  "inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 text-base font-semibold text-[var(--brand-text)] shadow-[0_10px_24px_-14px_var(--brand)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]";

export const brandSecondaryButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line-strong bg-surface px-5 text-base font-semibold text-text transition-colors hover:bg-surface-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]";

export const publicInput =
  "block h-13 w-full rounded-2xl border border-line bg-surface-2/50 px-4 text-base text-text transition-[border-color,box-shadow,background-color] placeholder:text-subtle focus:border-[var(--brand)] focus:bg-surface focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--brand)_18%,transparent)]";

export const publicLabel = "flex flex-col gap-1.5 text-sm font-medium text-text";

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 opacity-80" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

/**
 * Page of an establishment for its customers: the shop's front in the Steevanz colour, with one quiet
 * detail of its kind (a restaurant's awning, a barber's pole, a pitch's lines…), one calm column
 * underneath, Steevanz only in small print. `service` names what the page is for.
 */
export function BrandFrame({ establishment, service, children }: { establishment: EstablishmentRow; service: string; children: ReactNode }) {
  return (
    <div style={brandStyle} className="flex min-h-dvh flex-col">
      <header className={`awning awning-${establishment.kind}`}>
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-6 pt-9 pb-9">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/12 px-3 py-1 text-sm font-medium">
            <KindIcon kind={establishment.kind} />
            {service}
          </span>
          <h1 className="display text-[2.35rem] leading-[1.02] text-balance">{establishment.name}</h1>
          {establishment.address ? (
            <p className="flex items-center gap-1.5 text-sm opacity-85">
              <PinIcon />
              {establishment.address}
            </p>
          ) : null}
        </div>
      </header>
      <main className="mx-auto mt-8 flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-10">{children}</main>
      <footer className="mx-auto flex w-full max-w-md flex-col items-center gap-1.5 px-5 pb-8 text-center text-xs text-subtle">
        {establishment.phone ? (
          <a href={`tel:${establishment.phone.replace(/\s+/g, "")}`} className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-muted hover:text-text">
            Ligar para {establishment.name}
          </a>
        ) : null}
        <p className="mt-2">
          Página criada com{" "}
          <Link href="/" className="font-semibold text-muted hover:text-text">
            Steevanz
          </Link>
        </p>
        <Link href="/privacidade" className="hover:text-text">
          Privacidade
        </Link>
      </footer>
    </div>
  );
}

export function PublicCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card flex flex-col gap-4 p-5 ${className}`}>{children}</section>;
}

/** Small figure with its label underneath (ticket and queue facts). */
export function Fact({ value, label, wide = false }: { value: ReactNode; label: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${wide ? "col-span-2" : ""}`}>
      <span className="display text-[1.9rem] leading-none tabular-nums text-text">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
