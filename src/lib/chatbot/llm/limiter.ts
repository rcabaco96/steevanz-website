// A ceiling on calls to an outside AI service, kept well below its free limits. One shared counter
// per process (the runner, or one server instance of the site): when it is reached, the engine
// answers with the free knowledge-based mock instead. Pure module (clock injected).

export interface CallLimits {
  perMinute: number;
  perDay: number;
}

export class CallLimiter {
  private readonly calls: number[] = [];
  private readonly limits: CallLimits;
  private readonly clock: () => number;

  constructor(limits: CallLimits, clock: () => number = Date.now) {
    this.limits = limits;
    this.clock = clock;
  }

  /** Whether both ceilings allow one more call now (takes nothing). */
  canTake(): boolean {
    const now = this.clock();
    while (this.calls.length && now - this.calls[0] >= 24 * 60 * 60_000) this.calls.shift();
    if (this.calls.length >= this.limits.perDay) return false;
    return this.calls.filter((at) => now - at < 60_000).length < this.limits.perMinute;
  }

  /** Takes one call if both ceilings allow it; false = don't call. */
  take(): boolean {
    if (!this.canTake()) return false;
    this.calls.push(this.clock());
    return true;
  }

  get usedToday(): number {
    const now = this.clock();
    return this.calls.filter((at) => now - at < 24 * 60 * 60_000).length;
  }
}

/** A positive whole number from the environment, else the default (never above `max`). */
export function limitFromEnv(raw: string | undefined, fallback: number, max: number): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? Math.min(value, max) : fallback;
}

/**
 * A ceiling on tokens (what Groq's free tier counts per minute and per day): before a call, the
 * estimate must fit; after it, the real count from the answer is recorded. Pure (clock injected).
 */
export class TokenBudget {
  private readonly used: { at: number; tokens: number }[] = [];
  private readonly limits: { perMinute: number; perDay: number };
  private readonly clock: () => number;

  constructor(limits: { perMinute: number; perDay: number }, clock: () => number = Date.now) {
    this.limits = limits;
    this.clock = clock;
  }

  private sum(windowMs: number): number {
    const now = this.clock();
    return this.used.filter((item) => now - item.at < windowMs).reduce((total, item) => total + item.tokens, 0);
  }

  /** Whether a call of about `tokens` stays inside both ceilings. */
  allows(tokens: number): boolean {
    const now = this.clock();
    while (this.used.length && now - this.used[0].at >= 24 * 60 * 60_000) this.used.shift();
    return this.sum(60_000) + tokens <= this.limits.perMinute && this.sum(24 * 60 * 60_000) + tokens <= this.limits.perDay;
  }

  record(tokens: number): void {
    if (tokens > 0) this.used.push({ at: this.clock(), tokens });
  }

  get usedToday(): number {
    return this.sum(24 * 60 * 60_000);
  }
}
