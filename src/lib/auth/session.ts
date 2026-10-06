import type { User } from "@supabase/supabase-js";
import { connection } from "next/server";
import { cache } from "react";
import type { ProfileRow } from "@/lib/accounts/types";
import { isAdminEmail, publicSupabaseConfig, serviceSupabaseConfig } from "@/lib/supabase/env";
import { createAuthClient } from "@/lib/supabase/server";

export type Session =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "client"; user: User; email: string }
  | { state: "admin"; user: User; email: string };

export function isAuthConfigured(): boolean {
  return Boolean(publicSupabaseConfig() && serviceSupabaseConfig());
}

/** Admin rights need a confirmed email, because anyone can register an account. */
export function isAdminUser(user: User): boolean {
  return Boolean(user.email && user.email_confirmed_at && isAdminEmail(user.email));
}

export const getSession = cache(async (): Promise<Session> => {
  await connection();
  if (!isAuthConfigured()) {
    console.error("[auth] Supabase not configured");
    return { state: "unconfigured" };
  }
  const supabase = await createAuthClient();
  if (!supabase) return { state: "unconfigured" };
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) return { state: "anonymous" };
    const email = data.user.email.toLowerCase();
    return isAdminUser(data.user) ? { state: "admin", user: data.user, email } : { state: "client", user: data.user, email };
  } catch (error) {
    console.error("[auth] getUser failed:", error instanceof Error ? error.message : error);
    return { state: "anonymous" };
  }
});

export class AuthRequiredError extends Error {
  constructor() {
    super("Sessão em falta");
    this.name = "AuthRequiredError";
  }
}

/** Any signed-in account (admins included). */
export async function requireUser(): Promise<User> {
  const session = await getSession();
  if (session.state !== "client" && session.state !== "admin") throw new AuthRequiredError();
  return session.user;
}

export const getOwnProfile = cache(async (): Promise<ProfileRow | null> => {
  const session = await getSession();
  if (session.state !== "client" && session.state !== "admin") return null;
  const supabase = await createAuthClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  if (error) throw new Error(`getOwnProfile: ${error.message}`);
  return data as ProfileRow | null;
});

/** Only relative, same-site paths are allowed as post-login destinations. */
export function safeNextPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

