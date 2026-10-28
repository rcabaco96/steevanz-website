import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  clientSites,
  domainSegment,
  routeClientSite,
} from "../src/lib/client-sites.ts";
import {
  resolveSeteChavesPath,
  seteChavesDomainSegment,
  seteChavesHref,
  seteChavesRobotsTxt,
  seteChavesSitemapEntries,
  seteChavesStaticParams,
} from "../src/content/sete-chaves/routes.ts";
import {
  seteChavesCopy,
  steevanzLinks,
} from "../src/content/sete-chaves/copy.ts";
import {
  dayNumber,
  isDemoOccupied,
  minNightsFor,
  nightPrice,
  seteChaves,
  seteChavesMailHref,
  seteChavesPhotos,
  seteChavesPrice,
  seteChavesUnits,
  seteChavesWhatsappHref,
} from "../src/content/sete-chaves/facts.ts";

// Sete Chaves: a FICTIONAL guest house in Aljezur, Steevanz's showcase site for lodging businesses (owner, 2026-10-24).

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
  ...filesUnder("src/components/clients/sete-chaves"),
  ...filesUnder("src/content/sete-chaves"),
  ...filesUnder("src/app/(clientes)/sete-chaves"),
].map((path) => ({ path, text: readFileSync(path, "utf8") }));

/** Every string the page can show (functions called with sample values). */
function allTexts(value) {
  const out = [];
  const walk = (v) => {
    if (typeof v === "string") out.push(v);
    else if (typeof v === "function") out.push(String(v(1)), String(v(3)));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  return out;
}
const texts = [...allTexts(seteChavesCopy), ...allTexts(seteChavesUnits)];

describe("Sete Chaves: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const entry = clientSites.find((s) => s.id === "sete-chaves");
    assert.ok(entry);
    assert.equal(entry.base, "/sete-chaves");
    assert.deepEqual(entry.hosts, []);
    assert.equal(seteChavesDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/sete-chaves"), {
      kind: "noindex",
      site: "sete-chaves",
    });
    assert.equal(routeClientSite("www.steevanz.com", "/sete-chavesx"), null);
    assert.deepEqual(
      routeClientSite("www.steevanz.com", "/sete-chaves/dominio"),
      { kind: "redirect", site: "sete-chaves", path: "/sete-chaves" },
    );
    assert.match(
      readFileSync("src/proxy.ts", "utf8"),
      /"\/sete-chaves",\s*"\/sete-chaves\/:path\*"/,
    );
  });

  it("resolves the page in both variants and nothing else", () => {
    assert.deepEqual(resolveSeteChavesPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveSeteChavesPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveSeteChavesPath(["quartos"]), null);
    assert.equal(resolveSeteChavesPath(["dominio", "x"]), null);
    assert.equal(seteChavesStaticParams().length, 2);
    assert.equal(seteChavesHref("preview"), "/sete-chaves");
    assert.equal(seteChavesHref("domain"), "/");
    assert.deepEqual(
      seteChavesSitemapEntries().map((e) => e.url),
      ["https://www.steevanz.com/sete-chaves"],
    );
    assert.match(
      seteChavesRobotsTxt(),
      /Sitemap: https:\/\/www\.steevanz\.com\/sete-chaves\/sitemap\.xml/,
    );
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of [
      "src/app/sitemap.ts",
      "src/lib/all-routes.ts",
      "src/app/robots.ts",
    ]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /sete-chaves/i, file);
    }
  });
});

describe("Sete Chaves: owner's rules", () => {
  it("never shows ratings, reviews, testimonials, numbers of customers or promised results", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(
        text,
        /aggregateRating|ratingValue|reviewCount|application\/ld\+json|★|⭐|testemunho|clientes satisfeit|hóspedes satisfeit/i,
        path,
      );
    }
    for (const text of texts)
      assert.doesNotMatch(
        text,
        /\d+\s*%|garantid|\d\s*estrelas|cinco estrelas|melhor preço/i,
        text,
      );
    // The reviews area is only the call.
    assert.equal(seteChavesCopy.review.button, "Deixe a sua avaliação");
  });

  it("shows every price without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(seteChavesCopy.plusVat, "+ IVA");
    assert.match(seteChavesCopy.vatNote, /sem IVA/);
    assert.match(seteChavesCopy.vatNote, /exemplo/);
    for (const { path, text } of files) {
      assert.doesNotMatch(
        text,
        /com IVA|IVA incluído|IVA inclu|IVA \(23|total com IVA/i,
        path,
      );
    }
    // Every € amount written in a text says «+ IVA» beside it.
    for (const text of texts) {
      if (/\d\s*€/.test(text)) assert.match(text, /\+ IVA/, text);
    }
    for (const unit of seteChavesUnits) {
      assert.ok(
        Number.isInteger(unit.priceLow) && unit.priceLow > 0,
        unit.name,
      );
      assert.ok(unit.pricePeak > unit.priceLow, unit.name);
      assert.ok(unit.guests >= 2, unit.name);
      assert.ok(seteChavesPhotos[unit.photo], unit.name);
    }
    assert.equal(seteChavesPrice(85), "85 €");
    // The booking estimate only adds the example prices of the nights (no VAT maths anywhere).
    const form = readFileSync(
      "src/components/clients/sete-chaves/BookingForm.tsx",
      "utf8",
    );
    assert.doesNotMatch(form, /\*\s*[01]\.(06|13|23)\b|\biva\s*\*/i);
  });

  it("has seven keys, numbered 1 to 7", () => {
    assert.deepEqual(
      seteChavesUnits.map((u) => u.key),
      [1, 2, 3, 4, 5, 6, 7],
    );
    assert.equal(new Set(seteChavesUnits.map((u) => u.id)).size, 7);
  });

  it("never writes «NFC» or «fidelização», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /fideliza/i, path);
      assert.doesNotMatch(
        text,
        /globals\.css|SiteShell|WhatsAppButton|root-metadata/,
        path,
      );
      assert.doesNotMatch(
        text,
        /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green|ring-green|border-green/i,
        path,
      );
    }
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files)
      assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business with example values, and credits Steevanz", () => {
    assert.match(seteChavesCopy.demo, /fictício/);
    assert.match(seteChavesCopy.demo, /valores de exemplo/);
    assert.match(seteChavesCopy.footer.fictional, /fictício/);
    assert.match(seteChavesCopy.footer.fictional, /Steevanz/);
    assert.match(seteChavesCopy.booking.demoNote, /fictício/);
    assert.match(
      seteChavesCopy.booking.demoAvailability,
      /ilustrativa|exemplo/,
    );
    assert.match(seteChavesCopy.story.hostsNote, /fictícios/);
    assert.match(seteChavesCopy.contact.addressNote, /fictícia/);
    assert.equal(seteChavesCopy.footer.credit, "Site por Steevanz");
  });

  it("uses unusable placeholder contacts and no legal identifiers", () => {
    assert.equal(seteChaves.phoneHref, "tel:+351900000000");
    assert.equal(seteChaves.whatsappNumber, "351900000000");
    assert.match(seteChaves.email, /\.example$/);
    assert.match(
      seteChavesWhatsappHref("Olá"),
      /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/,
    );
    assert.match(
      seteChavesMailHref("Pedido", "Olá"),
      /^mailto:reservas@setechaves\.example\?subject=Pedido&body=Ol%C3%A1$/,
    );
    for (const { path, text } of files) {
      assert.doesNotMatch(
        text,
        /961 ?292 ?679|\bNIF\b|\bNIPC\b|\bRNAL\b|\bAL\s*n\.?º|registo n\.?º\s*\d/i,
        path,
      );
    }
    for (const slot of [
      "{nome}",
      "{chave}",
      "{chegada}",
      "{partida}",
      "{noites}",
      "{hospedes}",
    ]) {
      assert.ok(seteChavesCopy.booking.message.includes(slot), slot);
    }
  });

  it("links the two Steevanz products to their pages with «Conhecer …»", () => {
    assert.equal(seteChavesCopy.guide.cta, "Conhecer o Guia digital");
    assert.match(seteChavesCopy.guide.keychainCta, /^Conhecer o porta-chaves/);
    assert.equal(
      steevanzLinks.guide,
      "https://www.steevanz.com/produtos/guia-digital-alojamento",
    );
    assert.equal(
      steevanzLinks.keychain,
      "https://www.steevanz.com/produtos/chaveiro-digital",
    );
    const products = readFileSync("src/content/products.ts", "utf8");
    assert.match(products, /pt: "guia-digital-alojamento"/);
    assert.match(products, /pt: "chaveiro-digital"/);
  });

  it("shows availability only as a fixed demo pattern, with the right minimum stays", () => {
    const unit = seteChavesUnits[0];
    let busy = 0;
    for (let i = 0; i < 365; i++)
      if (isDemoOccupied(unit, new Date(2026, 0, 1 + i))) busy++;
    assert.ok(busy > 20 && busy < 160, String(busy));
    assert.equal(
      isDemoOccupied(unit, new Date(2026, 9, 25)),
      isDemoOccupied(unit, new Date(2026, 9, 25)),
    );
    assert.equal(minNightsFor(new Date(2026, 6, 10)), 4);
    assert.equal(minNightsFor(new Date(2026, 9, 10)), 2);
    assert.equal(nightPrice(unit, new Date(2026, 7, 1)), unit.pricePeak);
    assert.equal(nightPrice(unit, new Date(2026, 10, 1)), unit.priceLow);
    assert.equal(
      dayNumber(new Date(2026, 0, 2)) - dayNumber(new Date(2026, 0, 1)),
      1,
    );
  });

  it("uses only its own media files, every one of them written in LICENCAS.txt", () => {
    const paths = [
      ...Object.values(seteChaves.media),
      ...Object.values(seteChavesPhotos).map((p) => p.src),
    ];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/sete-chaves/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync(
      "public/media/clients/sete-chaves/LICENCAS.txt",
      "utf8",
    );
    for (const file of readdirSync("public/media/clients/sete-chaves")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    // The link preview image: a JPG under 300 KB.
    assert.ok(
      statSync("public/media/clients/sete-chaves/og.jpg").size < 300_000,
    );
  });

  it("goes back to the top on every reload, even with #section in the address (Orvé lesson, 2026-10-24)", () => {
    const smooth = readFileSync(
      "src/components/clients/sete-chaves/SmoothScroll.tsx",
      "utf8",
    );
    assert.match(smooth, /getEntriesByType\("navigation"\)/);
    assert.match(smooth, /history\.replaceState/);
  });

  it("takes the link preview image from the preview's own address on a Vercel preview (Orvé lesson, 2026-10-24)", () => {
    const meta = readFileSync(
      "src/components/clients/sete-chaves/metadata.ts",
      "utf8",
    );
    assert.match(meta, /VERCEL_ENV === "preview"/);
    assert.match(meta, /VERCEL_BRANCH_URL/);
    assert.match(meta, /metadataBase: new URL\(origin\)/);
  });
});
