import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewsDashboard, reviewsPageSize, type DashboardQuery } from "@/components/reviews/ReviewsDashboard";
import { computeAnalytics, periodIds, reviewStarFilters, type PeriodId, type ReviewStarFilter } from "@/lib/reviews/analytics";
import { getDashboardSource } from "@/lib/reviews/store";
import { themeIds, type ThemeId } from "@/lib/reviews/text";

const defaultPeriod: PeriodId = "all";
const maxReviewsShown = 500;

type Query = Record<string, string | string[] | undefined>;

function param(query: Query, key: string): string {
  const value = query[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseQuery(query: Query): DashboardQuery {
  const period = param(query, "periodo");
  const stars = param(query, "estrelas");
  const theme = param(query, "tema");
  const limit = Number.parseInt(param(query, "n"), 10);
  return {
    period: periodIds.includes(period as PeriodId) ? (period as PeriodId) : defaultPeriod,
    filters: {
      stars: reviewStarFilters.includes(stars as ReviewStarFilter) ? (stars as ReviewStarFilter) : "all",
      unanswered: param(query, "resposta") === "sem",
      theme: themeIds.includes(theme as ThemeId) ? (theme as ThemeId) : null,
    },
    limit: Number.isFinite(limit) ? Math.min(maxReviewsShown, Math.max(reviewsPageSize, limit)) : reviewsPageSize,
  };
}

export async function generateMetadata({ params }: PageProps<"/painel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function DashboardPage({ params, searchParams }: PageProps<"/painel/[slug]">) {
  const { slug } = await params;
  const query = parseQuery(await searchParams);

  const source = await getDashboardSource(slug);
  if (!source) notFound();

  return <ReviewsDashboard source={source} analytics={computeAnalytics(source, query.period)} basePath={`/painel/${slug}`} query={query} />;
}
