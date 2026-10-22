import { loboRobotsTxt } from "@/content/lobo-do-mar/routes";

// robots.txt of the client's own domain (served at its root by the proxy, once it has a domain).
export const dynamic = "force-static";

export function GET() {
  return new Response(loboRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
