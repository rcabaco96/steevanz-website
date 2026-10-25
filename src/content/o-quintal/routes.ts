// Pages of O Quintal's shop (src/app/(clientes)/o-quintal) and their addresses. Portuguese only (the business's
// site is only in Portuguese). Kept free of imports so the unit tests can load it directly.

export type OQuintalMode = "preview" | "domain";

/**
 * The address search engines should keep. No domain of its own yet (2026-10-25): for now the preview on
 * steevanz.com, which stays out of search engines anyway. When a domain is chosen: put it here and in `hosts` in
 * src/lib/client-sites.ts, and add it to the proxy matcher (src/proxy.ts).
 */
export const oQuintalOrigin = "https://www.steevanz.com/o-quintal";
export const oQuintalPreviewBase = "/o-quintal";
/** Same value as `domainSegment` in src/lib/client-sites.ts. */
export const oQuintalDomainSegment = "dominio";

export const oQuintalCategoryIds = ["cabazes", "fruta", "legumes", "regionais", "mercearia"] as const;

export type OQuintalPage =
  | { kind: "home" }
  | { kind: "shop"; category: string | null }
  | { kind: "product"; id: string }
  | { kind: "cart" }
  | { kind: "success" }
  | { kind: "cancel" };

export interface OQuintalRoute {
  mode: OQuintalMode;
  page: OQuintalPage;
}

/** The path of a page on the client's domain («/», «/loja/fruta», «/produto/banana»…). */
export function oQuintalPath(page: OQuintalPage): string {
  switch (page.kind) {
    case "home":
      return "/";
    case "shop":
      return page.category ? `/loja/${page.category}` : "/loja";
    case "product":
      return `/produto/${page.id}`;
    case "cart":
      return "/carrinho";
    case "success":
      return "/encomenda/sucesso";
    case "cancel":
      return "/encomenda/cancelada";
  }
}

/** The link to a page from inside the site, in the given mode. */
export function oQuintalHref(mode: OQuintalMode, page: OQuintalPage): string {
  const path = oQuintalPath(page);
  if (mode === "domain") return path;
  return path === "/" ? oQuintalPreviewBase : `${oQuintalPreviewBase}${path}`;
}

export function oQuintalCanonical(page: OQuintalPage): string {
  const path = oQuintalPath(page);
  return path === "/" ? oQuintalOrigin : `${oQuintalOrigin}${path}`;
}

/**
 * The catch-all segments of /o-quintal/[[...path]] → the page, or null (404). Product ids are checked against
 * the catalogue by the caller (`productExists`), so this file stays free of imports.
 */
export function resolveOQuintalPath(segments: readonly string[] | undefined, productExists: (id: string) => boolean): OQuintalRoute | null {
  let parts: string[];
  try {
    parts = (segments ?? []).map((part) => decodeURIComponent(part));
  } catch {
    return null;
  }
  let mode: OQuintalMode = "preview";
  if (parts[0] === oQuintalDomainSegment) {
    mode = "domain";
    parts = parts.slice(1);
  }
  const [first, second, ...rest] = parts;
  if (rest.length) return null;
  if (first === undefined) return { mode, page: { kind: "home" } };
  if (first === "loja") {
    if (second === undefined) return { mode, page: { kind: "shop", category: null } };
    return (oQuintalCategoryIds as readonly string[]).includes(second) ? { mode, page: { kind: "shop", category: second } } : null;
  }
  if (first === "produto" && second !== undefined) return productExists(second) ? { mode, page: { kind: "product", id: second } } : null;
  if (second !== undefined && first !== "encomenda") return null;
  if (first === "carrinho") return { mode, page: { kind: "cart" } };
  if (first === "encomenda" && second === "sucesso") return { mode, page: { kind: "success" } };
  if (first === "encomenda" && second === "cancelada") return { mode, page: { kind: "cancel" } };
  return null;
}

/** Every page, for the sitemap and generateStaticParams. */
export function oQuintalPages(productIds: readonly string[]): OQuintalPage[] {
  return [
    { kind: "home" },
    { kind: "shop", category: null },
    ...oQuintalCategoryIds.map((category) => ({ kind: "shop" as const, category })),
    ...productIds.map((id) => ({ kind: "product" as const, id })),
    { kind: "cart" },
    { kind: "success" },
    { kind: "cancel" },
  ];
}

export function oQuintalStaticParams(productIds: readonly string[]): { path: string[] }[] {
  const pages = oQuintalPages(productIds);
  return (["preview", "domain"] as const).flatMap((mode) =>
    pages.map((page) => {
      const parts = oQuintalPath(page).split("/").filter(Boolean);
      return { path: mode === "domain" ? [oQuintalDomainSegment, ...parts] : parts };
    }),
  );
}

/** Pages worth indexing (not the cart nor the order result pages). */
export function oQuintalSitemapEntries(productIds: readonly string[]): { url: string; priority: number }[] {
  return oQuintalPages(productIds)
    .filter((page) => page.kind === "home" || page.kind === "shop" || page.kind === "product")
    .map((page) => ({ url: oQuintalCanonical(page), priority: page.kind === "home" ? 1 : page.kind === "shop" ? 0.8 : 0.6 }));
}

export function oQuintalRobotsTxt(): string {
  return ["User-agent: *", "Allow: /", "Disallow: /carrinho", "Disallow: /encomenda/", "", `Sitemap: ${oQuintalOrigin}/sitemap.xml`, ""].join("\n");
}
