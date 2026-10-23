import { orveRobotsTxt } from "@/content/orve/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Orvé is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(orveRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
