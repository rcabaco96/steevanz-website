import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serviceSupabaseConfig } from "./env";
import { retryingFetch } from "./retry-fetch";

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Supabase service role is not configured");
    this.name = "SupabaseNotConfiguredError";
  }
}

export function createServiceClient(): SupabaseClient {
  const config = serviceSupabaseConfig();
  if (!config) throw new SupabaseNotConfiguredError();
  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: retryingFetch((input, init) => fetch(input, { ...init, cache: "no-store" })) },
  });
}

export function tryCreateServiceClient(): SupabaseClient | null {
  try {
    return createServiceClient();
  } catch (error) {
    console.error("[supabase] service client unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}
