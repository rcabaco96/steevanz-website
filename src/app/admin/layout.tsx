import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { ThemeScript } from "@/components/site/ThemeScript";
import { rootViewport } from "@/lib/root-metadata";

export const metadata: Metadata = {
  title: { default: "Painel · Steevanz", template: "%s · Painel Steevanz" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = rootViewport;

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-soft">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
