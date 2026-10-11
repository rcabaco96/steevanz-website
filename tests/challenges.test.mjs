import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { challengeOrder, chaseMaxFiveStars, competitionChallenges, paceRace } from "../src/lib/reviews/challenges.ts";
import { computeCompetition, fiveStarsToRank, rankScore } from "../src/lib/reviews/competitors.ts";

const now = new Date("2026-10-11T12:00:00Z");
const entry = (id, average, reviewsCount, { isSelf = false, pace = null } = {}) => ({
  id,
  name: id,
  isSelf,
  mapsUrl: "",
  distanceM: 0,
  rating: average,
  average,
  reviewsCount,
  pacePerMonth: pace,
  replyRate: null,
  replySample: null,
});
const me = (average, reviewsCount, pace = null) => entry("me", average, reviewsCount, { isSelf: true, pace });
const challenges = (entries, reviews = [], trend = null) => {
  const competition = computeCompetition(entries, null);
  if (competition) competition.trend = trend;
  return competitionChallenges(competition, reviews, now);
};

describe("competition challenges", () => {
  it("counts the 5★ reviews to pass the place right above and the position reached", () => {
    const result = challenges([entry("a", 4.6, 100), me(4.5, 40), entry("b", 3.5, 30)]);
    const expected = fiveStarsToRank(4.5, 40, rankScore(4.6, 100));
    assert.equal(result.chase.name, "a");
    assert.equal(result.chase.fiveStars, expected);
    assert.equal(result.chase.reachRank, 1);
    assert.equal(result.defend, null);
    // b is far below: no threat.
    assert.equal(result.threat, null);
  });

  it("reaches more than one place when the reviews pass several", () => {
    // a and a2 are nearly tied: the reviews that pass a2 also pass a.
    const result = challenges([entry("a", 4.6, 100), entry("a2", 4.6, 99), me(4.5, 40)]);
    assert.equal(result.chase.name, "a2");
    assert.equal(result.chase.reachRank, 1);
  });

  it("hides a chase that would need too many reviews", () => {
    const result = challenges([entry("a", 4.9, 2000), me(4.0, 20)]);
    assert.ok(fiveStarsToRank(4.0, 20, rankScore(4.9, 2000)) > chaseMaxFiveStars);
    assert.equal(result.chase, null);
    assert.equal(result.monthly, null);
  });

  it("at 1.º, counts how many 5★ reviews the 2.º needs to pass the customer", () => {
    const result = challenges([me(4.8, 300), entry("b", 4.8, 290), entry("c", 4.0, 50)]);
    assert.equal(result.chase, null);
    assert.equal(result.defend.name, "b");
    assert.equal(result.defend.rank, 2);
    assert.equal(result.defend.fiveStars, fiveStarsToRank(4.8, 290, rankScore(4.8, 300)));
    assert.ok(result.defend.fiveStars <= 5);
    assert.equal(challengeOrder(result)[0], "defend");
  });

  it("at 1.º with a big lead, the defence comes after the other phrases", () => {
    const result = challenges([me(4.9, 300), entry("b", 4.85, 310)]);
    assert.ok(result.defend.fiveStars > 5);
    assert.equal(result.reviewsChase.reviews, 11);
    // The total-reviews chase is computed but only ranking phrases are shown (owner, 2026-10-12).
    assert.deepEqual(challengeOrder(result), ["defend"]);
  });

  it("computes the close place right below but never shows it (only phrases about climbing)", () => {
    const result = challenges([entry("x", 4.9, 500), me(4.5, 100), entry("z", 4.49, 100)]);
    assert.equal(result.threat.name, "z");
    assert.equal(result.threat.rank, 3);
    assert.ok(result.threat.fiveStars <= 5);
    assert.ok(!challengeOrder(result).includes("threat"));
    // A distant place below is no threat.
    assert.equal(challenges([entry("x", 4.9, 500), me(4.5, 100), entry("z", 3.0, 100)]).threat, null);
  });

  it("counts the reviews to pass the place above in total reviews, and the month's challenge", () => {
    const reviews = [
      { rating: 5, publishedAt: "2026-10-02T10:00:00Z" },
      { rating: 4, publishedAt: "2026-10-05T10:00:00Z" },
      // 00:30 of 1 October in Lisbon: this month.
      { rating: 5, publishedAt: "2026-09-30T23:30:00Z" },
      { rating: 5, publishedAt: "2026-09-29T10:00:00Z" },
    ];
    const result = challenges([entry("big", 4.0, 110), me(4.6, 100), entry("small", 3.0, 20)], reviews);
    assert.deepEqual(result.reviewsChase, { name: "big", reviews: 11, rank: 2, reachRank: 1 });
    // The month's challenge is only about the ranking: here the customer is already above "big" there.
    assert.equal(result.monthly, null);
    // With a ranking chase: the 5★ of this month are counted.
    const rank = challenges([entry("a", 4.55, 60), me(4.5, 40), entry("b", 3.5, 300)], reviews);
    assert.equal(rank.monthly.kind, "rank");
    assert.equal(rank.monthly.missing, rank.chase.fiveStars);
    assert.equal(rank.monthly.reachRank, 1);
    assert.equal(rank.monthly.doneThisMonth, 2);
  });

  it("hides a total-reviews chase that is too far", () => {
    const result = challenges([entry("big", 4.0, 900), me(4.6, 100)]);
    assert.equal(result.reviewsChase, null);
  });

  it("races on monthly pace only when both are measured and the extra is sensible", () => {
    // Already faster: passes it at the current pace.
    assert.deepEqual(paceRace("y", 20, 5, 10), { name: "y", theirPace: 5, ownPace: 10, reviews: 20, extraPerMonth: 0, months: 4 });
    // Slower: the smallest extra (at most doubling the own pace) within 3, 6 or 12 months.
    const race = paceRace("y", 50, 10, 8);
    assert.equal(race.extraPerMonth, 7);
    assert.equal(race.months, 10);
    assert.equal(paceRace("y", 20, null, 5), null);
    assert.equal(paceRace("y", 20, 5, null), null);
    assert.equal(paceRace("y", 5, 0.2, 0.3), null, "tiny paces: no race");
    assert.equal(paceRace("y", 2000, 50, 5), null, "would need 200 more a month");
    const result = challenges([entry("big", 4.0, 130, { pace: 4 }), me(4.6, 100, 6)]);
    assert.equal(result.pace.name, "big");
    // 31 behind, 2 a month faster: 16 months at the current pace, so 4 more a month passes it within 6.
    assert.equal(result.pace.extraPerMonth, 4);
    assert.ok(result.pace.months <= 6);
  });

  it("celebrates only real climbs and rating rises of the last month", () => {
    const entries = [entry("a", 4.6, 100), me(4.5, 40)];
    const trend = { since: "2026-09-11", ratingRankChange: 2, reviewsRankChange: 0, ratingChange: 0.05 / 4.45, reviewsChange: 0.1 };
    const wins = challenges(entries, [], trend).wins;
    // Places climbed only in total reviews are no win to show.
    assert.equal(challenges(entries, [], { ...trend, ratingRankChange: 0, reviewsRankChange: 3, ratingChange: 0 }).wins, null);
    assert.equal(wins.rankPlaces, 2);
    assert.equal(wins.reviewsPlaces, null);
    assert.ok(Math.abs(wins.ratingRise - 0.05) < 1e-9);
    assert.equal(challenges(entries, [], { ...trend, ratingRankChange: -1, ratingChange: 0.001 }).wins, null);
    assert.equal(challenges(entries, [], null).wins, null);
  });

  it("says nothing without data", () => {
    assert.equal(competitionChallenges(null, [], now), null);
    // Competitors only (the customer's numbers still coming).
    assert.equal(challenges([entry("a", 4.6, 100), entry("b", 4.2, 80)]), null);
    // The customer without reviews.
    assert.equal(challenges([entry("a", 4.6, 100), entry("me", null, 0, { isSelf: true })]), null);
    // Alone at 1.º with nobody rated below: nothing to defend.
    const alone = challenges([me(4.6, 100), entry("b", null, 0)]);
    assert.equal(alone.defend, null);
    assert.equal(alone.chase, null);
    assert.equal(alone.monthly, null);
  });
});
