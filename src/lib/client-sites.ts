// Client websites served from this app on the client's own domain (owner, 2026-10-21).
//
// A client site lives at a preview path of the Steevanz site (e.g. /fabios-roadstop), kept out of search
// engines. Its pages also exist under «<base>/dominio/…», the variant whose links point at the client's own
// domain. When the client's domain points at this app, the proxy rewrites every request on that host to
// that variant, so www.fabiosroadstop.pt/sobre-nos shows /fabios-roadstop/dominio/sobre-nos.
//
// Kept free of imports so the unit tests can load it directly.

export interface ClientSite {
  id: string;
  /** Hostnames (lowercase, no port) that serve the site at their root. */
  hosts: readonly string[];
  /** Preview path on the Steevanz site. */
  base: string;
  /** Files served from the domain root, each mapped to a path of this app. */
  rootFiles: Readonly<Record<string, string>>;
  /** Path prefixes passed through untouched on the client's domain (static media, framework files). */
  passThrough: readonly string[];
}

/** The path segment of the variant whose links point at the client's own domain. */
export const domainSegment = "dominio";

export const clientSites: readonly ClientSite[] = [
  {
    id: "fabios-roadstop",
    hosts: ["fabiosroadstop.pt", "www.fabiosroadstop.pt"],
    base: "/fabios-roadstop",
    rootFiles: {
      "/robots.txt": "/fabios-roadstop/robots.txt",
      "/sitemap.xml": "/fabios-roadstop/sitemap.xml",
      "/manifest.webmanifest": "/fabios-roadstop/manifest.webmanifest",
      "/favicon.ico": "/media/clients/fabios-roadstop/favicon.ico",
      "/apple-touch-icon.png": "/media/clients/fabios-roadstop/apple-icon.png",
    },
    passThrough: ["/_next/", "/_vercel/", "/media/clients/fabios-roadstop/"],
  },
  {
    // O Ermita (owner, 2026-10-22): no domain yet, only the preview path. When one is chosen, list it here, set
    // `ermitaOrigin` in src/content/o-ermita/routes.ts and add its host to the proxy matcher (src/proxy.ts).
    id: "o-ermita",
    hosts: [],
    base: "/o-ermita",
    rootFiles: {
      "/robots.txt": "/o-ermita/robots.txt",
      "/sitemap.xml": "/o-ermita/sitemap.xml",
      "/manifest.webmanifest": "/o-ermita/manifest.webmanifest",
      "/favicon.ico": "/media/clients/o-ermita/icone-logo.ico",
      "/apple-touch-icon.png": "/media/clients/o-ermita/icone-logo-apple.png",
    },
    passThrough: ["/_next/", "/_vercel/", "/media/clients/o-ermita/"],
  },
  {
    // Lobo do Mar (owner, 2026-10-22): no domain yet, only the preview path. When one is chosen, list it here, set
    // `loboOrigin` in src/content/lobo-do-mar/routes.ts and add its host to the proxy matcher (src/proxy.ts).
    id: "lobo-do-mar",
    hosts: [],
    base: "/lobo-do-mar",
    rootFiles: {
      "/robots.txt": "/lobo-do-mar/robots.txt",
      "/sitemap.xml": "/lobo-do-mar/sitemap.xml",
      "/manifest.webmanifest": "/lobo-do-mar/manifest.webmanifest",
      "/favicon.ico": "/media/clients/lobo-do-mar/icone.ico",
      "/apple-touch-icon.png": "/media/clients/lobo-do-mar/icone-apple.png",
    },
    passThrough: ["/_next/", "/_vercel/", "/media/clients/lobo-do-mar/"],
  },
  {
    // Ponteiro (owner, 2026-10-24): a FICTIONAL café, kitchen and bar in Porto, Steevanz's showcase site for
    // restaurants, cafés, pastelarias and bars. Only the preview path; it will never have a domain of its own.
    id: "ponteiro",
    hosts: [],
    base: "/ponteiro",
    rootFiles: {
      "/robots.txt": "/ponteiro/robots.txt",
      "/sitemap.xml": "/ponteiro/sitemap.xml",
      "/manifest.webmanifest": "/ponteiro/manifest.webmanifest",
      "/favicon.ico": "/media/clients/ponteiro/favicon.ico",
      "/apple-touch-icon.png": "/media/clients/ponteiro/apple-icon.png",
    },
    passThrough: ["/_next/", "/_vercel/", "/media/clients/ponteiro/"],
  },
];

export type ClientSiteDecision =
  /** Serve another path of this app (the address bar keeps the original one). */
  | { kind: "rewrite"; site: string; path: string }
  /** Send the browser to another path (permanent). */
  | { kind: "redirect"; site: string; path: string }
  /** Serve the path as it is, out of search engines. */
  | { kind: "noindex"; site: string }
  /** A static file on the client's domain: serve it as it is, nothing else to do. */
  | { kind: "pass"; site: string };

/** «WWW.Example.pt:443.» → «www.example.pt». */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

function underBase(pathname: string, base: string): string | null {
  if (pathname === base) return "";
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length);
  return null;
}

/**
 * What the proxy does with a request, or null to leave it alone (every Steevanz page, on any other host).
 * `pathname` is the request's path, without the query string.
 */
export function routeClientSite(host: string | null | undefined, pathname: string): ClientSiteDecision | null {
  const hostname = normalizeHost(host);
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  const onDomain = clientSites.find((site) => site.hosts.includes(hostname));
  if (onDomain) {
    if (onDomain.passThrough.some((prefix) => path.startsWith(prefix))) return { kind: "pass", site: onDomain.id };
    const file = onDomain.rootFiles[path];
    if (file) return { kind: "rewrite", site: onDomain.id, path: file };
    // Old preview links opened on the domain: drop the preview prefix (and the variant's segment).
    const rest = underBase(path, onDomain.base);
    if (rest !== null) {
      const variantRest = underBase(rest, `/${domainSegment}`);
      return { kind: "redirect", site: onDomain.id, path: (variantRest ?? rest) || "/" };
    }
    return { kind: "rewrite", site: onDomain.id, path: `${onDomain.base}/${domainSegment}${path === "/" ? "" : path}` };
  }

  for (const site of clientSites) {
    const rest = underBase(path, site.base);
    if (rest === null) continue;
    // The domain variant has a single public address: the preview path.
    const variantRest = underBase(rest, `/${domainSegment}`);
    if (variantRest !== null) return { kind: "redirect", site: site.id, path: `${site.base}${variantRest}` };
    return { kind: "noindex", site: site.id };
  }
  return null;
}
