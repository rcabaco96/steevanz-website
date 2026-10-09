import type { NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { draftMissingReplies, loadReplyBusiness } from "@/lib/reviews/reply-store";
import type { ReplyRunResponse } from "@/lib/reviews/types";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

function reply(body: ReplyRunResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Builds replies (by rules, free) for the stored reviews without one: always and only from the
 * reviews already in Supabase for this business (the whole stored history, in pages). It never
 * reads Google nor waits for the reader or any other source; new reviews arrive through the
 * panel's review update and the daily routine.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/respostas">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return reply({ status: "error", message: "forbidden" }, 403);
  const client = tryCreateServiceClient();
  if (!client) return reply({ status: "error", message: "Serviço indisponível." }, 503);

  const business = await loadReplyBusiness(client, slug).catch(() => null);
  if (!business) return reply({ status: "error", message: "Painel não encontrado." }, 404);

  try {
    const result = await draftMissingReplies(client, business);
    // "synced" is kept for the response shape: this route never imports reviews.
    return reply({ status: "done", synced: false, ...result });
  } catch (error) {
    console.error("[replies] run failed:", error instanceof Error ? error.message : error);
    return reply({ status: "error", message: "Não foi possível preparar as respostas." }, 502);
  }
}
