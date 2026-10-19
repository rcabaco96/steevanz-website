import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cleanTranslations,
  filledLanguages,
  formatMenuPrice,
  languageNames,
  localizeMenu,
  menuLanguageOf,
  menuLanguages,
  menuText,
  pickMenuLanguage,
  tableLabel,
  translationLimits,
} from "../src/lib/video-menus/i18n.ts";
import { orderBar, orderingError, orderingText } from "../src/lib/video-menus/ordering-i18n.ts";
import { customerLanguageNote, orderBarLabel, orderingErrorMessage, staffOrderLines } from "../src/lib/video-menus/ordering-rules.ts";
import { toVideoMenuData } from "../src/lib/video-menus/rules.ts";

describe("picking the menu's language", () => {
  it("reads language tags as one of the six", () => {
    assert.equal(menuLanguageOf("en-GB"), "en");
    assert.equal(menuLanguageOf("pt_BR"), "pt");
    assert.equal(menuLanguageOf("DE"), "de");
    assert.equal(menuLanguageOf("nl-NL"), null);
    assert.equal(menuLanguageOf(""), null);
    assert.equal(menuLanguageOf(undefined), null);
  });

  it("?lang= first, then the stored choice, then the phone's languages, else Portuguese", () => {
    assert.equal(pickMenuLanguage({ search: "?lang=fr", stored: "de", browser: ["en-US"] }), "fr");
    assert.equal(pickMenuLanguage({ search: "?mesa=1&lang=it-IT", stored: null, browser: [] }), "it");
    assert.equal(pickMenuLanguage({ search: "?lang=xx", stored: "de", browser: ["en-US"] }), "de");
    assert.equal(pickMenuLanguage({ search: "", stored: null, browser: ["nl-NL", "es-ES", "en"] }), "es");
    assert.equal(pickMenuLanguage({ search: "", stored: "klingon", browser: ["en-US"] }), "en");
    assert.equal(pickMenuLanguage({ search: null, stored: null, browser: ["nl-NL", "ja"] }), "pt");
    assert.equal(pickMenuLanguage({}), "pt");
  });

  it("has every word in every language", () => {
    for (const language of menuLanguages) {
      assert.ok(languageNames[language]);
      for (const [key, value] of Object.entries(menuText.pt)) assert.equal(typeof menuText[language][key], typeof value, `${language}.${key}`);
      for (const key of Object.keys(orderingText.pt)) assert.ok(orderingText[language][key], `${language}.${key}`);
      for (const key of Object.keys(orderingText.pt.errors)) assert.ok(orderingText[language].errors[key], `${language}.errors.${key}`);
    }
  });

  it("says in Portuguese exactly what the table's phones said before", () => {
    for (const error of ["cart_full", "line_full", "note_too_long", "cart_empty", "order_too_soon", "rate_limited", "dish_missing", "table_missing", "ordering_off", "network", "bad_request", "whatever"]) {
      assert.equal(orderingError("pt", error), orderingErrorMessage(error));
    }
    assert.equal(orderBar("pt", 3, 1450), orderBarLabel(3, 1450));
    assert.equal(orderingError("en", "whatever"), orderingText.en.errors.bad_request);
  });

  it("keeps the euros and the amount, in each language's format", () => {
    assert.match(formatMenuPrice(10.5, "pt"), /^10,50\s€$/);
    assert.equal(formatMenuPrice(10.5, "en"), "€10.50");
    assert.match(formatMenuPrice(10.5, "de"), /^10,50\s€$/);
  });

  it("names the tables called «Mesa N» in the customer's language", () => {
    assert.equal(tableLabel("Mesa 3", "en"), "Table 3");
    assert.equal(tableLabel("mesa 12", "de"), "Tisch 12");
    assert.equal(tableLabel("Mesa 3", "pt"), "Mesa 3");
    assert.equal(tableLabel("Esplanada", "fr"), "Esplanada");
  });
});

describe("translations of the dishes and collections", () => {
  const limits = { name: translationLimits.dishName, description: translationLimits.dishDescription };

  it("keeps only the five languages and their fields, trimmed, within the limits, without empty ones or ones equal to the Portuguese", () => {
    const raw = {
      en: { name: "  Octopus   lagareiro style ", description: "", extra: "x" },
      es: { name: "Polvo à lagareiro" },
      pt: { name: "never" },
      nl: { name: "never" },
      de: "not an object",
      fr: { description: "x".repeat(400) },
    };
    const clean = cleanTranslations(raw, limits, { name: "Polvo à lagareiro", description: "Polvo assado." });
    assert.deepEqual(Object.keys(clean).sort(), ["en", "fr"]);
    assert.deepEqual(clean.en, { name: "Octopus lagareiro style" });
    assert.equal(clean.fr.description.length, 300);
    assert.deepEqual(cleanTranslations(null, limits), {});
    assert.deepEqual(cleanTranslations([1, 2], limits), {});
    assert.deepEqual(filledLanguages(clean), ["en", "fr"]);
  });

  const rows = () => ({
    menu: { business_name: "Trattoria", logo_url: "/logo.png", instagram: null },
    dishes: [
      { id: "d1", menu_id: "m", name: "Bruschetta", description: "Pão tostado com tomate.", price_cents: 650, position: 0, bunny_video_id: "v1", translations: { en: { description: "Toasted bread with tomato." }, de: { name: "Bruschetta", description: "Geröstetes Brot mit Tomaten." } } },
      { id: "d2", menu_id: "m", name: "Água com gás", description: "", price_cents: 200, position: 1, bunny_video_id: "v2", translations: {} },
    ],
    collections: [
      { id: "c1", menu_id: "m", name: "Antipasti", position: 0, is_default: true, translations: { en: { name: "Starters" } } },
      { id: "c2", menu_id: "m", name: "Bebidas", position: 1, is_default: false },
    ],
    links: [
      { collection_id: "c1", dish_id: "d1", position: 0 },
      { collection_id: "c2", dish_id: "d2", position: 0 },
    ],
  });

  it("carries only what differs from the Portuguese into the page", () => {
    const { menu, dishes, collections, links } = rows();
    const data = toVideoMenuData(menu, dishes, collections, links);
    assert.deepEqual(data.dishes.d1.translations, { en: { description: "Toasted bread with tomato." }, de: { description: "Geröstetes Brot mit Tomaten." } });
    assert.equal("translations" in data.dishes.d2, false);
    assert.deepEqual(data.collections[0].translations, { en: { name: "Starters" } });
    assert.equal("translations" in data.collections[1], false);
  });

  it("shows each text in the language, falling back to Portuguese when it has none", () => {
    const { menu, dishes, collections, links } = rows();
    const data = toVideoMenuData(menu, dishes, collections, links);
    assert.equal(localizeMenu(data, "pt"), data);
    const en = localizeMenu(data, "en");
    assert.equal(en.dishes.d1.name, "Bruschetta");
    assert.equal(en.dishes.d1.description, "Toasted bread with tomato.");
    assert.equal(en.dishes.d2.name, "Água com gás");
    assert.equal(en.collections[0].name, "Starters");
    assert.equal(en.collections[1].name, "Bebidas");
    // Same videos, prices and keys: nothing but the words changes.
    assert.deepEqual(Object.keys(en.dishes), Object.keys(data.dishes));
    assert.equal(en.dishes.d1.bunny, "v1");
    assert.equal(en.dishes.d1.price, 6.5);
    assert.equal(en.dishes.d2, data.dishes.d2);
    const it = localizeMenu(data, "it");
    assert.equal(it.dishes.d1.description, "Pão tostado com tomate.");
    assert.equal(it.collections[0].name, "Antipasti");
  });
});

describe("the staff's page stays in Portuguese", () => {
  it("lists the Portuguese names as the order was placed and the notes as typed", () => {
    const lines = staffOrderLines([
      { dish_name: "Água com gás", unit_price_cents: 200, quantity: 2, note: "", position: 1 },
      { dish_name: "Polvo à lagareiro", unit_price_cents: 1850, quantity: 1, note: "no garlic please", position: 0 },
    ]);
    assert.deepEqual(lines, [
      { name: "Polvo à lagareiro", priceCents: 1850, quantity: 1, note: "no garlic please" },
      { name: "Água com gás", priceCents: 200, quantity: 2, note: "" },
    ]);
  });

  it("notes the customer's language in Portuguese, nothing for Portuguese or unknown", () => {
    assert.equal(customerLanguageNote("en"), "Cliente pediu em inglês");
    assert.equal(customerLanguageNote("de"), "Cliente pediu em alemão");
    assert.equal(customerLanguageNote("pt"), null);
    assert.equal(customerLanguageNote(null), null);
  });
});
