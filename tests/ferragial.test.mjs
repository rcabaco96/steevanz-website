import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { ferragialDomainSegment, ferragialHref, ferragialStaticParams, resolveFerragialPath } from "../src/content/ferragial/routes.ts";
import { ferragialCopy } from "../src/content/ferragial/copy.ts";
import {
  ferragial,
  ferragialDelivery,
  ferragialDuration,
  ferragialExperiences,
  ferragialMailHref,
  ferragialPhotos,
  ferragialPrice,
  ferragialWhatsappHref,
  ferragialWines,
} from "../src/content/ferragial/facts.ts";

// Adega Ferragial: a FICTIONAL family winery in the Alentejo, Steevanz's showcase site for wineries (owner,
// 2026-10-24), with an online shop and online booking of visits and tastings.

const nbsp = " ";

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

const files = [...filesUnder("src/components/clients/ferragial"), ...filesUnder("src/content/ferragial"), ...filesUnder("src/app/(clientes)/ferragial")].map((path) => ({
  path,
  text: readFileSync(path, "utf8"),
}));
const texts = JSON.stringify([ferragialCopy, ferragialWines, ferragialExperiences, ferragial]);

describe("Adega Ferragial: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const entry = clientSites.find((s) => s.id === "ferragial");
    assert.ok(entry);
    assert.equal(entry.base, "/ferragial");
    assert.deepEqual(entry.hosts, []);
    assert.equal(ferragialDomainSegment, domainSegment);
    for (const file of Object.values(entry.rootFiles)) {
      if (file.startsWith("/media/")) assert.ok(existsSync(join("public", file)), file);
    }
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/ferragial"), { kind: "noindex", site: "ferragial" });
    assert.equal(routeClientSite("www.steevanz.com", "/ferragialx"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/ferragial/dominio"), { kind: "redirect", site: "ferragial", path: "/ferragial" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/ferragial",\s*"\/ferragial\/:path\*"/);
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveFerragialPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveFerragialPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveFerragialPath(["en"]), null);
    assert.equal(resolveFerragialPath(["dominio", "x"]), null);
    assert.equal(ferragialStaticParams().length, 2);
    assert.equal(ferragialHref("preview"), "/ferragial");
    assert.equal(ferragialHref("domain"), "/");
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      if (existsSync(file)) assert.doesNotMatch(readFileSync(file, "utf8"), /ferragial/i, file);
    }
  });

  it("takes its link preview image from the preview's own address on a Vercel preview", () => {
    const metadata = readFileSync("src/components/clients/ferragial/metadata.ts", "utf8");
    assert.match(metadata, /VERCEL_ENV === "preview"/);
    assert.match(metadata, /VERCEL_BRANCH_URL/);
    assert.match(metadata, /metadataBase: new URL\(origin\)/);
    assert.doesNotMatch(metadata, /application\/ld\+json|jsonLd/i);
  });
});

describe("Adega Ferragial: owner's rules", () => {
  it("never shows ratings, reviews, testimonials, awards, scores or numbers of visitors", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|medalha|\bpontos\b|prémio|premiad|visitantes por/i, path);
    }
    assert.doesNotMatch(texts, /\d+\s*%|garantid|medalha|pontos|prémio|premiad|\bouro\b/i);
  });

  it("shows every price without VAT with «+ IVA», and never a VAT-inclusive amount", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%|IVA inclu/i, path);
    }
    assert.equal(ferragialCopy.wines.plusVat, "+ IVA");
    assert.equal(ferragialCopy.visits.plusVat, "+ IVA");
    assert.equal(ferragialCopy.basket.plusVat, "+ IVA");
    assert.equal(ferragialCopy.booking.plusVat, "+ IVA");
    assert.match(ferragialCopy.wines.vatNote, /sem IVA/);
    assert.match(ferragialCopy.visits.vatNote, /sem IVA/);
    assert.match(ferragialCopy.basket.vatNote, /sem IVA/);
    // The order and booking messages say «+ IVA» after the total.
    assert.match(ferragialCopy.basket.message, /\{total\} \+ IVA/);
    assert.match(ferragialCopy.booking.message, /\{total\} \+ IVA/);
    for (const item of [...ferragialWines, ...ferragialExperiences]) assert.ok(item.price > 0, item.id);
    assert.ok(ferragialDelivery.shipping > 0);
    assert.equal(ferragialPrice(18), `18${nbsp}€`);
    assert.equal(ferragialPrice(9.5), `9,50${nbsp}€`);
    assert.equal(ferragialDuration(90), `1${nbsp}h${nbsp}30`);
    assert.equal(ferragialDuration(120), `2${nbsp}h`);
  });

  it("drinks responsibly: the moderation line, adults-only shop and tastings", () => {
    assert.equal(ferragialCopy.responsible, "Seja responsável. Beba com moderação.");
    assert.match(readFileSync("src/components/clients/ferragial/Footer.tsx", "utf8"), /copy\.responsible/);
    assert.match(readFileSync("src/components/clients/ferragial/Basket.tsx", "utf8"), /basket\.adult\b/);
    assert.match(ferragialCopy.basket.adult, /18 anos/);
    assert.match(ferragialCopy.wines.adultsOnly, /18 anos/);
    assert.match(ferragialCopy.visits.adults, /18 anos/);
  });

  it("never writes «NFC» or «fidelização», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green/i, path);
    }
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, with a fictional phone and examples of prices", () => {
    assert.match(ferragialCopy.demo, /fictício/);
    assert.match(ferragialCopy.footer.fictional, /fictício/);
    assert.match(ferragialCopy.footer.fictional, /Steevanz/);
    assert.match(ferragialCopy.wines.demoNote, /exemplo/);
    assert.match(ferragialCopy.visits.demoNote, /exemplo/);
    assert.match(ferragialCopy.events.note, /exemplo/);
    assert.match(ferragialCopy.club.demoNote, /exemplo/);
    assert.match(ferragialCopy.family.note, /fictícias/);
    assert.match(ferragialCopy.basket.demoNote, /fictícios/);
    assert.match(ferragialCopy.booking.demoNote, /fictícios/);
    assert.equal(ferragial.phoneHref, "tel:+351900000000");
    assert.equal(ferragial.whatsappNumber, "351900000000");
    assert.match(ferragialWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
    assert.match(ferragialMailHref("Encomenda", "a b"), /^mailto:ola@ferragial\.example\?subject=Encomenda&body=a%20b$/);
    assert.match(ferragialCopy.footer.credit, /Site por Steevanz/);
  });

  it("only promises what Steevanz's products do (club card: a touch or QR, no app)", () => {
    assert.match(ferragialCopy.club.eyebrow, /Cartão de cliente digital/);
    assert.match(ferragialCopy.club.intro, /sem app/);
    assert.match(ferragialCopy.club.intro, /um toque ou com o QR code/);
    assert.equal(ferragialCopy.review.button, "Deixe a sua avaliação");
  });

  it("books only on the days and months each experience runs", () => {
    for (const exp of ferragialExperiences) {
      assert.ok(Object.keys(exp.slots).length > 0, exp.id);
      for (const [day, times] of Object.entries(exp.slots)) {
        assert.ok(Number(day) >= 0 && Number(day) <= 6 && Number(day) !== 1, `${exp.id}: closed on Mondays`);
        for (const t of times) assert.match(t, /^\d\d:\d\d$/);
      }
      if (exp.months) assert.ok(exp.season, `${exp.id} explains its season`);
    }
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [
      ...Object.values(ferragial.media),
      ...Object.values(ferragialPhotos).map((p) => p.src),
      ...ferragialExperiences.flatMap((e) => (e.media.kind === "video" ? [e.media.src, e.media.poster] : [])),
    ];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/ferragial/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/ferragial/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/ferragial")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    assert.ok(statSync("public/media/clients/ferragial/og.jpg").size < 300_000);
  });
});
