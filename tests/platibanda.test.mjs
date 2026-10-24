import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import {
  platibandaDomainSegment,
  platibandaHref,
  platibandaListingHref,
  platibandaSitemapEntries,
  platibandaStaticParams,
  resolvePlatibandaPath,
} from "../src/content/platibanda/routes.ts";
import { platibandaCopy } from "../src/content/platibanda/copy.ts";
import { platibanda, platibandaPhotos, platibandaWhatsappHref } from "../src/content/platibanda/facts.ts";
import { defaultFilters, filterListings, listingPrice, listings, visitMessage } from "../src/content/platibanda/listings.ts";

// Platibanda: a FICTIONAL real-estate agency in Tavira, Steevanz's showcase site for real-estate businesses
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

const slugs = listings.map((l) => l.slug);

describe("Platibanda: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const site = clientSites.find((entry) => entry.id === "platibanda");
    assert.ok(site);
    assert.equal(site.base, "/platibanda");
    assert.deepEqual(site.hosts, []);
    assert.equal(platibandaDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/platibanda"), { kind: "noindex", site: "platibanda" });
    assert.deepEqual(routeClientSite("www.steevanz.com", `/platibanda/imoveis/${slugs[0]}`), { kind: "noindex", site: "platibanda" });
    assert.equal(routeClientSite("www.steevanz.com", "/platibandas"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/platibanda/dominio"), { kind: "redirect", site: "platibanda", path: "/platibanda" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/platibanda",\s*"\/platibanda\/:path\*"/);
  });

  it("resolves the home page and every property, in both variants, and nothing else", () => {
    assert.deepEqual(resolvePlatibandaPath(undefined, slugs), { mode: "preview", page: "home" });
    assert.deepEqual(resolvePlatibandaPath(["dominio"], slugs), { mode: "domain", page: "home" });
    assert.deepEqual(resolvePlatibandaPath(["imoveis", slugs[0]], slugs), { mode: "preview", page: "listing", slug: slugs[0] });
    assert.deepEqual(resolvePlatibandaPath(["dominio", "imoveis", slugs[1]], slugs), { mode: "domain", page: "listing", slug: slugs[1] });
    assert.equal(resolvePlatibandaPath(["imoveis", "nao-existe"], slugs), null);
    assert.equal(resolvePlatibandaPath(["imoveis"], slugs), null);
    assert.equal(resolvePlatibandaPath(["en"], slugs), null);
    assert.equal(platibandaStaticParams(slugs).length, 2 * (slugs.length + 1));
    assert.equal(platibandaHref("preview"), "/platibanda");
    assert.equal(platibandaListingHref("preview", "x"), "/platibanda/imoveis/x");
    assert.equal(platibandaListingHref("domain", "x"), "/imoveis/x");
    assert.equal(platibandaSitemapEntries(slugs).length, slugs.length + 1);
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /platibanda/i, file);
    }
  });
});

describe("Platibanda: listings and filters", () => {
  it("has unique slugs and references, real photos and every deal", () => {
    assert.equal(new Set(slugs).size, slugs.length);
    assert.equal(new Set(listings.map((l) => l.ref)).size, listings.length);
    for (const deal of ["venda", "arrendamento", "ferias"]) assert.ok(listings.some((l) => l.deal === deal), deal);
    for (const l of listings) {
      assert.ok(l.photos.length >= 3, l.slug);
      for (const p of l.photos) assert.ok(platibandaPhotos[p.id], `${l.slug}: ${p.id}`);
      assert.ok(Number.isInteger(l.price) && l.price > 0, l.slug);
    }
  });

  it("filters by deal, type, zone, bedrooms and price", () => {
    assert.equal(filterListings(listings, defaultFilters).length, listings.length);
    const sale = filterListings(listings, { ...defaultFilters, deal: "venda" });
    assert.ok(sale.length > 0 && sale.every((l) => l.deal === "venda"));
    const cheap = filterListings(listings, { ...defaultFilters, deal: "venda", maxPrice: 400000 });
    assert.ok(cheap.every((l) => l.price <= 400000));
    assert.ok(cheap.length < sale.length);
    // A price ceiling never applies without a deal (sale prices and nightly rates are not comparable).
    assert.equal(filterListings(listings, { ...defaultFilters, maxPrice: 100 }).length, listings.length);
    assert.ok(filterListings(listings, { ...defaultFilters, bedrooms: 4 }).every((l) => l.bedrooms >= 4));
    assert.ok(filterListings(listings, { ...defaultFilters, zone: "tavira", kind: "apartamento" }).every((l) => l.zone === "tavira" && l.kind === "apartamento"));
  });

  it("writes prices the Portuguese way, and a visit request with the reference", () => {
    assert.equal(listingPrice({ deal: "venda", price: 485000 }), "485 000 €");
    assert.equal(listingPrice({ deal: "arrendamento", price: 950 }), "950 €/mês");
    assert.equal(listingPrice({ deal: "ferias", price: 140 }), "desde 140 €/noite");
    assert.match(visitMessage({ ref: "PB-101", title: "Casa", deal: "venda" }), /visitar o imóvel PB-101/);
    assert.match(visitMessage({ ref: "PB-301", title: "Casa", deal: "ferias" }, "Nome: Ana."), /disponibilidade .*PB-301.*Nome: Ana\./);
  });
});

describe("Platibanda: owner's rules", () => {
  const files = [
    ...filesUnder("src/components/clients/platibanda"),
    ...filesUnder("src/content/platibanda"),
    ...filesUnder("src/app/(clientes)/platibanda"),
  ].map((path) => ({ path, text: readFileSync(path, "utf8") }));

  it("never shows ratings, reviews, testimonials or numbers of customers", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit|application\/ld\+json/i, path);
    }
    const texts = JSON.stringify(platibandaCopy) + JSON.stringify(listings);
    assert.doesNotMatch(texts, /\d+\s*%|resultados garantidos|clientes felizes/i);
  });

  it("shows every service fee without VAT, with «+ IVA», and never a VAT-inclusive amount", () => {
    assert.equal(platibandaCopy.services.plusVat, "+ IVA");
    assert.match(platibandaCopy.services.vatNote, /sem IVA/);
    for (const s of platibandaCopy.services.list) assert.equal(s.feeVat, true, s.id);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%/i, path);
    }
  });

  it("marks every property as fictional and never invents an AMI licence or an energy class", () => {
    assert.equal(platibandaCopy.fictionalListing, "Imóvel fictício (exemplo)");
    assert.equal(platibanda.ami, "AMI: (número da licença)");
    assert.equal(platibandaCopy.listing.energyPlaceholder, "(do certificado)");
    for (const l of listings) assert.equal("energy" in l, false, l.slug);
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /AMI[:\s]+\d/, path);
      assert.doesNotMatch(text, /energy:\s*"[A-G][+-]?"|classe energ[ée]tica:?\s*[A-G]/i, path);
    }
  });

  it("illustrates the listings only with interiors and generic outdoor spaces, never a recognisable building", () => {
    const scenery = ["fachadaPlatibanda", "taviraPraca", "taviraPorta", "reflexo"];
    for (const l of listings) for (const p of l.photos) assert.ok(!scenery.includes(p.id), `${l.slug}: ${p.id}`);
    assert.match(platibandaCopy.photosNote, /ilustrativas/);
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

  it("says it is a fictional business, and its contacts reach no one", () => {
    assert.match(platibandaCopy.demo, /fictício/);
    assert.match(platibandaCopy.footer.fictional, /fictício/);
    assert.match(platibandaCopy.team.note, /fictícia/);
    assert.match(platibandaCopy.services.demoNote, /fictício/);
    assert.equal(platibanda.whatsappNumber, "351900000000");
    assert.match(platibandaWhatsappHref("Olá"), /^https:\/\/wa\.me\/351900000000\?text=Ol%C3%A1$/);
    for (const a of platibandaCopy.team.list) assert.match(a.phone, /^\+351 900 000 00\d$/);
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(platibanda.media), ...Object.values(platibandaPhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/platibanda/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/platibanda/LICENCAS.txt", "utf8");
    for (const file of readdirSync("public/media/clients/platibanda")) {
      if (file === "LICENCAS.txt") continue;
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
    const og = statSync("public/media/clients/platibanda/og.jpg");
    assert.ok(og.size < 300 * 1024, "og.jpg under 300 KB");
  });

  it("brings the page back to the top on every reload, even with #section in the address", () => {
    const smooth = readFileSync("src/components/clients/platibanda/SmoothScroll.tsx", "utf8");
    assert.match(smooth, /getEntriesByType\("navigation"\)/);
    assert.match(smooth, /history\.replaceState/);
    const meta = readFileSync("src/components/clients/platibanda/metadata.ts", "utf8");
    assert.match(meta, /VERCEL_ENV === "preview"/);
    assert.match(meta, /VERCEL_BRANCH_URL/);
  });
});
