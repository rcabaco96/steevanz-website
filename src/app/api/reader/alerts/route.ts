import type { NextRequest } from "next/server";
import { z } from "zod";
import { isNegative } from "@/lib/reviews/analytics";
import { alertMaxAgeMs, sendNegativeReviewAlert, syncTargetColumns, type AlertReview, type SyncTarget } from "@/lib/reviews/store";
import { tryCreateServiceClient } from "@/lib/supabase/service";

const bodySchema = z.object({
  businessId: z.uuid(),
  reviewIds: z.array(z.string().min(1).max(300)).max(500),
});

/**
 * Called by the local reader after an "update" job with the ids of the reviews it just added.
 * Sends the usual negative-review email (1–3★, published in the last 7 days) to the customer.
 * Authorization: Bearer CRON_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid body: expected { businessId, reviewIds }" }, { status: 400 });
  const { businessId, reviewIds } = parsed.data;
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data: business, error } = await client.from("review_businesses").select(syncTargetColumns).eq("id", businessId).maybeSingle<SyncTarget>();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!business) return Response.json({ error: "business not found" }, { status: 404 });
  if (!business.alert_email || !reviewIds.length) return Response.json({ sent: false, negative: 0, reason: business.alert_email ? "no reviews" : "no alert email" });

  const since = new Date(Date.now() - alertMaxAgeMs).toISOString();
  const ids = [...new Set(reviewIds)];
  const rows: AlertReview[] = [];
  // Chunks keep the request URL short.
  for (let index = 0; index < ids.length; index += 100) {
    const { data, error: reviewsError } = await client
      .from("google_reviews")
      .select("rating, published_at, text")
      .eq("business_id", businessId)
      .in("review_id", ids.slice(index, index + 100))
      .gte("published_at", since);
    if (reviewsError) return Response.json({ error: reviewsError.message }, { status: 500 });
    rows.push(...((data ?? []) as AlertReview[]));
  }
  const negative = rows.filter((review) => isNegative(review.rating)).sort((a, b) => b.published_at.localeCompare(a.published_at));
  if (!negative.length) return Response.json({ sent: false, negative: 0 });

  await sendNegativeReviewAlert(business, negative);
  return Response.json({ sent: true, negative: negative.length });
}
