import { grobRobotsTxt } from "@/content/grob/routes";

// robots.txt do domínio do clube (servido na raiz pelo proxy, quando tiver domínio).
export const dynamic = "force-static";

export function GET() {
  return new Response(grobRobotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
