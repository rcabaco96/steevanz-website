import type { NextRequest } from "next/server";
import { panelApiDenied } from "@/lib/reviews/access";
import { loadReaderJobs, queueCompetitorSearch, queueFullImport, type ImportResponse } from "@/lib/reviews/import-jobs";
import { handRetiredJobsToReader } from "@/lib/reviews/reader-queue";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 60;

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
 * Reader jobs of the customer (full import, "Atualizar", competitor search), the reader's heartbeat
 * and what is already saved. Only reads Supabase. Polled by the panel only while one of these jobs
 * is queued or running (ReaderJobs.tsx).
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/painel/[slug]/import">) {
  const { slug } = await ctx.params;
  const denied = await panelApiDenied(slug);
  if (denied) return denied;
  const { client, id } = await business(slug);
  if (!client) return reply({ error: "Serviço indisponível." }, 503);
  if (!id) return reply({ error: "Painel não encontrado." }, 404);
  try {
    return reply(await loadReaderJobs(client, id));
  } catch {
    return reply({ error: "Serviço indisponível." }, 500);
  }
}

/**
 * "Importar histórico completo": queues a full import for the Steevanz reader and, for a customer
 * without competitors, the reader's competitor search (another tab, in parallel with the reviews).
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
    // A job left for a provider that no longer exists would block this customer's imports forever.
    await handRetiredJobsToReader(client, id);
    await queueFullImport(client, id);
    await queueCompetitorSearch(client, id);
    return reply(await loadReaderJobs(client, id));
  } catch {
    return reply({ error: "Não foi possível fazer o pedido. Tente novamente." }, 500);
  }
}
