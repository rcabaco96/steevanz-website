"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { startReviewSync, syncBusinessReviews, syncTargetColumns, type SyncTarget } from "@/lib/reviews/store";
import { isProductId } from "@/content/products";
import { apifyToken } from "@/lib/reviews/apify";
import { discoverCompetitors, measureCompetitorPace, snapshotCompetitors } from "@/lib/reviews/competitor-store";
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
  owner_id: z.union([uuid, z.literal("")]).transform((owner) => owner || null),
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
      owner_id: value(formData, "owner_id"),
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
        owner_id: "Escolha uma conta de cliente válida.",
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
      if (error.code === "23503") return { ok: false, message: "Essa conta de cliente já não existe." };
      throw new Error(error.message);
    }
    revalidatePath("/admin/reviews");
    revalidatePath(`/painel/${business.slug}`);
    if (!id && saved) after(() => findCompetitors(client, { id: saved.id as string, google_maps_url: business.google_maps_url }));
    return {
      ok: true,
      message: id ? "Negócio atualizado." : "Negócio criado. Os concorrentes da zona vão ser procurados em segundo plano (1–3 minutos).",
    };
  });
}

/** Details and a first pace batch after discovery; the daily job finishes any remaining batches. */
async function completeCompetitors(client: ReturnType<typeof createServiceClient>, businessId: string) {
  try {
    await snapshotCompetitors(client, businessId);
    await measureCompetitorPace(client, businessId);
  } catch (error) {
    console.error("[competitors] follow-up failed:", error instanceof Error ? error.message : error);
  }
}

async function findCompetitors(client: ReturnType<typeof createServiceClient>, business: { id: string; google_maps_url: string }) {
  try {
    await discoverCompetitors(client, business);
  } catch (error) {
    console.error("[competitors] discovery failed:", error instanceof Error ? error.message : error);
    return;
  }
  await completeCompetitors(client, business.id);
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
    // Star distributions and review pace follow in the background.
    after(() => completeCompetitors(client, data.id as string));
    revalidatePath("/admin/reviews");
    revalidatePath(`/painel/${data.slug}`);
    return { ok: true, message: `${found} concorrentes encontrados. A média exata e o ritmo de reviews de cada um completam-se nos próximos minutos e no dia seguinte.` };
  });
}

export async function toggleCompetitor(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    const excluded = value(formData, "excluded") === "true";
    const { data, error } = await createServiceClient().from("competitors").update({ excluded }).eq("id", id.data).eq("is_self", false).select("business:review_businesses(slug)").maybeSingle<{ business: { slug: string } | null }>();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/reviews");
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
    revalidatePath("/admin/reviews");
    return { ok: true, message: "Negócio removido." };
  });
}

export async function syncReviewsNow(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const id = uuid.safeParse(value(formData, "id"));
    if (!id.success) return { ok: false, message: "Pedido inválido." };
    if (!apifyToken()) return { ok: false, message: "Falta configurar o APIFY_TOKEN." };
    const client = createServiceClient();
    const { data, error } = await client.from("review_businesses").select(syncTargetColumns).eq("id", id.data).maybeSingle<SyncTarget>();
    if (error) throw new Error(error.message);
    if (!data) return { ok: false, message: "Negócio não encontrado." };
    if ((await startReviewSync(client, data.id, 0)) === "running") return { ok: false, message: "Já está a decorrer uma sincronização deste negócio. Aguarde um minuto." };
    const mode = value(formData, "mode") === "full" ? "full" : "refresh";
    const result = await syncBusinessReviews(client, data, mode);
    revalidatePath("/admin/reviews");
    revalidatePath(`/painel/${data.slug}`);
    return result.ok
      ? { ok: true, message: mode === "full" ? `Reimportado: ${result.imported} reviews lidas, incluindo respostas a reviews antigas.` : `Sincronizado: ${result.imported} reviews recebidas do Google.` }
      : { ok: false, message: `A sincronização falhou: ${result.error?.slice(0, 160)}` };
  });
}
