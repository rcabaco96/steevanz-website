import { ponteiroRobotsTxt } from "@/content/ponteiro/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Ponteiro is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(ponteiroRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
