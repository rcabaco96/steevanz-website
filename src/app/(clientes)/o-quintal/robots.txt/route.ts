import { oQuintalRobotsTxt } from "@/content/o-quintal/routes";

// robots.txt of the client's own domain (served at its root by the proxy, once it has a domain).
export const dynamic = "force-static";

export function GET() {
  return new Response(oQuintalRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
