import { normalizePhone, phoneError } from "@/lib/phone";
import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { clientIp, hashIp } from "@/lib/booking/request";
import { zonedDateString, zonedDateTimeToUtc } from "@/lib/booking/slots";

/** Unguessable token for public links (waitlist entry, card, booking): 32 url-safe characters. */
export function publicToken(): string {
  return randomBytes(24).toString("base64url");
}

export const tokenPattern = /^[A-Za-z0-9_-]{20,64}$/;

// Public forms (join the queue, get a card, book) are limited per visitor. Shops often share one
// Wi-Fi address between many customers, so the limits are per kind and generous.
const limits = {
  waitlist: { perWindow: 20, windowMinutes: 10 },
  loyalty: { perWindow: 20, windowMinutes: 10 },
  loyalty_stamp: { perWindow: 30, windowMinutes: 10 },
  loyalty_recover: { perWindow: 5, windowMinutes: 30 },
  booking_module: { perWindow: 10, windowMinutes: 10 },
} as const;

export type LimitKind = keyof typeof limits;

export async function isModuleRateLimited(client: SupabaseClient, kind: LimitKind): Promise<boolean> {
  const { perWindow, windowMinutes } = limits[kind];
  const ipHash = hashIp(await clientIp());
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  try {
    const { count, error } = await client
      .from("submission_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("kind", kind)
      .gte("created_at", since);
    if (error) throw error;
    if ((count ?? 0) >= perWindow) return true;
    const { error: insertError } = await client.from("submission_attempts").insert({ ip_hash: ipHash, kind });
    if (insertError) throw insertError;
    return false;
  } catch (error) {
    console.error("[modules] rate limit check failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export function formText(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

/** Bots fill every field; people never see this one. */
export const honeypot = "website_url";

export function isBot(formData: FormData): boolean {
  return formText(formData, honeypot) !== "";
}

/** Start of today in the establishment's time zone, as an instant. */
export function startOfLocalDay(timeZone: string, now = new Date()): Date {
  return zonedDateTimeToUtc(zonedDateString(now, timeZone), 0, timeZone);
}

/**
 * The phone typed in a form with its country ("phone" and "phone_country"): "+351 912 345 678",
 * null when left empty, or the message to show when it is not a valid number.
 */
export function phoneFrom(formData: FormData): { phone: string | null } | { error: string } {
  const typed = formText(formData, "phone");
  if (!typed) return { phone: null };
  const dial = formData.has("phone_country") ? formText(formData, "phone_country") : "351";
  const phone = normalizePhone(typed, dial);
  return phone ? { phone } : { error: phoneError(dial) };
}
