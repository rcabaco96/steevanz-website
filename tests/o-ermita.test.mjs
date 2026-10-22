import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import {
  ermitaDomainSegment,
  ermitaHref,
  ermitaSitemapEntries,
  ermitaStaticParams,
  resolveErmitaPath,
} from "../src/content/o-ermita/routes.ts";
import { ermitaCopy } from "../src/content/o-ermita/copy.ts";
import { ermita } from "../src/content/o-ermita/facts.ts";

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("O Ermita: preview path and future domain (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain yet", () => {
    const site = clientSites.find((entry) => entry.id === "o-ermita");
    assert.ok(site);
    assert.equal(site.base, "/o-ermita");
    assert.deepEqual(site.hosts, []);
  });

  it("keeps the preview path out of search engines and leaves steevanz.com alone", () => {
    for (const host of ["www.steevanz.com", "localhost:3010"]) {
      assert.deepEqual(routeClientSite(host, "/o-ermita"), { kind: "noindex", site: "o-ermita" });
      assert.deepEqual(routeClientSite(host, "/o-ermita/en"), { kind: "noindex", site: "o-ermita" });
    }
    assert.equal(routeClientSite("www.steevanz.com", "/o-ermitax"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/o-ermita/dominio/en"), { kind: "redirect", site: "o-ermita", path: "/o-ermita/en" });
  });

  it("the proxy matches the preview path", () => {
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/o-ermita",\s*"\/o-ermita\/:path\*"/);
  });

  it("uses the same domain segment as the route table", () => {
    assert.equal(domainSegment, ermitaDomainSegment);
  });
});

describe("O Ermita: pages", () => {
  it("resolves both languages in both variants and nothing else", () => {
    assert.deepEqual(resolveErmitaPath(undefined), { mode: "preview", locale: "pt" });
    assert.deepEqual(resolveErmitaPath(["en"]), { mode: "preview", locale: "en" });
    assert.deepEqual(resolveErmitaPath(["dominio", "en"]), { mode: "domain", locale: "en" });
    assert.equal(resolveErmitaPath(["pt"]), null);
    assert.equal(resolveErmitaPath(["en", "menu"]), null);
    assert.equal(ermitaStaticParams().length, 4);
    assert.equal(ermitaHref("preview", "pt"), "/o-ermita");
    assert.equal(ermitaHref("preview", "en"), "/o-ermita/en");
    assert.equal(ermitaHref("domain", "en"), "/en");
    assert.equal(ermitaSitemapEntries().length, 2);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /ermita/i, file);
    }
  });
});

describe("O Ermita: content rules", () => {
  const files = [
    ...filesUnder("src/components/clients/o-ermita"),
    ...filesUnder("src/content/o-ermita"),
    ...filesUnder("src/app/(clientes)/o-ermita"),
  ].map((path) => ({ path, text: readFileSync(path, "utf8") }));

  it("never shows ratings, reviews or prices", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|priceRange|€|\bIVA\b/, path);
    }
  });

  it("never writes «NFC», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54/i, path);
    }
  });

  it("has every text in both languages", () => {
    const shape = (value) =>
      Array.isArray(value) ? value.map(shape) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;
    assert.deepEqual(shape(ermitaCopy.en), shape(ermitaCopy.pt));
  });

  it("uses the name the restaurant uses and only its own media files", () => {
    assert.equal(ermita.name, "O Ermita");
    for (const src of Object.values(ermita.media)) {
      assert.ok(src.startsWith("/media/clients/o-ermita/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    assert.ok(existsSync("public/media/clients/o-ermita/LICENCAS.txt"));
  });
});
