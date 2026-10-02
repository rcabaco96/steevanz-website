import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { Logo } from "@/components/site/Logo";
import { ThemeScript } from "@/components/site/ThemeScript";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { rootViewport } from "@/lib/root-metadata";

export const metadata: Metadata = {
  title: { default: "Análise de reviews · Steevanz", template: "%s · Análise de reviews Steevanz" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = rootViewport;

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-soft">
        <ThemeScript />
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Logo href="/" label="Steevanz" />
              <span className="hidden rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text sm:inline">Reviews</span>
            </div>
            <ThemeToggle label="Mudar tema" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
