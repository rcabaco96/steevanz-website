import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { aboutCopy, contactCopy } from "../src/content/company.ts";
import { bookingCopy, infoRequestCopy } from "../src/content/booking.ts";
import { goalCtas, goals, howCopy, loyaltyCopy, novoCopy, platesCopy, sceneCopy, sectorsCopy } from "../src/content/novo-home.ts";
import { pageLabels } from "../src/content/page-labels.ts";
import { getProductCopy } from "../src/content/product-copy/index.ts";
import { products } from "../src/content/products.ts";
import { sectors } from "../src/content/sectors.ts";
import { ui } from "../src/content/ui.ts";
import { baseLocaleOf, extraLocales, htmlLang, localize, localizePartial, locales, nativeNames, prefixedLocales } from "../src/lib/i18n.ts";
import { href, localizedHrefs, routeFromPath, switchLocalePath } from "../src/lib/routes.ts";
import { languageAlternates, pageMetadata } from "../src/lib/seo.ts";

// The site in six languages (owner, 2026-10-20): pt (no prefix), en, es, fr, de, it.

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

describe("locale resolution", () => {
  it("has the six languages, Portuguese first, with their own names", () => {
    assert.deepEqual([...locales], ["pt", "en", "es", "fr", "de", "it"]);
    assert.deepEqual([...prefixedLocales], ["en", "es", "fr", "de", "it"]);
    assert.deepEqual(Object.values(nativeNames), ["Português", "English", "Español", "Français", "Deutsch", "Italiano"]);
    assert.equal(htmlLang.pt, "pt-PT");
  });

  it("falls back to English when a language is missing", () => {
    const record = { pt: "olá", en: "hello", fr: "bonjour" };
    assert.equal(localize(record, "pt"), "olá");
    assert.equal(localize(record, "fr"), "bonjour");
    for (const locale of ["es", "de", "it"]) assert.equal(localize(record, locale), "hello");
  });

  it("merges a partial translation over the English fields", () => {
    const record = { pt: { name: "Nome", body: "Texto" }, en: { name: "Name", body: "Text" }, es: { name: "Nombre" } };
    assert.deepEqual(localizePartial(record, "es"), { name: "Nombre", body: "Text" });
    assert.deepEqual(localizePartial(record, "de"), { name: "Name", body: "Text" });
    assert.deepEqual(localizePartial(record, "pt"), { name: "Nome", body: "Texto" });
    assert.equal(baseLocaleOf("de"), "en");
    assert.equal(baseLocaleOf("pt"), "pt");
  });
});

describe("routes in six languages", () => {
  it("prefixes every language but Portuguese and reuses the English slugs", () => {
    const route = { key: "product", productId: "digital-menu" };
    assert.deepEqual(localizedHrefs(route), {
      pt: "/produtos/menu-digital",
      en: "/en/products/digital-menu",
      es: "/es/products/digital-menu",
      fr: "/fr/products/digital-menu",
      de: "/de/products/digital-menu",
      it: "/it/products/digital-menu",
    });
    assert.equal(href("de", { key: "home" }), "/de");
    assert.equal(href("it", { key: "book" }), "/it/book-a-demo");
    assert.equal(href("fr", { key: "doc", productId: "bookings", pageId: "faq" }), "/fr/docs/online-booking-system/faq");
  });

  it("reads every page back from its path in every language", () => {
    const routes = [
      { key: "home" },
      { key: "about" },
      { key: "requestInfo" },
      { key: "product", productId: "loyalty" },
      { key: "sector", sectorId: "lodging" },
      { key: "doc", productId: "ai-voice", pageId: "setup" },
    ];
    for (const locale of locales) {
      for (const route of routes) assert.deepEqual(routeFromPath(href(locale, route)), { locale, route }, `${locale} ${JSON.stringify(route)}`);
    }
  });

  it("switches to the same page in the chosen language", () => {
    assert.equal(switchLocalePath("/produtos/placas-google-reviews", "de"), "/de/products/google-review-plates");
    assert.equal(switchLocalePath("/es/sectors/holiday-rentals", "pt"), "/setores/alojamento-local");
    assert.equal(switchLocalePath("/it/book-a-demo", "fr"), "/fr/book-a-demo");
    assert.equal(switchLocalePath("/de", "en"), "/en");
    assert.equal(switchLocalePath("/fr/docs/digital-menu/usage", "pt"), "/docs/menu-digital/utilizacao");
    // Not a site page (a client's menu, an unknown path): the home in that language.
    assert.equal(switchLocalePath("/menu/trattoria-da-nonna", "it"), "/it");
    assert.equal(switchLocalePath("/xx/yy", "es"), "/es");
  });
});

describe("hreflang and canonical", () => {
  it("lists the six languages and x-default (Portuguese)", () => {
    const languages = languageAlternates({ key: "product", productId: "website" });
    assert.deepEqual(Object.keys(languages), ["pt-PT", "en", "es", "fr", "de", "it", "x-default"]);
    assert.match(languages.de, /\/de\/products\/business-website$/);
    assert.equal(languages["x-default"], languages["pt-PT"]);
  });

  it("gives each language its own canonical, og:locale and image", () => {
    const meta = pageMetadata({ locale: "it", route: { key: "about" }, title: "Chi siamo", description: "…" });
    assert.match(meta.alternates.canonical, /\/it\/about$/);
    assert.equal(meta.openGraph.locale, "it_IT");
    assert.equal(meta.openGraph.alternateLocale.length, 5);
    assert.equal(meta.openGraph.images[0].url, "/og/it");
  });

  it("serves the prefixed languages from one route tree, and the old English tree is gone", () => {
    assert.equal(existsSync("src/app/(en)"), false);
    const layout = readFileSync("src/app/(intl)/[lang]/layout.tsx", "utf8");
    assert.match(layout, /dynamicParams = false/);
    assert.match(layout, /langStaticParams/);
    const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
    assert.match(sitemap, /locales\.map/);
    assert.match(sitemap, /languageAlternates/);
    // [product] has no layout, so the doc page must list both segments or /es/docs/… would 404 in production.
    assert.match(readFileSync("src/app/(intl)/[lang]/docs/[product]/[page]/page.tsx", "utf8"), /product: slugIn\(product\.slug, locale\), page: slugIn/);
  });
});

describe("translated content", () => {
  const full = { ui, pageLabels, novoCopy, sceneCopy, howCopy, loyaltyCopy, platesCopy, sectorsCopy, aboutCopy, contactCopy, bookingCopy, infoRequestCopy, goals };

  it("has every field of the Portuguese text in each language, for the chrome, home, booking and about", () => {
    for (const [name, record] of Object.entries(full)) {
      for (const locale of extraLocales) {
        assert.ok(record[locale], `${name}.${locale} is missing`);
        assert.deepEqual(shape(record[locale]), shape(record.pt), `${name}.${locale} differs from pt`);
      }
    }
  });

  it("translates the product cards and the sector cards", () => {
    for (const product of products) {
      const en = getProductCopy(product.id, "en");
      for (const locale of extraLocales) {
        const copy = getProductCopy(product.id, locale);
        for (const field of ["name", "shortName", "tagline", "summary"]) assert.ok(copy[field], `${product.id}.${locale}.${field}`);
        assert.notEqual(copy.tagline, en.tagline, `${product.id}.${locale} tagline is still English`);
        // The rest of each product page is being translated file by file; a missing field falls back to English.
        assert.ok(copy.heroSubtitle, `${product.id}.${locale}.heroSubtitle`);
        assert.ok(product.priceQualifier[locale], `${product.id} price qualifier in ${locale}`);
      }
    }
    for (const sector of sectors) {
      for (const locale of extraLocales) {
        const copy = localizePartial(sector.copy, locale);
        for (const field of ["name", "cardTitle", "cardBody", "bundleTitle", "bundleBody"]) assert.notEqual(copy[field], sector.copy.en[field], `${sector.id}.${locale}.${field}`);
      }
    }
  });

  it("keeps the brand line, prices without VAT and the house words in every language", () => {
    const brand = { pt: "Com os bons modos de antigamente.", en: "With good old-fashioned manners.", es: "Con los buenos modales de antes.", fr: "Avec les bonnes manières d'antan.", de: "Mit den guten Manieren von früher.", it: "Con le buone maniere di una volta." };
    const vat = { pt: "+ IVA", en: "+ VAT", es: "+ IVA", fr: "+ TVA", de: "zzgl. MwSt.", it: "+ IVA" };
    for (const locale of locales) {
      assert.equal(novoCopy[locale].brandLine[1], brand[locale], locale);
      assert.equal(ui[locale].common.vatExcluded, vat[locale], locale);
      assert.equal(novoCopy[locale].showcase.vat, vat[locale], locale);
      assert.equal(novoCopy[locale].goals.vat, vat[locale], locale);
    }
    const all = [...strings(full), ...products.flatMap((product) => locales.flatMap((locale) => [...strings(getProductCopy(product.id, locale)), localize(product.priceQualifier, locale)]))];
    for (const text of all) {
      assert.doesNotMatch(text, /\bNFC\b/, text);
      assert.doesNotMatch(text, /IVA incluído|IVA incluido|IVA inclusa|TVA comprise|TTC|inkl\.? MwSt|incl\.? VAT|including VAT|VAT included/i, text);
    }
  });
});

describe("home goals (owner, 2026-10-20)", () => {
  it("shows equal product cards per goal, with «Conhecer …» for each product, and no demo illustration", () => {
    assert.deepEqual(goals.pt.map((goal) => goal.id), ["found", "full", "sell", "return", "custom"]);
    for (const locale of locales) {
      for (const goal of goals[locale]) {
        for (const product of goal.products) {
          assert.ok(product.benefit, `${locale} ${goal.id} ${product.id}`);
          assert.ok(localize(goalCtas[product.id], locale));
        }
      }
    }
    for (const id of Object.keys(goalCtas)) assert.match(goalCtas[id].pt, /^Conhecer /);
    const component = readFileSync("src/components/novo/Goals.tsx", "utf8");
    assert.doesNotMatch(component, /PhoneVideo|setTimeout|ADVANCE|Demo\(/);
    assert.equal(existsSync("src/components/novo/PhoneVideo.tsx"), false);
    for (const asset of ["menu-grelha.mp4", "dolci-landing.mp4"]) assert.equal(existsSync(join("public/home", asset)), false, asset);
  });
});

describe("language picker", () => {
  it("is a button with a listbox of the six flags, in the header", () => {
    const picker = readFileSync("src/components/site/LanguagePicker.tsx", "utf8");
    assert.match(picker, /aria-haspopup="listbox"/);
    assert.match(picker, /role="option"/);
    assert.match(picker, /LanguageFlag/);
    assert.match(picker, /switchLocalePath/);
    assert.match(picker, /h-11 w-11/);
    assert.match(readFileSync("src/components/site/Header.tsx", "utf8"), /<LanguagePicker/);
    assert.ok(!readdirSync("src/components/site").includes("LanguageSwitch.tsx"));
  });
});
