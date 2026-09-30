import type { NextRequest } from "next/server";
import { refreshAdminSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await refreshAdminSession(request);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
