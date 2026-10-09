import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pickReaderJob } from "../src/lib/reviews/maps-reader.ts";
import {
  competitorPause,
  cooldownMinutesFor,
  defaultThrottle,
  gateAllows,
  initialCooldown,
  isPaused,
  limitOutcome,
  limitWaitNote,
  recordLimit,
  recordSuccess,
  restoreCooldown,
  throttleFrom,
} from "../src/lib/reviews/reader-throttle.ts";

const minute = 60_000;
const t0 = Date.parse("2026-10-09T21:00:00Z");
const job = (id, kind, priority, minutes, target = {}) => ({
  id,
  kind,
  business_id: null,
  place_id: null,
  priority,
  requested_at: new Date(t0 + minutes * minute).toISOString(),
  ...target,
});

describe("settings", () => {
  it("uses sensible defaults and reads the environment", () => {
    assert.deepEqual(throttleFrom({}, 10), defaultThrottle);
    const custom = throttleFrom({ READER_COMPETITOR_SLOTS: "2", READER_COMPETITOR_PAUSE_MS: "8000", READER_COOLDOWN_MIN: "15", READER_COOLDOWN_MAX_MIN: "45", READER_LIMIT_ATTEMPTS: "4" }, 10);
    assert.equal(custom.competitorSlots, 2);
    assert.equal(custom.competitorPauseMs, 8000);
    assert.equal(custom.cooldownMinutes, 15);
    assert.equal(custom.cooldownMaxMinutes, 45);
    assert.equal(custom.limitAttempts, 4);
    // Never more competitor slots than the reader has; nonsense falls back to the default.
    assert.equal(throttleFrom({ READER_COMPETITOR_SLOTS: "8" }, 4).competitorSlots, 4);
    assert.equal(throttleFrom({ READER_COMPETITOR_SLOTS: "abc", READER_COOLDOWN_MIN: "-3" }, 10).competitorSlots, 3);
    assert.equal(throttleFrom({ READER_COOLDOWN_MIN: "-3" }, 10).cooldownMinutes, 10);
  });

  it("spaces competitor starts by the pause to twice the pause", () => {
    assert.equal(competitorPause(5000, 0), 5000);
    assert.equal(competitorPause(5000, 0.5), 7500);
    assert.equal(competitorPause(5000, 1), 10000);
  });
});

describe("customer first, competitors capped", () => {
  // The 2026-10-09 evening: a new customer's full import, its discover and its competitor reads.
  const queued = [
    job("discover", "discover", 4, 1, { business_id: "king" }),
    job("c1", "competitor", 4, 2, { place_id: "p1" }),
    job("c2", "competitor_replies", 4, 2, { place_id: "p2" }),
    job("full", "full", 3, 0, { business_id: "king" }),
  ];

  it("starts the customer's import alone: no competitor work while a customer job is queued or running", () => {
    const gate = { now: t0, clientJobsActive: true, competitorRunning: 0, competitorSlots: 3, competitorReady: true };
    assert.equal(pickReaderJob(queued, new Set(), 0, 10, gate).id, "full");
    // The import is running: the discover and the reads wait.
    assert.equal(pickReaderJob(queued.slice(0, 3), new Set(["business:king"]), 1, 10, gate), null);
  });

  it("then the competitor work, capped and spaced", () => {
    const free = { now: t0, clientJobsActive: false, competitorRunning: 0, competitorSlots: 3, competitorReady: true };
    assert.equal(pickReaderJob(queued.slice(0, 3), new Set(), 0, 10, free).id, "discover");
    assert.equal(pickReaderJob(queued.slice(1, 3), new Set(), 3, 10, { ...free, competitorRunning: 3 }), null);
    assert.equal(pickReaderJob(queued.slice(1, 3), new Set(), 1, 10, { ...free, competitorRunning: 1, competitorReady: false }), null);
  });

  it("a customer's update always passes, even with competitor slots full", () => {
    const update = job("u", "update", 1, 5, { business_id: "other" });
    const gate = { now: t0, clientJobsActive: true, competitorRunning: 3, competitorSlots: 3, competitorReady: false };
    assert.equal(pickReaderJob([...queued.slice(0, 3), update], new Set(), 3, 10, gate).id, "u");
  });

  it("leaves jobs put back after a limit until their time", () => {
    const later = job("later", "full", 1, 0, { business_id: "b", not_before: new Date(t0 + 10 * minute).toISOString() });
    assert.equal(gateAllows(later, { now: t0 }), false);
    assert.equal(gateAllows(later, { now: t0 + 10 * minute }), true);
    assert.equal(pickReaderJob([later], new Set(), 0, 10, { now: t0 }), null);
  });
});

describe("cool-down when Google limits", () => {
  it("pauses after 2 signals within 5 minutes, 10 min the first time", () => {
    let { state, started } = recordLimit(initialCooldown, t0, defaultThrottle);
    assert.equal(started, null);
    assert.equal(isPaused(state, t0), false);
    ({ state, started } = recordLimit(state, t0 + 2 * minute, defaultThrottle));
    assert.equal(started, 10);
    assert.equal(state.pausedUntil, t0 + 12 * minute);
    assert.equal(isPaused(state, t0 + 11 * minute), true);
    assert.equal(isPaused(state, t0 + 12 * minute), false);
  });

  it("signals far apart do not pause", () => {
    const first = recordLimit(initialCooldown, t0, defaultThrottle).state;
    const second = recordLimit(first, t0 + 6 * minute, defaultThrottle);
    assert.equal(second.started, null);
    assert.equal(second.state.signals.length, 1);
  });

  it("grows to 30 and 60 minutes while it keeps happening, back to 10 after a good read", () => {
    assert.deepEqual([1, 2, 3, 4].map((level) => cooldownMinutesFor(level, defaultThrottle)), [10, 30, 60, 60]);
    let state = { signals: [t0], level: 1, pausedUntil: null };
    let started;
    ({ state, started } = recordLimit(state, t0 + minute, defaultThrottle));
    assert.equal(started, 30);
    // Signals during a pause change nothing.
    assert.equal(recordLimit(state, t0 + 2 * minute, defaultThrottle).started, null);
    state = recordSuccess(state);
    assert.equal(state.level, 0);
    assert.equal(isPaused(state, t0 + 2 * minute), true, "the current pause stays");
    const after = recordLimit({ ...state, pausedUntil: null, signals: [t0 + 40 * minute] }, t0 + 41 * minute, defaultThrottle);
    assert.equal(after.started, 10);
  });

  it("a pause survives a restart of the reader", () => {
    assert.equal(restoreCooldown(new Date(t0 + 5 * minute).toISOString(), t0).pausedUntil, t0 + 5 * minute);
    assert.equal(restoreCooldown(new Date(t0 - minute).toISOString(), t0).pausedUntil, null);
    assert.equal(restoreCooldown(null, t0).pausedUntil, null);
  });
});

describe("jobs hit by a limit", () => {
  it("go back to the queue 10, 30, 60 and 90 minutes later, and fail at the 5th", () => {
    const waits = [0, 1, 2, 3].map((previous) => limitOutcome(previous, t0, null, defaultThrottle));
    assert.deepEqual(
      waits.map((outcome) => [outcome.action, outcome.attempts, (outcome.notBefore - t0) / minute]),
      [
        ["requeue", 1, 10],
        ["requeue", 2, 30],
        ["requeue", 3, 60],
        ["requeue", 4, 90],
      ],
    );
    assert.deepEqual(limitOutcome(4, t0, null, defaultThrottle), { action: "fail", attempts: 5 });
  });

  it("never before the reader's pause ends", () => {
    assert.equal(limitOutcome(0, t0, t0 + 30 * minute, defaultThrottle).notBefore, t0 + 30 * minute);
  });

  it("says when it is tried again, in Portugal's time", () => {
    assert.equal(limitWaitNote(Date.parse("2026-10-09T21:40:00Z")), "À espera: o Google está a limitar o leitor, tentamos outra vez às 22:40.");
  });
});
