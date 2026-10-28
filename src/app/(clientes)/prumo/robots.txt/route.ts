import { prumoRobotsTxt } from "@/content/prumo/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Prumo is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(prumoRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
