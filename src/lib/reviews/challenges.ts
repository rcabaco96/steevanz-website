import { zonedParts } from "./analytics.ts";
import { computeCompetition, entryRankScore, fiveStarsToRank, type Competition, type CompetitorEntry } from "./competitors.ts";

/**
 * Competition challenges (business rules 5, 7 and 13): short phrases that turn the comparison into
 * a race — what it takes to pass the place right above, who is about to pass the customer, a
 * reachable target for the month and the places climbed in the last month. Everything comes from
 * the stored numbers (Google's rating and total of each place, the measured monthly paces and the
 * customer's own reviews); a phrase is left out when its numbers are missing or it would be silly.
 */

/** Above this many 5★ reviews, passing the place above is not shown (too far to motivate). */
export const chaseMaxFiveStars = 100;
/** Above this many reviews, passing the place above in total reviews is not shown. */
export const reviewsChaseMax = 200;
/** The place right below is a threat when it needs this many 5★ reviews or fewer to pass. */
export const threatMaxFiveStars = 5;
/** The month's challenge only uses gaps of this size or smaller (reachable in a month). */
export const monthlyChallengeMax = 15;
/** Pace race: deadlines tried in turn for "with C more per month you pass it in ~M months". */
export const paceRaceMonths = [3, 6, 12] as const;
/** Pace race: below this many reviews a month on both sides there is no race to speak of. */
export const paceRaceMinPerMonth = 1;
/** Pace race: the extra reviews per month asked for are at most the current pace (doubling it), or this many. */
export const paceRaceMinExtraCap = 5;
/** Last-month wins: the customer's exact average must have gone up by at least this much. */
export const ratingWinMin = 0.01;

export interface RankChase {
  /** The place right above in the ranking. */
  name: string;
  /** 5★ reviews needed to pass it. */
  fiveStars: number;
  /** Position reached with those reviews (the place above's, or better). */
  reachRank: number;
}

export interface RankDefend {
  /** The place right below the customer (2.º when the customer is 1.º). */
  name: string;
  rank: number;
  /** 5★ reviews it needs to pass the customer. */
  fiveStars: number;
}

export interface ReviewsChase {
  name: string;
  /** Reviews needed to have more than it. */
  reviews: number;
  /** Position in total reviews today and once passed. */
  rank: number;
  reachRank: number;
}

export interface PaceRace {
  /** The place right above in total reviews. */
  name: string;
  /** Reviews per month (measured). */
  theirPace: number;
  ownPace: number;
  /** Reviews it has more than the customer (+1 to pass). */
  reviews: number;
  /** Extra reviews per month needed; 0 when the current pace already gets there. */
  extraPerMonth: number;
  /** Months to pass it at the current pace plus the extra. */
  months: number;
}

export interface MonthlyChallenge {
  kind: "rank" | "reviews";
  name: string;
  /** Reviews still missing (5★ for "rank"). */
  missing: number;
  reachRank: number;
  /** Reviews already received this calendar month (Lisbon), 5★ only for "rank". */
  doneThisMonth: number;
}

export interface CompetitionWins {
  since: string;
  /** Places climbed in the ranking / in total reviews since `since` (only when > 0). */
  rankPlaces: number | null;
  reviewsPlaces: number | null;
  /** Rise of the customer's exact average since `since` (only when ≥ ratingWinMin). */
  ratingRise: number | null;
}

export interface CompetitionChallenges {
  chase: RankChase | null;
  /** Only at 1.º: how close the 2.º is. */
  defend: RankDefend | null;
  /** Below 1.º: the place right below, when it is close (≤ threatMaxFiveStars). */
  threat: RankDefend | null;
  reviewsChase: ReviewsChase | null;
  pace: PaceRace | null;
  monthly: MonthlyChallenge | null;
  wins: CompetitionWins | null;
}

export interface OwnReview {
  rating: number;
  publishedAt: string;
}

const exact = (entry: CompetitorEntry) => entry.average ?? entry.rating;

/** The customer's ranking position after `fiveStars` new reviews of 5★ (same ranking as the table). */
function rankAfterFiveStars(entries: CompetitorEntry[], self: CompetitorEntry, fiveStars: number): number | null {
  const average = exact(self);
  if (average === null) return null;
  const count = self.reviewsCount + fiveStars;
  const next = { ...self, average: (average * self.reviewsCount + 5 * fiveStars) / count, reviewsCount: count };
  return computeCompetition(entries.map((entry) => (entry.isSelf ? next : entry)), null)?.ratingRank ?? null;
}

/** The customer's position in total reviews after `reviews` new reviews. */
function reviewsRankAfter(entries: CompetitorEntry[], reviews: number): number | null {
  return computeCompetition(entries.map((entry) => (entry.isSelf ? { ...entry, reviewsCount: entry.reviewsCount + reviews } : entry)), null)?.reviewsRank ?? null;
}

/**
 * Pace race against the place right above in total reviews. At the current paces the customer
 * passes it in gap / (own − theirs) months; when that is not within a year, the smallest extra per
 * month that passes it within 3, then 6, then 12 months, as long as the extra is at most the current
 * pace (or 5 a month). Null when a pace is not measured, both are tiny, or no sensible extra exists.
 */
export function paceRace(name: string, reviews: number, theirPace: number | null, ownPace: number | null): PaceRace | null {
  if (theirPace === null || ownPace === null || reviews <= 0) return null;
  if (Math.max(theirPace, ownPace) < paceRaceMinPerMonth) return null;
  const lastDeadline = paceRaceMonths[paceRaceMonths.length - 1];
  if (ownPace > theirPace && reviews / (ownPace - theirPace) <= lastDeadline) {
    return { name, theirPace, ownPace, reviews, extraPerMonth: 0, months: reviews / (ownPace - theirPace) };
  }
  const cap = Math.max(paceRaceMinExtraCap, Math.round(ownPace));
  for (const deadline of paceRaceMonths) {
    const extra = Math.max(1, Math.ceil(reviews / deadline + theirPace - ownPace - 1e-9));
    if (extra > cap) continue;
    return { name, theirPace, ownPace, reviews, extraPerMonth: extra, months: reviews / (ownPace + extra - theirPace) };
  }
  return null;
}

/** "2026-10": the calendar month in Lisbon. */
const lisbonMonth = (iso: string) => zonedParts(iso).month;

/**
 * All the competition challenges of a customer. `ownReviews` are the customer's imported reviews
 * (only to count those received this month). Null without a comparison or without the customer's
 * own numbers.
 */
export function competitionChallenges(competition: Competition | null, ownReviews: OwnReview[], now: Date): CompetitionChallenges | null {
  if (!competition || competition.ratingRank === null) return null;
  const entries = competition.entries;
  const self = entries.find((entry) => entry.isSelf);
  if (!self || exact(self) === null || self.reviewsCount <= 0) return null;

  // The ranking, as the table orders it, among places with a rating.
  const rated = entries.filter((entry) => exact(entry) !== null && entryRankScore(entry) !== null);
  const index = rated.findIndex((entry) => entry.isSelf);
  const selfScore = entryRankScore(self);
  const above = index > 0 ? rated[index - 1] : null;
  const below = index >= 0 && index < rated.length - 1 ? rated[index + 1] : null;

  let chase: RankChase | null = null;
  if (above) {
    const fiveStars = fiveStarsToRank(exact(self)!, self.reviewsCount, entryRankScore(above)!);
    if (fiveStars !== null && fiveStars > 0 && fiveStars <= chaseMaxFiveStars) {
      const reachRank = rankAfterFiveStars(entries, self, fiveStars);
      if (reachRank !== null && reachRank < competition.ratingRank) chase = { name: above.name, fiveStars, reachRank };
    }
  }

  let defend: RankDefend | null = null;
  let threat: RankDefend | null = null;
  if (below && selfScore !== null) {
    const fiveStars = fiveStarsToRank(exact(below)!, below.reviewsCount, selfScore);
    if (fiveStars !== null && fiveStars > 0) {
      const rival = { name: below.name, rank: index + 2, fiveStars };
      if (index === 0 && fiveStars <= chaseMaxFiveStars) defend = rival;
      else if (index > 0 && fiveStars <= threatMaxFiveStars) threat = rival;
    }
  }

  const gap = competition.reviewsGap;
  let reviewsChase: ReviewsChase | null = null;
  if (gap && competition.reviewsRank !== null && gap.reviewsDiff > 0 && gap.reviewsDiff <= reviewsChaseMax) {
    const reachRank = reviewsRankAfter(entries, gap.reviewsDiff);
    if (reachRank !== null && reachRank < competition.reviewsRank) reviewsChase = { name: gap.name, reviews: gap.reviewsDiff, rank: competition.reviewsRank, reachRank };
  }

  let pace: PaceRace | null = null;
  if (gap) {
    const ahead = entries.find((entry) => !entry.isSelf && entry.name === gap.name && entry.reviewsCount === self.reviewsCount + gap.reviewsDiff - 1);
    if (ahead) pace = paceRace(ahead.name, gap.reviewsDiff, ahead.pacePerMonth, self.pacePerMonth);
  }

  // The month's challenge: the nearest reachable target (the ranking first on a tie).
  const thisMonth = lisbonMonth(now.toISOString());
  const receivedThisMonth = ownReviews.filter((review) => Date.parse(review.publishedAt) <= now.getTime() && lisbonMonth(review.publishedAt) === thisMonth);
  const options: MonthlyChallenge[] = [];
  if (chase && chase.fiveStars <= monthlyChallengeMax) {
    options.push({ kind: "rank", name: chase.name, missing: chase.fiveStars, reachRank: chase.reachRank, doneThisMonth: receivedThisMonth.filter((review) => review.rating === 5).length });
  }
  if (reviewsChase && reviewsChase.reviews <= monthlyChallengeMax) {
    options.push({ kind: "reviews", name: reviewsChase.name, missing: reviewsChase.reviews, reachRank: reviewsChase.reachRank, doneThisMonth: receivedThisMonth.length });
  }
  const monthly = options.sort((a, b) => a.missing - b.missing)[0] ?? null;

  let wins: CompetitionWins | null = null;
  const trend = competition.trend;
  if (trend) {
    const current = exact(self);
    const rise = trend.ratingChange !== null && current !== null ? current - current / (1 + trend.ratingChange) : null;
    const candidate: CompetitionWins = {
      since: trend.since,
      rankPlaces: trend.ratingRankChange !== null && trend.ratingRankChange > 0 ? trend.ratingRankChange : null,
      reviewsPlaces: trend.reviewsRankChange !== null && trend.reviewsRankChange > 0 ? trend.reviewsRankChange : null,
      ratingRise: rise !== null && rise >= ratingWinMin - 1e-9 ? rise : null,
    };
    if (candidate.rankPlaces !== null || candidate.reviewsPlaces !== null || candidate.ratingRise !== null) wins = candidate;
  }

  return { chase, defend, threat, reviewsChase, pace, monthly, wins };
}

export type ChallengeKind = "defend" | "threat" | "chase" | "reviews" | "pace";

/**
 * The order the phrases are shown in (at most `limit` in a block). Only phrases about climbing
 * (owner, 2026-10-11: «quero ganhar reviews para subir de posição, não para descer»): the chase in the
 * ranking, the total of reviews, the pace race, and the lead when the customer is already 1.º. The
 * place right below (`threat`) is still computed but never shown.
 */
export function challengeOrder(challenges: CompetitionChallenges): ChallengeKind[] {
  const order: ChallengeKind[] = [];
  if (challenges.chase) order.push("chase");
  if (challenges.reviewsChase) order.push("reviews");
  if (challenges.pace) order.push("pace");
  if (challenges.defend) order.push("defend");
  return order;
}
