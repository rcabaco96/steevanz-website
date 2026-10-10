import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPanelGoogleStatus, googleConnectPath } from "@/components/google/header-status";
import { ReviewsDashboard, reviewsPageSize, type DashboardQuery } from "@/components/reviews/ReviewsDashboard";
import { getSession } from "@/lib/auth/session";
import { requirePanelPage } from "@/lib/reviews/access";
import { computeAnalytics, reviewStarFilters, type PeriodId, type ReviewStarFilter } from "@/lib/reviews/analytics";
import { emptyReaderJobs, loadReaderJobs } from "@/lib/reviews/import-jobs";
import { getDashboardSource } from "@/lib/reviews/store";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { themeIds, type ThemeId } from "@/lib/reviews/text";

const defaultPeriod: PeriodId = "all";
const maxReviewsShown = 500;

type Query = Record<string, string | string[] | undefined>;

function param(query: Query, key: string): string {
  const value = query[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseQuery(query: Query): DashboardQuery {
  const stars = param(query, "estrelas");
  const theme = param(query, "tema");
  const limit = Number.parseInt(param(query, "n"), 10);
  return {
    // No period filter in the panel any more: old links with ?periodo= show everything too.
    period: defaultPeriod,
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
  if (!(await requirePanelPage(slug, `/painel/${slug}`))) notFound();
  const query = parseQuery(await searchParams);

  const source = await getDashboardSource(slug);
  if (!source) notFound();

  const client = tryCreateServiceClient();
  // Only reads Supabase (jobs of the local reader); opening the page never reads Google.
  const readerJobs = client ? await loadReaderJobs(client, source.business.id).catch(() => emptyReaderJobs) : emptyReaderJobs;

  // «Ligar Google» under a partial import: straight to Google's consent (or, while the connection
  // isn't set up yet, back to the Google page with the explanation).
  const googleStatus = await getPanelGoogleStatus(slug);
  const googleConnect = googleStatus === "connected" ? null : { href: googleConnectPath(slug), external: true };
  // Searching the competitors again is an admin's call (owner, 2026-10-10); the customer never sees it.
  const isAdmin = (await getSession()).state === "admin";
  return (
    <ReviewsDashboard
      source={source}
      analytics={computeAnalytics(source, query.period)}
      basePath={`/painel/${slug}`}
      query={query}
      readerJobs={readerJobs}
      googleConnect={googleConnect}
      isAdmin={isAdmin}
    />
  );
}
