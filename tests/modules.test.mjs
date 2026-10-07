import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readableTextOn, slugify } from "../src/lib/establishments/kinds.ts";
import { estimateWait, formatWait, observedPace, roundUpToFive } from "../src/lib/modules/waitlist/eta.ts";
import { cardCodeFrom, codeAlphabet, formatCardCode, isLocked, isStaffCode, normalizeCardCode, stampSlots } from "../src/lib/modules/loyalty/rules.ts";
import { bookingAvailability, canChangeOnline, findBookingSlot } from "../src/lib/modules/bookings/availability.ts";

const minute = 60_000;

describe("establishments", () => {
  it("slugifies names", () => {
    assert.equal(slugify("Café Central — Lisboa"), "cafe-central-lisboa");
    assert.equal(slugify("  ##  "), "");
  });

  it("picks readable text on brand colours", () => {
    assert.equal(readableTextOn("#7a2d60"), "#ffffff");
    assert.equal(readableTextOn("#f5d76e"), "#1d1220");
    assert.equal(readableTextOn("#ffffff"), "#1d1220");
  });
});

describe("waitlist estimate", () => {
  const now = Date.parse("2026-10-07T20:00:00Z");
  const turn = { serviceMinutes: null, staffId: null };

  it("is zero for the next person", () => {
    assert.equal(estimateWait({ ahead: [], avgMinutes: 15, activeStaff: 1, recentCalls: [], now }), 0);
  });

  it("uses the configured average without enough calls", () => {
    assert.equal(estimateWait({ ahead: [turn, turn], avgMinutes: 12, activeStaff: 1, recentCalls: [now - 5 * minute], now }), 25);
  });

  it("blends in the real pace of the last calls", () => {
    const calls = [now - 30 * minute, now - 20 * minute, now - 10 * minute];
    assert.equal(observedPace(calls, now), 10);
    // (20 + 10) / 2 = 15 per turn × 2 ahead = 30
    assert.equal(estimateWait({ ahead: [turn, turn], avgMinutes: 20, activeStaff: 1, recentCalls: calls, now }), 30);
  });

  it("ignores calls older than 90 minutes", () => {
    const calls = [now - 200 * minute, now - 190 * minute, now - 180 * minute];
    assert.equal(observedPace(calls, now), null);
  });

  it("shares service time between professionals", () => {
    const ahead = [
      { serviceMinutes: 30, staffId: null },
      { serviceMinutes: 30, staffId: null },
      { serviceMinutes: 15, staffId: null },
    ];
    assert.equal(estimateWait({ ahead, avgMinutes: 20, activeStaff: 3, recentCalls: [], now }), 25);
  });

  it("only counts people for the same professional (or anyone) when waiting for one", () => {
    const ahead = [
      { serviceMinutes: 30, staffId: "rui" },
      { serviceMinutes: 30, staffId: "pedro" },
      { serviceMinutes: 15, staffId: null },
    ];
    assert.equal(estimateWait({ ahead, self: { serviceMinutes: 30, staffId: "rui" }, avgMinutes: 20, activeStaff: 2, recentCalls: [], now }), 45);
  });

  it("rounds and formats", () => {
    assert.equal(roundUpToFive(1), 5);
    assert.equal(roundUpToFive(21), 25);
    assert.equal(formatWait(0), "a seguir");
    assert.equal(formatWait(15), "cerca de 15 min");
    assert.equal(formatWait(70), "cerca de 1 h 10 min");
    assert.equal(formatWait(120), "cerca de 2 h");
  });
});

describe("loyalty rules", () => {
  it("makes readable 6-character codes", () => {
    const code = cardCodeFrom(new Uint8Array([0, 1, 2, 3, 4, 250]));
    assert.equal(code.length, 6);
    for (const char of code) assert.ok(codeAlphabet.includes(char));
    assert.equal(formatCardCode("K7P29Q"), "K7P 29Q");
    assert.equal(normalizeCardCode(" k7p-29q "), "K7P29Q");
  });

  it("checks staff codes and locks", () => {
    assert.ok(isStaffCode("123456"));
    assert.ok(!isStaffCode("12345"));
    assert.ok(!isStaffCode("12a456"));
    const now = Date.now();
    assert.ok(isLocked(new Date(now + minute).toISOString(), now));
    assert.ok(!isLocked(new Date(now - minute).toISOString(), now));
    assert.ok(!isLocked(null, now));
  });

  it("draws the stamp slots", () => {
    assert.deepEqual(stampSlots(2, 4), [true, true, false, false]);
  });
});

describe("booking availability", () => {
  // Wednesday 7 October 2026, 08:00 in Lisbon (UTC+1).
  const now = Date.parse("2026-10-07T07:00:00Z");
  const wednesday = 3;

  function input(overrides = {}) {
    return {
      mode: "service",
      timeZone: "Europe/Lisbon",
      now,
      minNoticeMinutes: 60,
      maxDaysAhead: 7,
      intervalMinutes: 30,
      occupiedMinutes: 30,
      fitMinutes: 30,
      hours: [{ weekday: wednesday, opens: "10:00", closes: "12:00" }],
      closures: [],
      staff: ["rui", "pedro"],
      busy: [],
      seatsPerSlot: 10,
      partySize: 2,
      seatsTaken: {},
      ...overrides,
    };
  }

  function today(days) {
    const day = days.find((candidate) => candidate.date === "2026-10-07");
    assert.ok(day);
    return day;
  }

  it("lists slots inside opening hours that fit before closing", () => {
    const day = today(bookingAvailability(input()));
    assert.deepEqual(day.slots.map((slot) => slot.time), ["10:00", "10:30", "11:00", "11:30"]);
    assert.equal(day.slots[0].start, "2026-10-07T09:00:00.000Z");
    assert.deepEqual(day.slots[0].staff, ["rui", "pedro"]);
  });

  it("drops slots where the service no longer fits", () => {
    const day = today(bookingAvailability(input({ occupiedMinutes: 50, fitMinutes: 45 })));
    assert.deepEqual(day.slots.map((slot) => slot.time), ["10:00", "10:30", "11:00"]);
  });

  it("respects the minimum notice", () => {
    const day = today(bookingAvailability(input({ minNoticeMinutes: 150 })));
    assert.deepEqual(day.slots.map((slot) => slot.time), ["10:30", "11:00", "11:30"]);
  });

  it("keeps a slot while one professional is free", () => {
    const busy = [{ staffId: "rui", kind: "booking", start: Date.parse("2026-10-07T09:00:00Z"), end: Date.parse("2026-10-07T09:30:00Z") }];
    const day = today(bookingAvailability(input({ busy })));
    assert.deepEqual(day.slots[0].staff, ["pedro"]);
    const both = [...busy, { staffId: "pedro", kind: "booking", start: Date.parse("2026-10-07T09:00:00Z"), end: Date.parse("2026-10-07T09:30:00Z") }];
    assert.equal(today(bookingAvailability(input({ busy: both }))).slots[0].time, "10:30");
  });

  it("treats an establishment without professionals as one resource", () => {
    const busy = [{ staffId: null, kind: "booking", start: Date.parse("2026-10-07T09:00:00Z"), end: Date.parse("2026-10-07T10:00:00Z") }];
    const day = today(bookingAvailability(input({ staff: [], busy })));
    assert.deepEqual(day.slots.map((slot) => slot.time), ["11:00", "11:30"]);
  });

  it("closes slots for establishment-wide blocks and closed days", () => {
    const busy = [{ staffId: null, kind: "block", start: Date.parse("2026-10-07T09:00:00Z"), end: Date.parse("2026-10-07T11:00:00Z") }];
    assert.equal(today(bookingAvailability(input({ busy }))).slots.length, 0);
    assert.equal(today(bookingAvailability(input({ closures: ["2026-10-07"] }))).slots.length, 0);
  });

  it("counts seats per arrival time in table mode", () => {
    const tenOClock = "2026-10-07T09:00:00.000Z";
    const day = today(bookingAvailability(input({ mode: "table", staff: [], seatsTaken: { [tenOClock]: 9 }, partySize: 2 })));
    assert.equal(day.slots[0].time, "10:30");
    assert.ok(findBookingSlot([day], "2026-10-07T09:30:00.000Z"));
    assert.equal(findBookingSlot([day], tenOClock), null);
  });

  it("only allows online changes before the limit", () => {
    const start = new Date(now + 3 * 60 * minute).toISOString();
    assert.ok(canChangeOnline(start, 2, now));
    assert.ok(!canChangeOnline(start, 4, now));
  });
});
