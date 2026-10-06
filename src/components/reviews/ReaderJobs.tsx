"use client";

import { createContext, useCallback, useContext, useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { isActive, type ImportResponse, type ReaderJobsState } from "@/lib/reviews/import-jobs";

/** While the reader works on a job of this customer the panel checks every second; otherwise every 10 s (heartbeat). */
const activePollMs = 1000;
const idlePollMs = 10_000;
const clockTickMs = 5000;

type Listener = (previous: ReaderJobsState, next: ReaderJobsState) => void;

interface ReaderJobsContext {
  state: ReaderJobsState;
  /** Current time in 5 s steps; null while server rendering. */
  now: number | null;
  /** New state from a POST (queueing a job); listeners see the change like a poll. */
  apply: (next: ReaderJobsState) => void;
  subscribe: (listener: Listener) => () => void;
}

const Context = createContext<ReaderJobsContext | null>(null);

function subscribeClock(onChange: () => void) {
  const timer = window.setInterval(onChange, clockTickMs);
  return () => window.clearInterval(timer);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Shares the reader's jobs of one customer between the cards that show them ("Atualizar reviews",
 * "Histórico completo", "Atualizar" in Respostas) with a single poll of GET /import, which only
 * reads Supabase. No polling while the tab is hidden; one check as soon as it is visible again.
 */
export function ReaderJobsProvider({ slug, initial, children }: { slug: string; initial: ReaderJobsState; children: ReactNode }) {
  const [state, setState] = useState(initial);
  const current = useRef(initial);
  const listeners = useRef(new Set<Listener>());
  const inFlight = useRef(false);
  const skipFirstPoll = useRef(true);
  const url = `/api/painel/${encodeURIComponent(slug)}/import`;
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
  const now = useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / clockTickMs) * clockTickMs,
    () => null,
  );

  const apply = useCallback((next: ReaderJobsState) => {
    const previous = current.current;
    current.current = next;
    setState(next);
    for (const listener of listeners.current) listener(previous, next);
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const active = isActive(state.full) || isActive(state.update);
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const poll = async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const response = await fetch(url, { cache: "no-store" });
        const body = (await response.json()) as ImportResponse;
        if (!cancelled && response.ok && !("error" in body)) apply(body);
      } catch {
        // Keep the last known state; the next poll retries.
      } finally {
        inFlight.current = false;
      }
    };
    // The page was just rendered with fresh data; afterwards (tab visible again, job started) check at once.
    if (skipFirstPoll.current) skipFirstPoll.current = false;
    else void poll();
    const timer = window.setInterval(() => void poll(), active ? activePollMs : idlePollMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [active, apply, url, visible]);

  const value = useMemo(() => ({ state, now, apply, subscribe }), [state, now, apply, subscribe]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useReaderJobs(): ReaderJobsContext {
  const context = useContext(Context);
  if (!context) throw new Error("useReaderJobs needs a ReaderJobsProvider");
  return context;
}

/** Runs on every new state (poll or POST), with the previous one, to react to jobs finishing. */
export function useReaderJobsListener(listener: Listener) {
  const { subscribe } = useReaderJobs();
  const onChange = useEffectEvent(listener);
  useEffect(() => subscribe((previous, next) => onChange(previous, next)), [subscribe]);
}
