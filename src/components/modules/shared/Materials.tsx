import { steevanzColors } from "@/lib/brand";
import type { ReactNode } from "react";
import { Panel } from "@/components/backoffice/ui";
import { CopyButton, PrintButton } from "./CopyButton";
import { QrCode } from "./QrCode";

/** The public link of a module page, its QR code to print and where to share it. */
export async function Materials({
  title,
  url,
  poster,
  hint,
  extra,
}: {
  title: string;
  url: string;
  /** Big line on the printable poster ("Mesa ocupada? Entre na fila"). */
  poster: { heading: string; sub: string; name: string };
  hint: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Panel title={title} className="print:hidden">
        <p className="-mt-2 mb-4 text-sm text-muted">{hint}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={url} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface-2/60 px-3 py-2.5 text-sm font-medium text-accent-text hover:underline">
            {url}
          </a>
          <div className="flex gap-2">
            <CopyButton value={url} />
            <PrintButton label="Imprimir cartaz" />
          </div>
        </div>
        {extra}
      </Panel>
      {/* Printable poster: only this block prints (print rule for [data-print-poster] in globals.css). */}
      <section data-print-poster aria-label="Cartaz para imprimir" className="mx-auto flex w-full max-w-md flex-col items-center gap-5 overflow-hidden rounded-3xl border border-line bg-white p-0 text-center shadow-sm print:max-w-none print:border-0 print:shadow-none">
        <div className="w-full px-6 py-6" style={{ backgroundColor: steevanzColors.accent, color: steevanzColors.accentText }}>
          <p className="text-sm font-semibold tracking-[0.12em] uppercase opacity-80">{poster.name}</p>
          <p className="display mt-1 text-3xl leading-tight">{poster.heading}</p>
        </div>
        <QrCode value={url} label={`Código QR para ${url}`} className="h-56 w-56" />
        <p className="px-6 pb-6 text-base text-[#1d1220]">{poster.sub}</p>
      </section>
    </div>
  );
}
