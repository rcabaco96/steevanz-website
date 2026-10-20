import { after } from "next/server";
import { countTagTap, loadTagDestination } from "@/lib/business-cards/store";

// A keychain or tag (owner, 2026-10-20): the tag stores https://www.steevanz.com/k/<code> and this sends
// the phone on (307) to the destination chosen in /admin/tags, so it can change later without touching
// the tag. The destination comes from a cache refreshed by every save; the tap is counted after the
// answer has gone. Only http(s) destinations (checked on save and again here), never indexed.
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toLowerCase();
  let destination: string | null = null;
  try {
    destination = await loadTagDestination(code);
  } catch (error) {
    console.error("[keychain-tags] destination read failed:", error instanceof Error ? error.message : error);
    return new Response("Temporarily unavailable", { status: 503, headers: { ...privateHeaders, "Retry-After": "5" } });
  }
  if (!destination) return new Response("Not found", { status: 404, headers: privateHeaders });
  after(() => countTagTap(code));
  return new Response(null, { status: 307, headers: { ...privateHeaders, Location: destination } });
}
