import type { NextRequest } from "next/server";
import { apifyToken } from "@/lib/reviews/apify";
import { draftMissingReplies, loadReplyBusiness } from "@/lib/reviews/reply-store";
import { startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
import type { ReplyRunResponse } from "@/lib/reviews/types";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

/** Same minimum interval as the analysis tab: both tabs share one Google import. */
const syncIntervalSeconds = 300;

function reply(body: ReplyRunResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** "Atualizar" in the Respostas tab: imports new reviews, then builds replies (by rules, free) for those without one. */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/respostas">) {
  const { slug } = await ctx.params;
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return reply({ status: "error", message: "forbidden" }, 403);
  const client = tryCreateServiceClient();
  if (!client) return reply({ status: "error", message: "Serviço indisponível." }, 503);

  const body = (await request.json().catch(() => null)) as { sync?: boolean } | null;
  const business = await loadReplyBusiness(client, slug).catch(() => null);
  if (!business) return reply({ status: "error", message: "Painel não encontrado." }, 404);

  let synced = false;
  if (body?.sync !== false && apifyToken()) {
    const { data: target } = await client.from("review_businesses").select(syncTargetColumns).eq("id", business.id).maybeSingle<SyncTarget>();
    if (target && (await startReviewSync(client, business.id, syncIntervalSeconds)) === "started") {
      synced = (await syncBusinessReviews(client, target, "visit")).ok;
    }
  }

  try {
    const result = await draftMissingReplies(client, business);
    return reply({ status: "done", synced, ...result });
  } catch (error) {
    console.error("[replies] run failed:", error instanceof Error ? error.message : error);
    return reply({ status: "error", message: "Não foi possível preparar as respostas." }, 502);
  }
}
