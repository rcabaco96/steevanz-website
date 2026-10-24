import { seteChavesRobotsTxt } from "@/content/sete-chaves/routes";

// robots.txt of a domain of its own (served at its root by the proxy). Sete Chaves is fictional and has none.
export const dynamic = "force-static";

export function GET() {
  return new Response(seteChavesRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
