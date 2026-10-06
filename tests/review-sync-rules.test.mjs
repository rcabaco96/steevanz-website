import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dailySyncFor, sameLocalDay } from "../src/lib/reviews/sync-rules.ts";

describe("daily sync routine", () => {
  const now = new Date("2026-10-03T22:30:00Z"); // 23:30 in Lisbon

  it("skips customers who already pressed Atualizar that day (Lisbon calendar day)", () => {
    assert.equal(dailySyncFor({ lastSyncedAt: "2026-10-03T08:00:00Z", fullDue: false }, now), "skip");
    assert.equal(dailySyncFor({ lastSyncedAt: "2026-10-02T22:59:00Z", fullDue: false }, now), "refresh");
    assert.equal(dailySyncFor({ lastSyncedAt: null, fullDue: false }, now), "refresh");
  });

  it("still runs the twice-a-year whole-history read", () => {
    assert.equal(dailySyncFor({ lastSyncedAt: "2026-10-03T08:00:00Z", fullDue: true }, now), "full");
  });

  it("uses the Portuguese day, not UTC", () => {
    assert.equal(sameLocalDay("2026-10-03T23:30:00Z", "2026-10-04T08:00:00Z"), true);
    assert.equal(sameLocalDay("2026-10-03T22:30:00Z", "2026-10-03T23:30:00Z"), false);
  });
});
