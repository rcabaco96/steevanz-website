"use server";

import { panelAccess } from "@/lib/reviews/access";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { chooseLocation, disconnect } from "./connection.ts";
import { syncFromGoogleBusiness } from "./gbp-sync.ts";

export type GoogleActionState = { ok: boolean; message?: string };

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60);
const locationSchema = z.string().regex(/^locations\/[A-Za-z0-9_-]+$/).max(200);

type Client = ReturnType<typeof createServiceClient>;

async function withBusiness(slug: string, task: (client: Client, businessId: string) => Promise<GoogleActionState>): Promise<GoogleActionState> {
  if (!slugSchema.safeParse(slug).success) return { ok: false, message: "Painel não encontrado." };
  const access = await panelAccess(slug);
  if (access !== "allowed") return { ok: false, message: access === "anonymous" ? "A sessão expirou. Entre novamente." : "Painel não encontrado." };
  try {
    const client = createServiceClient();
    const { data, error } = await client.from("review_businesses").select("id").eq("slug", slug).maybeSingle<{ id: string }>();
    if (error) throw new Error(error.message);
    if (!data) return { ok: false, message: "Painel não encontrado." };
    const result = await task(client, data.id);
    revalidatePath(`/painel/${slug}`, "layout");
    return result;
  } catch (error) {
    console.error("[google] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

/** The customer picked their location among the ones the Google account manages. */
export async function chooseGoogleLocationAction(slug: string, locationName: string): Promise<GoogleActionState> {
  if (!locationSchema.safeParse(locationName).success) return { ok: false, message: "Escolha um dos perfis da lista." };
  return withBusiness(slug, async (client, businessId) => {
    const result = await chooseLocation(client, businessId, locationName);
    // First read of the whole history through the official API (free), after the answer is sent.
    if (result.ok) after(() => syncFromGoogleBusiness(client, businessId, "full").then(() => undefined));
    return result;
  });
}

/** Revokes Steevanz's access at Google and forgets the tokens. Stored reviews stay. */
export async function disconnectGoogleAction(slug: string): Promise<GoogleActionState> {
  return withBusiness(slug, async (client, businessId) => {
    await disconnect(client, businessId);
    return { ok: true, message: "A conta Google foi desligada." };
  });
}
