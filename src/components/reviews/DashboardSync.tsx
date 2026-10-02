"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { buttonClasses } from "@/components/ui/Button";
import type { DashboardSyncResponse } from "@/lib/reviews/types";

const runningPollMs = 15_000;
const maxPolls = 20;
const clockTickMs = 30_000;

type Phase = "idle" | "syncing" | "error";

function subscribeClock(onChange: () => void) {
  const timer = window.setInterval(onChange, clockTickMs);
  return () => window.clearInterval(timer);
}

/** Current time, rounded so the snapshot stays stable between ticks; null while server rendering. */
function useClock(): number | null {
  return useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / clockTickMs) * clockTickMs,
    () => null,
  );
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
function relative(iso: string, now: number): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return `há ${days} ${days === 1 ? "dia" : "dias"}`;
}

interface DashboardSyncProps {
  syncUrl: string;
  lastSyncedAt: string | null;
  lastSyncedLabel: string;
}

export function DashboardSync({ syncUrl, lastSyncedAt, lastSyncedLabel }: DashboardSyncProps) {
  const router = useRouter();
  // Every visit asks for fresh reviews, so the button starts in its busy state.
  const [phase, setPhase] = useState<Phase>("syncing");
  const [message, setMessage] = useState<string | null>(null);
  const [refreshing, startRefresh] = useTransition();
  const now = useClock();
  const started = useRef(false);

  // Feedback like "Já estava atualizado" is momentary; errors stay until the next attempt.
  useEffect(() => {
    if (!message || phase === "error") return;
    const timer = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [message, phase]);

  const sync = useCallback(
    async (manual: boolean) => {
      setPhase("syncing");
      setMessage(null);
      try {
        let body: DashboardSyncResponse = { status: "running" };
        let waited = false;
        // Someone else's sync may already be running: wait for it instead of starting another.
        for (let attempt = 0; attempt < maxPolls && body.status === "running"; attempt++) {
          if (attempt) {
            waited = true;
            await sleep(runningPollMs);
          }
          const response = await fetch(syncUrl, { method: "POST", cache: "no-store" });
          body = (await response.json()) as DashboardSyncResponse;
        }
        if (body.status === "running") body = { status: "error", message: "A atualização está a demorar. Tente daqui a pouco." };
        if (body.status === "error") {
          setPhase("error");
          setMessage(body.message);
          return;
        }
        setPhase("idle");
        // "fresh" on the first try means the page already shows the latest import.
        if (body.status === "fresh" && !waited) {
          if (manual) setMessage("Já estava atualizado.");
          return;
        }
        startRefresh(() => router.refresh());
      } catch {
        setPhase("error");
        setMessage("Sem ligação. Tente novamente.");
      }
    },
    [router, syncUrl],
  );

  useEffect(() => {
    if (started.current) return;
    const timer = window.setTimeout(() => {
      started.current = true;
      void sync(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [sync]);

  const busy = phase === "syncing" || refreshing;
  const status = busy
    ? "A procurar reviews novas no Google…"
    : lastSyncedAt
      ? `Reviews atualizadas ${now ? relative(lastSyncedAt, now) : lastSyncedLabel}`
      : "Ainda sem reviews importadas";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <button type="button" onClick={() => void sync(true)} disabled={busy} aria-busy={busy} className={buttonClasses("primary", "md", "disabled:opacity-90")}>
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
      <p role="status" className="text-sm text-subtle">
        {status}
        {message && !busy ? <span className={phase === "error" ? " text-danger" : ""}> · {message}</span> : null}
      </p>
    </div>
  );
}
