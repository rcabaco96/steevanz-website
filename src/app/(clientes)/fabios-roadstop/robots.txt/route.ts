import { fabiosRobotsTxt } from "@/content/fabios-roadstop/routes";

// robots.txt of the client's own domain (www.fabiosroadstop.pt/robots.txt, through the proxy).
export const dynamic = "force-static";

export function GET() {
  return new Response(fabiosRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
