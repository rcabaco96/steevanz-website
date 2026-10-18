// Client-only environment checks. Call inside effects/handlers (never during render).

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function saveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

/** Reduced motion or Save-Data: posters/stills only, no autoplay. */
export function stillsOnly(): boolean {
  return reducedMotion() || saveData();
}

/** Desktop mouse at ≥1024px: the only place pointer-tilt effects run. */
export function finePointerDesktop(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches
  );
}

/** Runs `fn` after window load + requestIdleCallback (timeout 2000). Returns a cancel function. */
export function afterLoadIdle(fn: () => void): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (!cancelled) fn();
  };
  const schedule = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(run, { timeout: 2000 });
    else timeoutId = setTimeout(run, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}
