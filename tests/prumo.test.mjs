import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { prumoDomainSegment, prumoHref, prumoStaticParams, resolvePrumoPath } from "../src/content/prumo/routes.ts";
import { prumoCopy } from "../src/content/prumo/copy.ts";
import { prumo, prumoDuration, prumoPhotos, prumoPrice, prumoWhatsappHref } from "../src/content/prumo/facts.ts";

// Prumo: a FICTIONAL clinic of physiotherapy, osteopathy and wellness in Coimbra, Steevanz's showcase site for the
// CRM's health and wellness sector (owner, 2026-10-24), with placeholder contacts and careful health content.

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

const texts = JSON.stringify(prumoCopy);

describe("Prumo: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const entry = clientSites.find((s) => s.id === "prumo");
    assert.ok(entry);
    assert.equal(entry.base, "/prumo");
    assert.deepEqual(entry.hosts, []);
    assert.equal(prumoDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/prumo"), { kind: "noindex", site: "prumo" });
    assert.equal(routeClientSite("www.steevanz.com", "/prumox"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/prumo/dominio"), { kind: "redirect", site: "prumo", path: "/prumo" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/prumo",\s*"\/prumo\/:path\*"/);
  });

  it("resolves its one page in both variants and nothing else", () => {
    assert.deepEqual(resolvePrumoPath(undefined), { mode: "preview" });
    assert.deepEqual(resolvePrumoPath([]), { mode: "preview" });
    assert.deepEqual(resolvePrumoPath(["dominio"]), { mode: "domain" });
    assert.equal(resolvePrumoPath(["en"]), null);
    assert.equal(resolvePrumoPath(["dominio", "x"]), null);
    assert.equal(prumoStaticParams().length, 2);
    assert.equal(prumoHref("preview"), "/prumo");
    assert.equal(prumoHref("domain"), "/");
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /prumo/i, file);
    }
  });

  it("takes its link preview image from the preview's own address on a Vercel preview", () => {
    const meta = readFileSync("src/components/clients/prumo/metadata.ts", "utf8");
    assert.match(meta, /VERCEL_ENV === "preview"/);
    assert.match(meta, /VERCEL_BRANCH_URL/);
    assert.match(meta, /metadataBase: new URL\(origin\)/);
    assert.doesNotMatch(meta, /application\/ld\+json|jsonLd/i);
  });

  it("goes back to the top on a reload, even with #section in the address", () => {
    const smooth = readFileSync("src/components/clients/prumo/SmoothScroll.tsx", "utf8");
    assert.match(smooth, /getEntriesByType\("navigation"\)/);
    assert.match(smooth, /history\.replaceState/);
    assert.match(smooth, /firstRun/);
  });
});

describe("Prumo: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/prumo"), ...filesUnder("src/content/prumo"), ...filesUnder("src/app/(clientes)/prumo")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never shows ratings, reviews, testimonials or numbers of customers", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|pacientes satisfeit/i, path);
    }
    assert.doesNotMatch(texts, /\d+\s*%/);
    assert.equal(prumoCopy.review.button, "Deixe a sua avaliação");
  });

  it("makes no medical claims and promises no results", () => {
    assert.doesNotMatch(texts, /garantid|\bcura\b|\bcurar|\bcuramos|elimina(r|mos)? a dor|sem dor|resultados? (rápid|garantid|visíve)|milagr|definitiv|100\s*%/i);
    assert.match(prumoCopy.health.text, /não substitui o aconselhamento/);
    assert.match(prumoCopy.health.text, /112/);
  });

  it("shows every price without VAT, with «+ IVA», as example values, and never a VAT-inclusive amount", () => {
    assert.equal(prumoCopy.disciplines.plusVat, "+ IVA");
    assert.match(prumoCopy.disciplines.vatNote, /sem IVA/);
    assert.match(prumoCopy.disciplines.demoNote, /exemplo/);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%|isento de IVA|IVA inclu/i, path);
    }
    const ids = new Set();
    for (const discipline of prumoCopy.disciplines.list) {
      assert.ok(discipline.services.length > 0, discipline.id);
      for (const s of discipline.services) {
        assert.ok(Number.isFinite(s.price) && s.price > 0, s.name);
        assert.ok(s.minutes > 0, s.name);
        assert.ok(!ids.has(s.id), `unique ${s.id}`);
        ids.add(s.id);
      }
    }
    assert.equal(prumoPrice(35), `35${nbsp}€`);
    assert.equal(prumoPrice(12.5), `12,5${nbsp}€`);
    assert.equal(prumoDuration(45), `45${nbsp}min`);
    assert.equal(prumoDuration(60), `1${nbsp}h`);
    assert.equal(prumoDuration(75), `1${nbsp}h${nbsp}15`);
  });

  it("never writes «NFC» or «fidelização», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green|ring-green|emerald-|\blime-\d/i, path);
    }
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business, with a fictional team and placeholder credentials", () => {
    for (const text of [prumoCopy.demo, prumoCopy.footer.fictional, prumoCopy.team.note]) assert.match(text, /fictíci/);
    assert.match(prumoCopy.footer.fictional, /Steevanz/);
    assert.equal(prumoCopy.footer.credit, "Site por Steevanz");
    assert.match(prumoCopy.team.note, /Equipa fictícia/);
    assert.equal(prumoCopy.team.licencePlaceholder, "(n.º da cédula)");
    assert.match(prumoCopy.footer.regulator, /\(n\.º de registo\)/);
    assert.ok(prumoCopy.visit.insurance.list.includes("(seguros e acordos)"));
    for (const item of prumoCopy.visit.insurance.list) assert.match(item, /^\(.+\)$/, item);
    // No real-looking licence numbers anywhere.
    assert.doesNotMatch(texts, /cédula[^"]{0,20}\d{3,}/i);
  });

  it("uses placeholder contacts, never a real person's number", () => {
    assert.equal(prumo.phoneHref, "tel:+351900000000");
    assert.equal(prumo.whatsappNumber, "351900000000");
    assert.match(prumoWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
    assert.match(prumo.email, /\.example$/);
    for (const { path, text } of files) assert.doesNotMatch(text, /961 ?292 ?679|351961292679/, path);
    assert.match(prumoCopy.booking.demoNote, /fictício/);
  });

  it("offers the Steevanz products that fit a clinic, by their real names", () => {
    assert.match(prumoCopy.booking.intro, /terapeuta/);
    assert.match(prumoCopy.booking.intro, /dia e a hora/);
    assert.equal(prumoCopy.studio.card.eyebrow, "Cartão de cliente digital");
    assert.match(prumoCopy.studio.card.text, /um toque/);
    // Every therapist does at least one treatment the booking offers.
    const offered = new Set(prumoCopy.disciplines.list.map((d) => d.id));
    for (const person of prumoCopy.team.list) assert.ok(person.disciplines.some((d) => offered.has(d)), person.id);
    for (const discipline of prumoCopy.disciplines.list) {
      assert.ok(prumoCopy.team.list.some((p) => p.disciplines.includes(discipline.id)), `someone does ${discipline.id}`);
    }
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(prumo.media), ...Object.values(prumoPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/prumo/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/prumo/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/prumo")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    assert.ok(statSync("public/media/clients/prumo/og.jpg").size < 300 * 1024);
  });
});
