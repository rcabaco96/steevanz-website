import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { products } from "../src/content/products.ts";
import {
  brandLine,
  cleanQualifier,
  fromLabel,
  goalFromPrice,
  goals,
  monthlyFeeSuffix,
} from "../src/content/home-ultra/shared.ts";

// Every text file of the /novo-ultra page: route, components and content.
function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}
const pageFiles = [
  ...filesUnder("src/app/(pt)/novo-ultra"),
  ...filesUnder("src/components/home-ultra"),
  ...filesUnder("src/content/home-ultra"),
].map((path) => ({ path, text: readFileSync(path, "utf8") }));

// Intl («pt-PT») puts a no-break space before the euro sign.
const nb = " ";

describe("/novo-ultra content", () => {
  it("puts each of the 14 products in exactly one goal", () => {
    const ids = goals.flatMap((g) => g.productIds);
    assert.equal(ids.length, products.length);
    assert.deepEqual([...new Set(ids)].sort(), products.map((p) => p.id).sort());
  });

  it("shows the expected «desde» prices per goal", () => {
    const labels = Object.fromEntries(goals.map((g) => [g.id, fromLabel(goalFromPrice(g))]));
    assert.deepEqual(labels, {
      encontrado: `desde 29${nb}€`,
      casa: `desde 19${nb}€/mês`,
      vender: `desde 10${nb}€`,
      voltar: `desde 5${nb}€`,
      medida: `desde 149${nb}€`,
    });
  });

  it("strips every «fidelização» clause from the price qualifiers", () => {
    for (const p of products) assert.doesNotMatch(cleanQualifier(p.priceQualifier.pt), /fideliza/i, p.id);
    assert.equal(
      cleanQualifier("por projeto, + 15 €/mês de alojamento, sem fidelização"),
      "por projeto, + 15 €/mês de alojamento",
    );
    assert.equal(monthlyFeeSuffix(products.find((p) => p.id === "digital-menu")), " + 30 €/mês");
  });

  it("keeps the brand line as the two lines, exactly", () => {
    assert.deepEqual([...brandLine], ["Tecnologia do futuro.", "Com os bons modos de antigamente."]);
    for (const { path, text } of pageFiles) {
      const line = (text.match(/bons modos de antigamente/gi) ?? []).length;
      const future = (text.match(/Tecnologia do futuro/g) ?? []).length;
      assert.ok(line <= future, `${path}: «bons modos de antigamente» without «Tecnologia do futuro.»`);
    }
  });

  it("never uses forbidden words, invented ratings or stats", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /de sempre/i, path);
      assert.doesNotMatch(text, /★/, path);
      assert.doesNotMatch(text, /\d[.,]\d\s*(estrelas|★)/i, path);
      // Only the cleanQualifier helper may mention it.
      if (!path.endsWith("shared.ts")) assert.doesNotMatch(text, /fideliza/i, path);
      // Copy files: no percentages (no invented stats).
      if (path.includes("content")) assert.doesNotMatch(text, /\d+\s?%/, `${path}: percentage`);
    }
  });
});
