"use client";

import { createContext, useCallback, useContext, useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { maxPollMs, nextPollDelay, pollFingerprint, pollingNeeded, type ImportResponse, type ReaderJobsState } from "@/lib/reviews/import-jobs";

const clockTickMs = 5000;
/** Idle: one check when the tab becomes visible again, if the last one is older than this. */
const idleRecheckMs = 60_000;

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
 * reads Supabase. It polls only while a job of the customer is queued or running (pollingNeeded):
 * every ~1.5 s while the reader works on it, every ~4 s while it waits, and 1.5× longer after each
 * check that brings nothing new (up to 30 s). It stops when the jobs are done or failed, pauses while
 * the tab is hidden and checks once as soon as it is visible again.
 */
export function ReaderJobsProvider({ slug, initial, children }: { slug: string; initial: ReaderJobsState; children: ReactNode }) {
  const [state, setState] = useState(initial);
  const current = useRef(initial);
  const listeners = useRef(new Set<Listener>());
  const inFlight = useRef(false);
  /** When the state last came from the server (render, poll or POST); 0 until mounted. */
  const freshAt = useRef(0);
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
    freshAt.current = Date.now();
    setState(next);
    for (const listener of listeners.current) listener(previous, next);
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  /** One check of GET /import; false when it failed (the last known state is kept). */
  const check = useEffectEvent(async (): Promise<boolean> => {
    if (inFlight.current) return true;
    inFlight.current = true;
    try {
      const response = await fetch(url, { cache: "no-store" });
      const body = (await response.json()) as ImportResponse;
      if (!response.ok || "error" in body) return false;
      apply(body);
      return true;
    } catch {
      return false;
    } finally {
      inFlight.current = false;
    }
  });

  // The page was just rendered with fresh data.
  useEffect(() => {
    freshAt.current = Date.now();
  }, []);

  const needed = pollingNeeded(state);
  useEffect(() => {
    if (!visible) return;
    if (!needed) {
      // Nothing to wait for: no polling, only one check when coming back to a tab left a while.
      if (freshAt.current && Date.now() - freshAt.current > idleRecheckMs) void check();
      return;
    }
    let cancelled = false;
    let timer: number | undefined;
    let delay: number | null = null;
    const step = async () => {
      const before = pollFingerprint(current.current);
      const ok = await check();
      if (cancelled) return;
      // Done or failed: the effect stops (it runs again with needed = false).
      if (!pollingNeeded(current.current)) return;
      delay = ok ? nextPollDelay(current.current, delay, pollFingerprint(current.current) !== before) : Math.min(maxPollMs, (delay ?? 2000) * 2);
      timer = window.setTimeout(() => void step(), delay);
    };
    // Fresh data (just rendered, or a job just queued): wait one interval; otherwise (tab visible again) check now.
    const first = nextPollDelay(current.current, null, true);
    const age = Date.now() - freshAt.current;
    if (age < first) {
      delay = first;
      timer = window.setTimeout(() => void step(), first - age);
    } else void step();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [needed, visible]);

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
