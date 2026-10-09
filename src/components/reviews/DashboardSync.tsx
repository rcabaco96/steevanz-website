"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { finishedJob, isActive, limitWaitText, limitWaitUntil, relativeTime, updateIntervalMinutes, type ImportJob, type ReaderStatus, type UpdateResponse } from "@/lib/reviews/import-jobs";
import { useBusySignal } from "./DashboardBusy";
import { InfoTip } from "./InfoTip";
import { readerTexts } from "./LeitorStatus";
import { useReaderJobs, useReaderJobsListener } from "./ReaderJobs";

const number = new Intl.NumberFormat("pt-PT");
/** Feedback like "Já estava atualizado" is momentary; errors stay until the next attempt. */
const messageMs = 8000;

export const newReviewsLabel = (count: number) => `${number.format(count)} ${count === 1 ? "review nova" : "reviews novas"}`;

/** Why an update failed, in Portuguese (the reader already writes its errors in Portuguese). */
export const updateFailedText = (job: ImportJob) => `A leitura do Google falhou. ${job.error ?? "Tente outra vez daqui a pouco."}`;

/**
 * Progress of an update job (or of the customer's full import, which reads the new reviews too) while
 * it waits for or runs on the reader, with the (i) that explains it.
 */
export function UpdateProgress({ job, reader, now = null }: { job: ImportJob; reader: ReaderStatus; now?: number | null }) {
  if (job.status === "running" && job.kind === "full") return <span>A importar o histórico completo do Google…</span>;
  if (job.status === "running")
    return (
      <span>
        A ler o Google… {newReviewsLabel(job.reviewsNew)} <InfoTip label="Reviews novas">{readerTexts.newReviews}</InfoTip>
      </span>
    );
  if (!reader.online)
    return (
      <span>
        O leitor está desligado: o pedido fica em espera <InfoTip label="Leitor desligado">{readerTexts.reader}</InfoTip>
      </span>
    );
  const limited = now === null ? null : limitWaitUntil(job, reader, now);
  if (limited)
    return (
      <span>
        {limitWaitText(limited)} <InfoTip label="O Google está a limitar o leitor">{readerTexts.limited}</InfoTip>
      </span>
    );
  return <span>{reader.busy ? "À espera do leitor… (está a terminar outro pedido)" : "À espera do leitor…"}</span>;
}

type Message = { tone: "info" | "error"; text: string } | { tone: "recent"; minutes: number };

/**
 * "Atualizar reviews": queues an update for the Steevanz reader and follows it until the new
 * reviews are saved, then reloads the dashboard's data. Opening the page never reads Google.
 */
export function DashboardSync({ syncUrl, lastSyncedLabel }: { syncUrl: string; lastSyncedLabel: string }) {
  const router = useRouter();
  const { state, now, apply } = useReaderJobs();
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [refreshing, startRefresh] = useTransition();
  // The customer's full import, while it waits or runs, stands for the update (it reads the new reviews too).
  const job = isActive(state.update) || !isActive(state.full) ? state.update : state.full;
  const waiting = isActive(job);

  useReaderJobsListener((previous, next) => {
    const finished = finishedJob(previous, next, "update");
    if (!finished) return;
    if (finished.status === "failed") {
      setMessage({ tone: "error", text: updateFailedText(finished) });
      return;
    }
    setMessage({ tone: "info", text: finished.reviewsNew ? `${newReviewsLabel(finished.reviewsNew)}.` : "Já estava atualizado." });
    // Owner replies may have changed even without new reviews: reload the data blocks (with skeletons).
    startRefresh(() => router.refresh());
  });

  useEffect(() => {
    if (!message || message.tone === "error") return;
    const timer = window.setTimeout(() => setMessage(null), messageMs);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function update() {
    setRequesting(true);
    setMessage(null);
    try {
      const response = await fetch(syncUrl, { method: "POST", cache: "no-store" });
      const body = (await response.json()) as UpdateResponse;
      if ("error" in body) {
        setMessage({ tone: "error", text: body.error });
        return;
      }
      const { recentMinutes, google, ...next } = body;
      apply(next);
      if (google) {
        // Perfil verificado: already updated from Google's official API.
        if (!google.ok) setMessage({ tone: "error", text: google.error ?? "Não foi possível atualizar a partir do Google." });
        else {
          setMessage({ tone: "info", text: google.newReviews ? `${newReviewsLabel(google.newReviews)}.` : "Já estava atualizado." });
          startRefresh(() => router.refresh());
        }
      } else if (recentMinutes !== null) setMessage({ tone: "recent", minutes: recentMinutes });
    } catch {
      setMessage({ tone: "error", text: "Sem ligação. Tente novamente." });
    } finally {
      setRequesting(false);
    }
  }

  const busy = requesting || waiting || refreshing;
  useBusySignal("sync", refreshing);

  let status;
  if (refreshing) status = "A mostrar as reviews atualizadas…";
  else if (requesting) status = "A pedir ao Google…";
  else if (job && waiting) status = <UpdateProgress job={job} reader={state.reader} now={now} />;
  else status = state.lastSyncedAt ? `Reviews atualizadas ${now ? relativeTime(state.lastSyncedAt, now) : lastSyncedLabel}` : state.stored.count
      ? "Ainda não foi atualizado"
      : "Ainda sem reviews importadas";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button type="button" onClick={() => void update()} disabled={busy} aria-busy={busy} className={buttonClasses("primary", "md", "disabled:opacity-90")}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={busy ? "motion-safe:animate-spin" : ""}
          >
            <path d="M20 11a8 8 0 0 0-14.9-3.9M4 5v4h4M4 13a8 8 0 0 0 14.9 3.9M20 19v-4h-4" />
          </svg>
          {busy ? "A atualizar…" : "Atualizar reviews"}
        </button>
        <div role="status" className="flex min-w-0 flex-col gap-0.5 text-sm text-subtle">
          <span>{status}</span>
          {message && !busy ? (
            message.tone === "recent" ? (
              <span className="text-text">
                {message.minutes < 1 ? "Atualizado há menos de 1 min" : `Atualizado há ${message.minutes} min`}{" "}
                <InfoTip label={`Uma leitura a cada ${updateIntervalMinutes} minutos`}>{readerTexts.interval(message.minutes)}</InfoTip>
              </span>
            ) : (
              <span className={message.tone === "error" ? "text-danger" : "text-text"}>{message.text}</span>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
