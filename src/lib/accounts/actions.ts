"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { AuthRequiredError, requireUser } from "@/lib/auth/session";
import { createAuthClient } from "@/lib/supabase/server";

function optional(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .transform((text) => (text.length ? text : null));
}

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  business_name: optional(160),
  phone: optional(40),
  nif: optional(20),
});

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function updateProfile(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireUser();
    const parsed = profileSchema.safeParse({
      full_name: value(formData, "full_name"),
      business_name: value(formData, "business_name"),
      phone: value(formData, "phone"),
      nif: value(formData, "nif"),
    });
    if (!parsed.success) return { ok: false, message: "Indique o seu nome e verifique o tamanho dos campos." };
    const supabase = await createAuthClient();
    if (!supabase) return { ok: false, message: "O acesso a contas ainda não está configurado." };
    const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
    if (error) throw new Error(error.message);
    revalidatePath("/conta", "layout");
    return { ok: true, message: "Dados guardados." };
  } catch (error) {
    if (error instanceof AuthRequiredError) return { ok: false, message: "A sessão expirou. Entre novamente." };
    console.error("[account] updateProfile failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}
