import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { meadaDomainSegment, meadaHref, meadaSitemapEntries, meadaStaticParams, resolveMeadaPath } from "../src/content/meada/routes.ts";
import { meadaCopy } from "../src/content/meada/copy.ts";
import { meada, meadaPhotos, meadaPrice, meadaWhatsappHref } from "../src/content/meada/facts.ts";

// Meada: a FICTIONAL shop of home and Portuguese crafts, Steevanz's showcase site for shops (owner, 2026-10-24).

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Meada: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "meada");
    assert.ok(site);
    assert.equal(site.base, "/meada");
    assert.deepEqual(site.hosts, []);
    assert.equal(meadaDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/meada"), { kind: "noindex", site: "meada" });
    assert.equal(routeClientSite("www.steevanz.com", "/meadas"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/meada/dominio"), { kind: "redirect", site: "meada", path: "/meada" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/meada",\s*"\/meada\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveMeadaPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveMeadaPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveMeadaPath(["en"]), null);
    assert.equal(resolveMeadaPath(["dominio", "x"]), null);
    assert.equal(meadaStaticParams().length, 2);
    assert.equal(meadaHref("preview"), "/meada");
    assert.equal(meadaSitemapEntries().length, 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /meada/i, file);
    }
  });

  it("serves its link preview from the preview's own address on a Vercel preview", () => {
    const metadata = readFileSync("src/components/clients/meada/metadata.ts", "utf8");
    assert.match(metadata, /VERCEL_ENV === "preview"/);
    assert.match(metadata, /VERCEL_BRANCH_URL/);
    assert.ok(statSync("public/media/clients/meada/og.jpg").size < 300_000);
  });

  it("goes back to the top on a reload, even with #section in the address", () => {
    const scroll = readFileSync("src/components/clients/meada/SmoothScroll.tsx", "utf8");
    assert.match(scroll, /getEntriesByType\("navigation"\)/);
    assert.match(scroll, /history\.replaceState/);
  });
});

describe("Meada: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/meada"), ...filesUnder("src/content/meada"), ...filesUnder("src/app/(clientes)/meada")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never shows ratings, reviews, testimonials or numbers of customers, and no JSON-LD", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|application\/ld\+json/i, path);
    }
    // No percentages or promised results in the texts (the CSS has percentages of its own).
    const texts = JSON.stringify(meadaCopy, (key, value) => (key === "focus" ? undefined : value));
    assert.doesNotMatch(texts, /\d+\s*%|resultados garantidos/i);
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(meadaCopy.shop.plusVat, "+ IVA");
    assert.match(meadaCopy.shop.vatNote, /sem IVA/);
    assert.match(meadaCopy.bag.message, /\{total\} \+ IVA/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%|\* ?1\.23|1,23/i, path);
    }
    for (const product of meadaCopy.shop.list) {
      assert.ok(product.price > 0 && Math.round(product.price * 100) === product.price * 100, product.name);
    }
    assert.equal(meadaPrice(34), "34 €");
    assert.equal(meadaPrice(6.5), "6,50 €");
  });

  it("orders through WhatsApp in the demo and says what a real Steevanz online shop does, never a real payment", () => {
    assert.match(meadaCopy.bag.demoNote, /MB WAY, Multibanco ou cartão/);
    assert.match(meadaCopy.bag.demoNote, /fictício/);
    for (const { path, text } of files) assert.doesNotMatch(text, /stripe|checkout|<form[^>]*action=/i, path);
  });

  it("calls the loyalty product by its name and never «fidelização» or «NFC»", () => {
    assert.equal(meadaCopy.card.eyebrow, "Cartão de cliente digital");
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
    }
  });

  it("never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green/i, path);
    }
  });

  it("has no pause button on the strips", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, and its contacts reach no one", () => {
    assert.match(meadaCopy.demo, /fictício/);
    assert.match(meadaCopy.footer.fictional, /fictício/);
    assert.match(meadaCopy.footer.credit, /Site por Steevanz/);
    assert.match(meadaCopy.team.note, /fictícia/);
    assert.match(meadaCopy.shop.demoNote, /Valores de exemplo de um negócio fictício/);
    assert.equal(meada.whatsappNumber, "351900000000");
    assert.equal(meada.phoneHref, "tel:+351900000000");
    assert.match(meadaWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(meada.media), ...Object.values(meadaPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/meada/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/meada/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/meada")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
  });
});
