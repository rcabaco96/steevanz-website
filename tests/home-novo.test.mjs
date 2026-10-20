import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { howCopy, loyaltyCopy, novoCopy, platesCopy } from "../src/content/novo-home.ts";
import { productAds } from "../src/content/product-ads.ts";

// The home page («/», pt): route, components and content.
const dir = "src/components/novo";
const pageFiles = [
  "src/app/(pt)/page.tsx",
  "src/content/novo-home.ts",
  ...readdirSync(dir)
    .filter((name) => /\.(tsx?|css)$/.test(name))
    .map((name) => join(dir, name)),
].map((path) => ({ path, text: readFileSync(path, "utf8") }));

describe("home page («/»)", () => {
  it("has the four steps of «Como trabalhamos», in order", () => {
    assert.deepEqual(
      howCopy.steps.map((step) => step.title),
      ["Queixe-se", "Oiça soluções", "Escolha a sua", "Nós tratamos do resto"],
    );
  });

  it("keeps the brand line as the two sentences", () => {
    assert.deepEqual([...novoCopy.brandLine], ["Tecnologia do futuro.", "Com os bons modos de antigamente."]);
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
      assert.doesNotMatch(text, /com IVA|IVA \(\d|IVA incluído/i, path);
    }
  });

  it("reads the plates price from products.ts and shows it «+ IVA»", () => {
    const banner = readFileSync(join(dir, "PlatesBanner.tsx"), "utf8");
    assert.match(banner, /getProduct\("google-review-plates"\)/);
    assert.doesNotMatch(banner, /\b(29|25|23|20)\s*€/);
    assert.equal(platesCopy.vat, "+ IVA");
    assert.doesNotMatch(JSON.stringify(platesCopy), /\d\s*€/);
  });

  it("shows the Menu digital ad (web version and poster in public/) and the old hero's plate scene", () => {
    for (const ad of Object.values(productAds)) for (const file of [ad.src, ad.poster]) assert.ok(existsSync(join("public", file)), file);
    assert.match(readFileSync(join(dir, "MenuShowcase.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync(join(dir, "LoyaltyBanner.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync("src/components/pages/ProductPage.tsx", "utf8"), /<AdVideo/);
    assert.match(readFileSync("src/components/media/AdVideo.tsx", "utf8"), /preload="none"/);
    assert.match(readFileSync(join(dir, "PlatesBanner.tsx"), "utf8"), /<HeroTapScene/);
  });

  it("has no Dolci e Salati case section and no «fidelização» in the loyalty band", () => {
    for (const { path, text } of pageFiles) assert.doesNotMatch(text, /novo-case|copy\.dolci/, path);
    assert.doesNotMatch(JSON.stringify(loyaltyCopy), /fideliza|\d\s*€/i);
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
    assert.doesNotMatch(readFileSync("src/app/(pt)/page.tsx", "utf8"), /faqJsonLd/);
    // Section order: clients, plates, Menu digital, loyalty card, goals, sectors, how we work, final call.
    const order = ["<ClientStrip", "<PlatesBanner", 'id="novo-menu"', "<LoyaltyBanner", 'id="novo-goals"', "<SectorSolutions", "<HowWeWork", 'id="novo-final"'];
    const positions = order.map((needle) => home.indexOf(needle));
    assert.ok(positions.every((pos) => pos > 0), JSON.stringify(positions));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  });
});
