import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { readableTextOn } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";

/** Brand colour of the establishment as CSS variables, for buttons and highlights on its pages. */
export function brandStyle(establishment: EstablishmentRow): CSSProperties {
  return { "--brand": establishment.accent_color, "--brand-text": readableTextOn(establishment.accent_color) } as CSSProperties;
}

export const brandButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 text-base font-semibold text-[var(--brand-text)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

export const brandSecondaryButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-5 text-base font-semibold text-text transition-colors hover:bg-surface-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

export const publicInput =
  "block h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-base text-text transition-[border-color,box-shadow] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--brand)_20%,transparent)]";

export const publicLabel = "flex flex-col gap-1.5 text-sm font-medium text-muted";

/** Page of an establishment for its customers: brand header, one column, Steevanz in small print. */
export function BrandFrame({ establishment, eyebrow, children }: { establishment: EstablishmentRow; eyebrow: string; children: ReactNode }) {
  return (
    <div style={brandStyle(establishment)} className="flex min-h-dvh flex-col">
      <header className="bg-[var(--brand)] text-[var(--brand-text)]">
        <div className="mx-auto w-full max-w-md px-5 pt-8 pb-7">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase opacity-80">{eyebrow}</p>
          <p className="display mt-1 text-[2rem] leading-tight">{establishment.name}</p>
          {establishment.address ? <p className="mt-1 text-sm opacity-80">{establishment.address}</p> : null}
        </div>
      </header>
      <main className="mx-auto -mt-3 flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-10">{children}</main>
      <footer className="mx-auto w-full max-w-md px-5 pb-8 text-center text-xs text-subtle">
        {establishment.phone ? (
          <p className="mb-2">
            Dúvidas? <a href={`tel:${establishment.phone.replace(/\s+/g, "")}`} className="font-semibold text-muted underline-offset-2 hover:underline">{establishment.phone}</a>
          </p>
        ) : null}
        <p>
          Serviço{" "}
          <Link href="/" className="font-semibold text-muted hover:text-text">
            Steevanz
          </Link>{" "}
          ·{" "}
          <Link href="/privacidade" className="hover:text-text">
            Privacidade
          </Link>
        </p>
      </footer>
    </div>
  );
}

export function PublicCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card flex flex-col gap-4 p-5 ${className}`}>{children}</section>;
}
