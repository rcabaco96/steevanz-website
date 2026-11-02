import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./grob.css";
import { grobFontVariables } from "@/components/clients/grob/fonts";
import { grobViewport } from "@/components/clients/grob/metadata";
import { grobHeadScript } from "@/components/clients/grob/head-script";

// O layout raiz do site do GROB: o <html> do clube, as suas letras e a sua folha de estilos. Sem cabeçalho, rodapé,
// botão de WhatsApp, estatísticas ou metadados da Steevanz. Pré-visualização em /grob (fora dos motores de busca);
// domínio próprio mais tarde, pelo proxy (src/lib/client-sites.ts).
export const viewport: Viewport = grobViewport;

export default function GrobLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={grobFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: grobHeadScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
