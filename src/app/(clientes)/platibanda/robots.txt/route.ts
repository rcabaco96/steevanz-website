import { platibandaRobotsTxt } from "@/content/platibanda/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Platibanda is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(platibandaRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
