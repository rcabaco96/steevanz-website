import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { QrCode } from "@/components/modules/shared/QrCode";
import { ScreenChime } from "@/components/public/waitlist/ScreenChime";
import { requestOrigin } from "@/lib/booking/request";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { estimateWait, formatWait } from "@/lib/modules/waitlist/eta";
import { currentSettings, loadQueue } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

/** Always dark (a TV at the door): the Steevanz accent of dark mode. */
const screenStyle = { "--brand": "#e39ac6", "--brand-text": "#1d0d1a" } as CSSProperties;

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Ecrã de chamada" };

/**
 * Call screen for a TV at the entrance, read from a distance: the last called number huge, the
 * others called recently, who is next, and the QR code to join. Ticket numbers only (no names).
 * Always dark, sized with the viewport so it fills any screen; refreshed every 5 s.
 */
export default async function WaitlistScreenPage({ params }: Props) {
  const { slug } = await params;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) notFound();
  const [bundle, origin] = await Promise.all([loadBundle(establishment), requestOrigin()]);
  const settings = await currentSettings(establishment, bundle);
  const queue = await loadQueue(establishment, settings);
  const words = kindWords[establishment.kind];
  const called = queue.live.filter((entry) => entry.status === "called").sort((a, b) => Date.parse(b.called_at ?? "") - Date.parse(a.called_at ?? ""));
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const [latest, ...earlier] = called;
  const minutes = estimateWait({
    ahead: waiting.map((entry) => ({
      serviceMinutes: settings.ask_service ? (bundle.services.find((item) => item.id === entry.service_id)?.duration_minutes ?? settings.avg_minutes) : null,
      staffId: entry.staff_id,
    })),
    avgMinutes: settings.avg_minutes,
    activeStaff: bundle.staff.filter((item) => item.active).length,
    recentCalls: queue.recentCalls,
    now: queue.now,
  });
  const time = new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(queue.now));
  const open = settings.state === "open";

  return (
    <div style={screenStyle} className="flex h-dvh flex-col overflow-hidden bg-[#120b14] text-white">
      <AutoRefresh intervalMs={5000} />

      <header className="flex items-center justify-between gap-6 px-[3vw] py-[2.2vh]">
        <p className="display truncate text-[clamp(1.5rem,2.6vw,3.2rem)] leading-none">{establishment.name}</p>
        <div className="flex shrink-0 items-center gap-[2vw]">
          <ScreenChime latestCall={latest ? `${latest.id}:${latest.called_at}` : null} />
          <p className="display text-[clamp(1.5rem,2.6vw,3.2rem)] leading-none tabular-nums text-white/85">{time}</p>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] gap-[2vw] px-[3vw] pb-[2vh]">
        {/* Who is called now */}
        <section aria-live="assertive" className="flex min-h-0 flex-col gap-[2vh]">
          {latest ? (
            <div className="flex min-h-0 flex-1 flex-col justify-center rounded-[2.4vw] bg-[var(--brand)] px-[4vw] py-[3vh] text-[var(--brand-text)]">
              <p className="text-[clamp(1.2rem,2.2vw,2.8rem)] font-semibold opacity-90">{words.callAction}</p>
              <p key={latest.id + (latest.called_at ?? "")} className="tv-call-in display origin-left text-[clamp(7rem,22vw,26rem)] leading-[0.85] tabular-nums">
                {latest.number}
              </p>
              <p className="mt-[1.5vh] text-[clamp(1.1rem,2vw,2.6rem)] opacity-90">{words.ready}</p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col justify-center rounded-[2.4vw] border-2 border-dashed border-white/15 px-[4vw] py-[3vh]">
              <p className="display text-[clamp(2rem,4.5vw,5.5rem)] leading-tight text-white/85">Ainda ninguém chamado</p>
              <p className="mt-[1.5vh] text-[clamp(1.1rem,1.8vw,2.2rem)] text-white/55">Quando for a sua vez, o seu número aparece aqui em grande.</p>
            </div>
          )}
          {earlier.length ? (
            <div className="flex items-center gap-[1.5vw]">
              <p className="shrink-0 text-[clamp(1rem,1.6vw,2rem)] text-white/60">Também chamados</p>
              <ul className="flex gap-[1vw] overflow-hidden">
                {earlier.slice(0, 6).map((entry) => (
                  <li key={entry.id} className="display rounded-[1vw] bg-white/10 px-[1.6vw] py-[0.6vh] text-[clamp(1.6rem,3.4vw,4rem)] leading-tight tabular-nums">
                    {entry.number}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* How to join */}
        <aside className="flex min-h-0 flex-col items-center justify-center gap-[2vh] rounded-[2.4vw] bg-white/[0.06] px-[2vw] py-[3vh] text-center">
          {open ? (
            <>
              <p className="display text-[clamp(1.4rem,2.6vw,3.2rem)] leading-tight">Entre na fila</p>
              <div className="rounded-[1.4vw] bg-white p-[1vw]">
                <QrCode value={`${origin}/fila/${establishment.slug}`} label="Código QR para entrar na fila" className="h-[min(30vh,18vw)] w-[min(30vh,18vw)]" />
              </div>
              <p className="text-[clamp(1rem,1.5vw,1.9rem)] text-white/70">Aponte a câmara do telemóvel. Avisamos quando for a sua vez.</p>
            </>
          ) : (
            <>
              <p className="display text-[clamp(1.6rem,3vw,3.6rem)] leading-tight">{settings.state === "paused" ? "Entradas em pausa" : "Fila fechada"}</p>
              <p className="text-[clamp(1rem,1.6vw,2rem)] text-white/65">
                {settings.state === "paused" ? "Voltamos a aceitar entradas daqui a pouco." : "Quem já está na fila continua a ser chamado."}
              </p>
            </>
          )}
          <div className="mt-[1vh] grid w-full grid-cols-2 gap-[1vw] border-t border-white/10 pt-[2vh]">
            <div>
              <p className="display text-[clamp(2rem,4vw,5rem)] leading-none tabular-nums">{waiting.length}</p>
              <p className="mt-[0.6vh] text-[clamp(0.9rem,1.3vw,1.6rem)] text-white/60">{waiting.length === 1 ? "pessoa à espera" : "pessoas à espera"}</p>
            </div>
            <div>
              <p className="display text-[clamp(1.6rem,3vw,3.8rem)] leading-none">{minutes ? formatWait(minutes).replace("cerca de ", "~ ") : "Sem espera"}</p>
              <p className="mt-[0.6vh] text-[clamp(0.9rem,1.3vw,1.6rem)] text-white/60">{minutes ? "espera estimada" : "é já a seguir"}</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Who is next */}
      <footer className="flex items-center gap-[2vw] border-t border-white/10 bg-white/[0.04] px-[3vw] py-[2.2vh]">
        <p className="shrink-0 text-[clamp(1.1rem,1.9vw,2.4rem)] font-semibold text-white/75">A seguir</p>
        {waiting.length ? (
          <ol className="flex min-w-0 gap-[1.2vw] overflow-hidden">
            {waiting.slice(0, 10).map((entry, index) => (
              <li
                key={entry.id}
                className={`display shrink-0 rounded-[1vw] px-[1.4vw] py-[0.5vh] text-[clamp(1.6rem,3vw,3.8rem)] leading-tight tabular-nums ${
                  index === 0 ? "bg-white text-[#120b14]" : "bg-white/10"
                }`}
              >
                {entry.number}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[clamp(1rem,1.7vw,2.1rem)] text-white/50">Ninguém à espera.</p>
        )}
      </footer>
    </div>
  );
}
