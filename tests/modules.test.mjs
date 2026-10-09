import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { kindFromCategory, slugify } from "../src/lib/establishments/kinds.ts";
import { estimateWait, formatWait, observedPace, roundUpToFive } from "../src/lib/modules/waitlist/eta.ts";
import { nextScheduleChange, scheduledState } from "../src/lib/modules/waitlist/schedule.ts";
import { cardCodeFrom, codeAlphabet, formatCardCode, isLocked, isStaffCode, normalizeCardCode, rewardInSentence, stampSlots } from "../src/lib/modules/loyalty/rules.ts";
import { bookingAvailability, canChangeOnline, findBookingSlot } from "../src/lib/modules/bookings/availability.ts";
import { normalizePhone, splitPhone } from "../src/lib/phone.ts";

const minute = 60_000;

describe("establishments", () => {
  it("picks the kind from the Google category", () => {
    assert.equal(kindFromCategory("Restaurante de marisco"), "restaurant");
    assert.equal(kindFromCategory("Seafood restaurant"), "restaurant");
    assert.equal(kindFromCategory("Café"), "restaurant");
    assert.equal(kindFromCategory("Barbearia"), "barbershop");
    assert.equal(kindFromCategory("Barber shop"), "barbershop");
    assert.equal(kindFromCategory("Clube de padel"), "sports");
    assert.equal(kindFromCategory("Cabeleireiro"), "salon");
    assert.equal(kindFromCategory("Clínica dentária"), "clinic");
    assert.equal(kindFromCategory("Loja de roupa"), "retail");
    assert.equal(kindFromCategory(null), "restaurant");
    assert.equal(kindFromCategory("Algo desconhecido"), "restaurant");
  });

  it("slugifies names", () => {
    assert.equal(slugify("Café Central — Lisboa"), "cafe-central-lisboa");
    assert.equal(slugify("  ##  "), "");
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

describe("waitlist opening hours", () => {
  // Friday 9 Oct 2026, Lisbon (UTC+1): lunch 12:00–15:00, dinner 19:00–23:00.
  const hours = [
    { weekday: 5, opens: "12:00:00", closes: "15:00:00" },
    { weekday: 5, opens: "19:00:00", closes: "23:00:00" },
  ];
  const at = (time) => Date.parse(`2026-10-09T${time}:00+01:00`);
  const base = { hours, closures: [], timeZone: "Europe/Lisbon" };

  it("opens a closed queue when service starts", () => {
    assert.equal(scheduledState({ ...base, state: "closed", stateChangedAt: at("11:00"), now: at("12:05") }), "open");
  });
  it("leaves it closed when the team closed it during this service", () => {
    assert.equal(scheduledState({ ...base, state: "closed", stateChangedAt: at("13:00"), now: at("13:30") }), null);
  });
  it("closes an open or paused queue after closing time", () => {
    assert.equal(scheduledState({ ...base, state: "open", stateChangedAt: at("12:00"), now: at("15:10") }), "closed");
    assert.equal(scheduledState({ ...base, state: "paused", stateChangedAt: at("14:00"), now: at("16:00") }), "closed");
  });
  it("respects a queue opened by hand after closing time", () => {
    assert.equal(scheduledState({ ...base, state: "open", stateChangedAt: at("15:20"), now: at("16:00") }), null);
  });
  it("does nothing on a closed day or a day without hours", () => {
    assert.equal(scheduledState({ ...base, closures: ["2026-10-09"], state: "closed", stateChangedAt: 0, now: at("12:30") }), null);
    assert.equal(scheduledState({ ...base, state: "closed", stateChangedAt: 0, now: Date.parse("2026-10-07T12:30:00+01:00") }), null);
  });
  it("tells the next change", () => {
    assert.deepEqual(nextScheduleChange({ ...base, now: at("13:00") }), { kind: "closes", at: at("15:00") });
    assert.deepEqual(nextScheduleChange({ ...base, now: at("16:00") }), { kind: "opens", at: at("19:00") });
  });
});

describe("loyalty rules", () => {
  it("puts the reward inside a sentence without lowercasing proper nouns", () => {
    assert.equal(rewardInSentence("Pastel de Belém oferecido"), "pastel de Belém oferecido");
    assert.equal(rewardInSentence("Um corte grátis"), "um corte grátis");
  });

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
      kind: "one",
      timeZone: "Europe/Lisbon",
      now,
      minNoticeMinutes: 60,
      maxDaysAhead: 7,
      intervalMinutes: 30,
      durationMinutes: 30,
      bufferMinutes: 0,
      lastArrivalMinutes: 60,
      hours: [{ weekday: wednesday, opens: "10:00", closes: "12:00" }],
      closures: [],
      staff: ["rui", "pedro"],
      staffHours: {},
      busy: [],
      capacity: 10,
      partySize: 2,
      arrivals: [],
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
    const day = today(bookingAvailability(input({ durationMinutes: 45, bufferMinutes: 5 })));
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

  it("fills a restaurant turn by the people booked in it", () => {
    // A turn 10:00–12:00 for 10 people, the last booking an hour before closing; 9 already booked.
    const lunch = { kind: "group", staff: [], partySize: 2, durationMinutes: 120, lastArrivalMinutes: 60, arrivals: [{ start: Date.parse("2026-10-07T09:30:00Z"), party: 9 }] };
    const full = today(bookingAvailability(input(lunch)));
    assert.equal(full.slots.length, 0);
    assert.equal(findBookingSlot([full], "2026-10-07T09:00:00.000Z"), null);
    // One more person still fits, at any time of the turn (no meal length).
    const one = today(bookingAvailability(input({ ...lunch, partySize: 1 })));
    assert.deepEqual(one.slots.map((slot) => slot.time), ["10:00", "10:30", "11:00"]);
    assert.equal(one.slots[0].turn.label, "Manhã");
    assert.equal(one.slots[0].end, "2026-10-07T11:00:00.000Z");
  });

  it("counts each turn on its own", () => {
    // Lunch is full, dinner is free.
    const hours = [
      { weekday: wednesday, opens: "12:00", closes: "15:00" },
      { weekday: wednesday, opens: "19:00", closes: "23:00" },
    ];
    const arrivals = [{ start: Date.parse("2026-10-07T12:00:00Z"), party: 10 }];
    const day = today(bookingAvailability(input({ kind: "group", staff: [], hours, arrivals, partySize: 2, lastArrivalMinutes: 60, durationMinutes: 120 })));
    assert.ok(day.slots.every((slot) => slot.turn.label === "Jantar"));
    assert.equal(day.slots[0].time, "19:00");
    assert.equal(day.slots[day.slots.length - 1].time, "22:00");
  });

  it("keeps people and places inside their own hours", () => {
    // Rui only works from 11:00; Pedro follows the space.
    const staffHours = { rui: [{ weekday: wednesday, opens: "11:00", closes: "12:00" }] };
    const day = today(bookingAvailability(input({ staffHours })));
    assert.deepEqual(day.slots[0].staff, ["pedro"]);
    assert.deepEqual(day.slots.find((slot) => slot.time === "11:00").staff, ["rui", "pedro"]);
  });

  it("only allows online changes before the limit", () => {
    const start = new Date(now + 3 * 60 * minute).toISOString();
    assert.ok(canChangeOnline(start, 2, now));
    assert.ok(!canChangeOnline(start, 4, now));
  });
});

describe("phone numbers", () => {
  it("Portuguese: 9 digits starting with 9, 2 or 3, with or without +351", () => {
    assert.equal(normalizePhone("912345678"), "+351 912 345 678");
    assert.equal(normalizePhone("912 345 678"), "+351 912 345 678");
    assert.equal(normalizePhone("+351 912 345 678"), "+351 912 345 678");
    assert.equal(normalizePhone("00351912345678"), "+351 912 345 678");
    assert.equal(normalizePhone("213555010"), "+351 213 555 010");
    assert.equal(normalizePhone("91234567"), null);
    assert.equal(normalizePhone("9123456789"), null);
    assert.equal(normalizePhone("812345678"), null);
    assert.equal(normalizePhone("+351 12345"), null);
    assert.equal(normalizePhone("91234567a"), null);
    assert.equal(normalizePhone("   "), null);
  });
  it("other countries: the chosen code and the number, without the leading 0", () => {
    assert.equal(normalizePhone("07700 900123", "44"), "+44 7700900123");
    assert.equal(normalizePhone("612 34 56 78", "34"), "+34 612345678");
    assert.equal(normalizePhone("12345", "34"), null);
    assert.equal(normalizePhone("+44 7700 900123", "351"), "+447700900123");
    assert.equal(normalizePhone("+81 90 1234 5678", ""), "+819012345678");
    assert.equal(normalizePhone("90 1234 5678", ""), null);
  });
  it("splits a stored number back into country and number", () => {
    assert.deepEqual(splitPhone("+351 912 345 678"), { dial: "351", number: "912 345 678" });
    assert.deepEqual(splitPhone("+44 7700900123"), { dial: "44", number: "7700900123" });
    assert.deepEqual(splitPhone("912345678"), { dial: "351", number: "912345678" });
    assert.deepEqual(splitPhone(null), { dial: "351", number: "" });
  });
});
