import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { brandStyle } from "@/components/public/BrandFrame";
import { kindWords } from "@/lib/establishments/kinds";
import { ensureWaitlistSettings, loadQueue } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Ecrã de chamada" };

/** Call screen for a TV at the entrance: ticket numbers only (no names), refreshed every 5 s. */
export default async function WaitlistScreenPage({ params }: Props) {
  const { slug } = await params;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) notFound();
  const [settings, queue] = await Promise.all([ensureWaitlistSettings(establishment), loadQueue(establishment)]);
  const called = queue.live.filter((entry) => entry.status === "called").sort((a, b) => Date.parse(b.called_at ?? "") - Date.parse(a.called_at ?? ""));
  const next = queue.live.filter((entry) => entry.status === "waiting").slice(0, 8);
  const words = kindWords[establishment.kind];

  return (
    <div style={brandStyle(establishment)} className="flex min-h-dvh flex-col bg-[#140c16] text-white">
      <AutoRefresh intervalMs={5000} />
      <header className="flex items-center justify-between bg-[var(--brand)] px-8 py-5 text-[var(--brand-text)]">
        <p className="display text-3xl">{establishment.name}</p>
        <p className="text-lg font-semibold opacity-80">{settings.state === "open" ? "Lista de espera" : "Fila fechada"}</p>
      </header>
      <main className="grid flex-1 gap-8 p-8 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="chamados" className="flex flex-col gap-4">
          <h1 id="chamados" className="text-2xl font-semibold tracking-[0.08em] text-white/70 uppercase">
            {words.callAction}
          </h1>
          {called.length ? (
            <ul className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {called.map((entry, index) => (
                <li
                  key={entry.id}
                  className={`grid place-items-center rounded-3xl py-8 ${index === 0 ? "bg-[var(--brand)] text-[var(--brand-text)]" : "bg-white/10"}`}
                >
                  <span className="display text-[6rem] leading-none tabular-nums">{entry.number}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-2xl text-white/50">Ninguém chamado neste momento.</p>
          )}
        </section>
        <section aria-labelledby="proximos" className="flex flex-col gap-4">
          <h2 id="proximos" className="text-2xl font-semibold tracking-[0.08em] text-white/70 uppercase">
            A seguir
          </h2>
          {next.length ? (
            <ol className="grid grid-cols-4 gap-3">
              {next.map((entry) => (
                <li key={entry.id} className="grid place-items-center rounded-2xl bg-white/10 py-4">
                  <span className="display text-4xl tabular-nums">{entry.number}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xl text-white/50">Fila vazia.</p>
          )}
        </section>
      </main>
      <footer className="px-8 pb-6 text-white/50">Entre na fila pelo QR code à entrada · o seu número aparece aqui quando for a sua vez.</footer>
    </div>
  );
}
