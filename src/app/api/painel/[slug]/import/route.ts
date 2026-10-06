import { after, type NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { apifyFullImportEnabled, collectApifyForPanel, startApifyFullImport } from "@/lib/reviews/apify-import";
import { fullImportSource } from "@/lib/reviews/import-source";
import { startCompetitionIfMissing } from "@/lib/reviews/competition-start";
import { loadReaderJobs, queueCompetitorSearch, queueFullImport, type ImportResponse } from "@/lib/reviews/import-jobs";
import { dataForSeoConfigured } from "@/lib/dataforseo/client";
import { collectForPanel } from "@/lib/dataforseo/collect";
import { dispatchForPanel } from "@/lib/dataforseo/dispatch";
import { tryCreateServiceClient } from "@/lib/supabase/service";


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

export const maxDuration = 120;

function reply(body: ImportResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function business(slug: string) {
  const client = tryCreateServiceClient();
  if (!client) return { client: null, id: null };
  const { data } = await client.from("review_businesses").select("id").eq("slug", slug).maybeSingle<{ id: string }>();
  return { client, id: data?.id ?? null };
}

/**
 * Reader jobs of the customer (full import and "Atualizar"), the reader's heartbeat and what is
 * already saved. Polled by the panel: every second while a job runs, every 10 s otherwise. While a
 * DataForSEO job waits, also fetches its result (free) so the panel never depends on the postback.
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/import">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const { client, id } = await business(slug);
  if (!client) return reply({ error: "Serviço indisponível." }, 503);
  if (!id) return reply({ error: "Painel não encontrado." }, 404);
  try {
    if (dataForSeoConfigured()) await collectForPanel(client, id);
    if (apifyFullImportEnabled()) await collectApifyForPanel(client, id);
    return reply(await loadReaderJobs(client, id));
  } catch {
    return reply({ error: "Serviço indisponível." }, 500);
  }
}

/**
 * "Importar histórico completo": queues a full import for the source chosen in
 * REVIEWS_FULL_IMPORT_SOURCE (import-source.ts): the Steevanz reader by default (it also searches a
 * new customer's competitors), else Apify or DataForSEO (paid; with DataForSEO the competitors are
 * searched after the response).
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/import">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return reply({ error: "forbidden" }, 403);
  const { client, id } = await business(slug);
  if (!client) return reply({ error: "Serviço indisponível." }, 503);
  if (!id) return reply({ error: "Painel não encontrado." }, 404);
  try {
    const job = await queueFullImport(client, id);
    const source = fullImportSource();
    if (source === "reader") {
      await client.from("review_import_jobs").update({ provider: "reader" }).eq("id", job.id).eq("status", "queued");
      // The competitor search goes in parallel (another reader tab), not after all the reviews.
      await queueCompetitorSearch(client, id);
    } else if (source === "apify" && apifyFullImportEnabled()) {
      await startApifyFullImport(client, job.id);
    } else {
      await sendNow(client, job.id);
      after(() => startCompetitionIfMissing(client, id).catch((error: unknown) => console.error("[painel] competitor search failed:", error instanceof Error ? error.message : error)));
    }
    return reply(await loadReaderJobs(client, id));
  } catch {
    return reply({ error: "Não foi possível fazer o pedido. Tente novamente." }, 500);
  }
}
