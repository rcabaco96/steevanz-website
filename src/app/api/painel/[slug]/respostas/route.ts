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
 * Builds replies (by rules, free) for the recent reviews without one, from the reviews already in
 * Supabase. New reviews come from the local reader: the Respostas tab's "Atualizar" first queues an
 * update (POST /sync) and waits for it, then calls this. Vercel never reads Google.
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
    // "synced" is kept for the response shape: the import is now the reader's job.
    return reply({ status: "done", synced: false, ...result });
  } catch (error) {
    console.error("[replies] run failed:", error instanceof Error ? error.message : error);
    return reply({ status: "error", message: "Não foi possível preparar as respostas." }, 502);
  }
}
