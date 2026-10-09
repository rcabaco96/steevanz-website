import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeAnalytics, computeRatingGoal, filterReviews, hasPlatesProduct, isNegative, isPositive, zonedParts } from "../src/lib/reviews/analytics.ts";
import { themeSentences, themesIn, significantWords } from "../src/lib/reviews/text.ts";

function review(id, publishedAt, rating = 5, extra = {}) {
  return {
    id,
    rating,
    text: null,
    publishedAt,
    ownerReply: null,
    ownerRepliedAt: null,
    reviewerReviewCount: 1,
    reviewerIsLocalGuide: false,
    likes: 0,
    ...extra,
  };
}

describe("text analysis", () => {
  it("detects themes regardless of accents and case", () => {
    assert.deepEqual(themesIn("ATENDIMENTO rápido, mas a casa de banho estava SUJA"), ["service", "waiting", "cleanliness"]);
    assert.deepEqual(themesIn(null), []);
  });

  it("drops stopwords and short tokens", () => {
    assert.deepEqual(significantWords("Muito bom, o café é ótimo e a esplanada também").map((word) => word.surface), ["café", "esplanada"]);
  });
});


describe("zonedParts", () => {
  it("uses Lisbon local time across daylight saving", () => {
    assert.equal(zonedParts("2026-07-01T11:30:00Z").hour, 12);
    assert.equal(zonedParts("2026-01-15T11:30:00Z").hour, 11);
  });
});

/**
 * Synthetic numbers only (stars and timestamps): no review text, never rendered anywhere.
 * Plates installed 7 months ago; before that a review every 15 days, after it 1–2 a day.
 */
function fixtureSource(now) {
  const dayMs = 86_400_000;
  const installed = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 7, 1));
  const reviews = [];
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 20, 1);
  let n = 0;
  for (let day = start; day < now.getTime() - dayMs; day += dayMs) {
    const index = Math.round((day - start) / dayMs);
    if (day < installed.getTime()) {
      if (index % 15 === 0) reviews.push(review(`b${n++}`, new Date(day + 13 * 3_600_000).toISOString(), index % 4 ? 5 : 3));
      continue;
    }
    reviews.push(review(`a${n++}`, new Date(day + 12 * 3_600_000).toISOString(), index % 7 ? 5 : 2));
    if (index % 2 === 0) reviews.push(review(`a${n++}`, new Date(day + 19 * 3_600_000).toISOString(), 4));
  }
  return {
    business: {
      id: "fixture",
      slug: "fixture",
      name: "Fixture",
      googleMapsUrl: "",
      reviewUrl: "",
      platesInstalledOn: installed.toISOString().slice(0, 10),
      ratingTotal: null,
      reviewsTotal: null,
      lastSyncedAt: null,
      activeServices: [],
      category: null,
    },
    reviews,
    competition: null,
  };
}

describe("computeAnalytics", () => {
  const now = new Date("2026-10-02T15:00:00Z");
  const source = fixtureSource(now);

  it("produces coherent totals for every period", () => {
    for (const period of ["30d", "90d", "12m", "all"]) {
      const analytics = computeAnalytics(source, period, now);
      const stars = analytics.starDistribution.reduce((sum, row) => sum + row.count, 0);
      assert.equal(stars, analytics.kpis.reviews.current, period);
      assert.equal(analytics.series.reduce((sum, bucket) => sum + bucket.reviews, 0), analytics.kpis.reviews.current, period);
    }
  });

  it("measures the effect of the plates on monthly reviews", () => {
    const withPlates = { ...source, business: { ...source.business, activeServices: ["nfc-google-reviews"] } };
    const analytics = computeAnalytics(withPlates, "all", now);
    assert.ok(analytics.beforeAfter);
    assert.ok(analytics.beforeAfter.upliftPct > 100, `uplift ${analytics.beforeAfter.upliftPct}`);
  });

  it("has no before/after without the plates product, even with an install date", () => {
    assert.equal(hasPlatesProduct(source.business), false);
    const analytics = computeAnalytics(source, "all", now);
    assert.equal(analytics.beforeAfter, null);
    assert.equal(analytics.beforeAfterGap, "no-plates");
    const otherProducts = { ...source, business: { ...source.business, activeServices: ["ai-reviews", "nfc-social"] } };
    assert.equal(computeAnalytics(otherProducts, "all", now).beforeAfterGap, "no-plates");
  });

  it("reports the monthly pace of the last 90 days against the 90 days before, whatever the filter", () => {
    const daysAgo = (days) => new Date(now.getTime() - days * 86_400_000).toISOString();
    const paced = { ...source, reviews: [10, 20, 30, 40, 50, 60, 100, 120, 150].map((days, i) => review(`p${i}`, daysAgo(days))) };
    for (const period of ["30d", "all"]) {
      const { pace } = computeAnalytics(paced, period, now).kpis;
      assert.equal(pace.current, 2);
      assert.equal(pace.previous, 1);
    }
  });
});

describe("computeRatingGoal", () => {
  const now = new Date("2026-10-02T12:00:00Z");
  const many = (count, rating) => Array.from({ length: count }, (_, index) => review(`r${rating}-${index}`, "2026-09-20T12:00:00Z", rating));

  it("counts the 5-star reviews needed for the next displayed step and the 1-star ones that drop it", () => {
    const goal = computeRatingGoal([...many(8, 5), ...many(2, 4)], 4.8, 10, now);
    assert.equal(goal.current, 4.8);
    assert.ok(Math.abs(goal.progress - 0.5) < 1e-9);
    assert.equal(goal.exact, true);
    assert.equal(goal.next, 4.9);
    assert.equal(goal.fiveStarsNeeded, 4);
    assert.equal(goal.previous, 4.7);
    assert.equal(goal.oneStarsToDrop, 1);
    assert.equal(goal.fiveStarsPerMonth, 8 / 3);
  });

  it("falls back to Google's totals when only part of the history was imported", () => {
    const goal = computeRatingGoal(many(5, 5), 4.3, 100, now);
    assert.equal(goal.exact, false);
    assert.equal(goal.current, 4.3);
    assert.equal(goal.fiveStarsNeeded, 8);
    assert.equal(goal.oneStarsToDrop, 2);
  });

  it("has no next step at 5.0 and nothing without reviews", () => {
    const goal = computeRatingGoal(many(3, 5), 5, 3, now);
    assert.equal(goal.next, null);
    assert.equal(goal.oneStarsToDrop, 1);
    assert.equal(computeRatingGoal([], null, null, now), null);
  });
});

describe("themeSentences and filterReviews", () => {
  it("quotes only the sentence that mentions the theme", () => {
    assert.deepEqual(themeSentences("Comida ótima. Mas esperámos 40 minutos pela mesa! Voltaremos.", "waiting"), ["Mas esperámos 40 minutos pela mesa!"]);
  });

  it("filters by stars, missing reply and theme, newest first", () => {
    const list = [
      review("a", "2026-09-01T10:00:00Z", 1, { text: "Muito caro" }),
      review("b", "2026-09-03T10:00:00Z", 2, { text: "Caro e lento", ownerReply: "Obrigado" }),
      review("c", "2026-09-02T10:00:00Z", 5, { text: "Preço justo" }),
    ];
    assert.deepEqual(filterReviews(list, { stars: "negative", unanswered: false, theme: null }).map((r) => r.id), ["b", "a"]);
    assert.deepEqual(filterReviews(list, { stars: "negative", unanswered: true, theme: null }).map((r) => r.id), ["a"]);
    assert.deepEqual(filterReviews(list, { stars: "all", unanswered: false, theme: "price" }).map((r) => r.id), ["b", "c", "a"]);
  });
});

describe("sample-size guards", () => {
  it("does not compare on a handful of data points", () => {
    const now = new Date("2026-10-02T12:00:00Z");
    const source = {
      business: { id: "b", slug: "b", name: "B", googleMapsUrl: "", reviewUrl: "", platesInstalledOn: "2026-09-25", ratingTotal: 5, reviewsTotal: 2, lastSyncedAt: null, activeServices: ["nfc-google-reviews"], category: null },
      competition: null,
      reviews: [review("x", "2026-09-30T12:10:00Z", 5), review("y", "2025-09-01T12:00:00Z", 4)],
    };
    const analytics = computeAnalytics(source, "30d", now);
    assert.equal(analytics.kpis.reviews.previous, null);
    assert.equal(analytics.beforeAfter, null);
    assert.equal(analytics.beforeAfterGap, "too-early");
  });
});

describe("recommendations", async () => {
  const { aiReviewsPitch, recommendations } = await import("../src/lib/reviews/recommendations.ts");
  const now = new Date("2026-10-02T15:00:00Z");
  const base = fixtureSource(now);
  const analytics = computeAnalytics(base, "12m", now);
  const periodReviews = base.reviews.filter((r) => Date.parse(r.publishedAt) >= Date.parse(analytics.period.start));

  it("pitches AI replies when reviews are left unanswered, but never to a customer who has it", () => {
    const pitch = aiReviewsPitch(base, analytics, periodReviews);
    assert.ok(pitch && pitch.unanswered > 0);
    const owner = { ...base, business: { ...base.business, activeServices: ["ai-reviews"] } };
    assert.equal(aiReviewsPitch(owner, analytics, periodReviews), null);
  });

  it("only suggests products the customer does not already own, at most three", () => {
    const items = recommendations(base, analytics, periodReviews);

    assert.ok(items.length > 0 && items.length <= 3);
    const ownsAll = { ...base, business: { ...base.business, activeServices: items.map((item) => item.productId) } };
    const remaining = recommendations(ownsAll, analytics, periodReviews).map((item) => item.productId);
    for (const item of items) if (item.productId !== "nfc-google-reviews") assert.ok(!remaining.includes(item.productId));
  });

  it("links waiting complaints to the digital waitlist", () => {
    const complaints = Array.from({ length: 6 }, (_, i) => review(`w${i}`, "2026-09-1" + i + "T12:00:00Z", 1, { text: "espera demora" }));
    const fine = Array.from({ length: 10 }, (_, i) => review(`f${i}`, "2026-09-0" + (i % 9 + 1) + "T12:00:00Z", 5, { text: "comida" }));
    const source = { ...base, reviews: [...complaints, ...fine] };
    const result = computeAnalytics(source, "12m", now);
    assert.ok(recommendations(source, result, source.reviews).some((item) => item.productId === "waitlist"));
  });
});

describe("competitors", async () => {
  const { competitionTrend, computeCompetition, distributionAverage, entryMonthAgo, fiveStarsToBeat, paceFromDates, paceFromSnapshots, selectCompetitors } = await import("../src/lib/reviews/competitors.ts");
  const home = { placeId: "self", category: "Marisqueira", lat: 37.1, lng: -8.35 };
  const place = (placeId, category, dLat, reviewsCount, searchString = "Marisqueira") => ({
    placeId,
    title: placeId,
    categoryName: category,
    location: { lat: 37.1 + dLat, lng: -8.35 },
    reviewsCount,
    searchString,
  });

  it("counts the 5-star reviews needed to overtake a better rated place", () => {
    // (4.45 x 500 + 5 x 188) / 688 = 4.6003 > 4.6, while 187 stays just below (4.5997).
    assert.equal(fiveStarsToBeat(4.45, 500, 4.6), 188);
    assert.equal(fiveStarsToBeat(4.7, 10, 4.6), 0);
    assert.equal(fiveStarsToBeat(4.5, 10, 5), null);
  });

  it("computes the exact average from Google's star distribution", () => {
    assert.equal(distributionAverage({ oneStar: 1, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 3 }), 4);
    assert.equal(distributionAverage(null), null);
  });

  it("keeps places inside the radius, same category first, most reviewed first", () => {
    const picked = selectCompetitors(home, [place("far", "Marisqueira", 0.1, 900), place("a", "Marisqueira", 0.001, 100), place("b", "Pizzaria", 0.002, 5000), place("c", "Marisqueira", 0.003, 300), place("self", "Marisqueira", 0, 999)]);
    assert.deepEqual(picked.map((p) => p.placeId), ["c", "a", "b"]);
  });

  it("searches within the radius chosen per customer (5 or 10 km) and searches again when it changes", async () => {
    const { discoveryDue, searchZoomFor, toRadiusKm, withinRadius } = await import("../src/lib/reviews/competitors.ts");
    // ~0.06° of latitude ≈ 6.7 km: inside 10 km, outside 5 km.
    const places = [place("near", "Marisqueira", 0.01, 100), place("mid", "Marisqueira", 0.06, 200)];
    assert.deepEqual(selectCompetitors(home, places, 10).map((p) => p.placeId), ["mid", "near"]);
    assert.deepEqual(selectCompetitors(home, places, 5).map((p) => p.placeId), ["near"]);
    assert.equal(toRadiusKm(5), 5);
    assert.equal(toRadiusKm("5"), 5);
    assert.equal(toRadiusKm(null), 10);
    assert.equal(toRadiusKm(7), 10);
    assert.equal(searchZoomFor(10), 13);
    assert.equal(searchZoomFor(5), 14);
    assert.equal(withinRadius(4999, 5), true);
    assert.equal(withinRadius(6700, 5), false);
    assert.equal(withinRadius(null, 5), true);
    const searched = "2026-10-01T10:00:00Z";
    assert.equal(discoveryDue({ competitors_refreshed_at: null, competitor_radius_km: 10 }), true);
    assert.equal(discoveryDue({ competitors_refreshed_at: searched, competitor_radius_km: 10, competitors_search_radius_km: null }), false);
    assert.equal(discoveryDue({ competitors_refreshed_at: searched, competitor_radius_km: 5, competitors_search_radius_km: 10 }), true);
    assert.equal(discoveryDue({ competitors_refreshed_at: searched, competitor_radius_km: 5, competitors_search_radius_km: 5 }), false);
  });

  it("orders same category, then category-search matches, then the broader search", () => {
    const places = ["a", "b"].map((id, i) => place(id, "Marisqueira", 0.001 * (i + 1), 100 + i));
    const picked = selectCompetitors(home, [...places, place("fish", "Restaurante de peixe", 0.001, 9000), place("kebab", "Kebab", 0.002, 9000, "Restaurante")]);
    assert.deepEqual(picked.map((p) => p.placeId), ["b", "a", "fish", "kebab"]);
  });

  it("measures monthly pace from recent review dates and from weekly snapshots", () => {
    const now = new Date("2026-10-02T12:00:00Z");
    const daysAgo = (d) => new Date(now.getTime() - d * 86_400_000).toISOString();
    assert.equal(paceFromDates([daysAgo(5), daysAgo(40), daysAgo(80), daysAgo(200)], now), 1);
    assert.equal(paceFromDates([daysAgo(1), daysAgo(15), daysAgo(30)], now, 3), 3);
    assert.equal(paceFromSnapshots([{ takenOn: "2026-09-01", reviewsCount: 100 }, { takenOn: "2026-10-01", reviewsCount: 130 }], now), 30);
    assert.equal(paceFromSnapshots([{ takenOn: "2026-09-25", reviewsCount: 100 }, { takenOn: "2026-10-01", reviewsCount: 130 }], now), null);
  });

  it("ranks the customer and says how far the next place is", () => {
    const entry = (id, average, reviewsCount, pacePerMonth, isSelf = false) => ({ id, name: id, isSelf, distanceM: 0, rating: Math.round(average * 10) / 10, average, reviewsCount, pacePerMonth });
    const result = computeCompetition([entry("me", 4.45, 500, 10, true), entry("x", 4.6, 300, 25), entry("y", 4.2, 800, 5)], "2026-10-01");
    assert.equal(result.ratingRank, 2);
    assert.equal(result.reviewsRank, 2);
    assert.equal(result.paceRank, 2);
    assert.ok(Math.abs(result.ratingGap.averageDiff - 0.15) < 1e-9);
    assert.equal(result.ratingGap.fiveStarsToPass, 188);
    assert.equal(result.reviewsGap.reviewsDiff, 301);
    assert.equal(result.paceLeader.name, "x");
  });

  it("works out a month ago from the reviews when no snapshot is that old", () => {
    const base = { id: "me", name: "me", isSelf: true, distanceM: 0, rating: 4.5, average: 4.5, reviewsCount: 100, pacePerMonth: 4, replyRate: null, replySample: null };
    // 4 reviews this month (5, 5, 5, 1): before them 96 reviews summing 450 - 16 = 434.
    const self = entryMonthAgo(base, [5, 5, 5, 1]);
    assert.equal(self.reviewsCount, 96);
    assert.ok(Math.abs(self.average - 434 / 96) < 1e-9);
    assert.equal(self.rating, 4.5);
    // A competitor: its monthly pace off the total, today's rating kept.
    const other = entryMonthAgo({ ...base, id: "x", isSelf: false, pacePerMonth: 6.4 }, null);
    assert.equal(other.reviewsCount, 94);
    assert.equal(other.average, 4.5);
  });

  it("puts a customer without any review last, instead of leaving its position unknown", () => {
    const entry = (id, rating, reviewsCount, isSelf = false) => ({ id, name: id, isSelf, distanceM: 0, rating, average: null, reviewsCount, pacePerMonth: null });
    const result = computeCompetition([entry("me", null, 0, true), entry("x", 4.6, 300), entry("y", 4.2, 80)], null);
    assert.equal(result.ratingRank, 3);
    assert.equal(result.reviewsRank, 3);
    assert.equal(result.total, 3);
    assert.equal(result.ratingGap, null);
  });

  it("counts places climbed only among places compared on both days", () => {
    const entry = (id, average, reviewsCount, isSelf = false) => ({ id, name: id, isSelf, distanceM: 0, rating: average, average, reviewsCount, pacePerMonth: null, replyRate: null, replySample: null });
    const then = [entry("me", 4.4, 100, true), entry("x", 4.6, 300), entry("y", 4.5, 50)];
    // "new" joined later with a better rating: it must not count as a fall.
    const now = [entry("me", 4.55, 110, true), entry("x", 4.6, 305), entry("y", 4.5, 52), entry("new", 4.9, 10)];
    const trend = competitionTrend(now, then, "2026-09-04");
    assert.equal(trend.ratingRankChange, 1);
    assert.equal(trend.reviewsRankChange, 0);
    assert.ok(Math.abs(trend.ratingChange - 0.15 / 4.4) < 1e-9);
    assert.ok(Math.abs(trend.reviewsChange - 0.1) < 1e-9);
  });

  it("shows the comparison as soon as anyone has numbers", () => {
    const entry = (id, rating, reviewsCount, isSelf = false) => ({ id, name: id, isSelf, distanceM: 0, rating, average: null, reviewsCount, pacePerMonth: null });
    assert.equal(computeCompetition([], null), null);
    const selfOnly = computeCompetition([entry("me", 4.4, 500, true)], null);
    assert.equal(selfOnly.competitors, 0);
    assert.equal(selfOnly.ratingRank, null);
    const competitorsOnly = computeCompetition([entry("x", 4.6, 300), entry("y", 4.2, 800)], null);
    assert.equal(competitorsOnly.competitors, 2);
    assert.equal(competitorsOnly.ratingRank, null);
    assert.equal(competitorsOnly.reviewsRank, null);
    assert.equal(competitorsOnly.ratingGap, null);
    // The customer's own rating from its import (no star breakdown yet) already places it.
    const withSelf = computeCompetition([entry("me", 4.4, 500, true), entry("x", 4.6, 300)], null);
    assert.equal(withSelf.competitors, 1);
    assert.equal(withSelf.ratingRank, 2);
    assert.equal(withSelf.reviewsRank, 1);
    assert.ok(Math.abs(withSelf.ratingGap.averageDiff - 0.2) < 1e-9);
  });
});

describe("negative and positive rule", () => {
  it("treats 1 to 3 stars as negative and 4 to 5 as positive, with nothing in between", () => {
    assert.deepEqual([1, 2, 3, 4, 5].map(isNegative), [true, true, true, false, false]);
    assert.deepEqual([1, 2, 3, 4, 5].map(isPositive), [false, false, false, true, true]);
    const list = [review("three", "2026-09-02T10:00:00Z", 3), review("four", "2026-09-01T10:00:00Z", 4)];
    assert.deepEqual(filterReviews(list, { stars: "negative", unanswered: false, theme: null }).map((r) => r.id), ["three"]);
    assert.deepEqual(filterReviews(list, { stars: "positive", unanswered: false, theme: null }).map((r) => r.id), ["four"]);
  });
});
