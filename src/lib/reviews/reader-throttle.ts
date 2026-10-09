/**
 * How the free reader (scripts/reader) paces itself so Google does not start limiting its browser:
 * one tab always kept for the customers' own reviews, competitor reads in parallel in the other tabs
 * (a short gap between starts), a pause of the competitor work when Google limits, and jobs hit by a limit put back in the queue for later instead of
 * failing. Pure module (no imports), tested with node --test (tests/reader-throttle.test.mjs).
 *
 * Evidence (2026-10-09): a new customer's discover + ~35 competitor reads in parallel with its own
 * first import made Google limit the reader's browser; the customer's import and every retry failed.
 */

const minuteMs = 60_000;

/** A customer's own reads: one tab is always kept for them; they never wait for competitor work. */
export const clientJobKinds = ["full", "update"] as const;
/** Competitor work: zone search and reads of competitor places. In parallel in the other tabs. */
export const competitorJobKinds = ["discover", "competitor", "competitor_replies"] as const;

export const isClientJob = (kind: string): boolean => (clientJobKinds as readonly string[]).includes(kind);
export const isCompetitorWork = (kind: string): boolean => (competitorJobKinds as readonly string[]).includes(kind);

export interface ThrottleConfig {
  /** Competitor jobs (discover, competitor, competitor_replies) at once: by default every tab but the customers' one. */
  competitorSlots: number;
  /** Minimum pause between two competitor job starts (each pause is this to twice this, at random). */
  competitorPauseMs: number;
  /** Limit signals within `limitWindowMs` that start a cool-down. */
  limitSignals: number;
  limitWindowMs: number;
  /**
   * First cool-down of the competitor work; each new one in a row (no successful read between) is 3×
   * longer, up to the max. Customers' own jobs never wait for it.
   */
  cooldownMinutes: number;
  cooldownMaxMinutes: number;
  /** Times a job may be hit by a limit before it fails (the earlier ones go back to the queue). */
  limitAttempts: number;
}

/** The reader is always there for the customers: short cool-downs, and only competitor work waits. */
export const defaultThrottle: ThrottleConfig = {
  competitorSlots: 9,
  competitorPauseMs: 1000,
  limitSignals: 2,
  limitWindowMs: 5 * minuteMs,
  cooldownMinutes: 3,
  cooldownMaxMinutes: 30,
  limitAttempts: 5,
};

function intFrom(value: string | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : fallback;
}

/**
 * Settings from the environment (.env.local of the reader), each with a sensible default:
 * READER_COMPETITOR_SLOTS (every tab but one), READER_COMPETITOR_PAUSE_MS (1000), READER_COOLDOWN_MIN (3),
 * READER_COOLDOWN_MAX_MIN (30), READER_LIMIT_ATTEMPTS (5). One tab always stays for the customers.
 */
export function throttleFrom(env: Record<string, string | undefined>, slots: number): ThrottleConfig {
  const cooldownMinutes = intFrom(env.READER_COOLDOWN_MIN, defaultThrottle.cooldownMinutes, 1, 24 * 60);
  return {
    ...defaultThrottle,
    competitorSlots: Math.max(1, Math.min(slots - 1, intFrom(env.READER_COMPETITOR_SLOTS, slots - 1, 1, 20))),
    competitorPauseMs: intFrom(env.READER_COMPETITOR_PAUSE_MS, defaultThrottle.competitorPauseMs, 0, 10 * minuteMs),
    cooldownMinutes,
    cooldownMaxMinutes: Math.max(cooldownMinutes, intFrom(env.READER_COOLDOWN_MAX_MIN, defaultThrottle.cooldownMaxMinutes, 1, 24 * 60)),
    limitAttempts: intFrom(env.READER_LIMIT_ATTEMPTS, defaultThrottle.limitAttempts, 1, 20),
  };
}

/** Pause before the next competitor job may start: `pauseMs` to 2× `pauseMs` (random 0..1). */
export const competitorPause = (pauseMs: number, random: number): number => Math.round(pauseMs * (1 + Math.min(1, Math.max(0, random))));

// --- Cool-down -------------------------------------------------------------------------------------

export interface CooldownState {
  /** Times (ms) of the recent limit signals, inside the window. */
  signals: number[];
  /** Cool-downs in a row without a successful read between them (0 = none). */
  level: number;
  /** No new job is claimed before this (ms); null when not paused. */
  pausedUntil: number | null;
}

export const initialCooldown: CooldownState = { signals: [], level: 0, pausedUntil: null };

/** Length of the n-th cool-down in a row: 3, 9, 27, 30 (max) minutes with the defaults. */
export function cooldownMinutesFor(level: number, config: Pick<ThrottleConfig, "cooldownMinutes" | "cooldownMaxMinutes">): number {
  return Math.min(config.cooldownMaxMinutes, config.cooldownMinutes * 3 ** Math.max(0, level - 1));
}

export const isPaused = (state: CooldownState, now: number): boolean => state.pausedUntil !== null && now < state.pausedUntil;

/**
 * A limit signal (Google's limited view, a sign-in gate, reviews that did not load, a sort refused,
 * a list that stopped early). With `limitSignals` of them inside the window, a cool-down starts
 * (`started` is its length in minutes); while already paused, signals only extend nothing.
 */
export function recordLimit(state: CooldownState, now: number, config: ThrottleConfig): { state: CooldownState; started: number | null } {
  if (isPaused(state, now)) return { state, started: null };
  const signals = [...state.signals.filter((at) => now - at < config.limitWindowMs), now];
  if (signals.length < config.limitSignals) return { state: { ...state, signals, pausedUntil: null }, started: null };
  const level = state.level + 1;
  const minutes = cooldownMinutesFor(level, config);
  return { state: { signals: [], level, pausedUntil: now + minutes * minuteMs }, started: minutes };
}

/** A successful read of Google: the next cool-down starts short again (the current one, if any, stays). */
export const recordSuccess = (state: CooldownState): CooldownState => ({ ...state, level: 0 });

/** A pause stored by an earlier run (review_reader_status.paused_until) carries over a restart. */
export function restoreCooldown(pausedUntil: string | null | undefined, now: number): CooldownState {
  const until = pausedUntil ? Date.parse(pausedUntil) : NaN;
  return Number.isFinite(until) && until > now ? { signals: [], level: 1, pausedUntil: until } : initialCooldown;
}

// --- Jobs hit by a limit ---------------------------------------------------------------------------

/** Wait before the n-th retry of a competitor job hit by a limit (minutes): ~3 h 10 min over 5 attempts. */
export const limitRetryMinutes = [10, 30, 60, 90] as const;
/** A customer's own job retries soon (minutes): ~37 min over 5 attempts, never held by the cool-down. */
export const clientLimitRetryMinutes = [2, 5, 10, 20] as const;

export type LimitOutcome = { action: "requeue"; attempts: number; notBefore: number } | { action: "fail"; attempts: number };

/**
 * A job hit by a Google limit for the `attempts`-th time (counting this one): back to the queue for
 * later, or failed once it used all its attempts. Competitor work never comes back before the
 * cool-down ends; a customer's own job comes back after a short wait whatever the cool-down.
 */
export function limitOutcome(previousAttempts: number, now: number, pausedUntil: number | null, config: Pick<ThrottleConfig, "limitAttempts">, kind = "competitor"): LimitOutcome {
  const attempts = previousAttempts + 1;
  if (attempts >= config.limitAttempts) return { action: "fail", attempts };
  const steps = isClientJob(kind) ? clientLimitRetryMinutes : limitRetryMinutes;
  const wait = steps[Math.min(attempts, steps.length) - 1] * minuteMs;
  return { action: "requeue", attempts, notBefore: isClientJob(kind) ? now + wait : Math.max(now + wait, pausedUntil ?? 0) };
}

/** "22:40" in Portugal. */
export const lisbonTime = (at: number | string | Date): string =>
  new Date(at).toLocaleTimeString("pt-PT", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit" });

/** Kept in the job while it waits (shown in the admin; the panel builds the same text from not_before). */
export const limitWaitNote = (notBefore: number | string | Date): string => `À espera: o Google está a limitar o leitor, tentamos outra vez às ${lisbonTime(notBefore)}.`;

export const limitFailNote = (attempts: number, last: string): string =>
  `O Google limitou o leitor ${attempts} vezes seguidas neste pedido, por isso desistimos por agora. Pode pedir outra vez. Último erro: ${last}`;

/** Status line of the reader while paused (admin and panel): only competitor reads wait. */
export const pausedText = (pausedUntil: number | string | Date): string =>
  `O Google está a limitar o leitor: as reviews dos clientes continuam, as leituras de concorrentes retomam às ${lisbonTime(pausedUntil)}.`;

// --- Which job next ----------------------------------------------------------------------------------

export interface ClaimGate {
  /** Now (ms): jobs with a later not_before still wait. */
  now?: number;
  /** Competitor jobs running on this reader. */
  competitorRunning?: number;
  competitorSlots?: number;
  /** False while the pause after the last competitor start has not passed. */
  competitorReady?: boolean;
  /** Google limits the reader (cool-down): competitor work waits, customers' jobs don't. */
  paused?: boolean;
}

/** Whether a queued job may start now under the gate (target and slot checks are pickReaderJob's). */
export function gateAllows(job: { kind: string; not_before?: string | null }, gate: ClaimGate): boolean {
  if (job.not_before && gate.now !== undefined && Date.parse(job.not_before) > gate.now) return false;
  if (!isCompetitorWork(job.kind)) return true;
  if (gate.paused) return false;
  if (gate.competitorReady === false) return false;
  return gate.competitorSlots === undefined || (gate.competitorRunning ?? 0) < gate.competitorSlots;
}
