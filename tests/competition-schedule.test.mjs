import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countdownText, needsSlotRead, nextCompetitionUpdate, previousCompetitionUpdate, slotLabel } from "../src/lib/reviews/competition-schedule.ts";

describe("competition update slots (10:00 and 19:00 in Portugal)", () => {
  it("follows summer time (UTC+1)", () => {
    const now = new Date("2026-10-03T08:30:00Z"); // 09:30 in Lisbon
    assert.equal(nextCompetitionUpdate(now).toISOString(), "2026-10-03T09:00:00.000Z");
    assert.equal(previousCompetitionUpdate(now).toISOString(), "2026-10-02T18:00:00.000Z");
    assert.equal(slotLabel(nextCompetitionUpdate(now)), "10:00");
  });

  it("follows winter time (UTC+0)", () => {
    const now = new Date("2026-12-10T12:00:00Z"); // 12:00 in Lisbon
    assert.equal(nextCompetitionUpdate(now).toISOString(), "2026-12-10T19:00:00.000Z");
    assert.equal(previousCompetitionUpdate(now).toISOString(), "2026-12-10T10:00:00.000Z");
  });

  it("rolls over to tomorrow's 10:00 after 19:00, across the clock change", () => {
    const now = new Date("2026-10-24T20:00:00Z"); // 21:00 Lisbon, the night before summer time ends
    assert.equal(nextCompetitionUpdate(now).toISOString(), "2026-10-25T10:00:00.000Z"); // 10:00 winter time
  });

  it("asks for a read only when the place was not read since the previous slot", () => {
    const now = new Date("2026-10-03T12:00:00Z"); // 13:00 Lisbon, previous slot 10:00 (09:00Z)
    assert.equal(needsSlotRead("2026-10-03T09:30:00Z", now), false);
    assert.equal(needsSlotRead("2026-10-03T08:59:00Z", now), true);
    assert.equal(needsSlotRead(null, now), true);
  });

  it("formats the countdown", () => {
    assert.equal(countdownText((2 * 3600 + 14 * 60 + 33) * 1000), "02:14:33");
    assert.equal(countdownText(-5), "00:00:00");
  });
});
