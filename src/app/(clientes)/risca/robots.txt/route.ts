import { riscaRobotsTxt } from "@/content/risca/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Risca is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(riscaRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
