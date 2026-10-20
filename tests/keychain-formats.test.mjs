import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { cartCopy } from "../src/content/cart.ts";
import { docs as keychainDocs } from "../src/content/docs/keychain.ts";
import { pageLabels } from "../src/content/page-labels.ts";
import { productCopy } from "../src/content/product-copy/index.ts";
import { getProduct } from "../src/content/products.ts";
import { defaultOptions, priceCart, sanitizeLines } from "../src/lib/cart/pricing.ts";

// «Porta-chaves digital» (owner, 2026-10-20): two formats at the same price, with a key ring or a tag without one,
// chosen in the cart with no logo or text; the destination can be changed later at no extra cost.

const locales = ["pt", "en", "es", "fr", "de", "it"];

function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const keychain = getProduct("keychain");

describe("keychain formats", () => {
  it("has the two formats, labelled in the six languages", () => {
    const formats = keychain.customization?.formats ?? [];
    assert.deepEqual(formats.map((format) => format.id), ["keyring", "tag"]);
    assert.equal(formats[0].label.pt, "Porta-chaves (com argola)");
    assert.equal(formats[1].label.pt, "Tag (sem argola, para colar ou pendurar)");
    for (const format of formats) for (const locale of locales) assert.ok(format.label[locale]?.trim(), `${format.id}.${locale}`);
    assert.equal(keychain.customization.formatOnly, true);
  });

  it("keeps the slug and the price: 5 €, 10 for 45 € and 25 for 100 €, for either format", () => {
    assert.equal(keychain.slug.pt, "chaveiro-digital");
    for (const format of ["keyring", "tag"]) {
      const total = (quantity) => priceCart([{ id: "a", productId: "keychain", quantity, options: { format, logo: false, text: "" } }]).oneTime.subtotalCents;
      assert.equal(total(1), 500, format);
      assert.equal(total(10), 4500, format);
      assert.equal(total(25), 10000, format);
    }
  });

  it("starts a cart line on the key ring and keeps the chosen format, with no logo or text", () => {
    assert.deepEqual(defaultOptions("keychain"), { format: "keyring", logo: false, text: "" });
    const [line] = sanitizeLines([{ id: "k1", productId: "keychain", quantity: 10, options: { format: "tag", logo: true, text: "Olá" } }]);
    assert.deepEqual(line.options, { format: "tag", logo: false, text: "" });
    const priced = priceCart([line]).oneTime.lines[0];
    assert.equal(priced.unitCents, 450);
    assert.equal(priced.lineExtraCents, 0);
    const [unknown] = sanitizeLines([{ id: "k2", productId: "keychain", quantity: 1, options: { format: "nope" } }]);
    assert.equal(unknown.options.format, "keyring");
  });

  it("shows only the format in the cart, the order e-mail and the product page hint", () => {
    const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(read("src/components/cart/CartView.tsx"), /customization\.formatOnly \? null/);
    assert.match(read("src/components/pages/CartPage.tsx"), /formatOnly: product\.customization\.formatOnly === true/);
    assert.match(read("src/lib/cart/actions.ts"), /if \(customization\.formatOnly\) return \[/);
    assert.match(read("src/components/pages/ProductPage.tsx"), /productHintFormat/);
    for (const locale of locales) {
      assert.ok(cartCopy[locale].customize.productHintFormat?.trim(), `cart hint ${locale}`);
      assert.ok(pageLabels[locale].product.formatsSamePrice?.trim(), `formats label ${locale}`);
    }
  });
});

describe("keychain copy in six languages", () => {
  const names = { pt: "Porta-chaves digital", en: "Digital keychain", es: "Llavero digital", fr: "Porte-clés digital", de: "Digitaler Schlüsselanhänger", it: "Portachiavi digitale" };
  const formatsQuestion = { pt: /argola/, en: /key ring/, es: /anilla/, fr: /anneau/, de: /Schlüsselring/, it: /anello/ };
  const changeLater = { pt: /mudá-lo mais tarde, sem custo/, en: /change it later at no extra cost/, es: /cambiarlo más adelante sin coste adicional/, fr: /changer plus tard sans frais supplémentaires/, de: /später ohne Aufpreis ändern/, it: /cambiarla in seguito senza costi aggiuntivi/ };
  const shortLink = { pt: /link curto da Steevanz/, en: /short Steevanz link/, es: /enlace corto de Steevanz/, fr: /lien court Steevanz/, de: /Steevanz-Link/, it: /link Steevanz/ };
  const orderTime = /escolhid[oa] na encomenda|escolhe na encomenda|chosen when you order|when you ordered|al hacer el pedido|elegido en el pedido|choisie à la commande|bei der Bestellung (festgelegt|gewählt)|al momento dell'ordine|scelta nell'ordine/i;

  it("calls it «Porta-chaves digital» in Portuguese and keeps keychain names elsewhere", () => {
    for (const locale of locales) assert.equal(productCopy.keychain[locale].name, names[locale], locale);
    const pt = strings(productCopy.keychain.pt).join(" ") + strings(Object.values(keychainDocs.pages).map((page) => page.pt)).join(" ");
    assert.doesNotMatch(pt.replace(/chaveiro-digital|mais-chaveiros/g, ""), /chaveiro/i);
  });

  it("explains both formats in an FAQ, and changing the destination later at no extra cost", () => {
    for (const locale of locales) {
      const faq = productCopy.keychain[locale].faq;
      const formats = faq.find((item) => formatsQuestion[locale].test(item.q));
      assert.ok(formats, `keychain.${locale} has the formats question`);
      assert.match(formats.a, /tag|étiquette|etiqueta/i, `keychain.${locale} formats answer`);
      const product = faq.map((item) => item.a).join(" ");
      const docsFaq = strings(keychainDocs.pages.faq[locale]).join(" ");
      for (const text of [product, docsFaq]) {
        assert.match(text, changeLater[locale], locale);
        assert.match(text, shortLink[locale], locale);
        assert.match(text, formatsQuestion[locale], locale);
      }
    }
  });

  it("no longer says the destination is fixed when ordering, and never says «NFC»", () => {
    for (const locale of locales) {
      const all = strings(productCopy.keychain[locale]).concat(strings(Object.values(keychainDocs.pages).map((page) => page[locale])));
      for (const text of all) {
        assert.doesNotMatch(text, orderTime, `${locale}: ${text}`);
        assert.doesNotMatch(text, /\bNFC\b/, `${locale}: ${text}`);
      }
    }
  });

  it("counts the packs in units", () => {
    const units = { pt: "10 unidades", en: "10 units", es: "10 unidades", fr: "10 pièces", de: "10 Stück", it: "10 pezzi" };
    for (const locale of locales) assert.equal(pageLabels[locale].product.packsCountKeychain.replace("{count}", "10"), units[locale], locale);
  });
});
