import { meadaRobotsTxt } from "@/content/meada/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Meada is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(meadaRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
