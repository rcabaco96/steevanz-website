import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { resolveRoazPath, roazDomainSegment, roazHref, roazSitemapEntries, roazStaticParams } from "../src/content/roaz/routes.ts";
import { roazCopy } from "../src/content/roaz/copy.ts";
import { roaz, roazPhotos, roazPrice, roazWhatsappHref } from "../src/content/roaz/facts.ts";

// Roaz: a FICTIONAL boat-trip operator in Ferragudo, Steevanz's showcase site for boat-trip and activity businesses
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

describe("Roaz: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "roaz");
    assert.ok(site);
    assert.equal(site.base, "/roaz");
    assert.deepEqual(site.hosts, []);
    assert.equal(roazDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/roaz"), { kind: "noindex", site: "roaz" });
    assert.equal(routeClientSite("www.steevanz.com", "/roazx"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/roaz/dominio"), { kind: "redirect", site: "roaz", path: "/roaz" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/roaz",\s*"\/roaz\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveRoazPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveRoazPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveRoazPath(["en"]), null);
    assert.equal(resolveRoazPath(["dominio", "x"]), null);
    assert.equal(roazStaticParams().length, 2);
    assert.equal(roazHref("preview"), "/roaz");
    assert.equal(roazSitemapEntries().length, 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /roaz/i, file);
    }
  });
});

describe("Roaz: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/roaz"), ...filesUnder("src/content/roaz"), ...filesUnder("src/app/(clientes)/roaz")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));
  const texts = JSON.stringify(roazCopy);

  it("never shows ratings, reviews, testimonials, numbers of guests or JSON-LD", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|application\/ld\+json|★|⭐|testemunho|clientes satisfeit|passageiros satisfeit/i, path);
    }
    // No percentages, no «X mil clientes», no promised sightings.
    assert.doesNotMatch(texts, /\d+\s*%|\bmil (clientes|passageiros|visitantes|pessoas)\b|milhares de|avistamento garantido|garantimos/i);
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(roazCopy.tours.plusVat, "+ IVA");
    assert.match(roazCopy.tours.vatNote, /sem IVA/);
    assert.match(roazCopy.tours.demoNote, /Valores de exemplo de um negócio fictício/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%|\* ?1\.23|1,23/i, path);
    }
    for (const tour of roazCopy.tours.list) {
      assert.ok(Number.isInteger(tour.adult) && tour.adult > 0, tour.id);
      assert.ok(Number.isInteger(tour.child) && tour.child > 0 && tour.child < tour.adult, tour.id);
      assert.ok(tour.minutes > 0 && tour.departures.length > 0, tour.id);
    }
    for (const extra of roazCopy.tours.extras.items) assert.ok(Number.isInteger(extra.price) && extra.price > 0, extra.name);
    // Every place a price is printed puts the «+ IVA» beside it.
    for (const file of ["Tours.tsx", "BookingForm.tsx"]) {
      const text = readFileSync(join("src/components/clients/roaz", file), "utf8");
      const prices = text.match(/roazPrice\(/g)?.length ?? 0;
      const vat = text.match(/plusVat/g)?.length ?? 0;
      assert.ok(prices > 0 && vat >= prices, `${file}: ${prices} prices, ${vat} «+ IVA»`);
    }
    assert.equal(roazPrice(35), "35 €");
  });

  it("never writes «NFC» or «fidelização», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green|ring-green|border-green/i, path);
    }
  });

  it("has no pause button on the strips", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, invents no licence numbers, and its contacts reach no one", () => {
    assert.match(roazCopy.demo, /fictício/);
    assert.match(roazCopy.footer.fictional, /fictício/);
    assert.match(roazCopy.skipper.note, /fictícia/);
    assert.match(roazCopy.booking.demoNote, /nada fica reservado nem é pago/);
    assert.ok(roazCopy.aboard.licences.some((l) => l.includes("(n.º RNAAT)")));
    // Licences only as placeholders: no RNAAT number anywhere.
    assert.doesNotMatch(texts, /RNAAT\s*(n\.º\s*)?\d/i);
    assert.equal(roaz.whatsappNumber, "351900000000");
    assert.equal(roaz.phoneHref, "tel:+351900000000");
    assert.match(roazWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
  });

  it("calls the Steevanz products by their names and only offers what they do", () => {
    assert.equal(roazCopy.booking.product, "Sistema de reservas online");
    assert.equal(roazCopy.waitlist.product, "Lista de espera digital");
    assert.equal(roazCopy.skipper.product, "Cartão de visita digital");
    assert.equal(roazCopy.review.button, "Deixe a sua avaliação");
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(roaz.media), ...Object.values(roazPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/roaz/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/roaz/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/roaz")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    // Never AI-generated media.
    assert.doesNotMatch(licences, /ai generated/i);
  });
});
