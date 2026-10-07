import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { ThemeScript } from "@/components/site/ThemeScript";
import { rootViewport } from "@/lib/root-metadata";

// Pages the customers of our clients open from a QR code, an NFC plate or a link:
// /fila (waitlist), /cartao (loyalty card) and /reservar (bookings). No account, no app.
export const metadata: Metadata = {
  title: { default: "Steevanz", template: "%s" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = rootViewport;

export default function PublicModulesLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-soft">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
