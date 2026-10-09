import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  competitorRepliesPerDay,
  customerDailyJob,
  jobKey,
  newPlaceJobs,
  planCompetitionSlot,
  planDailyJobs,
  readerAlertDue,
  repliesDue,
} from "../src/lib/reviews/reader-queue.ts";
import { needsFullSync } from "../src/lib/reviews/sync-rules.ts";

const now = new Date("2026-10-03T22:00:00Z"); // 23:00 in Lisbon
const recentFull = "2026-06-01T10:00:00Z";
const business = (id, last, full = recentFull) => ({ id, last_synced_at: last, full_synced_at: full });
const competitor = (place_id, extra = {}) => ({ place_id, excluded: false, is_self: false, ...extra });
const place = (place_id, read_on, replies_read_on) => ({ place_id, read_on, replies_read_on });

describe("customer jobs", () => {
  it("updates only customers not updated that Lisbon day", () => {
    assert.equal(customerDailyJob(business("a", "2026-10-03T07:00:00Z"), now), null);
    assert.deepEqual(customerDailyJob(business("b", "2026-10-02T22:59:00Z"), now), { kind: "update", business_id: "b", place_id: null, priority: 5, requested_by: "cron" });
  });

  it("reads the whole history only on the first import", () => {
    assert.equal(needsFullSync({ full_synced_at: "2020-01-01T10:00:00Z" }), false);
    assert.equal(needsFullSync({ full_synced_at: null }), true);
    assert.equal(customerDailyJob(business("c", "2026-10-03T07:00:00Z", "2020-03-01T10:00:00Z"), now), null);
  });

  it("gives the first import a higher priority", () => {
    const job = customerDailyJob(business("d", null, null), now);
    assert.equal(job.kind, "full");
    assert.equal(job.priority, 3);
  });
});

describe("competitor jobs (slots at 10:00 and 19:00 in Portugal)", () => {
  // now = 23:00 in Lisbon, so the previous slot is 19:00 (18:00Z).
  const read = (place_id, read_at, replies_read_on = "2026-10-01") => ({ place_id, read_on: read_at?.slice(0, 10) ?? null, read_at, replies_read_on });

  it("reads each shared place once, skipping own, excluded and places read since the previous slot", () => {
    const jobs = planCompetitionSlot(
      [],
      [competitor("p1"), competitor("p1"), competitor("p2"), competitor("p3", { excluded: true }), competitor("p4", { is_self: true }), competitor("p5")],
      [read("p2", "2026-10-03T18:30:00Z"), read("p1", "2026-10-03T09:30:00Z"), read("p5", null)],
      now,
    );
    assert.deepEqual(
      jobs.map((job) => [job.kind, job.place_id, job.business_id]),
      [
        ["competitor", "p1", null],
        ["competitor", "p5", null],
      ],
    );
  });

  it("skips a place its own customer updated since the previous slot (shared base per place)", () => {
    const customers = [
      { ...business("x", "2026-10-03T18:10:00Z"), place_id: "p1" },
      { ...business("y", "2026-10-03T20:00:00Z"), google_place_id: "p2" },
      { ...business("z", "2026-10-03T12:00:00Z"), place_id: "p3" },
    ];
    const jobs = planCompetitionSlot(customers, [competitor("p1"), competitor("p2"), competitor("p3")], [read("p1", null), read("p2", null), read("p3", null)], now);
    assert.deepEqual(
      jobs.map((job) => `${job.kind}:${job.place_id}`),
      ["competitor:p3"],
    );
  });

  it("reads every place not read since the slot itself (numbers come from that read)", () => {
    const at = new Date("2026-10-03T18:00:00Z"); // 19:00 slot
    const jobs = planCompetitionSlot(
      [],
      [competitor("p1"), competitor("p2")],
      [read("p1", "2026-10-03T09:20:00Z"), read("p2", "2026-10-03T18:05:00Z")],
      at,
    );
    assert.deepEqual(jobs.filter((job) => job.kind === "competitor").map((job) => job.place_id), ["p1"]);
  });

  it("reads 12 months of reviews only for places never measured, capped per slot", () => {
    const places = ["a", "b", "c", "d"];
    const rows = [place("a", null, "2026-09-19"), place("b", null, null), place("c", null, "2026-09-01")];
    assert.deepEqual(repliesDue(places, rows, "2026-10-03"), ["b", "d"]);
    assert.deepEqual(repliesDue(places, rows, "2026-10-03", 1), ["b"]);

    const many = Array.from({ length: competitorRepliesPerDay + 10 }, (_, index) => competitor(`p${index}`));
    const jobs = planCompetitionSlot([], many, [], now);
    assert.equal(jobs.filter((job) => job.kind === "competitor_replies").length, competitorRepliesPerDay);
    assert.equal(jobs.filter((job) => job.kind === "competitor").length, competitorRepliesPerDay + 10);
  });

  it("the daily customer routine queues customers only, first imports first", () => {
    const jobs = planDailyJobs([business("old", "2026-10-01T10:00:00Z"), business("new", null, null)], now);
    assert.deepEqual(
      jobs.map((job) => `${job.kind}:${job.business_id ?? job.place_id}`),
      ["full:new", "update:old"],
    );
  });

  it("verified customers are left to the official Google API", () => {
    const jobs = planDailyJobs([business("old", "2026-10-01T10:00:00Z"), { ...business("ver", null, null), google_link_status: "connected" }], now);
    assert.deepEqual(
      jobs.map((job) => `${job.kind}:${job.business_id}`),
      ["update:old"],
    );
  });

  it("after a competitor search, queues only places not read today", () => {
    const jobs = newPlaceJobs(["p1", "p2", "p2"], [place("p1", "2026-10-03", "2026-10-02")], "admin", now);
    assert.deepEqual(
      jobs.map((job) => `${job.kind}:${job.place_id}:${job.priority}:${job.requested_by}`),
      ["competitor:p2:3:admin", "competitor_replies:p2:3:admin"],
    );
  });

  it("keys jobs like the unique active indexes", () => {
    assert.equal(jobKey({ kind: "update", business_id: "b", place_id: null }), "b:b:update");
    assert.equal(jobKey({ kind: "competitor", business_id: null, place_id: "p" }), "p:p:competitor");
  });
});

describe("reader offline alert", () => {
  it("alerts after 12 h without a heartbeat, at most once a day", () => {
    assert.equal(readerAlertDue("2026-10-03T12:00:00Z", null, now), false);
    assert.equal(readerAlertDue("2026-10-03T09:00:00Z", null, now), true);
    assert.equal(readerAlertDue(null, null, now), true);
    assert.equal(readerAlertDue("2026-10-02T09:00:00Z", "2026-10-03T06:00:00Z", now), false);
    assert.equal(readerAlertDue("2026-10-02T09:00:00Z", "2026-10-02T22:00:00Z", now), true);
  });
});
