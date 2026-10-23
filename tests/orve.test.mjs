import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { orveDomainSegment, orveHref, orveSitemapEntries, orveStaticParams, resolveOrvePath } from "../src/content/orve/routes.ts";
import { orveCopy } from "../src/content/orve/copy.ts";
import { orve, orvePhotos, orvePrice, orveWhatsappHref } from "../src/content/orve/facts.ts";

// Orvé: a FICTIONAL beauty atelier, Steevanz's showcase site for beauty businesses (owner, 2026-10-23).

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Orvé: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "orve");
    assert.ok(site);
    assert.equal(site.base, "/orve");
    assert.deepEqual(site.hosts, []);
    assert.equal(orveDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve"), { kind: "noindex", site: "orve" });
    assert.equal(routeClientSite("www.steevanz.com", "/orvex"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve/dominio"), { kind: "redirect", site: "orve", path: "/orve" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/orve",\s*"\/orve\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveOrvePath(undefined), { mode: "preview" });
    assert.deepEqual(resolveOrvePath(["dominio"]), { mode: "domain" });
    assert.equal(resolveOrvePath(["en"]), null);
    assert.equal(resolveOrvePath(["dominio", "x"]), null);
    assert.equal(orveStaticParams().length, 2);
    assert.equal(orveHref("preview"), "/orve");
    assert.equal(orveSitemapEntries().length, 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /orve/i, file);
    }
  });
});

describe("Orvé: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/orve"), ...filesUnder("src/content/orve"), ...filesUnder("src/app/(clientes)/orve")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never shows ratings, reviews, testimonials or numbers of customers", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit/i, path);
    }
    // No percentages or promised results in the texts (the CSS has percentages of its own).
    const texts = JSON.stringify(orveCopy, (key, value) => (key === "focus" ? undefined : value));
    assert.doesNotMatch(texts, /\d+\s*%|resultados garantidos/i);
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(orveCopy.rituals.plusVat, "+ IVA");
    assert.match(orveCopy.rituals.vatNote, /sem IVA/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%/i, path);
    }
    for (const ritual of orveCopy.rituals.list) {
      for (const t of ritual.treatments) {
        assert.ok(Number.isInteger(t.price) && t.price > 0, t.name);
        assert.ok(t.minutes > 0, t.name);
      }
    }
    assert.equal(orvePrice(48), "48 €");
  });

  it("never writes «NFC», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green/i, path);
    }
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, and its contacts reach no one", () => {
    assert.match(orveCopy.demo, /fictício/);
    assert.match(orveCopy.footer.fictional, /fictício/);
    assert.match(orveCopy.team.note, /fictícia/);
    assert.equal(orve.whatsappNumber, "351900000000");
    assert.match(orveWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(orve.media), ...Object.values(orvePhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/orve/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/orve/LICENCAS.txt", "utf8");
    for (const src of paths) {
      const file = src.split("/").pop();
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
  });
});
