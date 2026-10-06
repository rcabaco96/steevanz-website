"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
import { isProductId } from "@/content/products";
import { apifyToken } from "@/lib/reviews/apify";
import { discoverCompetitors } from "@/lib/reviews/competitor-store";
import { jobPriority, queueNewCompetitorReads, queueReaderJob } from "@/lib/reviews/reader-queue";
import { fullImportSource } from "@/lib/reviews/import-source";
import { queueCompetitorSearch } from "@/lib/reviews/import-jobs";
import { isShortMapsLink, parseMapsPlaceLink, placeIdFromFid, writeReviewLink } from "@/lib/reviews/maps-link";
import { createServiceClient } from "@/lib/supabase/service";
import type { AdminActionState } from "./actions";
import { AdminAccessError, requireAdmin } from "./auth";

const uuid = z.uuid();
const googleHosts = /(^|\.)google\.[a-z.]+$|(^|\.)goo\.gl$|(^|\.)g\.page$/;

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

async function guarded(task: () => Promise<AdminActionState>): Promise<AdminActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    console.error("[admin] review action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

const googleUrl = z.url({ protocol: /^https$/ }).refine((url) => googleHosts.test(new URL(url).hostname));

const businessSchema = z.object({
  id: z.union([uuid, z.literal("")]),
  name: z.string().min(1).max(160),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60),
  google_maps_url: googleUrl,
  review_url: googleUrl,
  plates_installed_on: z.union([z.iso.date(), z.literal("")]).transform((date) => date || null),
  alert_email: z.union([z.email(), z.literal("")]).transform((email) => email.toLowerCase() || null),
  active_services: z.array(z.string().refine(isProductId)).max(20),
});

export async function saveReviewBusiness(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const name = value(formData, "name");
    const parsed = businessSchema.safeParse({
      id: value(formData, "id"),
      name,
      slug: slugify(value(formData, "slug") || name),
      google_maps_url: value(formData, "google_maps_url"),
      review_url: value(formData, "review_url"),
      plates_installed_on: value(formData, "plates_installed_on"),
      alert_email: value(formData, "alert_email"),
      active_services: formData.getAll("active_services").filter((entry): entry is string => typeof entry === "string"),
    });
    if (!parsed.success) {
      const field = String(parsed.error.issues[0]?.path[0] ?? "");
      const messages: Record<string, string> = {
        name: "Indique o nome do negócio.",
        slug: "O endereço do painel só pode ter letras, números e hífens.",
        google_maps_url: "O link do Google Maps tem de ser um link https do Google (google.com/maps ou maps.app.goo.gl).",
        review_url: "O link de avaliação tem de ser um link https do Google (g.page/r/…/review ou search.google.com).",
        plates_installed_on: "Data de instalação inválida.",
        alert_email: "Indique um email válido para os alertas (ou deixe vazio).",
      };
      return { ok: false, message: messages[field] ?? "Dados inválidos." };
    }
    const { id, ...business } = parsed.data;
    const client = createServiceClient();
    const { data: saved, error } = id
      ? await client.from("review_businesses").update(business).eq("id", id).select("id").single()
      : await client.from("review_businesses").insert(business).select("id").single();
    if (error) {
      if (error.code === "23505") return { ok: false, message: "Já existe um negócio com esse endereço de painel." };
      throw new Error(error.message);
    }
    revalidatePath("/admin/reviews", "layout");
    revalidatePath(`/painel/${business.slug}`);
    // No paid competitor search here: the reader searches the competitors at the first import.
    return { ok: true, message: id ? "Negócio atualizado." : saved ? "Negócio criado." : "Negócio guardado." };
  });
}

/** A short Maps link (maps.app.goo.gl…) → the full place link it redirects to (a plain request, no API). */
async function resolveMapsLink(url: string): Promise<string> {
  let current = url;
  for (let hop = 0; hop < 5 && isShortMapsLink(current); hop++) {
    const response = await fetch(current, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(10_000) });
    const next = response.headers.get("location");
    if (!next) break;
    current = new URL(next, current).toString();
  }
  // A redirect can stop at Google's consent page, with the place link as its "continue" parameter.
  const parsed = new URL(current);
  const resume = parsed.searchParams.get("continue");
  return /(^|\.)consent\./.test(parsed.hostname) && resume ? resume : current;
}

/**
 * «Novo negócio» from its Google Maps link alone: name, Google id and coordinates come from the link
 * (the last place in it), the rest from the first import, queued here for the reader (reviews, rating,
 * category and the zone's competitors).
 */
export async function createBusinessFromMapsLink(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  let created: string | null = null;
  const result = await guarded(async () => {
    const link = value(formData, "google_maps_url");
    if (!googleUrl.safeParse(link).success) {
      return { ok: false, message: "Cole o link https do negócio no Google Maps (google.com/maps/place/… ou maps.app.goo.gl/…)." };
    }
    const place = parseMapsPlaceLink(await resolveMapsLink(link).catch(() => link));
    if (!place) {
      return { ok: false, message: "Este link não é de um negócio no Google Maps. Abra o negócio no Maps e copie o link da barra de endereço ou de «Partilhar»." };
    }
    const client = createServiceClient();
    const { data: existing, error: existingError } = await client.from("review_businesses").select("slug").eq("google_fid", place.fid).maybeSingle<{ slug: string }>();
    if (existingError) throw new Error(existingError.message);
    if (existing) return { ok: false, message: `Este negócio já existe: /painel/${existing.slug}` };

    // Google's place id comes out of the link's feature id: the plate opens the write-a-review window.
    const placeId = placeIdFromFid(place.fid);
    const base = slugify(place.name) || "negocio";
    let saved: { id: string; slug: string } | null = null;
    for (let attempt = 1; attempt < 20 && !saved; attempt++) {
      const slug = attempt === 1 ? base : `${base.slice(0, 56)}-${attempt}`;
      const { data, error } = await client
        .from("review_businesses")
        .insert({ slug, name: place.name, google_maps_url: place.cleanUrl, review_url: placeId ? writeReviewLink(placeId) : place.cleanUrl, place_id: placeId, google_fid: place.fid, lat: place.lat, lng: place.lng })
        .select("id, slug")
        .single<{ id: string; slug: string }>();
      if (!error) saved = data;
      else if (error.code !== "23505") throw new Error(error.message);
    }
    if (!saved) return { ok: false, message: "Não foi possível escolher um endereço livre para o painel." };

    let queued = false;
    if (fullImportSource() === "reader") {
      const { error } = await client.from("review_import_jobs").insert({ business_id: saved.id, kind: "full", priority: jobPriority.firstImport, requested_by: "admin", provider: "reader" });
      if (error && error.code !== "23505") throw new Error(error.message);
      queued = !error;
      // The competitor search goes in parallel (another reader tab).
      await queueCompetitorSearch(client, saved.id, "admin");
    }
    revalidatePath("/admin/reviews", "layout");
    created = saved.id;
    return {
      ok: true,
      message: `Negócio criado: «${place.name}» em /painel/${saved.slug}.${queued ? " A primeira importação (reviews e concorrência) ficou na fila do leitor." : ""}`,
    };
  });
  // Back to the list, which names the new business (outside guarded: redirect works by throwing).
  if (result?.ok && created) redirect(`/admin/reviews?criado=${created}`);
  return result;
}

/** After a search, the free local reader reads each new place (star distribution, reviews, reply rate). */
async function completeCompetitors(client: ReturnType<typeof createServiceClient>, businessId: string) {
  try {
    await queueNewCompetitorReads(client, businessId, "admin");
  } catch (error) {
    console.error("[competitors] queuing reader jobs failed:", error instanceof Error ? error.message : error);
  }
}

export async function refreshCompetitors(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    if (!apifyToken()) return { ok: false, message: "Falta configurar o APIFY_TOKEN." };
    const client = createServiceClient();
    const { data, error } = await client.from("review_businesses").select("id, slug, google_maps_url").eq("id", id.data).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return { ok: false, message: "Negócio não encontrado." };
    const found = await discoverCompetitors(client, data as { id: string; google_maps_url: string });
    // Star distributions, pace and reply rates are read by the local reader.
    await completeCompetitors(client, data.id as string);
    revalidatePath("/admin/reviews", "layout");
    revalidatePath(`/painel/${data.slug}`);
    return { ok: true, message: `${found} concorrentes encontrados. O leitor lê a média exata, o ritmo e as respostas de cada um assim que estiver ligado.` };
  });
}

export async function toggleCompetitor(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    const excluded = value(formData, "excluded") === "true";
    const { data, error } = await createServiceClient().from("competitors").update({ excluded }).eq("id", id.data).eq("is_self", false).select("business:review_businesses(slug)").maybeSingle<{ business: { slug: string } | null }>();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/reviews", "layout");
    if (data?.business) revalidatePath(`/painel/${data.business.slug}`);
    return { ok: true, message: excluded ? "Concorrente excluído." : "Concorrente incluído." };
  });
}

export async function deleteReviewBusiness(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("review_businesses").delete().eq("id", id.data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/reviews", "layout");
    return { ok: true, message: "Negócio removido." };
  });
}

/** Plan B (paid): reads the reviews right now through Apify, when the local reader cannot. */
export async function syncReviewsNow(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    if (!apifyToken()) return { ok: false, message: "Falta configurar o APIFY_TOKEN." };
    const client = createServiceClient();
    const { data, error } = await client.from("review_businesses").select(syncTargetColumns).eq("id", id.data).maybeSingle<SyncTarget>();
    if (error) throw new Error(error.message);
    if (!data) return { ok: false, message: "Negócio não encontrado." };
    if ((await startReviewSync(client, data.id, 0)) === "running") return { ok: false, message: "Já está a decorrer uma leitura deste negócio. Aguarde um minuto." };
    const mode = value(formData, "mode") === "full" ? "full" : "refresh";
    const result = await syncBusinessReviews(client, data, mode);
    revalidatePath("/admin/reviews", "layout");
    revalidatePath(`/painel/${data.slug}`);
    return result.ok
      ? { ok: true, message: mode === "full" ? `Apify: ${result.imported} reviews lidas, incluindo respostas a reviews antigas.` : `Apify: ${result.imported} reviews recebidas do Google.` }
      : { ok: false, message: `A leitura com o Apify falhou: ${result.error?.slice(0, 160)}` };
  });
}

/** Normal path (free): asks the local reader for an update or the whole history, ahead of the routine. */
export async function queueReaderReviews(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    const kind = value(formData, "kind") === "full" ? "full" : "update";
    const client = createServiceClient();
    const { data, error } = await client.from("review_businesses").select("id, slug").eq("id", id.data).maybeSingle<{ id: string; slug: string }>();
    if (error) throw new Error(error.message);
    if (!data) return { ok: false, message: "Negócio não encontrado." };
    const result = await queueReaderJob(client, { kind, business_id: data.id, place_id: null, priority: jobPriority.waiting, requested_by: "admin" });
    revalidatePath("/admin/reviews", "layout");
    if (result === "active") return { ok: true, message: "Já há um pedido igual na fila do leitor." };
    return { ok: true, message: kind === "full" ? "Pedido o histórico completo ao leitor. Começa assim que o leitor estiver livre." : "Pedida uma atualização ao leitor. Começa assim que o leitor estiver livre." };
  });
}

/**
 * «Procurar concorrentes com o leitor» (free): forgets the last search and queues the reader's zone
 * search; the places chosen before stay until the new search replaces them (admin exclusions stay).
 */
export async function searchCompetitorsWithReader(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    const client = createServiceClient();
    const { error } = await client.from("review_businesses").update({ competitors_refreshed_at: null }).eq("id", id.data);
    if (error) throw new Error(error.message);
    const queued = await queueCompetitorSearch(client, id.data, "admin");
    revalidatePath("/admin/reviews", "layout");
    return { ok: true, message: queued ? "Procura de concorrentes na fila do leitor." : "Já há uma procura de concorrentes na fila do leitor." };
  });
}
