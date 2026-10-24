import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./orve.css";
import { orveFontVariables } from "@/components/clients/orve/fonts";
import { orveViewport } from "@/components/clients/orve/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/orve/preloader-gate";
import { orveHtmlLang, resolveOrvePath } from "@/content/orve/routes";

// Root layout of Orvé's website — a FICTIONAL beauty atelier, Steevanz's showcase site for beauty and aesthetics
// businesses (owner, 2026-10-23). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button,
// analytics or metadata. Preview at /orve, /orve/en, /orve/es, /orve/fr, /orve/de, /orve/it (out of search engines);
// <html lang> follows the page's language.
export const viewport: Viewport = orveViewport;

type Params = Promise<{ path?: string[] }>;

export default async function OrveLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveOrvePath((await params).path)?.locale ?? "pt";
  return (
    <html lang={orveHtmlLang[locale]} className={orveFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderGateScript }} />
        <noscript>
          <style>{preloaderNoscriptStyle}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
