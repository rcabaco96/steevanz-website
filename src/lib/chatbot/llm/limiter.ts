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

  /** Takes one call if both ceilings allow it; false = don't call. */
  take(): boolean {
    const now = this.clock();
    while (this.calls.length && now - this.calls[0] >= 24 * 60 * 60_000) this.calls.shift();
    if (this.calls.length >= this.limits.perDay) return false;
    if (this.calls.filter((at) => now - at < 60_000).length >= this.limits.perMinute) return false;
    this.calls.push(now);
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
