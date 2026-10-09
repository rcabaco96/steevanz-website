"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GoogleG } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { formatDate } from "@/lib/reviews/format";
import { duration, finishedJob, fullImportProgress, isActive, relativeTime, type ImportResponse } from "@/lib/reviews/import-jobs";
import { useBusySignal } from "./DashboardBusy";
import { InfoTip } from "./InfoTip";
import { LeitorStatus, readerTexts } from "./LeitorStatus";
import { useReaderJobs, useReaderJobsListener } from "./ReaderJobs";

const number = new Intl.NumberFormat("pt-PT");
const decimal = new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * "Histórico completo": the panel queues a full import, the Steevanz reader on a local computer reads
 * every review from Google Maps and reports its progress, shown here as it runs.
 */
export function HistoryImport({ slug, googleConnect = null }: { slug: string; googleConnect?: { href: string; external: boolean } | null }) {
  const router = useRouter();
  const { state, now, apply } = useReaderJobs();
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const job = state.full;
  const active = isActive(job);
  const { stored, reader } = state;
  const progress = fullImportProgress(job, stored);

  // When an import finishes, the dashboard reloads its data (with skeletons on the data blocks); while the
  // competitors are being read, every 5 places and at the end, so the comparison table fills up.
  useReaderJobsListener((previous, next) => {
    if (finishedJob(previous, next, "full")?.status === "done") startRefresh(() => router.refresh());
    const before = previous.competition;
    const after = next.competition;
    // First numbers, every 5 places, and the end.
    if (after && (!before || after.read > before.read) && (!before || before.read === 0 || after.pending === 0 || Math.floor(after.read / 5) > Math.floor(before.read / 5))) startRefresh(() => router.refresh());
  });
  const competition = state.competition;
  // The reader's competitor search runs next to the first import (another tab).
  const searching = isActive(state.discover) && competition === null;
  const searchFailed = state.discover?.status === "failed" && competition === null ? state.discover.error : null;
  useBusySignal("sync", refreshing);

  async function start() {
    setStarting(true);
    setError(null);
    try {
      const response = await fetch(`/api/painel/${encodeURIComponent(slug)}/import`, { method: "POST", cache: "no-store" });
      const body = (await response.json()) as ImportResponse;
      if ("error" in body) setError(body.error);
      else apply(body);
    } catch {
      setError("Sem ligação. Tente novamente.");
    } finally {
      setStarting(false);
    }
  }

  const saved = progress.total !== null ? `${number.format(progress.done)} de ${number.format(progress.total)} reviews guardadas` : `${number.format(progress.done)} reviews guardadas`;
  const elapsed = job?.startedAt && now ? Math.max(0, Math.round(((job.finishedAt ? Date.parse(job.finishedAt) : now) - Date.parse(job.startedAt)) / 1000)) : null;

  // Figures: what the running import has read, or what we already have (idle, queued).
  let figures = stored.count ? saved : "Ainda não há reviews importadas para este negócio.";
  let detail: string | null = stored.newestAt ? `A mais recente é de ${formatDate(stored.newestAt)}.` : null;
  if (job?.status === "running" && progress.total === null) {
    figures = "A abrir o Google Maps…";
    detail = `${number.format(job.reviewsDone)} reviews lidas`;
  } else if (job?.status === "running") {
    figures = saved;
    detail = progress.left ? `Faltam ~${number.format(progress.left)} ${progress.left === 1 ? "review" : "reviews"}${progress.secondsLeft !== null ? ` (~${duration(progress.secondsLeft)})` : ""}.` : "A terminar…";
  } else if (job?.status === "queued") {
    figures = saved;
    detail = progress.secondsLeft !== null ? `A importação deve demorar ~${duration(progress.secondsLeft)}.` : null;
  }

  // The last import finished with only part of the history (Google shows a visitor without a session only some reviews).
  const partial = job?.status === "done" && job.reviewsExpected !== null && job.reviewsDone < job.reviewsExpected * 0.98;

  // What the reader is doing with this customer's full import.
  let status: string | null = null;
  if (job?.status === "queued")
    status = !reader.online
      ? "O leitor está desligado: o pedido fica em espera."
      : reader.busy
        ? "O leitor está a terminar outro pedido; esta importação vem a seguir."
        : "Pedido recebido. O leitor vai começar…";
  else if (job?.status === "done")
    status = `Última importação completa${job.finishedAt && now ? ` ${relativeTime(job.finishedAt, now)}` : ""}: ${number.format(job.reviewsDone)} reviews${elapsed !== null ? ` em ${duration(elapsed)}` : ""}.${job.error ? ` ${job.error}` : ""}`;
  else if (job?.status === "failed") status = `A última importação falhou. ${job.error ?? "Tente outra vez."}`;
  else if (!job && stored.count) status = "Ainda não foi feita uma importação completa.";

  return (
    <section aria-labelledby="historico-title" className="card flex flex-col gap-3 p-4 sm:p-5" aria-busy={active || undefined}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="historico-title" className="flex items-center gap-1.5 font-semibold text-text">
          Histórico completo
          <InfoTip label="Histórico completo">
            O leitor da Steevanz lê no Google Maps as reviews do negócio, das mais recentes para as mais antigas. Sem sessão iniciada, o Google só mostra
            parte do histórico; com o Perfil de Empresa Google ligado, chegam todas. Guarda nota, texto, data e resposta do dono; nunca o nome nem o perfil
            de quem escreveu. As reviews que já temos são atualizadas, nunca duplicadas. Na primeira importação procura também os concorrentes da zona e
            lê a nota, o total e as estrelas de cada um.
          </InfoTip>
        </h2>
        <LeitorStatus />
      </div>

      <div className="flex flex-col gap-2">
        {active || (progress.ratio !== null && stored.count > 0) ? (
          <div
            role="progressbar"
            aria-label={active ? "Progresso da importação" : "Reviews guardadas"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.ratio !== null ? Math.round(progress.ratio * 100) : undefined}
            className="relative h-3 overflow-hidden rounded-full bg-surface-2"
          >
            {progress.ratio !== null && !(job?.status === "running" && job.reviewsDone === 0) ? (
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${active ? "bg-accent" : "bg-success/70"}`}
                style={{ width: `${Math.max(2, progress.ratio * 100)}%` }}
              />
            ) : (
              <div className="absolute inset-y-0 w-1/3 -translate-x-full animate-shimmer rounded-full bg-accent/60" />
            )}
          </div>
        ) : null}
        <div role="status" className="flex flex-col gap-0.5">
          <p className="flex items-start justify-between gap-3 text-sm text-text">
            <span>
              {figures}{" "}
              {stored.count || active ? <InfoTip label="Reviews guardadas e tempo que falta">{readerTexts.progress}</InfoTip> : null}
            </span>
            {active && progress.ratio !== null ? <span className="font-semibold">{Math.round(progress.ratio * 100)}%</span> : null}
          </p>
          {detail ? <p className="text-xs text-subtle">{detail}</p> : null}
        </div>
        {status ? <p className={`text-sm ${job?.status === "failed" ? "text-danger" : "text-muted"}`}>{status}</p> : null}
        {partial && googleConnect ? (
          <div className="flex flex-col gap-2.5 rounded-xl bg-accent-soft/60 p-3.5">
            <p className="text-sm text-text">
              <span className="font-semibold">Quer o histórico completo{job?.reviewsExpected ? ` (${number.format(job.reviewsExpected)} reviews)` : ""}?</span> Ligue o seu Perfil de Empresa
              Google: é grátis e oficial, e todas as reviews passam a chegar diretamente do Google, com a data exata e as respostas.
            </p>
            {/* A plain navigation: to Google's consent screen (and back to the panel), or to the explanation page. */}
            <a href={googleConnect.href} className={buttonClasses("primary", "md", "self-start")}>
              <GoogleG size={16} /> Ligar Google
            </a>
          </div>
        ) : null}
        {job?.status === "running" && elapsed !== null ? (
          <p className="text-xs text-subtle">
            {duration(elapsed)} decorridos · {number.format(job.pagesDone)} pedidos ao Google
            {job.avgPageMs ? ` · ${decimal.format(job.avgPageMs / 1000)} s por pedido` : ""}
          </p>
        ) : null}
      </div>

      {competition && competition.pending > 0 ? (
        <div className="flex flex-col gap-1.5 border-t border-line pt-3">
          <div
            role="progressbar"
            aria-label="Leitura da concorrência"
            aria-valuemin={0}
            aria-valuemax={competition.total}
            aria-valuenow={competition.read}
            className="h-2.5 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(3, (competition.read / Math.max(1, competition.total)) * 100)}%` }}
            />
          </div>
          <p className="flex items-start justify-between gap-3 text-sm text-text">
            <span>
              Concorrência: {number.format(competition.read)} de {number.format(competition.total)} lidos
            </span>
            <span className="font-semibold">{Math.round((competition.read / Math.max(1, competition.total)) * 100)}%</span>
          </p>
          <p className="text-xs text-subtle">
            Faltam ~{number.format(competition.pending)} (~{duration(competition.pending * 25)}). A tabela de concorrência vai-se preenchendo.
            {!reader.online ? " O leitor está desligado: continua quando for ligado." : ""}
          </p>
        </div>
      ) : searching ? (
        <p className="border-t border-line pt-3 text-xs text-subtle">
          {state.discover?.status === "running" ? "A procurar os concorrentes da zona…" : "A procura dos concorrentes da zona vai começar."} Corre em paralelo com as reviews.
        </p>
      ) : searchFailed ? (
        <p className="border-t border-line pt-3 text-xs text-danger">A procura de concorrentes falhou: {searchFailed} Carregue em «Importar outra vez» para tentar de novo.</p>
      ) : null}

      {!active ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => void start()}
            disabled={starting}
            className={buttonClasses(stored.count ? "secondary" : "primary", "md", "self-start")}
          >
            {starting ? "A pedir…" : job?.status === "done" ? "Importar outra vez" : "Importar histórico completo"}
          </button>
          {!reader.online ? <p className="text-xs text-subtle">O pedido fica em espera até o leitor ser ligado.</p> : null}
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
