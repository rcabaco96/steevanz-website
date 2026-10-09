import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  competitionProgress,
  duration,
  emptyReaderJobs,
  finishedJob,
  fullImportProgress,
  isActive,
  isReaderOnline,
  maxPollMs,
  nextPollDelay,
  pollingNeeded,
  queuedPollMs,
  recentSyncMinutes,
  relativeTime,
  runningPollMs,
  updateIntervalMinutes,
} from "../src/lib/reviews/import-jobs.ts";

const now = Date.parse("2026-10-03T12:00:00Z");
const ago = (ms) => new Date(now - ms).toISOString();

function job(changes = {}) {
  return {
    id: "j1",
    kind: "update",
    status: "queued",
    priority: 1,
    reviewsExpected: null,
    reviewsDone: 0,
    reviewsNew: 0,
    pagesDone: 0,
    avgPageMs: null,
    error: null,
    requestedAt: ago(0),
    startedAt: null,
    finishedAt: null,
    ...changes,
  };
}
const state = (changes) => ({ ...emptyReaderJobs, ...changes });

describe("reader heartbeat", () => {
  it("is online only when it reported in the last 30 seconds", () => {
    assert.equal(isReaderOnline(ago(5_000), now), true);
    assert.equal(isReaderOnline(ago(31_000), now), false);
    assert.equal(isReaderOnline(null, now), false);
  });
});

describe("15-minute rule", () => {
  it("blocks a new read within the interval and says how long ago", () => {
    assert.equal(recentSyncMinutes(ago(30_000), now), 0);
    assert.equal(recentSyncMinutes(ago(7 * 60_000 + 10_000), now), 7);
  });
  it("allows a read after the interval or with no sync yet", () => {
    assert.equal(recentSyncMinutes(ago(updateIntervalMinutes * 60_000), now), null);
    assert.equal(recentSyncMinutes(null, now), null);
  });
});

describe("finished jobs", () => {
  it("reports the job that went from active to done or failed", () => {
    const running = state({ update: job({ status: "running" }) });
    assert.equal(finishedJob(running, state({ update: job({ status: "done", reviewsNew: 2 }) }), "update")?.reviewsNew, 2);
    assert.equal(finishedJob(running, state({ update: job({ status: "failed" }) }), "update")?.status, "failed");
  });
  it("ignores jobs that were already finished, other jobs and other kinds", () => {
    const done = state({ update: job({ status: "done" }) });
    assert.equal(finishedJob(done, done, "update"), null);
    assert.equal(finishedJob(state({ update: job() }), state({ update: job({ id: "j2", status: "done" }) }), "update"), null);
    assert.equal(finishedJob(state({ update: job() }), state({ update: job({ status: "done" }) }), "full"), null);
    assert.equal(isActive(null), false);
  });
});

describe("full import figures", () => {
  const stored = { count: 312, googleTotal: 679, newestAt: null };
  it("uses what is saved and the last Google total while idle or queued", () => {
    assert.deepEqual(fullImportProgress(null, stored), { done: 312, total: 679, left: 367, ratio: 312 / 679, secondsLeft: null });
    const queued = fullImportProgress(job({ kind: "full" }), stored);
    assert.equal(queued.done, 312);
    assert.equal(queued.secondsLeft, Math.round((4000 + 68 * 700) / 1000));
  });
  it("follows the running job, with the last known total until the reader counts them", () => {
    const early = fullImportProgress(job({ kind: "full", status: "running", reviewsDone: 100, pagesDone: 10, avgPageMs: 500 }), stored);
    assert.equal(early.total, 679);
    assert.equal(early.left, 579);
    assert.equal(early.secondsLeft, Math.round((58 * 500) / 1000));
    const counted = fullImportProgress(job({ kind: "full", status: "running", reviewsExpected: 700, reviewsDone: 100, pagesDone: 10, avgPageMs: 500 }), stored);
    assert.equal(counted.total, 700);
  });
  it("never goes over 100% and has no total before the first import", () => {
    assert.equal(fullImportProgress(null, { count: 690, googleTotal: 679, newestAt: null }).ratio, 1);
    assert.equal(fullImportProgress(null, { count: 30, googleTotal: null, newestAt: null }).total, null);
  });
});

describe("texts", () => {
  it("formats durations and relative times", () => {
    assert.equal(duration(45), "45 s");
    assert.equal(duration(130), "2 min 10 s");
    assert.equal(relativeTime(ago(20_000), now), "agora mesmo");
    assert.equal(relativeTime(ago(3 * 60_000), now), "há 3 min");
    assert.equal(relativeTime(ago(26 * 3_600_000), now), "há 1 dia");
  });
});

describe("Panel polling", () => {
  it("polls only while a job of the customer is queued or running", () => {
    assert.equal(pollingNeeded(emptyReaderJobs), false);
    assert.equal(pollingNeeded({ ...emptyReaderJobs, update: job({ status: "done" }), full: job({ kind: "full", status: "failed" }) }), false);
    assert.equal(pollingNeeded({ ...emptyReaderJobs, update: job() }), true);
    assert.equal(pollingNeeded({ ...emptyReaderJobs, discover: job({ kind: "discover", status: "running" }) }), true);
    // Competitors still to read but no read queued (nothing will change by itself): no polling.
    assert.equal(pollingNeeded({ ...emptyReaderJobs, competition: { total: 3, read: 1, pending: 2, active: 0 } }), false);
    assert.equal(pollingNeeded({ ...emptyReaderJobs, competition: { total: 3, read: 1, pending: 2, active: 1 } }), true);
  });

  it("backs off while nothing changes, back to the base on a change", () => {
    const queued = { ...emptyReaderJobs, update: job() };
    const running = { ...emptyReaderJobs, update: job({ status: "running" }) };
    assert.equal(nextPollDelay(running, null, false), runningPollMs);
    assert.equal(nextPollDelay(queued, null, false), queuedPollMs);
    assert.equal(nextPollDelay(queued, queuedPollMs, false), queuedPollMs * 1.5);
    assert.equal(nextPollDelay(queued, 25_000, false), maxPollMs);
    assert.equal(nextPollDelay(running, 20_000, true), runningPollMs);
  });

  it("counts competitor reads queued or running", () => {
    const rows = [
      { place_id: "a", status: "done", requested_at: ago(2000) },
      { place_id: "b", status: "queued", requested_at: ago(1000) },
    ];
    assert.deepEqual(competitionProgress(["a", "b", "c"], rows), { total: 3, read: 1, pending: 2, active: 1 });
  });
});

describe("waiting while Google limits the reader", async () => {
  const { limitWaitText, limitWaitUntil } = await import("../src/lib/reviews/import-jobs.ts");
  const later = (minutes) => new Date(now + minutes * 60_000).toISOString();
  it("shows the job's own retry time, or the reader's pause, whichever is later", () => {
    const reader = { pausedUntil: null };
    assert.equal(limitWaitUntil(job({ notBefore: later(20) }), reader, now), later(20));
    assert.equal(limitWaitUntil(job({ notBefore: later(20) }), { pausedUntil: later(30) }, now), later(30));
    assert.equal(limitWaitUntil(job(), { pausedUntil: later(5) }, now), later(5));
    assert.equal(limitWaitUntil(job({ notBefore: later(-1) }), reader, now), null);
    assert.equal(limitWaitUntil(job({ status: "running", notBefore: later(20) }), reader, now), null);
    assert.equal(limitWaitText("2026-10-09T21:40:00Z"), "À espera: o Google está a limitar o leitor, tentamos outra vez às 22:40");
  });
});
