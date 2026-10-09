import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lisbonTimeOfDay, slotBefore } from "../src/lib/reviews/competition-schedule.ts";
import { decideTick } from "../src/lib/reviews/tick.ts";

const empty = { competitionSlot: null, customerDay: null };

describe("scheduler tick: competition slots (10:00 and 19:00 in Portugal)", () => {
  it("handles the first tick at/after a slot, once", () => {
    const now = new Date("2026-10-03T09:00:00Z"); // 10:00 in Lisbon (summer time)
    const first = decideTick(now, { ...empty, competitionSlot: "2026-10-02T18:00:00.000Z" });
    assert.equal(first.competition.due, true);
    assert.equal(first.competition.slot, "2026-10-03T09:00:00.000Z");
    assert.equal(first.competition.label, "10:00");
    assert.equal(first.competition.next, "2026-10-03T18:00:00.000Z");

    const later = decideTick(new Date("2026-10-03T09:15:00Z"), { ...empty, competitionSlot: first.competition.slot });
    assert.equal(later.competition.due, false);
  });

  it("does nothing before the slot", () => {
    const tick = decideTick(new Date("2026-10-03T08:45:00Z"), { ...empty, competitionSlot: "2026-10-02T18:00:00.000Z" });
    assert.equal(tick.competition.due, false);
  });

  it("catches up a slot missed by earlier ticks (e.g. 19:00 handled at 22:00)", () => {
    const tick = decideTick(new Date("2026-10-03T21:00:00Z"), { ...empty, competitionSlot: "2026-10-03T09:00:00.000Z" });
    assert.equal(tick.competition.due, true);
    assert.equal(tick.competition.label, "19:00");
  });

  it("follows winter time (slots at 10:00 / 19:00 UTC)", () => {
    const tick = decideTick(new Date("2026-12-10T10:05:00Z"), { ...empty, competitionSlot: "2026-12-09T19:00:00.000Z" });
    assert.equal(tick.competition.due, true);
    assert.equal(tick.competition.slot, "2026-12-10T10:00:00.000Z");
  });

  it("the slot before 10:00 is the previous day's 19:00, and before 19:00 the same day's 10:00", () => {
    assert.equal(slotBefore(new Date("2026-10-03T09:00:00Z")).toISOString(), "2026-10-02T18:00:00.000Z");
    assert.equal(slotBefore(new Date("2026-10-03T18:00:00Z")).toISOString(), "2026-10-03T09:00:00.000Z");
    // Across the end of summer time (25 Oct 2026): 19:00 summer (18:00Z) → 10:00 winter (10:00Z).
    assert.equal(slotBefore(new Date("2026-10-25T10:00:00Z")).toISOString(), "2026-10-24T18:00:00.000Z");
  });
});

describe("scheduler tick: customers' routine (22:00 in Portugal)", () => {
  it("starts at 22:00 Lisbon time, in summer and in winter", () => {
    assert.equal(lisbonTimeOfDay(new Date("2026-10-03T12:00:00Z"), 22).toISOString(), "2026-10-03T21:00:00.000Z");
    assert.equal(lisbonTimeOfDay(new Date("2026-12-10T12:00:00Z"), 22).toISOString(), "2026-12-10T22:00:00.000Z");
  });

  it("is due once a day from 22:00, and verified syncs run on every tick until midnight", () => {
    const before = decideTick(new Date("2026-10-03T20:45:00Z"), empty); // 21:45 Lisbon
    assert.equal(before.customers.due, false);
    assert.equal(before.customers.verified, false);

    const at = decideTick(new Date("2026-10-03T21:00:00Z"), { ...empty, customerDay: "2026-10-02" }); // 22:00 Lisbon
    assert.equal(at.customers.due, true);
    assert.equal(at.customers.day, "2026-10-03");
    assert.equal(at.customers.verified, true);

    const after = decideTick(new Date("2026-10-03T22:30:00Z"), { ...empty, customerDay: "2026-10-03" }); // 23:30 Lisbon
    assert.equal(after.customers.due, false);
    assert.equal(after.customers.verified, true);
  });

  it("the Vercel safety-net cron (22:00 UTC) is always at or after 22:00 Lisbon", () => {
    assert.equal(decideTick(new Date("2026-07-01T22:00:00Z"), empty).customers.due, true); // 23:00 summer
    assert.equal(decideTick(new Date("2026-12-01T22:00:00Z"), empty).customers.due, true); // 22:00 winter
  });

  it("the next Lisbon day starts fresh after midnight", () => {
    const tick = decideTick(new Date("2026-10-03T23:15:00Z"), { ...empty, customerDay: "2026-10-03" }); // 00:15 on the 4th
    assert.equal(tick.day, "2026-10-04");
    assert.equal(tick.customers.due, false);
    assert.equal(tick.customers.verified, false);
  });
});
