import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { replyMinSample, replyRateFrom, shownReplyRate } from "../src/lib/reviews/competitors.ts";

const now = new Date("2026-10-03T12:00:00Z");
const daysAgo = (days) => new Date(now.getTime() - days * 86_400_000).toISOString();
const item = (days, replied) => ({ publishedAt: daysAgo(days), replied });

describe("competitor reply rate", () => {
  it("counts the share of reviews with an owner reply", () => {
    const result = replyRateFrom([item(10, true), item(20, true), item(30, false), item(40, true)], now);
    assert.equal(result.rate, 0.75);
    assert.equal(result.sample, 4);
    assert.equal(result.since, daysAgo(40).slice(0, 10));
  });

  it("leaves out reviews from the last 7 days and older than 12 months", () => {
    const result = replyRateFrom([item(2, false), item(6, false), item(8, true), item(364, true), item(366, false), item(800, false)], now);
    assert.equal(result.sample, 2);
    assert.equal(result.rate, 1);
  });

  it("only looks at the newest reviews, like the pace sample, before applying the window", () => {
    // Newest 3: two from this week (left out) and one replied; older ones are beyond the sample.
    const result = replyRateFrom([item(1, false), item(3, false), item(9, true), item(20, false), item(30, false)], now, 3);
    assert.equal(result.sample, 1);
    assert.equal(result.rate, 1);
  });

  it("ignores invalid and future dates and reports an empty sample", () => {
    assert.deepEqual(replyRateFrom([{ publishedAt: "not a date", replied: true }, item(-5, true)], now), { rate: null, sample: 0, since: null });
    assert.deepEqual(replyRateFrom([], now), { rate: null, sample: 0, since: null });
  });

  it("hides the rate when it was not measured or rests on too few reviews", () => {
    assert.equal(shownReplyRate(0.8, replyMinSample), 0.8);
    assert.equal(shownReplyRate(0.8, replyMinSample - 1), null);
    assert.equal(shownReplyRate(0.8, null), null);
    assert.equal(shownReplyRate(null, 20), null);
  });
});
