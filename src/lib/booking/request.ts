import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const windowMinutes = 10;
const maxAttemptsPerWindow = 5;

export async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function requestOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${protocol}://${host}` : "";
}

function hashIp(ip: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-24) ?? "steevanz";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function isRateLimited(client: SupabaseClient, kind: "booking" | "lead"): Promise<boolean> {
  const ipHash = hashIp(await clientIp());
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  try {
    const { count, error } = await client
      .from("submission_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (error) throw error;
    if ((count ?? 0) >= maxAttemptsPerWindow) return true;
    const { error: insertError } = await client.from("submission_attempts").insert({ ip_hash: ipHash, kind });
    if (insertError) throw insertError;
    return false;
  } catch (error) {
    console.error("[booking] rate limit check failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
