import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { cartCopy } from "../src/content/cart.ts";
import { docPages } from "../src/content/doc-pages.ts";
import { mockupCopy } from "../src/content/mockups.ts";
import { extraLocales } from "../src/lib/i18n.ts";

// Group D of the site translation (es, fr, de, it): docs labels, sectors, mockups, cart and legal pages.

/** The shape of a value: same keys (deep) and same array lengths, ignoring the strings themselves. */
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]));
  return typeof value;
}

function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function assertFull(name, record) {
  for (const locale of extraLocales) {
    assert.ok(record[locale], `${name}.${locale} is missing`);
    assert.deepEqual(shape(record[locale]), shape(record.pt), `${name}.${locale} differs from pt`);
    if (typeof record.en === "object") assert.notDeepEqual(record[locale], record.en, `${name}.${locale} is still English`);
  }
}

function assertHouseWords(text) {
  assert.doesNotMatch(text, /\bNFC\b/, text);
  assert.doesNotMatch(text, /IVA incluído|IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt|incl\.? VAT|including VAT|VAT included/i, text);
}

describe("docs labels in every language", () => {
  it("translates the doc page labels but keeps the English slugs", () => {
    for (const page of docPages) {
      assertFull(`docPages.${page.id}.label`, page.label);
      for (const locale of extraLocales) assert.equal(page.slug[locale], undefined, `${page.id} slug ${locale}`);
    }
  });

  it("has the four languages in the docs page and docs index copy", () => {
    for (const file of ["src/components/pages/DocPage.tsx", "src/components/pages/DocsIndexPage.tsx"]) {
      const source = readFileSync(file, "utf8");
      for (const locale of extraLocales) assert.match(source, new RegExp(`\\n  ${locale}: \\{`), `${file} ${locale}`);
      assert.match(source, /satisfies Localized</, file);
      assert.doesNotMatch(source, /localize\(ui, locale\)s/, file);
    }
  });
});


describe("product-page illustrations in every language", () => {
  it("has every mockup text in es, fr, de, it, prices without VAT and no «NFC»", () => {
    assertFull("mockupCopy", mockupCopy);
    for (const text of strings(mockupCopy)) assertHouseWords(text);
  });
});

describe("cart, checkout and success pages in every language", () => {
  it("has the whole cart copy in es, fr, de, it, with VAT always added on top", () => {
    assertFull("cartCopy", cartCopy);
    const vat = { es: "+ IVA", fr: "+ TVA", de: "zzgl. MwSt.", it: "+ IVA" };
    for (const locale of extraLocales) {
      assert.equal(cartCopy[locale].plusVat, vat[locale], locale);
      assert.ok(cartCopy[locale].projectFrom.includes("{price}") && cartCopy[locale].projectFrom.includes(vat[locale]), locale);
      for (const key of ["decrease", "increase", "remove"]) assert.match(cartCopy[locale][key], /\{name\}/, `${locale}.${key}`);
      assert.match(cartCopy[locale].headerLabelCount, /\{count\}/);
    }
    for (const text of strings(cartCopy)) assertHouseWords(text);
  });
});
