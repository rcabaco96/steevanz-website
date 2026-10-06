import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatAddress, matchLocation } from "../src/lib/google/connection.ts";
import { awaitingApprovalMessage, describeGoogleError, GoogleApiError, needsReconnect, parseGoogleError, v4LocationPath } from "../src/lib/google/gbp-api.ts";
import {
  insertRow,
  mapGbpReview,
  newNegativeReviewIds,
  reachedCutoff,
  ReviewMatcher,
  starRatingValue,
  stripGoogleTranslation,
  updateCutoff,
  updateRow,
} from "../src/lib/google/gbp-sync.ts";
import { GoogleTokenError } from "../src/lib/google/oauth.ts";

const now = Date.parse("2026-10-03T12:00:00Z");
const ago = (ms) => new Date(now - ms).toISOString();
const day = 86_400_000;

function apiReview(changes = {}) {
  return {
    name: "accounts/1/locations/2/reviews/r1",
    reviewId: "r1",
    reviewer: { displayName: "placeholder", profilePhotoUrl: "https://example.invalid/p.png" },
    starRating: "FOUR",
    comment: "t1",
    createTime: "2026-09-01T10:00:00.123456Z",
    updateTime: "2026-09-02T10:00:00Z",
    ...changes,
  };
}

describe("review mapping", () => {
  it("maps ONE..FIVE to 1..5 and nothing else", () => {
    assert.deepEqual(["ONE", "TWO", "THREE", "FOUR", "FIVE"].map(starRatingValue), [1, 2, 3, 4, 5]);
    assert.equal(starRatingValue("STAR_RATING_UNSPECIFIED"), null);
    assert.equal(starRatingValue("SIX"), null);
    assert.equal(starRatingValue(undefined), null);
  });

  it("keeps only the original words of a translated comment", () => {
    assert.equal(stripGoogleTranslation("(Translated by Google) t2\n\n(Original)\nt1"), "t1");
    assert.equal(stripGoogleTranslation("t1\n\n(Translated by Google)\nt2"), "t1");
    assert.equal(stripGoogleTranslation("  t1  "), "t1");
    assert.equal(stripGoogleTranslation(""), null);
    assert.equal(stripGoogleTranslation(undefined), null);
  });

  it("keeps rating, text, dates and the owner's reply, never the reviewer", () => {
    const mapped = mapGbpReview(apiReview({ reviewReply: { comment: "a1", updateTime: "2026-09-03T08:00:00Z" } }));
    assert.deepEqual(mapped, {
      gbpReviewId: "r1",
      rating: 4,
      text: "t1",
      publishedAt: "2026-09-01T10:00:00.123Z",
      ownerReply: "a1",
      ownerRepliedAt: "2026-09-03T08:00:00.000Z",
      updateTime: "2026-09-02T10:00:00Z",
    });
    assert.equal(JSON.stringify(mapped).includes("placeholder"), false);
    assert.equal(JSON.stringify(insertRow("b1", mapped, ago(0))).includes("placeholder"), false);
  });

  it("maps a review without text or reply and skips unusable ones", () => {
    const mapped = mapGbpReview(apiReview({ comment: undefined }));
    assert.equal(mapped.text, null);
    assert.equal(mapped.ownerReply, null);
    assert.equal(mapped.ownerRepliedAt, null);
    assert.equal(mapGbpReview(apiReview({ starRating: "STAR_RATING_UNSPECIFIED" })), null);
    assert.equal(mapGbpReview(apiReview({ createTime: "x" })), null);
  });
});

describe("update stop rule", () => {
  it("re-reads one day before the last sync", () => {
    assert.equal(updateCutoff(ago(0)), now - day);
    assert.equal(updateCutoff(null), null);
  });

  it("stops at the first page holding a review older than the cutoff", () => {
    const cutoff = now - day;
    assert.equal(reachedCutoff([ago(1000), ago(day / 2)], cutoff), false);
    assert.equal(reachedCutoff([ago(1000), ago(day + 1000)], cutoff), true);
    assert.equal(reachedCutoff([ago(400 * day)], null), false);
  });
});

describe("matching with reviews read from Maps", () => {
  const stored = [
    { review_id: "m1", rating: 4, published_at: "2026-09-01T10:00:01.000Z", gbp_review_id: null },
    { review_id: "m2", rating: 2, published_at: "2026-09-01T10:00:00.000Z", gbp_review_id: null },
    { review_id: "m3", rating: 5, published_at: "2026-08-01T10:00:00.000Z", gbp_review_id: "r9" },
  ];
  const review = (changes) => ({ gbpReviewId: "r1", rating: 4, publishedAt: "2026-09-01T10:00:00.000Z", ...changes });

  it("finds a review first by its Google id", () => {
    const matcher = new ReviewMatcher(stored);
    assert.equal(matcher.match(review({ gbpReviewId: "r9", rating: 1, publishedAt: "2020-01-01T00:00:00Z" })).review_id, "m3");
  });

  it("else by same rating and creation time within 2 seconds, once", () => {
    const matcher = new ReviewMatcher(stored);
    const first = matcher.match(review());
    assert.equal(first.review_id, "m1");
    assert.equal(first.gbp_review_id, "r1");
    assert.equal(matcher.match(review()).review_id, "m1");
    assert.equal(matcher.match(review({ gbpReviewId: "r2" })), null);
  });

  it("does not match another rating, a time 3 seconds away or an already linked row", () => {
    const matcher = new ReviewMatcher(stored);
    assert.equal(matcher.match(review({ rating: 3 })), null);
    assert.equal(matcher.match(review({ publishedAt: "2026-09-01T10:00:04.000Z" })), null);
    assert.equal(matcher.match(review({ gbpReviewId: "r5", rating: 5, publishedAt: "2026-08-01T10:00:00.000Z" })), null);
  });

  it("picks the closest of two candidates", () => {
    const matcher = new ReviewMatcher([
      { review_id: "a", rating: 4, published_at: "2026-09-01T10:00:01.900Z", gbp_review_id: null },
      { review_id: "b", rating: 4, published_at: "2026-09-01T10:00:00.200Z", gbp_review_id: null },
    ]);
    assert.equal(matcher.match(review()).review_id, "b");
  });

  it("updates a known row without touching Maps-only columns and inserts unknown ones as gbp:<id>", () => {
    const mapped = mapGbpReview(apiReview());
    const update = updateRow("b1", stored[0], mapped, ago(0));
    assert.equal(update.review_id, "m1");
    assert.equal(update.published_at, stored[0].published_at);
    assert.equal(update.gbp_review_id, "r1");
    assert.equal("likes" in update || "language" in update || "reviewer_review_count" in update, false);
    const insert = insertRow("b1", mapped, ago(0));
    assert.equal(insert.review_id, "gbp:r1");
    assert.equal(insert.gbp_review_id, "r1");
    assert.equal(insert.published_at, mapped.publishedAt);
  });
});

describe("alerts", () => {
  it("returns new 1–3★ reviews from the last 7 days", () => {
    const inserted = [
      { reviewId: "gbp:a", rating: 3, publishedAt: ago(day), text: null },
      { reviewId: "gbp:b", rating: 4, publishedAt: ago(day), text: null },
      { reviewId: "gbp:c", rating: 1, publishedAt: ago(8 * day), text: null },
      { reviewId: "gbp:d", rating: 1, publishedAt: ago(0), text: null },
    ];
    assert.deepEqual(newNegativeReviewIds(inserted, now), ["gbp:a", "gbp:d"]);
  });
});

describe("locations", () => {
  const option = (changes) => ({ account: "accounts/1", name: "locations/1", title: "n1", address: null, placeId: null, ...changes });

  it("links the location with the customer's place id", () => {
    const options = [option({ name: "locations/1", placeId: "p1" }), option({ name: "locations/2", placeId: "p2", title: "n2" })];
    const match = matchLocation(options, { placeIds: [null, "p2"], name: "n1" });
    assert.equal(match.kind, "one");
    assert.equal(match.option.name, "locations/2");
  });

  it("falls back to the exact title, and asks when several or none match", () => {
    assert.equal(matchLocation([option({ title: " N1 " }), option({ name: "locations/2", title: "n2" })], { placeIds: [], name: "n1" }).option.name, "locations/1");
    assert.equal(matchLocation([option(), option({ name: "locations/2" })], { placeIds: [], name: "n1" }).kind, "ambiguous");
    assert.equal(matchLocation([option({ title: "n1 x" })], { placeIds: ["p9"], name: "n1" }).kind, "none");
  });

  it("formats the address and builds the v4 path", () => {
    assert.equal(formatAddress({ addressLines: ["l1"], postalCode: "1000-001", locality: "c1" }), "l1, 1000-001 c1");
    assert.equal(formatAddress(undefined), null);
    assert.equal(v4LocationPath("accounts/1", "locations/2"), "accounts/1/locations/2");
  });
});

describe("Google errors in Portuguese", () => {
  it("explains that the Steevanz app is waiting for Google's approval", () => {
    const disabled = parseGoogleError(403, { error: { code: 403, status: "PERMISSION_DENIED", message: "m", details: [{ reason: "SERVICE_DISABLED" }] } });
    assert.equal(describeGoogleError(disabled), awaitingApprovalMessage);
    const zeroQuota = parseGoogleError(429, { error: { code: 429, details: [{ reason: "RATE_LIMIT_EXCEEDED", metadata: { quota_limit_value: "0" } }] } });
    assert.equal(describeGoogleError(zeroQuota), awaitingApprovalMessage);
    const legacy = parseGoogleError(403, { error: { code: 403, message: "m", errors: [{ reason: "accessNotConfigured" }] } });
    assert.equal(describeGoogleError(legacy), awaitingApprovalMessage);
  });

  it("asks to connect again when the authorization is gone", () => {
    const revoked = new GoogleTokenError(400, "invalid_grant", "");
    assert.match(describeGoogleError(revoked), /Volte a ligar/);
    assert.equal(needsReconnect(revoked), true);
    assert.equal(needsReconnect(new GoogleApiError(401, null, "")), true);
    assert.equal(needsReconnect(new GoogleApiError(500, null, "")), false);
  });

  it("has a message for every other failure", () => {
    for (const status of [403, 404, 429, 500, 418]) assert.ok(describeGoogleError(new GoogleApiError(status, null, "")).length > 10);
    assert.ok(describeGoogleError(new Error("x")).length > 10);
  });
});
