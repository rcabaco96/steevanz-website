import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import {
  loboDomainSegment,
  loboHref,
  loboSitemapEntries,
  loboStaticParams,
  resolveLoboPath,
} from "../src/content/lobo-do-mar/routes.ts";
import { loboCopy } from "../src/content/lobo-do-mar/copy.ts";
import { lobo } from "../src/content/lobo-do-mar/facts.ts";

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Lobo do Mar: preview path and future domain (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain yet", () => {
    const site = clientSites.find((entry) => entry.id === "lobo-do-mar");
    assert.ok(site);
    assert.equal(site.base, "/lobo-do-mar");
    assert.deepEqual(site.hosts, []);
  });

  it("keeps the preview path out of search engines and leaves steevanz.com alone", () => {
    for (const host of ["www.steevanz.com", "localhost:3010"]) {
      assert.deepEqual(routeClientSite(host, "/lobo-do-mar"), { kind: "noindex", site: "lobo-do-mar" });
      assert.deepEqual(routeClientSite(host, "/lobo-do-mar/en"), { kind: "noindex", site: "lobo-do-mar" });
    }
    assert.equal(routeClientSite("www.steevanz.com", "/lobo-do-marx"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/lobo-do-mar/dominio/en"), { kind: "redirect", site: "lobo-do-mar", path: "/lobo-do-mar/en" });
  });

  it("the proxy matches the preview path", () => {
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/lobo-do-mar",\s*"\/lobo-do-mar\/:path\*"/);
  });

  it("uses the same domain segment as the route table", () => {
    assert.equal(domainSegment, loboDomainSegment);
  });
});

describe("Lobo do Mar: pages", () => {
  it("resolves both languages in both variants and nothing else", () => {
    assert.deepEqual(resolveLoboPath(undefined), { mode: "preview", locale: "pt" });
    assert.deepEqual(resolveLoboPath(["en"]), { mode: "preview", locale: "en" });
    assert.deepEqual(resolveLoboPath(["dominio", "en"]), { mode: "domain", locale: "en" });
    assert.equal(resolveLoboPath(["pt"]), null);
    assert.equal(resolveLoboPath(["en", "menu"]), null);
    assert.equal(loboStaticParams().length, 4);
    assert.equal(loboHref("preview", "pt"), "/lobo-do-mar");
    assert.equal(loboHref("preview", "en"), "/lobo-do-mar/en");
    assert.equal(loboHref("domain", "en"), "/en");
    assert.equal(loboSitemapEntries().length, 2);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /lobo/i, file);
    }
  });
});

describe("Lobo do Mar: content rules", () => {
  const files = [
    ...filesUnder("src/components/clients/lobo-do-mar"),
    ...filesUnder("src/content/lobo-do-mar"),
    ...filesUnder("src/app/(clientes)/lobo-do-mar"),
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
    assert.deepEqual(shape(loboCopy.en), shape(loboCopy.pt));
  });

  it("uses the name the restaurant uses and only its own media files", () => {
    assert.equal(lobo.name, "Lobo do Mar");
    for (const src of Object.values(lobo.media)) {
      assert.ok(src.startsWith("/media/clients/lobo-do-mar/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    assert.ok(existsSync("public/media/clients/lobo-do-mar/LICENCAS.txt"));
  });
});
