import { NextResponse, type NextRequest } from "next/server";
import { routeClientSite } from "@/lib/client-sites";
import { refreshSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // Client websites (src/lib/client-sites.ts): their own domain, or their preview path out of search engines.
  const client = routeClientSite(request.headers.get("host"), request.nextUrl.pathname);
  if (client) {
    if (client.kind === "pass") return NextResponse.next();
    if (client.kind === "noindex") {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = client.path;
    return client.kind === "rewrite" ? NextResponse.rewrite(url) : NextResponse.redirect(url, 308);
  }

  const response = await refreshSession(request);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/conta",
    "/conta/:path*",
    "/painel",
    "/painel/:path*",
    "/api/painel/:path*",
    // Client websites: the preview path on any host, and every request on the client's own domain.
    "/fabios-roadstop",
    "/fabios-roadstop/:path*",
    { source: "/((?!_next/).*)", has: [{ type: "host", value: "fabiosroadstop.pt" }] },
    { source: "/((?!_next/).*)", has: [{ type: "host", value: "www.fabiosroadstop.pt" }] },
    "/o-ermita",
    "/o-ermita/:path*",
    "/lobo-do-mar",
    "/lobo-do-mar/:path*",
    "/orve",
    "/orve/:path*",
    "/ponteiro",
    "/ponteiro/:path*",
    "/meada",
    "/meada/:path*",
    "/risca",
    "/risca/:path*",
    "/platibanda",
    "/platibanda/:path*",
    "/prumo",
    "/prumo/:path*",
  ],
};
