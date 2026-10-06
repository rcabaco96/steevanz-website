import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { PanelTabs } from "@/components/reviews/PanelTabs";
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

/**
 * `googleBadge` and `googleBar` are parallel-route slots (src/app/painel/@googleBadge, @googleBar):
 * this root layout can't read the [slug] param, the slots can. They render the customer's Google
 * Business Profile status inside the sticky header: a "Google ligado" badge next to the theme
 * toggle, or a bar under the header encouraging the customer to connect (always on screen).
 */
export default function DashboardRootLayout({ children, googleBadge, googleBar }: LayoutProps<"/painel">) {
  return (
    // The connect bar makes the sticky header taller: anchors scroll a bit further down.
    <html lang="pt-PT" className={`${fontVariables} has-[[data-google-bar]]:scroll-pt-36`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-soft">
        <ThemeScript />
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
          {/* Phones: logo mark · switcher filling the middle · theme. From sm: a true three-column bar with the switcher centred. */}
          <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 min-[360px]:gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Logo href="/" label="Steevanz" className="max-sm:[&>span]:hidden" />
              <span className="hidden rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text lg:inline">Reviews</span>
            </div>
            <PanelTabs className="w-full max-w-xs justify-self-center sm:w-auto sm:max-w-none" />
            <div className="col-start-3 flex items-center justify-end gap-0.5 max-sm:-mr-1.5 sm:gap-2">
              {googleBadge}
              <ThemeToggle label="Mudar tema" />
            </div>
          </div>
          {googleBar}
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
