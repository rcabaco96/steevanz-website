"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition, type ComponentProps, type ReactNode } from "react";

/**
 * Which part of the dashboard is being refreshed on the server, so only those parts show a
 * skeleton while the rest stays put (see the "skeletons" skill):
 * - "sync": new reviews being imported (every data block);
 * - "period": the period filter changed (every data block);
 * - "reviews": review filters or "Ver mais" (the review list only).
 */
export type BusyScope = "sync" | "period" | "reviews";

const BusyContext = createContext<{ active: BusyScope[]; setBusy: (scope: BusyScope, busy: boolean) => void } | null>(null);

/** Below this, the update feels instant and a skeleton would only flicker. */
const showAfterMs = 300;

export function DashboardBusyProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<BusyScope[]>([]);
  const setBusy = useCallback((scope: BusyScope, busy: boolean) => {
    setActive((current) => (busy ? (current.includes(scope) ? current : [...current, scope]) : current.filter((item) => item !== scope)));
  }, []);
  const value = useMemo(() => ({ active, setBusy }), [active, setBusy]);
  return <BusyContext.Provider value={value}>{children}</BusyContext.Provider>;
}

/** Reports a scope as busy once it has been busy for a moment. */
export function useBusySignal(scope: BusyScope, busy: boolean) {
  const setBusy = useContext(BusyContext)?.setBusy;
  useEffect(() => {
    if (!setBusy || !busy) return;
    const timer = window.setTimeout(() => setBusy(scope, true), showAfterMs);
    return () => {
      window.clearTimeout(timer);
      setBusy(scope, false);
    };
  }, [busy, scope, setBusy]);
}

/** Wraps a block of server-rendered data; while one of its scopes refreshes, it shows a skeleton veil. */
export function Refreshable({ scopes, children }: { scopes: BusyScope[]; children: ReactNode }) {
  const active = useContext(BusyContext)?.active ?? [];
  const busy = active.some((scope) => scopes.includes(scope));
  return (
    <div className="relative" aria-busy={busy || undefined}>
      <div className={`transition-opacity duration-300 ${busy ? "pointer-events-none opacity-35 saturate-50" : ""}`}>{children}</div>
      {busy ? (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-card)]">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-bg/80 to-transparent" />
          </div>
          <span role="status" className="sr-only">
            A atualizar…
          </span>
        </>
      ) : null}
    </div>
  );
}

/**
 * In-dashboard link (filters, periods, "Ver mais"): navigates inside a transition so the scope it
 * affects shows a skeleton until the server has rendered the new data.
 */
export function PendingLink({ scope, href, onClick, ...rest }: ComponentProps<typeof Link> & { scope: BusyScope; href: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useBusySignal(scope, pending);
  return (
    <Link
      {...rest}
      href={href}
      aria-busy={pending || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        startTransition(() => router.push(href, { scroll: false }));
      }}
    />
  );
}
