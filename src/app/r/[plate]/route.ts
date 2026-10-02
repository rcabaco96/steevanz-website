import { after, type NextRequest } from "next/server";
import { hashIp } from "@/lib/booking/request";
import type { TapDevice } from "@/lib/reviews/types";
import { tryCreateServiceClient } from "@/lib/supabase/service";

const platePattern = /^[a-z0-9]{4,16}$/;
const previewBots =
  /bot\b|crawler|spider|preview|facebookexternalhit|^WhatsApp\/|TelegramBot|Slackbot|Discordbot|Twitterbot|LinkedInBot|Embedly|SkypeUriPreview|Google-InspectionTool|HeadlessChrome/i;

function deviceFrom(userAgent: string): TapDevice {
  if (/iPhone|iPad|iPod|iOS/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "other";
}

function redirectTo(url: string | URL) {
  return new Response(null, {
    status: 302,
    headers: { Location: String(url), "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" },
  });
}

export async function GET(request: NextRequest, ctx: RouteContext<"/r/[plate]">) {
  const { plate } = await ctx.params;
  const code = plate.toLowerCase();
  const fallback = new URL("/", request.url);
  if (!platePattern.test(code)) return redirectTo(fallback);

  const client = tryCreateServiceClient();
  if (!client) return redirectTo(fallback);

  const { data, error } = await client
    .from("nfc_plates")
    .select("code, active, business_id, business:review_businesses(review_url)")
    .eq("code", code)
    .maybeSingle<{ code: string; active: boolean; business_id: string; business: { review_url: string } | null }>();
  if (error) console.error("[nfc] plate lookup failed:", error.message);
  const target = data?.business?.review_url;
  if (!data || !target) return redirectTo(fallback);

  const userAgent = request.headers.get("user-agent") ?? "";
  if (data.active && !previewBots.test(userAgent) && request.method === "GET") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
    const tap = {
      plate_code: data.code,
      business_id: data.business_id,
      source: request.nextUrl.searchParams.get("s") === "qr" ? "qr" : "nfc",
      device: deviceFrom(userAgent),
      visitor_hash: hashIp(`${ip}|${userAgent}`).slice(0, 32),
    };
    after(async () => {
      const { error: insertError } = await client.from("nfc_taps").insert(tap);
      if (insertError) console.error("[nfc] tap insert failed:", insertError.message);
    });
  }

  return redirectTo(target);
}
