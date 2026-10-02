import { significantWords, themeIds, themeSentences, themesIn, type ThemeId } from "./text.ts";
import type { DashboardSource, GoogleReview, NfcTap, TapSource } from "./types.ts";

export const periodIds = ["30d", "90d", "12m", "all"] as const;
export type PeriodId = (typeof periodIds)[number];

export const attributionWindowMinutes = 90;
const timeZone = "Europe/Lisbon";
const dayMs = 86_400_000;

export type Granularity = "day" | "week" | "month";

export interface TimeBucket {
  key: string;
  start: string;
  reviews: number;
  ratingSum: number;
  avgRating: number | null;
  taps: number;
}

export interface Comparison {
  current: number | null;
  previous: number | null;
}

export interface Kpis {
  avgRating: Comparison;
  reviews: Comparison;
  taps: Comparison;
  conversion: Comparison;
  replyRate: Comparison;
  medianReplyHours: number | null;
  uniqueVisitors: number;
  attributedReviews: number;
}

export interface PeriodStats {
  months: number;
  reviews: number;
  reviewsPerMonth: number;
  avgRating: number | null;
  textShare: number | null;
}

export interface BeforeAfter {
  installedOn: string;
  before: PeriodStats;
  after: PeriodStats;
  upliftPct: number | null;
}

/** Why the before/after comparison is missing, so the dashboard can say so instead of hiding it. */
export type BeforeAfterGap = "no-install-date" | "too-early" | "no-history" | null;

export interface PlateStats {
  code: string;
  label: string;
  taps: number;
  attributedReviews: number;
  conversion: number | null;
  enoughData: boolean;
}

export interface ThemeExample {
  reviewId: string;
  rating: number;
  publishedAt: string;
  quote: string;
}

export interface ThemeStats {
  id: ThemeId;
  mentions: number;
  avgRating: number | null;
  positiveShare: number;
  negativeShare: number;
  verdict: "strength" | "improve" | "neutral";
  examples: ThemeExample[];
}

export interface WordCount {
  word: string;
  count: number;
}

export interface WeekdayStats {
  weekday: number;
  reviews: number;
  avgRating: number | null;
  taps: number;
  attributed: number;
  conversion: number | null;
  enoughTaps: boolean;
  enoughReviews: boolean;
}

export interface RatingGoal {
  /** Unrounded average behind the displayed rating. */
  average: number;
  /** Share of the way from the lowest average that still shows `current` to the one that shows `next`. */
  progress: number | null;
  /** Rating as Google displays it, one decimal. */
  current: number;
  totalReviews: number;
  /** False when only part of the history was imported and the numbers come from Google's totals. */
  exact: boolean;
  next: number | null;
  fiveStarsNeeded: number | null;
  previous: number | null;
  oneStarsToDrop: number | null;
  fiveStarsPerMonth: number;
  monthsToNext: number | null;
}

export interface DashboardAnalytics {
  period: { id: PeriodId; start: string | null; end: string; granularity: Granularity };
  firstReviewAt: string | null;
  kpis: Kpis;
  ratingGoal: RatingGoal | null;
  series: TimeBucket[];
  starDistribution: { stars: number; count: number; share: number }[];
  beforeAfter: BeforeAfter | null;
  beforeAfterGap: BeforeAfterGap;
  plates: PlateStats[];
  sources: Record<TapSource, number>;
  tapHeatmap: number[][];
  sentiment: { positive: number; neutral: number; negative: number };
  themes: ThemeStats[];
  words: { positive: WordCount[]; negative: WordCount[] };
  weekdays: WeekdayStats[];
  unansweredCount: number;
}

/** Below these sample sizes a percentage or average is noise, so the dashboard greys it out. */
export const minSample = { taps: 20, reviews: 5, themeMentions: 5, previousReviews: 5 } as const;

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});
const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function zonedParts(iso: string) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    month: `${parts.year}-${parts.month}`,
    hour: Number(parts.hour) % 24,
    weekday: weekdayIndex[parts.weekday] ?? 0,
  };
}

function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * dayMs).toISOString().slice(0, 10);
}

function weekStart(date: string): string {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return addDays(date, -((weekday + 6) % 7));
}

export function bucketKey(iso: string, granularity: Granularity): string {
  const { date, month } = zonedParts(iso);
  if (granularity === "month") return month;
  if (granularity === "week") return weekStart(date);
  return date;
}

function nextKey(key: string, granularity: Granularity): string {
  if (granularity === "day") return addDays(key, 1);
  if (granularity === "week") return addDays(key, 7);
  const [year, month] = key.split("-").map(Number);
  return month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function ratio(part: number, whole: number): number | null {
  return whole > 0 ? part / whole : null;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function periodStart(period: PeriodId, now: Date): Date | null {
  if (period === "all") return null;
  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  return new Date(now.getTime() - days * dayMs);
}

function granularityFor(period: PeriodId, spanDays: number): Granularity {
  if (period === "30d") return "day";
  if (period === "90d") return "week";
  return spanDays > 120 ? "month" : "week";
}

/**
 * Links each review to the most recent unused tap at the same business within the
 * attribution window before it was published. Each tap explains at most one review.
 */
export function attributeReviews(reviews: GoogleReview[], taps: NfcTap[], windowMinutes = attributionWindowMinutes): Map<string, NfcTap> {
  const sortedTaps = [...taps].sort((a, b) => Date.parse(a.tappedAt) - Date.parse(b.tappedAt));
  const sortedReviews = [...reviews].sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt));
  const used = new Set<NfcTap>();
  const result = new Map<string, NfcTap>();
  const windowMs = windowMinutes * 60_000;
  let low = 0;
  for (const review of sortedReviews) {
    const published = Date.parse(review.publishedAt);
    while (low < sortedTaps.length && Date.parse(sortedTaps[low].tappedAt) < published - windowMs) low++;
    for (let i = sortedTaps.length - 1; i >= low; i--) {
      const tapped = Date.parse(sortedTaps[i].tappedAt);
      if (tapped > published || used.has(sortedTaps[i])) continue;
      used.add(sortedTaps[i]);
      result.set(review.id, sortedTaps[i]);
      break;
    }
  }
  return result;
}

function inRange(iso: string, start: number | null, end: number): boolean {
  const time = Date.parse(iso);
  return (start === null || time >= start) && time <= end;
}

function statsFor(reviews: GoogleReview[], months: number): PeriodStats {
  return {
    months,
    reviews: reviews.length,
    reviewsPerMonth: months > 0 ? reviews.length / months : 0,
    avgRating: average(reviews.map((review) => review.rating)),
    textShare: ratio(reviews.filter((review) => review.text?.trim()).length, reviews.length),
  };
}

function computeBeforeAfter(source: DashboardSource, now: Date): { value: BeforeAfter | null; gap: BeforeAfterGap } {
  const installedOn = source.business.platesInstalledOn;
  if (!installedOn) return { value: null, gap: "no-install-date" };
  const installed = Date.parse(`${installedOn}T00:00:00Z`);
  const monthMs = 30.44 * dayMs;
  const afterMonths = (now.getTime() - installed) / monthMs;
  if (afterMonths < 1) return { value: null, gap: "too-early" };
  const firstReview = source.reviews.length ? Math.min(...source.reviews.map((review) => Date.parse(review.publishedAt))) : installed;
  const beforeStart = Math.max(firstReview, installed - Math.max(afterMonths, 3) * monthMs);
  const beforeMonths = (installed - beforeStart) / monthMs;
  const before = statsFor(
    source.reviews.filter((review) => Date.parse(review.publishedAt) >= beforeStart && Date.parse(review.publishedAt) < installed),
    beforeMonths,
  );
  if (beforeMonths < 1 || before.reviews < 3) return { value: null, gap: "no-history" };
  const after = statsFor(
    source.reviews.filter((review) => Date.parse(review.publishedAt) >= installed),
    afterMonths,
  );
  const upliftPct = before.reviewsPerMonth > 0 ? (after.reviewsPerMonth / before.reviewsPerMonth - 1) * 100 : null;
  return { value: { installedOn, before, after, upliftPct }, gap: null };
}

function topWords(reviews: GoogleReview[], limit: number): WordCount[] {
  const counts = new Map<string, { count: number; surfaces: Map<string, number> }>();
  for (const review of reviews) {
    for (const { key, surface } of significantWords(review.text)) {
      const entry = counts.get(key) ?? { count: 0, surfaces: new Map<string, number>() };
      entry.count += 1;
      entry.surfaces.set(surface, (entry.surfaces.get(surface) ?? 0) + 1);
      counts.set(key, entry);
    }
  }
  return [...counts]
    .filter(([, entry]) => entry.count >= 2)
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([, entry]) => ({ word: [...entry.surfaces].sort((a, b) => b[1] - a[1])[0][0], count: entry.count }));
}

const round1 = (value: number) => Math.round(value * 10 + 1e-9) / 10;

/**
 * How many 5-star reviews lift the displayed rating by one step, and how many 1-star reviews
 * drop it. Uses the imported history when it is complete, otherwise Google's own totals.
 * Google rounds to one decimal, so a display of 4.4 needs an average of at least 4.35.
 */
export function computeRatingGoal(
  reviews: GoogleReview[],
  ratingTotal: number | null,
  reviewsTotal: number | null,
  now: Date,
): RatingGoal | null {
  const exact = reviews.length > 0 && (reviewsTotal === null || reviews.length >= reviewsTotal * 0.95);
  const count = exact ? reviews.length : (reviewsTotal ?? 0);
  if (!count) return null;
  const sum = exact ? reviews.reduce((total, review) => total + review.rating, 0) : (ratingTotal ?? 0) * count;
  if (!sum) return null;
  const average = sum / count;
  const current = exact ? round1(average) : round1(ratingTotal!);

  let next: number | null = null;
  let fiveStarsNeeded: number | null = null;
  if (current < 5) {
    next = round1(current + 0.1);
    const threshold = next - 0.05;
    fiveStarsNeeded = Math.max(1, Math.ceil((count * threshold - sum) / (5 - threshold) - 1e-9));
  }

  let previous: number | null = null;
  let oneStarsToDrop: number | null = null;
  if (current > 1) {
    previous = round1(current - 0.1);
    const floor = current - 0.05;
    oneStarsToDrop = Math.max(1, Math.floor((sum - count * floor) / (floor - 1) + 1e-9) + 1);
  }

  const recentFiveStars = reviews.filter((review) => review.rating === 5 && now.getTime() - Date.parse(review.publishedAt) <= 90 * dayMs).length;
  const fiveStarsPerMonth = recentFiveStars / 3;
  // Google's totals are already rounded, so without the full history the position inside the step is unknown.
  const progress = !exact ? null : current >= 5 ? 1 : Math.min(1, Math.max(0, (average - (current - 0.05)) / 0.1));
  return {
    average,
    progress,
    current,
    totalReviews: count,
    exact,
    next,
    fiveStarsNeeded,
    previous,
    oneStarsToDrop,
    fiveStarsPerMonth,
    monthsToNext: fiveStarsNeeded !== null && fiveStarsPerMonth > 0 ? fiveStarsNeeded / fiveStarsPerMonth : null,
  };
}

export const reviewStarFilters = ["all", "positive", "neutral", "negative"] as const;
export type ReviewStarFilter = (typeof reviewStarFilters)[number];

export interface ReviewFilters {
  stars: ReviewStarFilter;
  unanswered: boolean;
  theme: ThemeId | null;
}

export function filterReviews(reviews: GoogleReview[], filters: ReviewFilters): GoogleReview[] {
  return reviews
    .filter((review) => {
      if (filters.stars === "positive" && review.rating < 4) return false;
      if (filters.stars === "neutral" && review.rating !== 3) return false;
      if (filters.stars === "negative" && review.rating > 2) return false;
      if (filters.unanswered && review.ownerReply?.trim()) return false;
      if (filters.theme && !themesIn(review.text).includes(filters.theme)) return false;
      return true;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function themeExamples(reviews: GoogleReview[], theme: ThemeId, verdict: ThemeStats["verdict"]): ThemeExample[] {
  const ordered = [...reviews].sort((a, b) =>
    verdict === "improve"
      ? a.rating - b.rating || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
      : Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  const examples: ThemeExample[] = [];
  const seen = new Set<string>();
  for (const review of ordered) {
    const quote = themeSentences(review.text, theme)[0];
    if (!quote || seen.has(quote.toLowerCase())) continue;
    seen.add(quote.toLowerCase());
    examples.push({ reviewId: review.id, rating: review.rating, publishedAt: review.publishedAt, quote });
    if (examples.length === 6) break;
  }
  return examples;
}

export function computeAnalytics(source: DashboardSource, period: PeriodId, now = new Date()): DashboardAnalytics {
  const endMs = now.getTime();
  const startDate = periodStart(period, now);
  const startMs = startDate?.getTime() ?? null;
  const reviews = source.reviews.filter((review) => inRange(review.publishedAt, startMs, endMs));
  const taps = source.taps.filter((tap) => inRange(tap.tappedAt, startMs, endMs));
  const attribution = attributeReviews(source.reviews, source.taps);
  const attributed = reviews.filter((review) => attribution.has(review.id));
  const allTimes = source.reviews.map((review) => Date.parse(review.publishedAt));
  const firstReviewMs = allTimes.length ? Math.min(...allTimes) : null;
  const seriesStartMs = startMs ?? firstReviewMs ?? endMs;
  const spanDays = (endMs - seriesStartMs) / dayMs;
  const granularity = granularityFor(period, spanDays);

  // Previous window of equal length, for deltas. Too few data points there means no comparison.
  const previousRange = startMs === null ? null : { start: startMs - (endMs - startMs), end: startMs - 1 };
  const previousReviews = previousRange ? source.reviews.filter((review) => inRange(review.publishedAt, previousRange.start, previousRange.end)) : [];
  const previousTaps = previousRange ? source.taps.filter((tap) => inRange(tap.tappedAt, previousRange.start, previousRange.end)) : [];
  const previousAttributed = previousReviews.filter((review) => attribution.has(review.id)).length;
  const comparableReviews = previousRange !== null && previousReviews.length >= minSample.previousReviews;
  const comparableTaps = previousRange !== null && previousTaps.length >= minSample.taps;

  const replied = (list: GoogleReview[]) => list.filter((review) => review.ownerReply?.trim());
  const replyHours = replied(reviews)
    .filter((review) => review.ownerRepliedAt)
    .map((review) => (Date.parse(review.ownerRepliedAt!) - Date.parse(review.publishedAt)) / 3_600_000)
    .filter((hours) => hours >= 0);

  const kpis: Kpis = {
    avgRating: {
      current: average(reviews.map((review) => review.rating)),
      previous: comparableReviews ? average(previousReviews.map((review) => review.rating)) : null,
    },
    reviews: { current: reviews.length, previous: comparableReviews ? previousReviews.length : null },
    taps: { current: taps.length, previous: comparableTaps ? previousTaps.length : null },
    conversion: {
      current: taps.length >= minSample.taps ? ratio(attributed.length, taps.length) : null,
      previous: comparableTaps ? ratio(previousAttributed, previousTaps.length) : null,
    },
    replyRate: {
      current: ratio(replied(reviews).length, reviews.length),
      previous: comparableReviews ? ratio(replied(previousReviews).length, previousReviews.length) : null,
    },
    medianReplyHours: median(replyHours),
    uniqueVisitors: new Set(taps.map((tap) => tap.visitorHash)).size,
    attributedReviews: attributed.length,
  };

  // Time series.
  const buckets = new Map<string, TimeBucket>();
  let key = bucketKey(new Date(seriesStartMs).toISOString(), granularity);
  const lastKey = bucketKey(now.toISOString(), granularity);
  for (let guard = 0; guard < 400; guard++) {
    buckets.set(key, { key, start: key, reviews: 0, ratingSum: 0, avgRating: null, taps: 0 });
    if (key === lastKey) break;
    key = nextKey(key, granularity);
  }
  for (const review of reviews) {
    const bucket = buckets.get(bucketKey(review.publishedAt, granularity));
    if (!bucket) continue;
    bucket.reviews += 1;
    bucket.ratingSum += review.rating;
  }
  for (const tap of taps) {
    const bucket = buckets.get(bucketKey(tap.tappedAt, granularity));
    if (bucket) bucket.taps += 1;
  }
  const series = [...buckets.values()].map((bucket) => ({ ...bucket, avgRating: bucket.reviews ? bucket.ratingSum / bucket.reviews : null }));

  const starDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    return { stars, count, share: reviews.length ? count / reviews.length : 0 };
  });

  // Plates.
  const plateTaps = new Map<string, number>();
  for (const tap of taps) plateTaps.set(tap.plateCode, (plateTaps.get(tap.plateCode) ?? 0) + 1);
  const plateAttributed = new Map<string, number>();
  for (const review of attributed) {
    const code = attribution.get(review.id)!.plateCode;
    plateAttributed.set(code, (plateAttributed.get(code) ?? 0) + 1);
  }
  const plates: PlateStats[] = source.plates
    .map((plate) => {
      const plateTapCount = plateTaps.get(plate.code) ?? 0;
      const plateReviews = plateAttributed.get(plate.code) ?? 0;
      return {
        code: plate.code,
        label: plate.label,
        taps: plateTapCount,
        attributedReviews: plateReviews,
        conversion: ratio(plateReviews, plateTapCount),
        enoughData: plateTapCount >= minSample.taps,
      };
    })
    .sort((a, b) => b.taps - a.taps);

  const sources: Record<TapSource, number> = { nfc: 0, qr: 0 };
  const tapHeatmap = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const tap of taps) {
    sources[tap.source] += 1;
    const { weekday, hour } = zonedParts(tap.tappedAt);
    tapHeatmap[weekday][hour] += 1;
  }

  // Text.
  const sentiment = {
    positive: reviews.filter((review) => review.rating >= 4).length,
    neutral: reviews.filter((review) => review.rating === 3).length,
    negative: reviews.filter((review) => review.rating <= 2).length,
  };
  const overall = kpis.avgRating.current ?? 0;
  const themed = reviews.map((review) => ({ review, themes: themesIn(review.text) }));
  const themes: ThemeStats[] = themeIds
    .map((id) => {
      const mentions = themed.filter((entry) => entry.themes.includes(id)).map((entry) => entry.review);
      const avgRating = average(mentions.map((review) => review.rating));
      const positiveShare = ratio(mentions.filter((review) => review.rating >= 4).length, mentions.length) ?? 0;
      const negativeShare = ratio(mentions.filter((review) => review.rating <= 2).length, mentions.length) ?? 0;
      let verdict: ThemeStats["verdict"] = "neutral";
      if (mentions.length >= minSample.themeMentions && avgRating !== null) {
        if (negativeShare >= 0.3 || avgRating <= overall - 0.4) verdict = "improve";
        else if (avgRating >= overall + 0.1 && positiveShare >= 0.8) verdict = "strength";
      }
      return { id, mentions: mentions.length, avgRating, positiveShare, negativeShare, verdict, examples: themeExamples(mentions, id, verdict) };
    })
    .filter((theme) => theme.mentions > 0)
    .sort((a, b) => b.mentions - a.mentions);

  const words = {
    positive: topWords(reviews.filter((review) => review.rating >= 4), 12),
    negative: topWords(reviews.filter((review) => review.rating <= 2), 12),
  };

  const weekdays: WeekdayStats[] = [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
    const dayReviews = reviews.filter((review) => zonedParts(review.publishedAt).weekday === weekday);
    const dayTaps = taps.filter((tap) => zonedParts(tap.tappedAt).weekday === weekday).length;
    const dayAttributed = dayReviews.filter((review) => attribution.has(review.id)).length;
    return {
      weekday,
      reviews: dayReviews.length,
      avgRating: average(dayReviews.map((review) => review.rating)),
      taps: dayTaps,
      attributed: dayAttributed,
      conversion: ratio(dayAttributed, dayTaps),
      enoughTaps: dayTaps >= minSample.taps,
      enoughReviews: dayReviews.length >= minSample.reviews,
    };
  });

  const beforeAfter = computeBeforeAfter(source, now);

  return {
    period: { id: period, start: startDate?.toISOString() ?? null, end: now.toISOString(), granularity },
    firstReviewAt: firstReviewMs === null ? null : new Date(firstReviewMs).toISOString(),
    kpis,
    ratingGoal: computeRatingGoal(source.reviews, source.business.ratingTotal, source.business.reviewsTotal, now),
    series,
    starDistribution,
    beforeAfter: beforeAfter.value,
    beforeAfterGap: beforeAfter.gap,
    plates,
    sources,
    tapHeatmap,
    sentiment,
    themes,
    words,
    weekdays,
    unansweredCount: reviews.filter((review) => !review.ownerReply?.trim()).length,
  };
}
