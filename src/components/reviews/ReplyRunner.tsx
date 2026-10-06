"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { buttonClasses } from "@/components/ui/Button";
import type { ReplyRunResponse } from "@/lib/reviews/types";
import { useBusySignal } from "./DashboardBusy";

type Phase = "idle" | "running" | "error";

function summary(body: Extract<ReplyRunResponse, { status: "done" }>): string {
  const parts: string[] = [];
  if (body.drafted === 0 && body.failed === 0) parts.push("Sem reviews novas por responder.");
  if (body.drafted > 0) parts.push(`${body.drafted} ${body.drafted === 1 ? "resposta nova" : "respostas novas"}`);
  if (body.autoApproved > 0) parts.push(`${body.autoApproved} ${body.autoApproved === 1 ? "aprovada" : "aprovadas"} automaticamente`);
  if (body.failed > 0) parts.push(`${body.failed} por escrever (tente outra vez)`);
  return parts.join(" · ");
}

/** "Atualizar": imports new reviews and drafts the missing replies. Only on click: opening the tab never reads Google. */
export function ReplyRunner({ runUrl }: { runUrl: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [refreshing, startRefresh] = useTransition();

  const run = useCallback(
    async (sync: boolean) => {
      setPhase("running");
      setMessage(null);
      try {
        const response = await fetch(runUrl, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sync }) });
        const body = (await response.json()) as ReplyRunResponse;
        if (body.status === "error") {
          setPhase("error");
          setMessage(body.message);
          return;
        }
        setPhase("idle");
        setMessage(summary(body));
        startRefresh(() => router.refresh());
      } catch {
        setPhase("error");
        setMessage("Sem ligação. Tente novamente.");
      }
    },
    [router, runUrl],
  );


  const busy = phase === "running" || refreshing;
  useBusySignal("replies", busy);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <button type="button" onClick={() => void run(true)} disabled={busy} aria-busy={busy} className={buttonClasses("primary", "md", "disabled:opacity-90")}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={busy ? "motion-safe:animate-spin" : ""}>
          <path d="M20 11a8 8 0 0 0-14.9-3.9M4 5v4h4M4 13a8 8 0 0 0 14.9 3.9M20 19v-4h-4" />
        </svg>
        {busy ? "A atualizar…" : "Atualizar"}
      </button>
      <p role="status" className={`text-sm ${phase === "error" ? "text-danger" : "text-subtle"}`}>
        {busy ? "A procurar reviews novas e a preparar respostas…" : message}
      </p>
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
