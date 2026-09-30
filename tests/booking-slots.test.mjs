import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeAvailability,
  findSlot,
  zonedDateTimeToUtc,
  weekdayOfDate,
  addDaysToDate,
} from "../src/lib/booking/slots.ts";

const lisbon = "Europe/Lisbon";

const weekdays = [1, 2, 3, 4, 5];

function baseConfig(overrides = {}) {
  return {
    timeZone: lisbon,
    minNoticeHours: 12,
    maxDaysAhead: 30,
    rules: weekdays.map((weekday) => ({ weekday, startTime: "10:00", endTime: "18:00", slotMinutes: 30, active: true })),
    breaks: weekdays.map((weekday) => ({ weekday, startTime: "13:00", endTime: "14:00" })),
    blockedDates: [],
    ...overrides,
  };
}

function day(days, date) {
  const found = days.find((candidate) => candidate.date === date);
  assert.ok(found, `missing day ${date}`);
  return found;
}

describe("zonedDateTimeToUtc", () => {
  it("handles summer time (WEST, UTC+1)", () => {
    assert.equal(zonedDateTimeToUtc("2026-07-15", 600, lisbon).toISOString(), "2026-07-15T09:00:00.000Z");
  });

  it("handles winter time (WET, UTC+0)", () => {
    assert.equal(zonedDateTimeToUtc("2026-01-15", 600, lisbon).toISOString(), "2026-01-15T10:00:00.000Z");
  });

  it("handles the days around the October 2026 DST change", () => {
    assert.equal(zonedDateTimeToUtc("2026-10-23", 600, lisbon).toISOString(), "2026-10-23T09:00:00.000Z");
    assert.equal(zonedDateTimeToUtc("2026-10-26", 600, lisbon).toISOString(), "2026-10-26T10:00:00.000Z");
  });

  it("handles the days around the March 2026 DST change", () => {
    assert.equal(zonedDateTimeToUtc("2026-03-27", 600, lisbon).toISOString(), "2026-03-27T10:00:00.000Z");
    assert.equal(zonedDateTimeToUtc("2026-03-30", 600, lisbon).toISOString(), "2026-03-30T09:00:00.000Z");
  });
});

describe("date helpers", () => {
  it("computes weekdays and adds days across month boundaries", () => {
    assert.equal(weekdayOfDate("2026-10-01"), 4);
    assert.equal(weekdayOfDate("2026-10-04"), 0);
    assert.equal(addDaysToDate("2026-10-30", 3), "2026-11-02");
    assert.equal(addDaysToDate("2026-12-31", 1), "2027-01-01");
  });
});

describe("computeAvailability", () => {
  const now = new Date("2026-10-01T08:00:00Z");

  it("returns maxDaysAhead + 1 days starting today in Lisbon", () => {
    const days = computeAvailability(baseConfig(), now, []);
    assert.equal(days.length, 31);
    assert.equal(days[0].date, "2026-10-01");
    assert.equal(days.at(-1).date, "2026-10-31");
  });

  it("respects the minimum notice", () => {
    const days = computeAvailability(baseConfig(), now, []);
    assert.equal(day(days, "2026-10-01").slots.length, 0);
    assert.equal(day(days, "2026-10-02").slots[0].time, "10:00");
  });

  it("removes breaks and keeps 30 minute slots", () => {
    const days = computeAvailability(baseConfig(), now, []);
    const friday = day(days, "2026-10-02");
    const times = friday.slots.map((slot) => slot.time);
    assert.equal(friday.slots.length, 14);
    assert.ok(!times.includes("13:00"));
    assert.ok(!times.includes("13:30"));
    assert.equal(times.at(-1), "17:30");
    const first = friday.slots[0];
    assert.equal(new Date(first.end).getTime() - new Date(first.start).getTime(), 30 * 60_000);
  });

  it("has no slots at the weekend", () => {
    const days = computeAvailability(baseConfig(), now, []);
    assert.equal(day(days, "2026-10-03").slots.length, 0);
    assert.equal(day(days, "2026-10-04").slots.length, 0);
  });

  it("uses the correct UTC offset on both sides of the DST change", () => {
    const days = computeAvailability(baseConfig(), now, []);
    assert.equal(day(days, "2026-10-23").slots[0].start, "2026-10-23T09:00:00.000Z");
    assert.equal(day(days, "2026-10-26").slots[0].start, "2026-10-26T10:00:00.000Z");
  });

  it("skips blocked dates", () => {
    const days = computeAvailability(baseConfig({ blockedDates: ["2026-10-05"] }), now, []);
    assert.equal(day(days, "2026-10-05").slots.length, 0);
    assert.equal(day(days, "2026-10-06").slots.length, 14);
  });

  it("removes slots overlapping existing bookings", () => {
    const busy = [{ start: new Date("2026-10-02T09:00:00Z"), end: new Date("2026-10-02T09:30:00Z") }];
    const days = computeAvailability(baseConfig(), now, busy);
    const times = day(days, "2026-10-02").slots.map((slot) => slot.time);
    assert.ok(!times.includes("10:00"));
    assert.ok(times.includes("10:30"));
  });

  it("ignores inactive rules", () => {
    const config = baseConfig();
    config.rules = config.rules.map((rule) => (rule.weekday === 5 ? { ...rule, active: false } : rule));
    const days = computeAvailability(config, now, []);
    assert.equal(day(days, "2026-10-02").slots.length, 0);
  });

  it("skips non-existent local times and does not duplicate repeated ones", () => {
    const config = baseConfig({
      minNoticeHours: 0,
      maxDaysAhead: 60,
      rules: [{ weekday: 0, startTime: "00:00", endTime: "03:00", slotMinutes: 30, active: true }],
      breaks: [],
    });
    const springDays = computeAvailability(config, new Date("2026-03-20T00:00:00Z"), []);
    const spring = day(springDays, "2026-03-29").slots.map((slot) => slot.time);
    assert.deepEqual(spring, ["00:00", "00:30", "02:00", "02:30"]);

    const autumnDays = computeAvailability(config, new Date("2026-10-20T00:00:00Z"), []);
    const autumn = day(autumnDays, "2026-10-25").slots;
    const starts = new Set(autumn.map((slot) => slot.start));
    assert.equal(starts.size, autumn.length);
    assert.deepEqual(
      autumn.map((slot) => slot.time),
      ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30"],
    );
  });

  it("finds a slot by ISO start", () => {
    const days = computeAvailability(baseConfig(), now, []);
    assert.ok(findSlot(days, "2026-10-02T09:00:00.000Z"));
    assert.ok(findSlot(days, "2026-10-02T09:00:00Z"));
    assert.equal(findSlot(days, "2026-10-02T12:00:00Z"), null);
    assert.equal(findSlot(days, "not-a-date"), null);
  });
});
