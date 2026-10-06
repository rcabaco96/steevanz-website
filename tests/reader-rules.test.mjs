import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { distributionAverage, replyRateFrom } from "../src/lib/reviews/competitors.ts";
import {
  daysBetween,
  lisbonDay,
  matchStoredReviews,
  slideReplyRate,
  pageReachesStop,
  pickReaderJob,
  readerJobKey,
  repliesMaxReviews,
  repliesReadDone,
  replySampleFrom,
  reviewRequestSort,
  toStarDistribution,
  updateStopBefore,
} from "../src/lib/reviews/maps-reader.ts";

const now = new Date("2026-10-03T12:00:00Z");
const daysAgo = (days) => new Date(now.getTime() - days * 86_400_000).toISOString();
const job = (id, priority, minutes, target = {}) => ({
  id,
  kind: "update",
  business_id: null,
  place_id: null,
  priority,
  requested_at: new Date(now.getTime() + minutes * 60_000).toISOString(),
  ...target,
});

describe("reader queue", () => {
  const queued = [job("a", 5, 0, { place_id: "p1" }), job("b", 1, 5, { business_id: "b1" }), job("c", 3, 1, { business_id: "b2" }), job("d", 1, 2, { business_id: "b3" })];

  it("takes the lowest priority number first, then the oldest request", () => {
    assert.equal(pickReaderJob(queued, new Set(), 0).id, "d");
    assert.equal(pickReaderJob(queued.slice(0, 3), new Set(), 0).id, "b");
    assert.equal(pickReaderJob([queued[0], queued[2]], new Set(), 0).id, "c");
  });

  it("never runs two jobs for the same business or place", () => {
    assert.equal(pickReaderJob(queued, new Set(["business:b3", "business:b1"]), 0).id, "c");
    assert.equal(pickReaderJob([queued[0]], new Set(["place:p1"]), 0), null);
    assert.equal(readerJobKey({ business_id: "b1", place_id: null }), "business:b1");
    assert.equal(readerJobKey({ business_id: null, place_id: "p1" }), "place:p1");
  });

  it("keeps the last free slot for priority 1 and stops when all slots are busy", () => {
    const routine = [queued[0], queued[2]];
    assert.equal(pickReaderJob(routine, new Set(), 2, 4).id, "c");
    assert.equal(pickReaderJob(routine, new Set(), 3, 4), null);
    assert.equal(pickReaderJob(queued, new Set(), 3, 4).id, "d");
    assert.equal(pickReaderJob(queued, new Set(), 4, 4), null);
  });
});

describe("update stop rule", () => {
  it("stops at the newest stored review − 1 day when nothing recent is unanswered", () => {
    assert.equal(updateStopBefore(daysAgo(3), null).toISOString(), daysAgo(4));
  });

  it("goes back to the oldest unanswered review of the last 30 days − 1 day", () => {
    assert.equal(updateStopBefore(daysAgo(3), daysAgo(20)).toISOString(), daysAgo(21));
    // An unanswered review newer than the newest stored one − 1 day changes nothing.
    assert.equal(updateStopBefore(daysAgo(3), daysAgo(3)).toISOString(), daysAgo(4));
  });

  it("reads the whole history when nothing is stored", () => {
    assert.equal(updateStopBefore(null, null), null);
    assert.equal(pageReachesStop([{ published_at: daysAgo(900) }], null), false);
  });

  it("stops once the page's oldest review is older than the limit", () => {
    const stop = updateStopBefore(daysAgo(3), daysAgo(20));
    assert.equal(pageReachesStop([{ published_at: daysAgo(1) }, { published_at: daysAgo(20) }], stop), false);
    assert.equal(pageReachesStop([{ published_at: daysAgo(1) }, { published_at: daysAgo(22) }], stop), true);
    assert.equal(pageReachesStop([], stop), false);
  });
});

describe("competitor reply rate read", () => {
  it("reads until 12 months back or 2000 reviews", () => {
    assert.equal(repliesReadDone(30, [{ published_at: daysAgo(100) }], now), false);
    assert.equal(repliesReadDone(30, [{ published_at: daysAgo(366) }], now), true);
    assert.equal(repliesReadDone(repliesMaxReviews, [{ published_at: daysAgo(10) }], now), true);
  });

  it("feeds replyRateFrom with the date and whether the owner replied, over the whole 12 months", () => {
    const reviews = [
      ...Array.from({ length: 80 }, (_, index) => ({ published_at: daysAgo(10 + index), owner_reply: index % 2 ? null : "r", owner_replied_at: null })),
      { published_at: daysAgo(400), owner_reply: "r", owner_replied_at: null },
    ];
    const sample = replySampleFrom(reviews);
    assert.deepEqual(sample[0], { publishedAt: daysAgo(10), replied: true });
    assert.deepEqual(sample[1], { publishedAt: daysAgo(11), replied: false });
    assert.equal(Object.keys(sample[0]).length, 2);
    const result = replyRateFrom(sample, now, repliesMaxReviews);
    assert.equal(result.sample, 80);
    assert.equal(result.rate, 0.5);
  });
});

describe("reader helpers", () => {
  it("stores the star distribution in the snapshot format", () => {
    const distribution = toStarDistribution({ 1: 1, 2: 0, 3: 0, 4: 0, 5: 3 });
    assert.deepEqual(distribution, { oneStar: 1, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 3 });
    assert.equal(distributionAverage(distribution), 4);
  });

  it("uses the calendar day in Portugal", () => {
    assert.equal(lisbonDay(new Date("2026-10-03T23:30:00Z")), "2026-10-04");
    assert.equal(lisbonDay(new Date("2026-12-31T23:30:00Z")), "2026-12-31");
  });

  it("recognises review requests sorted by newest", () => {
    const body = (last) => new URLSearchParams({ "f.req": JSON.stringify([[["qv9Egd", JSON.stringify([null, 1, last]), null, "generic"]]]) }).toString();
    assert.equal(reviewRequestSort(body([2])), "newest");
    assert.equal(reviewRequestSort(body([1])), "other");
    assert.equal(reviewRequestSort(undefined), null);
  });
});

describe("reviews stored under another id", () => {
  const at = (seconds) => new Date(Date.parse("2026-09-01T10:00:00Z") + seconds * 1000).toISOString();

  it("matches the same rating published within 2 seconds, keeping the stored id", () => {
    const stored = [{ review_id: "gbp:1", rating: 5, published_at: at(0) }, { review_id: "gbp:2", rating: 2, published_at: at(1) }];
    const read = [{ review_id: "m1", rating: 5, published_at: at(1.5) }, { review_id: "m2", rating: 3, published_at: at(1) }, { review_id: "m3", rating: 2, published_at: at(4) }];
    assert.deepEqual([...matchStoredReviews(read, stored)], [["m1", "gbp:1"]]);
  });

  it("leaves reviews already stored under their own id alone and matches each stored row once", () => {
    const stored = [{ review_id: "m1", rating: 5, published_at: at(0) }, { review_id: "gbp:9", rating: 5, published_at: at(1) }];
    const read = [{ review_id: "m1", rating: 5, published_at: at(0) }, { review_id: "m2", rating: 5, published_at: at(0.5) }, { review_id: "m3", rating: 5, published_at: at(1.2) }];
    assert.deepEqual([...matchStoredReviews(read, stored)], [["m2", "gbp:9"]]);
  });
});

describe("daily competitor read: sliding 12-month reply rate (approximation)", () => {
  const item = (days, replied) => ({ publishedAt: daysAgo(days), replied });

  it("adds the reviews that turned 7 days old and drops the same days of the oldest", () => {
    // 358 reviews over the 358 counted days at 50%: one day leaves, one replied review enters.
    const slid = slideReplyRate({ rate: 0.5, sample: 358 }, [item(3, false), item(7.5, true), item(12, false)], 1, now);
    assert.equal(slid.sample, 358);
    assert.ok(Math.abs(slid.rate - (0.5 * 357 + 1) / 358) < 1e-9);
  });

  it("changes nothing on the same day, and starts from the new reviews when nothing was counted", () => {
    assert.deepEqual(slideReplyRate({ rate: 0.4, sample: 50 }, [item(8, true)], 0, now), { rate: 0.4, sample: 50 });
    assert.deepEqual(slideReplyRate({ rate: null, sample: 0 }, [item(8, true), item(9, false)], 3, now), { rate: 0.5, sample: 2 });
    assert.deepEqual(slideReplyRate({ rate: null, sample: 0 }, [], 3, now), { rate: null, sample: 0 });
  });

  it("counts whole calendar days between reads", () => {
    assert.equal(daysBetween("2026-09-30", "2026-10-03"), 3);
    assert.equal(daysBetween("2026-10-03", "2026-10-03"), 0);
  });
});
