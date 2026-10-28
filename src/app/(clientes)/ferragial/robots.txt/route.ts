import { ferragialRobotsTxt } from "@/content/ferragial/routes";

// robots.txt of a domain of its own (served at its root by the proxy). The Adega Ferragial is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(ferragialRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
