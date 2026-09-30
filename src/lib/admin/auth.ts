import { connection } from "next/server";
import { cache } from "react";
import { adminEmails, isAdminEmail, publicSupabaseConfig, serviceSupabaseConfig } from "@/lib/supabase/env";
import { createAuthClient } from "@/lib/supabase/server";

export type AdminContext =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "forbidden"; email: string }
  | { state: "admin"; email: string };

export function isAdminConfigured(): boolean {
  return Boolean(publicSupabaseConfig() && serviceSupabaseConfig() && adminEmails().length);
}

export const getAdminContext = cache(async (): Promise<AdminContext> => {
  await connection();
  if (!isAdminConfigured()) {
    console.error("[admin] Supabase or ADMIN_EMAILS not configured");
    return { state: "unconfigured" };
  }
  const supabase = await createAuthClient();
  if (!supabase) return { state: "unconfigured" };
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) return { state: "anonymous" };
    const email = data.user.email.toLowerCase();
    return isAdminEmail(email) ? { state: "admin", email } : { state: "forbidden", email };
  } catch (error) {
    console.error("[admin] getUser failed:", error instanceof Error ? error.message : error);
    return { state: "anonymous" };
  }
});

export class AdminAccessError extends Error {
  constructor() {
    super("Acesso não autorizado");
    this.name = "AdminAccessError";
  }
}

export async function requireAdmin(): Promise<string> {
  const context = await getAdminContext();
  if (context.state !== "admin") throw new AdminAccessError();
  return context.email;
}
