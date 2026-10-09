import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase Auth «Send Email Hook». Once the hook points here, Supabase hands every email it would
 * send to this route instead of its mailer, and this route sends nothing: the site's own flows never
 * ask Supabase to send (see src/lib/auth/email-links.ts), so anything that arrives here came from a
 * direct call to the public Auth API or from the Supabase dashboard. Setup: docs/auth-email-config.md.
 */

const toleranceSeconds = 5 * 60;

/** Standard Webhooks signature, as Supabase signs its auth hooks (secret «v1,whsec_<base64>»). */
function validSignature(secret: string, id: string, timestamp: string, body: string, header: string): boolean {
  const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return header.split(" ").some((entry) => {
    const [version, signature] = entry.split(",");
    if (version !== "v1" || !signature) return false;
    const given = Buffer.from(signature, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET?.trim();
  const body = await request.text();
  if (secret) {
    const id = request.headers.get("webhook-id") ?? "";
    const timestamp = request.headers.get("webhook-timestamp") ?? "";
    const signature = request.headers.get("webhook-signature") ?? "";
    const age = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (!id || !Number.isFinite(age) || age > toleranceSeconds || !validSignature(secret, id, timestamp, body, signature)) {
      return NextResponse.json({ error: { http_code: 401, message: "Invalid signature" } }, { status: 401 });
    }
  }
  let action = "unknown";
  try {
    const payload = JSON.parse(body) as { email_data?: { email_action_type?: string } };
    action = payload.email_data?.email_action_type ?? action;
  } catch {}
  console.warn("[auth] Supabase tried to send an auth email; not sent (the site sends its own):", action);
  return NextResponse.json({});
}
