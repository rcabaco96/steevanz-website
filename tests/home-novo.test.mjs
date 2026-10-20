import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { businessCardBandCopy, goals, guideBandCopy, howCopy, loyaltyCopy, novoCopy, platesCopy } from "../src/content/novo-home.ts";
import { productAds } from "../src/content/product-ads.ts";

// The home page, «/» (pt) and «/en» (en): routes, components and content.
const dir = "src/components/novo";
const pageFiles = [
  "src/app/(pt)/page.tsx",
  "src/app/(intl)/[lang]/page.tsx",
  "src/content/novo-home.ts",
  ...readdirSync(dir)
    .filter((name) => /\.(tsx?|css)$/.test(name))
    .map((name) => join(dir, name)),
].map((path) => ({ path, text: readFileSync(path, "utf8") }));

describe("home page («/» and «/en»)", () => {
  it("has the four steps of «Como trabalhamos», in order", () => {
    assert.deepEqual(
      howCopy.pt.steps.map((step) => step.title),
      ["Queixe-se", "Oiça soluções", "Escolha a sua", "Nós tratamos do resto"],
    );
    assert.equal(howCopy.en.steps.length, 4);
  });

  it("keeps the brand line as the two sentences", () => {
    assert.deepEqual([...novoCopy.pt.brandLine], ["Tecnologia do futuro.", "Com os bons modos de antigamente."]);
    assert.deepEqual([...novoCopy.en.brandLine], ["Technology of the future.", "With good old-fashioned manners."]);
    for (const { path, text } of pageFiles) {
      const line = (text.match(/bons modos de antigamente/gi) ?? []).length;
      const future = (text.match(/Tecnologia do futuro/g) ?? []).length;
      assert.ok(line <= future, `${path}: «bons modos de antigamente» without «Tecnologia do futuro.»`);
    }
  });

  it("no longer has «Um dia no seu negócio», the phone hero or the brand film", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /Um dia no seu negócio|DayJourney|BrandVideo|heroClips/, path);
    }
    assert.equal(existsSync("src/app/(pt)/novo"), false, "/novo redirects to «/» from next.config.ts");
  });

  it("never uses forbidden words, invented ratings or VAT maths", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /de sempre/i, path);
      assert.doesNotMatch(text, /★|\d[.,]\d\s*estrelas/i, path);
      assert.doesNotMatch(text, /com IVA|IVA \(\d|IVA incluído|incl\.? VAT|including VAT|VAT included/i, path);
    }
  });

  it("reads the plates price from products.ts and shows it «+ IVA»", () => {
    const banner = readFileSync(join(dir, "PlatesBanner.tsx"), "utf8");
    assert.match(banner, /getProduct\("google-review-plates"\)/);
    assert.doesNotMatch(banner, /\b(29|25|23|20)\s*€/);
    assert.equal(platesCopy.pt.vat, "+ IVA");
    assert.equal(platesCopy.en.vat, "+ VAT");
    assert.equal(loyaltyCopy.en.vat, "+ VAT");
    assert.equal(novoCopy.en.showcase.vat, "+ VAT");
    assert.doesNotMatch(JSON.stringify(platesCopy), /\d\s*€|€\s*\d/);
  });

  it("shows the Menu digital ad (web version and poster in public/) and the old hero's plate scene", () => {
    for (const ad of Object.values(productAds)) for (const file of [ad.src, ad.poster]) assert.ok(existsSync(join("public", file)), file);
    assert.match(readFileSync(join(dir, "MenuShowcase.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync(join(dir, "LoyaltyBanner.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync(join(dir, "AdBand.tsx"), "utf8"), /<AdVideo/);
    for (const id of ["digital-menu", "loyalty", "guest-guide", "business-card"]) assert.ok(productAds[id], id);
    assert.match(readFileSync("src/components/pages/ProductPage.tsx", "utf8"), /<AdVideo/);
    assert.match(readFileSync("src/components/media/AdVideo.tsx", "utf8"), /preload="none"/);
    assert.match(readFileSync(join(dir, "PlatesBanner.tsx"), "utf8"), /<HeroTapScene/);
  });

  it("has no Dolci e Salati case section and no «fidelização» in the loyalty band", () => {
    for (const { path, text } of pageFiles) assert.doesNotMatch(text, /novo-case|copy\.dolci/, path);
    assert.doesNotMatch(JSON.stringify(loyaltyCopy), /fideliza|\d\s*€|€\s*\d/i);
    for (const copy of [guideBandCopy, businessCardBandCopy]) assert.doesNotMatch(JSON.stringify(copy), /fideliza|\d\s*€|€\s*\d/i);
  });

  it("never shows a «published» toast in the plate scenes (the stars on the form fill: owner, 2026-10-20)", () => {
    for (const name of ["HeroTapScene", "ReviewTapScene"]) {
      const tsx = readFileSync(`src/components/visuals/${name}.tsx`, "utf8");
      const css = readFileSync(`src/components/visuals/${name}.module.css`, "utf8");
      assert.doesNotMatch(tsx, /toast/, name);
      assert.doesNotMatch(css, /\.toast/, name);
    }
  });

  it("has no prices or FAQ section, and no FAQ structured data", () => {
    const home = readFileSync(join(dir, "NovoHome.tsx"), "utf8");
    assert.doesNotMatch(home, /PricesFaq|novo-prices/);
    for (const page of ["src/app/(pt)/page.tsx", "src/app/(intl)/[lang]/page.tsx"]) assert.doesNotMatch(readFileSync(page, "utf8"), /faqJsonLd/);
    // Section order: clients, plates, Menu digital, loyalty card, goals (right below the loyalty card: owner rule),
    // guest guide, business card, sectors, how we work, final call.
    const order = ["<ClientStrip", "<PlatesBanner", 'id="novo-menu"', "<LoyaltyBanner", 'id="novo-goals"', 'productId="guest-guide"', 'productId="business-card"', "<SectorSolutions", "<HowWeWork", 'id="novo-final"'];
    const positions = order.map((needle) => home.indexOf(needle));
    assert.ok(positions.every((pos) => pos > 0), JSON.stringify(positions));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  });

  it("is the same page at «/en», «/es», «/fr», «/de» and «/it», and the old home is gone (owner, 2026-10-20)", () => {
    const intl = readFileSync("src/app/(intl)/[lang]/page.tsx", "utf8");
    assert.match(intl, /<NovoHome locale=\{locale\}/);
    assert.match(intl, /novoHomeMetadata\(await localeOf\(params\)\)/);
    assert.match(intl, /websiteJsonLd\(locale\)/);
    assert.match(readFileSync("src/app/(pt)/page.tsx", "utf8"), /<NovoHome locale="pt"/);
    for (const old of ["src/components/pages/HomePage.tsx", "src/content/home.ts", "src/components/marketing/Marquee.tsx"]) {
      assert.equal(existsSync(old), false, old);
    }
    for (const locale of ["en", "es", "fr", "de", "it"]) {
      assert.equal(goals[locale].length, goals.pt.length, locale);
      assert.deepEqual(goals[locale].map((goal) => goal.id), goals.pt.map((goal) => goal.id), locale);
      const ids = (list) => list.map((goal) => goal.products.map((product) => product.id));
      assert.deepEqual(ids(goals[locale]), ids(goals.pt), locale);
    }
    // Owner, 2026-10-20: the online shop belongs only to «Vender mais».
    const withShop = goals.pt.filter((goal) => goal.products.some((product) => product.id === "online-shop")).map((goal) => goal.id);
    assert.deepEqual(withShop, ["sell"]);
  });

  it("has the slogan «encontram, compram e voltam» in the title and the hero", () => {
    assert.equal(novoCopy.pt.hero.titleAccent, "encontram, compram e voltam.");
    assert.match(novoCopy.pt.metaTitle, /encontram, compram e voltam/);
    assert.match(novoCopy.en.metaTitle, /find you, buy from you and come back/);
    for (const { path, text } of pageFiles) assert.doesNotMatch(text, /escolhem e voltam/, path);
  });

  it("sends every product call to its product page with «Conhecer …», never straight to a demo", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /\/menu\/|demoMenuHref|Ver um menu|alojamento-template/, path);
    }
    assert.match(novoCopy.pt.showcase.cta, /^Conhecer /);
    assert.match(platesCopy.pt.cta, /^Conhecer /);
    assert.match(loyaltyCopy.pt.cta, /^Conhecer /);
    assert.equal(guideBandCopy.pt.cta, "Conhecer o guia");
    assert.equal(businessCardBandCopy.pt.cta, "Conhecer os cartões");
    for (const copy of [guideBandCopy, businessCardBandCopy]) {
      assert.match(copy.en.cta, /^Discover /);
      assert.match(copy.it.cta, /^Scopra /);
      assert.equal(copy.en.vat, "+ VAT");
      assert.equal(copy.de.vat, "zzgl. MwSt.");
    }
    for (const cta of [novoCopy.en.showcase.cta, platesCopy.en.cta, loyaltyCopy.en.cta]) assert.match(cta, /^Discover /);
    assert.doesNotMatch(readFileSync("src/components/pages/SectorPage.tsx", "utf8"), /SectorExamples|alojamento-template/);
    assert.doesNotMatch(readFileSync("src/content/sectors.ts", "utf8"), /alojamento-template|examples:/);
  });

  it("gives every product page «Agendar demonstração» in the hero and at the end", () => {
    const page = readFileSync("src/components/pages/ProductPage.tsx", "utf8");
    assert.ok((page.match(/t\.common\.bookDemo/g) ?? []).length >= 3);
    assert.match(page, /<CtaBand[\s\S]*primaryLabel=\{t\.common\.bookDemo\}/);
  });
});
