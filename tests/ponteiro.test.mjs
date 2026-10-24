import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { ponteiroDomainSegment, ponteiroHref, ponteiroSitemapEntries, ponteiroStaticParams, resolvePonteiroPath } from "../src/content/ponteiro/routes.ts";
import { ponteiroCopy } from "../src/content/ponteiro/copy.ts";
import { ponteiro, ponteiroHhmm, ponteiroPhotos, ponteiroPrice, ponteiroWhatsappHref } from "../src/content/ponteiro/facts.ts";

// Ponteiro: a FICTIONAL café, kitchen and bar, Steevanz's showcase site for restaurants, cafés and bars (owner,
// 2026-10-24).

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Ponteiro: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "ponteiro");
    assert.ok(site);
    assert.equal(site.base, "/ponteiro");
    assert.deepEqual(site.hosts, []);
    assert.equal(ponteiroDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/ponteiro"), { kind: "noindex", site: "ponteiro" });
    assert.equal(routeClientSite("www.steevanz.com", "/ponteirox"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/ponteiro/dominio"), { kind: "redirect", site: "ponteiro", path: "/ponteiro" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/ponteiro",\s*"\/ponteiro\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolvePonteiroPath(undefined), { mode: "preview" });
    assert.deepEqual(resolvePonteiroPath(["dominio"]), { mode: "domain" });
    assert.equal(resolvePonteiroPath(["en"]), null);
    assert.equal(resolvePonteiroPath(["dominio", "x"]), null);
    assert.equal(ponteiroStaticParams().length, 2);
    assert.equal(ponteiroHref("preview"), "/ponteiro");
    assert.equal(ponteiroSitemapEntries().length, 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /ponteiro/i, file);
    }
  });
});

describe("Ponteiro: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/ponteiro"), ...filesUnder("src/content/ponteiro"), ...filesUnder("src/app/(clientes)/ponteiro")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));
  const texts = JSON.stringify(ponteiroCopy);

  it("never shows ratings, reviews, testimonials or numbers of customers, and no made-up structured data", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|application\/ld\+json/i, path);
    }
    // No percentages or promised results in the texts (the CSS has percentages of its own).
    assert.doesNotMatch(texts, /\d+\s*%|resultados garantidos/i);
    // The reviews area is only the call to leave one.
    assert.equal(ponteiroCopy.review.button, "Deixe a sua avaliação");
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(ponteiroCopy.carta.plusVat, "+ IVA");
    assert.match(ponteiroCopy.carta.vatNote, /sem IVA/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%/i, path);
    }
    const prices = [
      ...ponteiroCopy.carta.tabs.flatMap((tab) => tab.groups.flatMap((g) => g.items)),
      ...ponteiroCopy.vitrine.shelves.flat(),
    ];
    assert.ok(prices.length > 20);
    for (const item of prices) assert.ok(item.price > 0 && Math.abs(Math.round(item.price * 100) - item.price * 100) < 1e-9, item.name);
    // Every component that prints a price prints «+ IVA» (plusVat) next to it.
    for (const { path, text } of files.filter((f) => f.text.includes("ponteiroPrice("))) {
      if (path.endsWith("facts.ts")) continue;
      assert.match(text, /plusVat/, path);
    }
    assert.equal(ponteiroPrice(1.2), "1,20 €");
    assert.equal(ponteiroPrice(8), "8 €");
  });

  it("never writes «NFC» or «fidelização», says «Menu digital», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(text, /ementa em v[íi]deo|menu em v[íi]deo|card[áa]pio/i, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green|ring-green/i, path);
    }
    assert.equal(ponteiroCopy.menu.eyebrow, "Menu digital");
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, and its contacts reach no one", () => {
    assert.match(ponteiroCopy.demo, /fictício/);
    assert.match(ponteiroCopy.footer.fictional, /fictício/);
    assert.match(ponteiroCopy.casa.note, /fictícia/);
    assert.match(ponteiroCopy.carta.demoNote, /Valores de exemplo de um negócio fictício/);
    assert.match(ponteiroCopy.footer.credit, /^Site por Steevanz$/);
    assert.equal(ponteiro.whatsappNumber, "351900000000");
    assert.match(ponteiroWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
    assert.match(ponteiro.menuDemo, /^https:\/\/www\.steevanz\.com\/menu\//);
  });

  it("reads the clock of the page right", () => {
    assert.equal(ponteiroHhmm(450), "07:30");
    assert.equal(ponteiroHhmm(1560), "02:00");
    assert.equal(ponteiroHhmm(1320), "22:00");
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(ponteiro.media), ...Object.values(ponteiroPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/ponteiro/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/ponteiro/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/ponteiro")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    const og = statSync("public/media/clients/ponteiro/og.jpg").size;
    assert.ok(og < 300 * 1024, `og.jpg is ${og} bytes`);
  });
});
