import type { User } from "@supabase/supabase-js";
import { connection } from "next/server";
import { cache } from "react";
import type { ProfileRow } from "@/lib/accounts/types";
import { isAdminEmail, publicSupabaseConfig, serviceSupabaseConfig } from "@/lib/supabase/env";
import { createAuthClient } from "@/lib/supabase/server";

/** The signed-in account, as far as pages need it. */
export interface SessionUser {
  id: string;
  email: string;
}

export type Session =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "client"; user: SessionUser; email: string }
  | { state: "admin"; user: SessionUser; email: string };

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
    // The access token is checked locally against the project's signing key (no round trip to
    // Supabase on every page). Its email is always a confirmed one: sessions are only issued after
    // confirmation, and an email change only reaches the token once the new address is confirmed.
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (error || !claims?.sub || typeof claims.email !== "string" || !claims.email || claims.is_anonymous) return { state: "anonymous" };
    const email = claims.email.toLowerCase();
    const user = { id: claims.sub, email };
    return isAdminEmail(email) ? { state: "admin", user, email } : { state: "client", user, email };
  } catch (error) {
    console.error("[auth] getClaims failed:", error instanceof Error ? error.message : error);
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
export async function requireUser(): Promise<SessionUser> {
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

