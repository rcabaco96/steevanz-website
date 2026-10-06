import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";
import { ThemeScript } from "@/components/site/ThemeScript";

export const metadata: Metadata = {
  title: "Página não encontrada · Page not found | Steevanz",
  description: "A página que procura não existe. The page you are looking for does not exist.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-PT" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeScript />
        <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 py-20">
          <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
          <div className="flex max-w-xl flex-col items-center gap-6 text-center">
            <p className="eyebrow">Erro 404</p>
            <h1 className="display text-5xl sm:text-6xl">Esta placa não leva a lado nenhum.</h1>
            <p className="text-lg text-muted">
              A página que procura não existe ou mudou de sítio. Volte ao início ou fale connosco.
            </p>
            <p lang="en" className="text-sm text-subtle">
              This page doesn&apos;t exist or has moved. Head back home or get in touch.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-full bg-accent px-6 font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
              >
                Ir para o início
              </Link>
              <Link
                href="/en"
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 font-semibold text-text transition-colors hover:bg-surface-2"
              >
                English homepage
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
