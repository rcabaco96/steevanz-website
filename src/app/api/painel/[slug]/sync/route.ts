import type { NextRequest } from "next/server";
import { apifyToken } from "@/lib/reviews/apify";
import { startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
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
  if (!apifyToken()) return reply({ status: "error", message: "A importação de reviews não está configurada." }, 503);
  const client = tryCreateServiceClient();
  if (!client) return reply({ status: "error", message: "Serviço indisponível." }, 503);

  const { data: business, error } = await client
    .from("review_businesses")
    .select(syncTargetColumns)
    .eq("slug", slug)
    .maybeSingle<SyncTarget>();
  if (error) return reply({ status: "error", message: "Serviço indisponível." }, 500);
  if (!business) return reply({ status: "error", message: "Painel não encontrado." }, 404);

  const start = await startReviewSync(client, business.id, dashboardSyncIntervalSeconds);
  if (start === "fresh" || start === "running") return reply({ status: start });
  if (start === "missing") return reply({ status: "error", message: "Painel não encontrado." }, 404);

  const result = await syncBusinessReviews(client, business);
  return result.ok ? reply({ status: "synced", imported: result.imported }) : reply({ status: "error", message: "Não foi possível atualizar as reviews." }, 502);
}
