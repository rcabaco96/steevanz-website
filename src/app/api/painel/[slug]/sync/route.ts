import type { NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { isActive, loadReaderJobs, queueUpdate, recentSyncMinutes, type UpdateResponse } from "@/lib/reviews/import-jobs";
import { handRetiredJobsToReader } from "@/lib/reviews/reader-queue";
import { syncVerifiedBusiness } from "@/lib/google/verified-sync";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 60;

function reply(body: UpdateResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function business(slug: string) {
  const client = tryCreateServiceClient();
  if (!client) return { client: null, id: null };
  const { data } = await client.from("review_businesses").select("id, google_link_status").eq("slug", slug).maybeSingle<{ id: string; google_link_status: string }>();
  return { client, id: data?.id ?? null, verified: data?.google_link_status === "connected" };
}

/** Verified customers may update again after this many seconds (Google's API is free and fast). */
const verifiedIntervalSeconds = 60;

/** State of "Atualizar reviews" (same as GET /import). Only reads Supabase. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/sync">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const { client, id } = await business(slug);
  if (!client) return reply({ error: "Serviço indisponível." }, 503);
  if (!id) return reply({ error: "Painel não encontrado." }, 404);
  try {
    return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null });
  } catch {
    return reply({ error: "Serviço indisponível." }, 500);
  }
}

/**
 * "Atualizar reviews" (and "Atualizar" in Respostas): queues an update for the Steevanz reader,
 * which reads Google; Vercel never reads Google. Verified customers are updated right here through
 * Google's official API. If the customer was synced less than 15 minutes ago nothing is queued; if
 * an update is already waiting or running, that one is returned.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/sync">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return reply({ error: "forbidden" }, 403);
  const { client, id, verified } = await business(slug);
  if (!client) return reply({ error: "Serviço indisponível." }, 503);
  if (!id) return reply({ error: "Painel não encontrado." }, 404);
  try {
    if (verified) {
      const state = await loadReaderJobs(client, id);
      // Perfil verificado: straight from Google Business Profile, in seconds, no reader.
      if (state.lastSyncedAt && Date.now() - Date.parse(state.lastSyncedAt) < verifiedIntervalSeconds * 1000) {
        return reply({ ...state, recentMinutes: 0 });
      }
      const result = await syncVerifiedBusiness(client, id, { deadlineMs: 50_000 });
      return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null, google: { ok: result.ok, newReviews: result.newReviews, error: result.error } });
    }
    // A job left for a provider that no longer exists would block this customer's updates forever.
    await handRetiredJobsToReader(client, id);
    const state = await loadReaderJobs(client, id);
    if (isActive(state.update)) return reply({ ...state, recentMinutes: null });
    const recentMinutes = recentSyncMinutes(state.lastSyncedAt, Date.now());
    if (recentMinutes !== null) return reply({ ...state, recentMinutes });
    await queueUpdate(client, id);
    return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null });
  } catch {
    return reply({ error: "Não foi possível fazer o pedido. Tente novamente." }, 500);
  }
}
