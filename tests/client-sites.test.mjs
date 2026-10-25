import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { normalizeHost, routeClientSite } from "../src/lib/client-sites.ts";
import {
  fabiosCanonical,
  fabiosDomainSegment,
  fabiosHref,
  fabiosRobotsTxt,
  fabiosSitemapEntries,
  fabiosStaticParams,
  resolveFabiosPath,
} from "../src/content/fabios-roadstop/routes.ts";
import { fabiosCopy } from "../src/content/fabios-roadstop/copy.ts";
import { domainSegment } from "../src/lib/client-sites.ts";

describe("client sites: host → path (src/lib/client-sites.ts)", () => {
  it("normalises the Host header", () => {
    assert.equal(normalizeHost("WWW.FabiosRoadstop.pt:443"), "www.fabiosroadstop.pt");
    assert.equal(normalizeHost("fabiosroadstop.pt."), "fabiosroadstop.pt");
    assert.equal(normalizeHost(null), "");
  });

  it("serves the client's site at the root of its domain, with and without www", () => {
    for (const host of ["www.fabiosroadstop.pt", "fabiosroadstop.pt", "WWW.FABIOSROADSTOP.PT:443"]) {
      assert.deepEqual(routeClientSite(host, "/"), { kind: "rewrite", site: "fabios-roadstop", path: "/fabios-roadstop/dominio" });
      assert.deepEqual(routeClientSite(host, "/sobre-nos"), {
        kind: "rewrite",
        site: "fabios-roadstop",
        path: "/fabios-roadstop/dominio/sobre-nos",
      });
      assert.deepEqual(routeClientSite(host, "/en/contact"), {
        kind: "rewrite",
        site: "fabios-roadstop",
        path: "/fabios-roadstop/dominio/en/contact",
      });
    }
  });

  it("gives the domain its own robots.txt, sitemap and icons", () => {
    const host = "www.fabiosroadstop.pt";
    assert.equal(routeClientSite(host, "/robots.txt").path, "/fabios-roadstop/robots.txt");
    assert.equal(routeClientSite(host, "/sitemap.xml").path, "/fabios-roadstop/sitemap.xml");
    assert.equal(routeClientSite(host, "/favicon.ico").path, "/media/clients/fabios-roadstop/favicon.ico");
    assert.equal(routeClientSite(host, "/manifest.webmanifest").path, "/fabios-roadstop/manifest.webmanifest");
  });

  it("leaves the client's media and the framework's files alone on its domain", () => {
    const host = "www.fabiosroadstop.pt";
    assert.equal(routeClientSite(host, "/_next/static/chunks/a.js").kind, "pass");
    assert.equal(routeClientSite(host, "/media/clients/fabios-roadstop/hero-loop-hd.mp4").kind, "pass");
  });

  it("never shows Steevanz pages on the client's domain", () => {
    const host = "www.fabiosroadstop.pt";
    for (const path of ["/admin", "/api/painel/x", "/produtos", "/media/clients/dolci-salati/x.jpg", "/menu/fabios-roadstop"]) {
      const decision = routeClientSite(host, path);
      assert.equal(decision.kind, "rewrite", path);
      assert.ok(decision.path.startsWith("/fabios-roadstop/dominio/"), path);
    }
  });

  it("sends old preview links opened on the domain to the clean address", () => {
    const host = "www.fabiosroadstop.pt";
    assert.deepEqual(routeClientSite(host, "/fabios-roadstop"), { kind: "redirect", site: "fabios-roadstop", path: "/" });
    assert.deepEqual(routeClientSite(host, "/fabios-roadstop/sobre-nos").path, "/sobre-nos");
    assert.deepEqual(routeClientSite(host, "/fabios-roadstop/dominio/en").path, "/en");
  });

  it("keeps the preview path on steevanz.com out of search engines", () => {
    for (const host of ["www.steevanz.com", "steevanz.com", "localhost:3010", "steevanz-git-x.vercel.app"]) {
      assert.deepEqual(routeClientSite(host, "/fabios-roadstop"), { kind: "noindex", site: "fabios-roadstop" });
      assert.deepEqual(routeClientSite(host, "/fabios-roadstop/en/about-us"), { kind: "noindex", site: "fabios-roadstop" });
      assert.deepEqual(routeClientSite(host, "/fabios-roadstop/sitemap.xml"), { kind: "noindex", site: "fabios-roadstop" });
    }
  });

  it("gives the domain variant a single public address on steevanz.com (the preview path)", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/fabios-roadstop/dominio/contacto"), {
      kind: "redirect",
      site: "fabios-roadstop",
      path: "/fabios-roadstop/contacto",
    });
    assert.equal(routeClientSite("www.steevanz.com", "/fabios-roadstop/dominio").path, "/fabios-roadstop");
  });

  it("does nothing to steevanz.com pages", () => {
    for (const path of ["/", "/en", "/produtos/menu-digital", "/menu/fabios-roadstop", "/admin", "/fabios-roadstopx", "/sitemap.xml", "/robots.txt"]) {
      assert.equal(routeClientSite("www.steevanz.com", path), null, path);
    }
    assert.equal(routeClientSite("fabiosroadstop.pt.evil.com", "/"), null);
    assert.equal(routeClientSite("notfabiosroadstop.pt", "/"), null);
  });

  it("uses the same domain segment as the route table", () => {
    assert.equal(domainSegment, fabiosDomainSegment);
  });

  it("the proxy matches every path of the client's domain and the preview path", () => {
    const proxy = readFileSync("src/proxy.ts", "utf8");
    assert.match(proxy, /"\/fabios-roadstop",\s*"\/fabios-roadstop\/:path\*"/);
    assert.match(proxy, /has: \[\{ type: "host", value: "fabiosroadstop\.pt" \}\]/);
    assert.match(proxy, /has: \[\{ type: "host", value: "www\.fabiosroadstop\.pt" \}\]/);
  });
});

describe("Fabio's Roadstop: pages, sitemap and robots", () => {
  it("resolves every page in both variants and nothing else", () => {
    assert.deepEqual(resolveFabiosPath(undefined), { mode: "preview", locale: "pt", page: "home" });
    assert.deepEqual(resolveFabiosPath(["sobre-nos"]), { mode: "preview", locale: "pt", page: "about" });
    assert.deepEqual(resolveFabiosPath(["dominio", "en", "contact"]), { mode: "domain", locale: "en", page: "contact" });
    assert.equal(resolveFabiosPath(["contactos"]), null);
    assert.equal(resolveFabiosPath(["en", "sobre-nos"]), null);
    assert.equal(fabiosStaticParams().length, 12);
    for (const { path } of fabiosStaticParams()) assert.notEqual(resolveFabiosPath(path), null, path.join("/"));
  });

  it("keeps the old site's Portuguese addresses", () => {
    assert.equal(fabiosHref("domain", "pt", "about"), "/sobre-nos");
    assert.equal(fabiosHref("domain", "pt", "contact"), "/contacto");
    assert.equal(fabiosHref("preview", "pt", "home"), "/fabios-roadstop");
    assert.equal(fabiosHref("preview", "en", "about"), "/fabios-roadstop/en/about-us");
  });

  it("lists only the client's pages, only on its own domain, with hreflang", () => {
    const entries = fabiosSitemapEntries();
    assert.equal(entries.length, 6);
    for (const entry of entries) {
      assert.ok(entry.url.startsWith("https://www.fabiosroadstop.pt"), entry.url);
      assert.doesNotMatch(entry.url, /steevanz|fabios-roadstop|dominio/);
      assert.deepEqual(Object.keys(entry.alternates.languages).sort(), ["en", "pt-PT", "x-default"]);
    }
    assert.equal(fabiosCanonical("pt", "home"), "https://www.fabiosroadstop.pt");
  });

  it("robots.txt of the domain allows crawling and points at its sitemap", () => {
    const txt = fabiosRobotsTxt();
    assert.match(txt, /^User-agent: \*\nAllow: \//);
    assert.match(txt, /Sitemap: https:\/\/www\.fabiosroadstop\.pt\/sitemap\.xml/);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /fabios/i, file);
    }
  });
});

describe("Fabio's Roadstop: content rules", () => {
  function filesUnder(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) out.push(...filesUnder(path));
      else if (/\.(tsx?|css)$/.test(name)) out.push(path);
    }
    return out;
  }
  const files = [
    ...filesUnder("src/components/clients/fabios-roadstop"),
    ...filesUnder("src/content/fabios-roadstop"),
    ...filesUnder("src/app/(clientes)/fabios-roadstop"),
  ].map((path) => ({ path, text: readFileSync(path, "utf8") }));

  it("never shows ratings, review counts or prices", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|priceRange|€/, path);
    }
  });

  it("never writes «NFC» and never uses Steevanz's stylesheet or shell", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
    }
  });

  it("has every text in both languages", () => {
    const shape = (value) =>
      Array.isArray(value) ? value.map(shape) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;
    assert.deepEqual(shape(fabiosCopy.en), shape(fabiosCopy.pt));
  });

  it("loads GSAP and Lenis only from the client sites' own components", () => {
    const offenders = filesUnder("src")
      .filter((path) => !["fabios-roadstop", "o-ermita", "lobo-do-mar", "o-quintal"].some((site) => path.includes(join("clients", site))))
      .filter((path) => /from "(gsap|lenis|@gsap\/react)|import\("lenis"\)/.test(readFileSync(path, "utf8")));
    assert.deepEqual(offenders, []);
  });
});
