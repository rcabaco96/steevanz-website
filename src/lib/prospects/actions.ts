"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { isProspectStatus } from "./rules";

const searchSchema = z.object({
  query: z.string().trim().min(2).max(80),
  area: z.string().trim().min(2).max(80),
  max_results: z.coerce.number().int().min(10).max(300),
});

/** Searches a day, so the computer that runs them does not get blocked by Google. */
const dailySearchLimit = 20;

/** Admin: queues a search («barbearias» in «Porto»); the prospector on our computer runs it. */
export async function queueProspectSearch(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = await requireAdmin();
    const parsed = searchSchema.safeParse({ query: formData.get("query"), area: formData.get("area"), max_results: formData.get("max_results") });
    if (!parsed.success) return { ok: false, message: "Indique o que procurar e onde (2 a 80 letras cada)." };
    const client = createServiceClient();
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { count } = await client.from("prospect_searches").select("id", { count: "exact", head: true }).gte("created_at", since);
    if ((count ?? 0) >= dailySearchLimit) return { ok: false, message: `Já foram pedidas ${dailySearchLimit} pesquisas nas últimas 24 horas. Volte a tentar amanhã, para o Google não bloquear o computador.` };
    const { error } = await client.from("prospect_searches").insert({ ...parsed.data, requested_by: email });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/prospecao");
    return { ok: true, message: `Pesquisa na fila: ${parsed.data.query} em ${parsed.data.area}. Os resultados aparecem aqui quando a pesquisa terminar (alguns minutos).` };
  } catch (error) {
    console.error("[prospects] queue failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível pôr a pesquisa na fila." };
  }
}

/** Admin: where we are with a business (new, contacted, interested, discarded) and a note. */
export async function updateProspect(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const placeId = String(formData.get("place_id") ?? "");
    const status = String(formData.get("status") ?? "");
    const notes = String(formData.get("notes") ?? "").trim().slice(0, 2000);
    if (!placeId || !isProspectStatus(status)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient()
      .from("prospects")
      .update({ status, notes: notes || null, updated_at: new Date().toISOString() })
      .eq("place_id", placeId);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/prospecao");
    return { ok: true, message: "Guardado." };
  } catch (error) {
    console.error("[prospects] update failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível guardar." };
  }
}

/**
 * Admin: deletes a search. Businesses only that search found, still «Novo» and without notes, go
 * with it; any business already worked on (another status or a note) stays, so no work is lost.
 */
export async function deleteProspectSearch(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const id = String(formData.get("search_id") ?? "");
    if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, message: "Pedido inválido." };
    const client = createServiceClient();
    const { data: search, error: searchError } = await client.from("prospect_searches").select("status").eq("id", id).maybeSingle();
    if (searchError) throw new Error(searchError.message);
    if (!search) return { ok: false, message: "Esta pesquisa já não existe." };
    if (search.status === "running") return { ok: false, message: "A pesquisa está a correr: espere que termine para a apagar." };
    const { data: hits, error: hitsError } = await client.from("prospect_search_hits").select("place_id").eq("search_id", id).limit(1000);
    if (hitsError) throw new Error(hitsError.message);
    const found = (hits ?? []).map((row: { place_id: string }) => row.place_id);
    const { error } = await client.from("prospect_searches").delete().eq("id", id);
    if (error) throw new Error(error.message);
    let removed = 0;
    for (let index = 0; index < found.length; index += 200) {
      const batch = found.slice(index, index + 200);
      const { data: still } = await client.from("prospect_search_hits").select("place_id").in("place_id", batch);
      const kept = new Set((still ?? []).map((row: { place_id: string }) => row.place_id));
      const orphans = batch.filter((placeId) => !kept.has(placeId));
      if (!orphans.length) continue;
      const { data: gone, error: deleteError } = await client.from("prospects").delete().in("place_id", orphans).eq("status", "new").is("notes", null).select("place_id");
      if (deleteError) throw new Error(deleteError.message);
      removed += gone?.length ?? 0;
    }
    revalidatePath("/admin/prospecao");
    return { ok: true, message: removed ? `Pesquisa apagada, com ${removed} ${removed === 1 ? "negócio que só ela tinha encontrado" : "negócios que só ela tinha encontrado"}.` : "Pesquisa apagada." };
  } catch (error) {
    console.error("[prospects] delete search failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível apagar a pesquisa." };
  }
}
