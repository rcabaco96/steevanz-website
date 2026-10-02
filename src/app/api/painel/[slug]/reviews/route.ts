import type { NextRequest } from "next/server";
import { filterReviews, periodIds, periodStart, type PeriodId } from "@/lib/reviews/analytics";
import { getDashboardSource } from "@/lib/reviews/store";
import { themeIds, type ThemeId } from "@/lib/reviews/text";
import type { ThemeReview } from "@/lib/reviews/types";

const maxReviews = 200;

export async function GET(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/reviews">) {
  const { slug } = await ctx.params;
  const theme = request.nextUrl.searchParams.get("tema") as ThemeId;
  const period = request.nextUrl.searchParams.get("periodo") as PeriodId;
  if (!themeIds.includes(theme) || !periodIds.includes(period)) return Response.json({ error: "invalid" }, { status: 400 });

  const source = await getDashboardSource(slug);
  if (!source) return Response.json({ error: "not found" }, { status: 404 });

  const start = periodStart(period, new Date())?.getTime() ?? null;
  const inPeriod = source.reviews.filter((review) => start === null || Date.parse(review.publishedAt) >= start);
  const matching = filterReviews(inPeriod, { stars: "all", unanswered: false, theme });
  const reviews: ThemeReview[] = matching.slice(0, maxReviews).map((review) => ({
    id: review.id,
    rating: review.rating,
    text: review.text,
    publishedAt: review.publishedAt,
    replied: Boolean(review.ownerReply?.trim()),
  }));
  return Response.json({ reviews, total: matching.length }, { headers: { "Cache-Control": "private, no-store" } });
}
