import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  REPLY_CHECK_DAYS,
  cidFromFid,
  depthSinceLastStored,
  dfsDistribution,
  fullDepth,
  ledgerComplete,
  nextFollowUpDepth,
  paceEstimateDepth,
  parseDfsTimestamp,
  readReachTarget,
  readSpan,
  repliesDepth,
  replyCheckDays,
  replyRateFromLedger,
  replyWindowStart,
  roundDepth,
  snapshotFromMapsItem,
  toCustomerReview,
  toLedgerRow,
  uniqueById,
} from "../src/lib/dataforseo/rules.ts";

const dayMs = 86_400_000;
const now = new Date("2026-10-03T12:00:00Z");
const daysAgo = (days) => new Date(now.getTime() - days * dayMs).toISOString();

describe("DataForSEO depths", () => {
  it("rounds up to multiples of 10 between 10 and the maximum", () => {
    assert.equal(roundDepth(1), 10);
    assert.equal(roundDepth(11), 20);
    assert.equal(roundDepth(20), 20);
    assert.equal(roundDepth(5000), 4490);
    assert.equal(roundDepth(2500, 2000), 2000);
    assert.equal(roundDepth(Number.NaN), 10);
  });

  it("full reads the whole history and flags places above 4490 as partial", () => {
    assert.deepEqual(fullDepth(123), { depth: 130, partial: false });
    assert.deepEqual(fullDepth(null), { depth: 4490, partial: false });
    assert.deepEqual(fullDepth(6000), { depth: 4490, partial: true });
  });

  it("re-checks replies over 30 days once a month per place, else 7", () => {
    assert.equal(REPLY_CHECK_DAYS, 7);
    assert.equal(replyCheckDays(null, "2026-10-03"), 30);
    assert.equal(replyCheckDays("2026-10-03", "2026-10-03"), 7);
    assert.equal(replyCheckDays("2026-09-04", "2026-10-03"), 7);
    assert.equal(replyCheckDays("2026-09-03", "2026-10-03"), 30);
    assert.equal(replyWindowStart(now, 7), now.getTime() - 8 * dayMs);
  });

  it("reaches back to the newest stored review − 1 day and to the oldest unanswered one", () => {
    assert.equal(readReachTarget({ newestStoredAt: daysAgo(2), oldestUnansweredAt: null }), now.getTime() - 3 * dayMs);
    assert.equal(readReachTarget({ newestStoredAt: daysAgo(2), oldestUnansweredAt: daysAgo(6) }), now.getTime() - 6 * dayMs);
    assert.equal(readReachTarget({ newestStoredAt: daysAgo(10), oldestUnansweredAt: daysAgo(6) }), now.getTime() - 11 * dayMs);
    assert.equal(readReachTarget({ newestStoredAt: null, oldestUnansweredAt: null, windowStart: now.getTime() - 8 * dayMs }), now.getTime() - 8 * dayMs);
    assert.equal(readReachTarget({ newestStoredAt: null, oldestUnansweredAt: null }), null);
  });

  it("owner rule no gaps: depth = Google's total − what we hold + reviews re-read + margin", () => {
    assert.equal(depthSinceLastStored({ googleTotal: 1000, storedCount: 990, storedSinceReach: 5, fallbackDepth: 50 }), 30);
    assert.equal(depthSinceLastStored({ googleTotal: 9000, storedCount: 10, storedSinceReach: 0, fallbackDepth: 50 }), 4490);
    // Deleted reviews: we hold more than Google shows.
    assert.equal(depthSinceLastStored({ googleTotal: 990, storedCount: 1000, storedSinceReach: 3, fallbackDepth: 50 }), 20);
    // Unknown total: the pace estimate.
    assert.equal(depthSinceLastStored({ googleTotal: null, storedCount: 1000, storedSinceReach: 3, fallbackDepth: 47 }), 50);
  });

  it("estimates from the pace when Google's total is unknown", () => {
    assert.equal(paceEstimateDepth(30, now.getTime() - 2 * dayMs, now), 20);
    assert.equal(paceEstimateDepth(300, now.getTime() - 10 * dayMs, now), 160);
    assert.equal(paceEstimateDepth(3000, now.getTime() - 10 * dayMs, now), 200);
    assert.equal(paceEstimateDepth(null, now.getTime(), now), 20);
  });

  it("asks again with a bigger depth until the read reaches the target", () => {
    const reach = now.getTime() - 10 * dayMs;
    // Reached, or Google had fewer reviews than asked (end of history), or already at the limit.
    assert.equal(nextFollowUpDepth({ depth: 20, readCount: 20, oldestReadAt: daysAgo(11), newestReadAt: daysAgo(0), reach }), null);
    assert.equal(nextFollowUpDepth({ depth: 50, readCount: 12, oldestReadAt: daysAgo(5), newestReadAt: daysAgo(0), reach }), null);
    assert.equal(nextFollowUpDepth({ depth: 4490, readCount: 4490, oldestReadAt: daysAgo(5), newestReadAt: daysAgo(0), reach }), null);
    assert.equal(nextFollowUpDepth({ depth: 20, readCount: 20, oldestReadAt: daysAgo(5), newestReadAt: daysAgo(0), reach: null }), null);
    // 20 reviews over 5 days, 10 days needed: about 48, at least double.
    assert.equal(nextFollowUpDepth({ depth: 20, readCount: 20, oldestReadAt: daysAgo(5), newestReadAt: daysAgo(0), reach }), 60);
    assert.equal(nextFollowUpDepth({ depth: 1500, readCount: 1500, oldestReadAt: daysAgo(5), newestReadAt: daysAgo(0), reach, maxDepth: 2000 }), 2000);
  });

  it("12-month reply read: from the pace (capped by Google's total), else a probe of 100", () => {
    assert.equal(repliesDepth({ pacePerMonth: 10, reviewsTotal: null }), 160);
    assert.equal(repliesDepth({ pacePerMonth: 10, reviewsTotal: 40 }), 50);
    // Unknown pace: a first probe of 100, never the whole history (follow-ups reach 12 months).
    assert.equal(repliesDepth({ pacePerMonth: null, reviewsTotal: 300 }), 100);
    assert.equal(repliesDepth({ pacePerMonth: null, reviewsTotal: 1864 }), 100);
    assert.equal(repliesDepth({ pacePerMonth: null, reviewsTotal: 59 }), 70);
    assert.equal(repliesDepth({ pacePerMonth: null, reviewsTotal: null }), 100);
    assert.equal(repliesDepth({ pacePerMonth: 500, reviewsTotal: 9000 }), 2000);
  });
});

describe("DataForSEO items", () => {
  it("parses DataForSEO timestamps to UTC", () => {
    assert.equal(parseDfsTimestamp("2026-10-02 07:36:58 +00:00"), "2026-10-02T07:36:58.000Z");
    assert.equal(parseDfsTimestamp("2026-10-02 07:36:58 +01:00"), "2026-10-02T06:36:58.000Z");
    assert.equal(parseDfsTimestamp("2026-10-02 07:36:58 +0100"), "2026-10-02T06:36:58.000Z");
    assert.equal(parseDfsTimestamp("2026-10-02 07:36:58"), "2026-10-02T07:36:58.000Z");
    assert.equal(parseDfsTimestamp("ontem"), null);
    assert.equal(parseDfsTimestamp(null), null);
  });

  const item = {
    review_id: "r1",
    timestamp: "2026-10-02 07:36:58 +00:00",
    rating: { value: 2 },
    review_text: "b",
    original_review_text: "a",
    original_language: "en",
    owner_answer: "c",
    owner_timestamp: null,
    reviews_count: 4,
    local_guide: true,
    profile_name: "x",
    profile_url: "x",
    profile_image_url: "x",
  };

  it("maps a customer's review without name, photo or profile", () => {
    const review = toCustomerReview(item);
    assert.deepEqual(review, {
      review_id: "r1",
      rating: 2,
      text: "a",
      language: "en",
      published_at: "2026-10-02T07:36:58.000Z",
      owner_reply: "c",
      owner_replied_at: null,
      reviewer_review_count: 4,
      reviewer_is_local_guide: true,
    });
    assert.equal(toCustomerReview({ ...item, rating: { value: 0 } }), null);
    assert.equal(toCustomerReview({ ...item, timestamp: null }), null);
    assert.equal(toCustomerReview({ ...item, original_review_text: null }).text, "b");
  });

  it("maps a ledger row with no text at all", () => {
    const row = toLedgerRow(item, "p1");
    assert.deepEqual(row, { place_id: "p1", review_id: "r1", published_at: "2026-10-02T07:36:58.000Z", rating: 2, replied: true, replied_at: null });
    assert.deepEqual(Object.keys(row).sort(), ["place_id", "published_at", "rating", "replied", "replied_at", "review_id"]);
    assert.equal(toLedgerRow({ ...item, owner_answer: null }, "p1").replied, false);
    assert.equal(toLedgerRow({ ...item, owner_answer: null, owner_timestamp: "2026-10-03 08:00:00 +00:00" }, "p1").replied_at, "2026-10-03T08:00:00.000Z");
  });

  it("keeps one row per review id and finds the span read", () => {
    assert.deepEqual(
      uniqueById([{ review_id: "a", n: 1 }, null, { review_id: "a", n: 2 }, { review_id: "b", n: 3 }]).map((row) => row.n),
      [1, 3],
    );
    assert.deepEqual(readSpan([{ published_at: daysAgo(1) }, { published_at: daysAgo(3) }]), { oldest: daysAgo(3), newest: daysAgo(1) });
    assert.deepEqual(readSpan([]), { oldest: null, newest: null });
  });

  it("converts the star distribution and the exact average of a zone result", () => {
    assert.deepEqual(dfsDistribution({ 1: 1, 2: 0, 3: 0, 4: 2, 5: 7 }), { oneStar: 1, twoStar: 0, threeStar: 0, fourStar: 2, fiveStar: 7 });
    assert.equal(dfsDistribution(null), null);
    assert.equal(dfsDistribution({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }), null);
    assert.deepEqual(snapshotFromMapsItem({ place_id: "p", rating: { value: 4.4, votes_count: 10 }, rating_distribution: { 1: 1, 2: 0, 3: 0, 4: 2, 5: 7 } }), {
      rating: 4.4,
      average: 4.4,
      reviews_count: 10,
      distribution: { oneStar: 1, twoStar: 0, threeStar: 0, fourStar: 2, fiveStar: 7 },
    });
    assert.equal(snapshotFromMapsItem({ place_id: "p", rating: { value: 4.4 } }), null);
  });

  it("reads Google's cid from the stored feature id", () => {
    assert.equal(cidFromFid("0xd1ad1771e4933c1:0x814c3eabc9fe0a09"), BigInt("0x814c3eabc9fe0a09").toString());
    assert.equal(cidFromFid("ChIJ"), null);
    assert.equal(cidFromFid(null), null);
  });
});

describe("Reply rate from the ledger", () => {
  it("counts reviews between 12 months and 7 days old", () => {
    const rate = replyRateFromLedger(
      [
        { published_at: daysAgo(3), replied: false },
        { published_at: daysAgo(10), replied: true },
        { published_at: daysAgo(100), replied: false },
        { published_at: daysAgo(400), replied: true },
      ],
      now,
    );
    assert.deepEqual(rate, { rate: 0.5, sample: 2, since: daysAgo(100).slice(0, 10) });
  });

  it("trusts the ledger only after a 12-month read wrote it", () => {
    assert.equal(ledgerComplete("2026-09-20", "2026-09-20T10:00:00Z"), true);
    assert.equal(ledgerComplete("2026-09-20", "2026-09-25T10:00:00Z"), false);
    assert.equal(ledgerComplete(null, "2026-09-20T10:00:00Z"), false);
    assert.equal(ledgerComplete("2026-09-20", null), false);
  });
});
