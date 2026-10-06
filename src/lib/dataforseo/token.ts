/**
 * Postback authentication: DataForSEO POSTs results to /api/dataforseo/postback?job=<id>&token=<t>
 * (or ?zone=<businessId>&token=<t>). The token is an HMAC of the reference with a key derived from
 * CRON_SECRET, so a postback URL only works for its own job. Pure (node:crypto only).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type PostbackRef = { job: string } | { zone: string };

/** Text signed for a reference; also the task `tag` (job id, or "zone:<businessId>"). */
export function postbackRefTag(ref: PostbackRef): string {
  return "job" in ref ? ref.job : `zone:${ref.zone}`;
}

export function postbackToken(ref: PostbackRef, secret: string): string {
  return createHmac("sha256", secret).update(`dataforseo-postback:${postbackRefTag(ref)}`).digest("hex");
}

export function verifyPostbackToken(ref: PostbackRef, token: string | null | undefined, secret: string): boolean {
  if (!token || !secret) return false;
  const expected = Buffer.from(postbackToken(ref, secret));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** What a task must still read, carried in its postback URL (DataForSEO echoes it back in task.data). */
export interface PostbackExtras {
  /** Oldest publication time (epoch ms) the newest-first read must reach (no gaps; reply re-check). */
  reach?: number | null;
  /** Reply re-check window of this read: 7 days, or 30 on the monthly deep check. */
  check?: number | null;
}

export function postbackUrl(base: string, ref: PostbackRef, secret: string, extras: PostbackExtras = {}): string {
  const params = new URLSearchParams();
  if ("job" in ref) params.set("job", ref.job);
  else params.set("zone", ref.zone);
  params.set("token", postbackToken(ref, secret));
  if (extras.reach !== null && extras.reach !== undefined && Number.isFinite(extras.reach)) params.set("reach", String(Math.round(extras.reach)));
  if (extras.check) params.set("check", String(extras.check));
  return `${base.replace(/\/+$/, "")}/api/dataforseo/postback?${params.toString()}`;
}

/** Reference and extras of a postback URL (from the request, or from task.data.postback_url). */
export function parsePostbackUrl(url: string | null | undefined): { ref: PostbackRef | null; token: string | null; extras: PostbackExtras } {
  let params: URLSearchParams;
  try {
    params = new URL(url ?? "", "https://placeholder.invalid").searchParams;
  } catch {
    return { ref: null, token: null, extras: {} };
  }
  const job = params.get("job");
  const zone = params.get("zone");
  const number = (key: string) => {
    const value = params.get(key);
    const parsed = value === null ? NaN : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  return {
    ref: job ? { job } : zone ? { zone } : null,
    token: params.get("token"),
    extras: { reach: number("reach"), check: number("check") },
  };
}
