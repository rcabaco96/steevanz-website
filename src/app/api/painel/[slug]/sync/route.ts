import type { NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { apifyToken } from "@/lib/reviews/apify";
import { customerFullSyncEveryHours, startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
import type { DashboardSyncResponse } from "@/lib/reviews/types";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

/** Minimum time between syncs triggered from the dashboard, whoever opens it. */
const dashboardSyncIntervalSeconds = 300;


function reply(body: DashboardSyncResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/sync">) {
  const { slug } = await ctx.params;

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return reply({ status: "error", message: "forbidden" }, 403);
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  if (!apifyToken()) return reply({ status: "error", message: "A importação de reviews não está configurada." }, 503);
  const client = tryCreateServiceClient();
  if (!client) return reply({ status: "error", message: "Serviço indisponível." }, 503);

  // "all": the customer asks to check replies on old reviews too (whole history, once a day).
  const body = (await request.json().catch(() => null)) as { scope?: string } | null;
  const wholeHistory = body?.scope === "all";

  const { data: business, error } = await client
    .from("review_businesses")
    .select(`${syncTargetColumns}, full_synced_at`)
    .eq("slug", slug)
    .maybeSingle<SyncTarget & { full_synced_at: string | null }>();
  if (error) return reply({ status: "error", message: "Serviço indisponível." }, 500);
  if (!business) return reply({ status: "error", message: "Painel não encontrado." }, 404);

  if (wholeHistory && business.full_synced_at && Date.now() - Date.parse(business.full_synced_at) < customerFullSyncEveryHours * 3_600_000) {
    return reply({ status: "fresh" });
  }

  const start = await startReviewSync(client, business.id, wholeHistory ? 0 : dashboardSyncIntervalSeconds);
  if (start === "fresh" || start === "running") return reply({ status: start });
  if (start === "missing") return reply({ status: "error", message: "Painel não encontrado." }, 404);

  const result = await syncBusinessReviews(client, business, wholeHistory ? "full" : "visit");
  return result.ok ? reply({ status: "synced", imported: result.imported }) : reply({ status: "error", message: "Não foi possível atualizar as reviews." }, 502);
}
