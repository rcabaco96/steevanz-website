"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { finishedJob, isActive, type UpdateResponse } from "@/lib/reviews/import-jobs";
import type { ReplyRunResponse } from "@/lib/reviews/types";
import { useBusySignal } from "./DashboardBusy";
import { newReviewsLabel, UpdateProgress, updateFailedText } from "./DashboardSync";
import { LeitorStatus } from "./LeitorStatus";
import { useReaderJobs, useReaderJobsListener } from "./ReaderJobs";

type Phase = "idle" | "requesting" | "waiting" | "drafting" | "error";

/** Longest wait for the reader (e.g. busy with another customer's full import) before drafting with what we have. */
const maxWaitMs = 3 * 60_000;

function summary(body: Extract<ReplyRunResponse, { status: "done" }>): string {
  const parts: string[] = [];
  if (body.drafted === 0 && body.failed === 0) parts.push("Sem reviews novas por responder.");
  if (body.drafted > 0) parts.push(`${body.drafted} ${body.drafted === 1 ? "resposta nova" : "respostas novas"}`);
  if (body.autoApproved > 0) parts.push(`${body.autoApproved} ${body.autoApproved === 1 ? "aprovada" : "aprovadas"} automaticamente`);
  if (body.failed > 0) parts.push(`${body.failed} por escrever (tente outra vez)`);
  return parts.join(" · ");
}

/**
 * "Atualizar": asks the Steevanz reader for new reviews (the same update as "Atualizar reviews"),
 * waits for it, then drafts the missing replies by rules. Only on click: opening the tab never
 * reads Google, and Vercel never reads Google. With the reader switched off it drafts from the
 * reviews we already have and the update stays queued.
 */
export function ReplyRunner({ runUrl, syncUrl }: { runUrl: string; syncUrl: string }) {
  const router = useRouter();
  const { state, apply } = useReaderJobs();
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [refreshing, startRefresh] = useTransition();
  /** Update job this run is waiting for, and since when (null once handled). */
  const waitingFor = useRef<{ id: string; since: number } | null>(null);

  const draft = useCallback(
    async (note: string | null) => {
      waitingFor.current = null;
      setPhase("drafting");
      try {
        const response = await fetch(runUrl, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sync: false }) });
        const body = (await response.json()) as ReplyRunResponse;
        if (body.status === "error") {
          setPhase("error");
          setMessage([note, body.message].filter(Boolean).join(" "));
          return;
        }
        setPhase("idle");
        setMessage([note, summary(body)].filter(Boolean).join(" "));
        startRefresh(() => router.refresh());
      } catch {
        setPhase("error");
        setMessage("Sem ligação. Tente novamente.");
      }
    },
    [router, runUrl],
  );

  useReaderJobsListener((previous, next) => {
    const waiting = waitingFor.current;
    if (!waiting) return;
    const finished = finishedJob(previous, next, "update");
    if (finished?.id === waiting.id) {
      void draft(finished.status === "failed" ? `${updateFailedText(finished)} Respostas preparadas com as reviews que já temos:` : `Google lido: ${newReviewsLabel(finished.reviewsNew)}.`);
    } else if (!next.reader.online) {
      void draft("O leitor desligou-se: a leitura fica em espera. Respostas preparadas com as reviews que já temos:");
    } else if (Date.now() - waiting.since > maxWaitMs) {
      void draft("O leitor ainda está ocupado: a leitura fica em fila. Respostas preparadas com as reviews que já temos:");
    }
  });

  async function run() {
    setPhase("requesting");
    setMessage(null);
    let body: UpdateResponse;
    try {
      body = (await (await fetch(syncUrl, { method: "POST", cache: "no-store" })).json()) as UpdateResponse;
    } catch {
      setPhase("error");
      setMessage("Sem ligação. Tente novamente.");
      return;
    }
    if ("error" in body) return void draft(`${body.error} Respostas preparadas com as reviews que já temos:`);
    const { recentMinutes, ...next } = body;
    apply(next);
    if (recentMinutes !== null || !next.update || !isActive(next.update)) return void draft(null);
    if (!next.reader.online) return void draft("O leitor está desligado: a leitura fica em espera. Respostas preparadas com as reviews que já temos:");
    waitingFor.current = { id: next.update.id, since: Date.now() };
    setPhase("waiting");
  }

  const busy = phase === "requesting" || phase === "waiting" || phase === "drafting" || refreshing;
  useBusySignal("replies", phase === "drafting" || refreshing);

  let status: ReactNode = message;
  if (phase === "requesting") status = "A pedir reviews novas ao Google…";
  else if (phase === "waiting" && state.update) status = <UpdateProgress job={state.update} reader={state.reader} />;
  else if (phase === "drafting" || refreshing) status = "A preparar respostas…";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button type="button" onClick={() => void run()} disabled={busy} aria-busy={busy} className={buttonClasses("primary", "md", "disabled:opacity-90")}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={busy ? "motion-safe:animate-spin" : ""}>
            <path d="M20 11a8 8 0 0 0-14.9-3.9M4 5v4h4M4 13a8 8 0 0 0 14.9 3.9M20 19v-4h-4" />
          </svg>
          {busy ? "A atualizar…" : "Atualizar"}
        </button>
        <p role="status" className={`min-w-0 text-sm ${phase === "error" ? "text-danger" : "text-subtle"}`}>
          {status}
        </p>
      </div>
      <LeitorStatus />
    </div>
  );
}

/** Prepares the remaining recent reviews, without a new Google import. */
export function DraftMoreButton({ runUrl, label }: { runUrl: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [error, setError] = useState<string | null>(null);
  useBusySignal("replies", busy || refreshing);
  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy || refreshing}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            const body = (await (await fetch(runUrl, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sync: false }) })).json()) as ReplyRunResponse;
            if (body.status === "error") setError(body.message);
            else startRefresh(() => router.refresh());
          } catch {
            setError("Sem ligação. Tente novamente.");
          } finally {
            setBusy(false);
          }
        }}
        className={buttonClasses("secondary", "md")}
      >
        {busy || refreshing ? "A preparar…" : label}
      </button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
