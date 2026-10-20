import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { howCopy, novoCopy, platesCopy } from "../src/content/novo-home.ts";

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
});
