import type { NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { isActive, loadReaderJobs, queueUpdate, recentSyncMinutes, type UpdateResponse } from "@/lib/reviews/import-jobs";
import { syncVerifiedBusiness } from "@/lib/google/verified-sync";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { collectForPanel } from "@/lib/dataforseo/collect";
import { dispatchForPanel } from "@/lib/dataforseo/dispatch";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 60;


/**
 * Someone is waiting in the panel: send the job to DataForSEO right away on the high-priority
 * queue (~30 s). Without DataForSEO credentials the job is left for the local reader.
 */
async function sendNow(client: NonNullable<ReturnType<typeof tryCreateServiceClient>>, jobId: string) {
  if (!dataForSeoConfigured()) {
    await client.from("review_import_jobs").update({ provider: "reader" }).eq("id", jobId).eq("status", "queued");
    return;
  }
  await dispatchForPanel(client, jobId);
}

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
    if (dataForSeoConfigured()) await collectForPanel(client, id);
    return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null });
  } catch {
    return reply({ error: "Serviço indisponível." }, 500);
  }
}

/**
 * "Atualizar reviews" (and "Atualizar" in Respostas): queues an update for the local reader, which
 * reads Google on the owner's computer. Vercel never reads Google. If the customer was synced less
 * than 15 minutes ago nothing is queued; if an update is already waiting or running, that one is
 * returned.
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
    const state = await loadReaderJobs(client, id);
    if (verified) {
      // Perfil verificado: straight from Google Business Profile, in seconds, no reader.
      if (state.lastSyncedAt && Date.now() - Date.parse(state.lastSyncedAt) < verifiedIntervalSeconds * 1000) {
        return reply({ ...state, recentMinutes: 0 });
      }
      const result = await syncVerifiedBusiness(client, id, { deadlineMs: 50_000 });
      return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null, google: { ok: result.ok, newReviews: result.newReviews, error: result.error } });
    }
    if (isActive(state.update)) return reply({ ...state, recentMinutes: null });
    const recentMinutes = recentSyncMinutes(state.lastSyncedAt, Date.now());
    if (recentMinutes !== null) return reply({ ...state, recentMinutes });
    const job = await queueUpdate(client, id);
    await sendNow(client, job.id);
    if (dataForSeoConfigured()) await collectForPanel(client, id);
    return reply({ ...(await loadReaderJobs(client, id)), recentMinutes: null });
  } catch {
    return reply({ error: "Não foi possível fazer o pedido. Tente novamente." }, 500);
  }
}
