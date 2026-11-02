// Páginas do site do GROB — Grupo Recreativo Olival Basto (src/app/(clientes)/grob) e os seus endereços.
// Uma só página, em português. Sem imports, para os testes unitários a poderem carregar diretamente.

/** «preview»: o caminho de pré-visualização na Steevanz (/grob); «domain»: o domínio do próprio clube (ainda nenhum). */
export type GrobMode = "preview" | "domain";

/**
 * O endereço que os motores de busca devem guardar. É um site-demo para apresentar ao clube: ainda sem domínio
 * próprio, por isso é a pré-visualização em steevanz.com, que fica fora dos motores de busca. Quando houver domínio:
 * pô-lo aqui e em `hosts` em src/lib/client-sites.ts, e acrescentá-lo ao matcher do proxy (src/proxy.ts).
 */
export const grobOrigin = "https://www.steevanz.com/grob";
export const grobPreviewBase = "/grob";
/** O mesmo valor que `domainSegment` em src/lib/client-sites.ts. */
export const grobDomainSegment = "dominio";

export interface GrobRoute {
  mode: GrobMode;
}

/** A ligação para o início do site, no modo dado. */
export function grobHref(mode: GrobMode): string {
  return mode === "domain" ? "/" : grobPreviewBase;
}

export function grobCanonical(): string {
  return grobOrigin;
}

/** Os segmentos do catch-all /grob/[[...path]] → a página, ou null (404). */
export function resolveGrobPath(segments: readonly string[] | undefined): GrobRoute | null {
  const parts = (segments ?? []).map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { mode: "preview" };
  if (parts.length === 1 && parts[0] === grobDomainSegment) return { mode: "domain" };
  return null;
}

/** A página nos dois modos, para o generateStaticParams. */
export function grobStaticParams(): { path: string[] }[] {
  return [{ path: [] }, { path: [grobDomainSegment] }];
}

export interface GrobSitemapEntry {
  url: string;
  priority: number;
}

/** O sitemap do clube (para o domínio próprio, quando o tiver). */
export function grobSitemapEntries(): GrobSitemapEntry[] {
  return [{ url: grobCanonical(), priority: 1 }];
}

/** robots.txt no domínio do clube. */
export function grobRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${grobOrigin}/sitemap.xml`, ""].join("\n");
}
