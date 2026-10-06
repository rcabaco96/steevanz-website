import { gunzipSync } from "node:zlib";
import type { NextRequest } from "next/server";
import type { DfsResponse, DfsTask } from "@/lib/dataforseo/client";
import { processJobTask, processZoneTask } from "@/lib/dataforseo/process";
import type { DfsMapsResult, DfsReviewsResult } from "@/lib/dataforseo/rules";
import { parsePostbackUrl, postbackRefTag, verifyPostbackToken } from "@/lib/dataforseo/token";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const maxDuration = 300;

/** DataForSEO may send the results gzip-compressed (with or without a Content-Encoding header). */
function bodyText(bytes: Buffer): string {
  return bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes).toString("utf8") : bytes.toString("utf8");
}

/**
 * DataForSEO posts each finished task here (postback_url set by src/lib/dataforseo/dispatch.ts):
 * ?job=<id>&token=<HMAC of the job id with CRON_SECRET> for review reads, ?zone=<businessId>&token=…
 * for zone searches. Results are written by src/lib/dataforseo/process.ts (idempotent: a repeated
 * postback is ignored). Errors answer 500 so DataForSEO may retry; GET /api/dataforseo/collect
 * picks up anything lost.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const { ref, token, extras } = parsePostbackUrl(request.url);
  if (!secret || !ref || !verifyPostbackToken(ref, token, secret)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const client = tryCreateServiceClient();
  if (!client) return Response.json({ error: "Supabase is not configured" }, { status: 500 });

  let body: DfsResponse<unknown>;
  try {
    body = JSON.parse(bodyText(Buffer.from(await request.arrayBuffer()))) as DfsResponse<unknown>;
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }
  const tag = postbackRefTag(ref);
  // Only tasks of this job / zone: the token signs the reference, the tag (when echoed) must match it.
  // A job also only accepts the task id it waits for (process.ts).
  const tasks = (body.tasks ?? []).filter((task) => task && (task.data?.tag === undefined || task.data?.tag === tag));
  if (!tasks.length) return Response.json({ ok: true, processed: 0 });

  try {
    const outcomes: unknown[] = [];
    for (const task of tasks) {
      if ("job" in ref) outcomes.push(await processJobTask(client, task as DfsTask<DfsReviewsResult>, ref.job, { extras }));
      else outcomes.push(await processZoneTask(client, task as DfsTask<DfsMapsResult>));
    }
    return Response.json({ ok: true, outcomes });
  } catch (error) {
    console.error("[dataforseo] postback failed:", error instanceof Error ? error.message : error);
    return Response.json({ error: "processing failed" }, { status: 500 });
  }
}
