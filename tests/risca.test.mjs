import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { riscaDomainSegment, riscaHref, riscaSitemapEntries, riscaStaticParams, resolveRiscaPath } from "../src/content/risca/routes.ts";
import { riscaCopy } from "../src/content/risca/copy.ts";
import { risca, riscaPhotos, riscaPrice, riscaWhatsappHref } from "../src/content/risca/facts.ts";

// Risca: a FICTIONAL hair salon and barbershop in Porto, Steevanz's showcase site for hairdressers and barbers
// (owner, 2026-10-24).

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Risca: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "risca");
    assert.ok(site);
    assert.equal(site.base, "/risca");
    assert.deepEqual(site.hosts, []);
    assert.equal(riscaDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/risca"), { kind: "noindex", site: "risca" });
    assert.equal(routeClientSite("www.steevanz.com", "/riscax"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/risca/dominio"), { kind: "redirect", site: "risca", path: "/risca" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/risca",\s*"\/risca\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveRiscaPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveRiscaPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveRiscaPath(["en"]), null);
    assert.equal(resolveRiscaPath(["dominio", "x"]), null);
    assert.equal(riscaStaticParams().length, 2);
    assert.equal(riscaHref("preview"), "/risca");
    assert.equal(riscaSitemapEntries().length, 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /risca/i, file);
    }
  });
});

describe("Risca: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/risca"), ...filesUnder("src/content/risca"), ...filesUnder("src/app/(clientes)/risca")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never shows ratings, reviews, testimonials, numbers of customers or made-up structured data", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|application\/ld\+json/i, path);
    }
    // No percentages or promised results in the texts (the CSS has percentages of its own).
    assert.doesNotMatch(JSON.stringify(riscaCopy), /\d+\s*%|resultados garantidos/i);
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(riscaCopy.services.plusVat, "+ IVA");
    assert.match(riscaCopy.services.vatNote, /sem IVA/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%/i, path);
    }
    for (const category of riscaCopy.services.list) {
      assert.ok(category.services.length > 0, category.id);
      for (const s of category.services) {
        assert.ok(Number.isInteger(s.price) && s.price > 0, s.name);
        assert.ok(s.minutes > 0, s.name);
      }
    }
    assert.equal(riscaPrice(32), "32 €");
    // Every place that prints a price prints «+ IVA» next to it.
    for (const file of ["Services.tsx", "Booking.tsx"]) {
      const text = readFileSync(join("src/components/clients/risca", file), "utf8");
      const prices = text.match(/riscaPrice\(/g)?.length ?? 0;
      const vat = text.match(/plusVat/g)?.length ?? 0;
      assert.ok(prices > 0 && vat >= prices, `${file}: ${prices} prices, ${vat} «+ IVA»`);
    }
  });

  it("serves the barbershop too: barbers in the booking, beard and kids' cuts, the walk-in queue", () => {
    const barber = riscaCopy.services.list.find((c) => c.id === "barbearia");
    assert.ok(barber);
    const names = barber.services.map((s) => s.name).join(" ");
    assert.match(names, /barba/i);
    assert.match(names, /rapaz/i);
    for (const id of barber.stylists) assert.ok(riscaCopy.team.list.some((s) => s.id === id && /Barbeiro/.test(s.role)), id);
    assert.match(riscaCopy.booking.step2, /barbeiro/i);
    assert.equal(riscaCopy.queue.steps.length, 3);
    assert.match(JSON.stringify(riscaCopy.queue), /QR/);
  });

  it("never writes «NFC» or «fidelização», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green/i, path);
    }
  });

  it("has no pause button on the strips", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, and its contacts reach no one", () => {
    assert.match(riscaCopy.demo, /fictício/);
    assert.match(riscaCopy.footer.fictional, /fictício/);
    assert.match(riscaCopy.team.note, /fictícia/);
    assert.match(riscaCopy.services.demoNote, /fictício/);
    assert.match(riscaCopy.footer.credit, /Site por Steevanz/);
    assert.equal(risca.whatsappNumber, "351900000000");
    assert.equal(risca.phoneHref, "tel:+351900000000");
    assert.match(riscaWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
  });

  it("asks for a review without showing any", () => {
    assert.equal(riscaCopy.review.button, "Deixe a sua avaliação");
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(risca.media), ...Object.values(riscaPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/risca/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/risca/LICENCAS.txt", "utf8");
    for (const name of readdirSync("public/media/clients/risca")) {
      if (name === "LICENCAS.txt") continue;
      assert.ok(licences.includes(name), `LICENCAS.txt names ${name}`);
    }
  });

  it("ships a link preview image under 300 KB", () => {
    assert.ok(statSync("public/media/clients/risca/og.jpg").size < 300 * 1024);
  });
});
