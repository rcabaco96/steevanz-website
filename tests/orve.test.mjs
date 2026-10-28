import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { site } from "../src/lib/site.ts";
import {
  orveAlternates,
  orveDomainSegment,
  orveHref,
  orveLocaleFromPathname,
  orveLocales,
  orveSitemapEntries,
  orveStaticParams,
  resolveOrvePath,
} from "../src/content/orve/routes.ts";
import { orveCopy } from "../src/content/orve/copy.ts";
import { orve, orveDuration, orvePhoneDisplay, orvePhotos, orvePrice, orveWhatsappHref } from "../src/content/orve/facts.ts";

// Orvé: a FICTIONAL beauty atelier, Steevanz's showcase site for beauty businesses (owner, 2026-10-23), in the six
// languages of the Steevanz site, with Steevanz's own phone and WhatsApp (owner, 2026-10-24).

const nbsp = " ";

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("Orvé: preview path (src/lib/client-sites.ts)", () => {
  it("is registered as a client site without a domain", () => {
    const entry = clientSites.find((s) => s.id === "orve");
    assert.ok(entry);
    assert.equal(entry.base, "/orve");
    assert.deepEqual(entry.hosts, []);
    assert.equal(orveDomainSegment, domainSegment);
  });

  it("keeps the preview out of search engines and leaves steevanz.com alone", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve"), { kind: "noindex", site: "orve" });
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve/de"), { kind: "noindex", site: "orve" });
    assert.equal(routeClientSite("www.steevanz.com", "/orvex"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve/dominio"), { kind: "redirect", site: "orve", path: "/orve" });
    assert.deepEqual(routeClientSite("www.steevanz.com", "/orve/dominio/fr"), { kind: "redirect", site: "orve", path: "/orve/fr" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/orve",\s*"\/orve\/:path\*"/);
  });

  it("resolves the six languages in both variants and nothing else", () => {
    assert.deepEqual([...orveLocales], ["pt", "en", "es", "fr", "de", "it"]);
    assert.deepEqual(resolveOrvePath(undefined), { mode: "preview", locale: "pt" });
    assert.deepEqual(resolveOrvePath(["dominio"]), { mode: "domain", locale: "pt" });
    assert.deepEqual(resolveOrvePath(["en"]), { mode: "preview", locale: "en" });
    assert.deepEqual(resolveOrvePath(["dominio", "de"]), { mode: "domain", locale: "de" });
    assert.equal(resolveOrvePath(["pt"]), null);
    assert.equal(resolveOrvePath(["en", "x"]), null);
    assert.equal(resolveOrvePath(["dominio", "x"]), null);
    assert.equal(orveStaticParams().length, 12);
    assert.equal(orveHref("preview"), "/orve");
    assert.equal(orveHref("preview", "it"), "/orve/it");
    assert.equal(orveHref("domain", "fr"), "/fr");
    assert.equal(orveLocaleFromPathname("/orve/de/x"), "de");
    assert.equal(orveLocaleFromPathname("/orve/xx"), "pt");
    assert.equal(orveLocaleFromPathname("/dominio/es"), "es");
  });

  it("lists every language in the hreflang alternates and the sitemap", () => {
    assert.deepEqual(orveAlternates(), {
      "pt-PT": "https://www.steevanz.com/orve",
      en: "https://www.steevanz.com/orve/en",
      es: "https://www.steevanz.com/orve/es",
      fr: "https://www.steevanz.com/orve/fr",
      de: "https://www.steevanz.com/orve/de",
      it: "https://www.steevanz.com/orve/it",
      "x-default": "https://www.steevanz.com/orve",
    });
    const entries = orveSitemapEntries();
    assert.equal(entries.length, 6);
    assert.deepEqual(
      entries.map((e) => e.url),
      Object.values(orveAlternates()).slice(0, 6),
    );
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /orve/i, file);
    }
  });
});

describe("Orvé: owner's rules", () => {
  const files = [...filesUnder("src/components/clients/orve"), ...filesUnder("src/content/orve"), ...filesUnder("src/app/(clientes)/orve")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never shows ratings, reviews, testimonials or numbers of customers", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|★|⭐|testemunho|clientes satisfeit/i, path);
    }
    // No percentages or promised results in the texts (the CSS has percentages of its own).
    const texts = JSON.stringify(orveCopy, (key, value) => (key === "focus" ? undefined : value));
    assert.doesNotMatch(texts, /\d+\s*%|garantid|guarantee|garanti|garantiert/i);
  });

  it("shows every price without VAT, with «+ IVA» in each language, and never a VAT-inclusive amount", () => {
    const plusVat = { pt: "+ IVA", en: "+ VAT", es: "+ IVA", fr: "+ TVA", de: "zzgl. MwSt.", it: "+ IVA" };
    const without = { pt: /sem IVA/, en: /exclude VAT/, es: /sin IVA/, fr: /hors TVA/, de: /ohne MwSt\./, it: /IVA esclusa/ };
    for (const locale of orveLocales) {
      assert.equal(orveCopy[locale].rituals.plusVat, plusVat[locale], locale);
      assert.match(orveCopy[locale].rituals.vatNote, without[locale], locale);
    }
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /com IVA|IVA incluído|IVA \(23|23\s*%|incl\.? VAT|VAT included|inkl\.? MwSt|\bTTC\b|IVA inclus|con IVA|IVA incluido/i, path);
    }
    for (const ritual of orveCopy.pt.rituals.list) {
      for (const t of ritual.treatments) {
        assert.ok(Number.isInteger(t.price) && t.price > 0, t.name);
        assert.ok(t.minutes > 0, t.name);
      }
    }
    assert.equal(orvePrice(48), `48${nbsp}€`);
    assert.equal(orvePrice(48, "en"), "€48");
    assert.equal(orvePrice(48, "de"), `48${nbsp}€`);
    assert.equal(orveDuration(75), `1${nbsp}h${nbsp}15`);
    assert.equal(orveDuration(75, "en"), `75${nbsp}min`);
    assert.equal(orveDuration(75, "de"), `75${nbsp}Min.`);
  });

  it("has every text in all six languages, with the same prices, minutes and pictures", () => {
    const shape = (value) =>
      Array.isArray(value)
        ? value.map(shape)
        : value && typeof value === "object"
          ? Object.fromEntries(
              Object.keys(value)
                .sort()
                .map((k) => [k, shape(value[k])]),
            )
          : typeof value;
    const pt = orveCopy.pt;
    for (const locale of orveLocales) {
      const copy = orveCopy[locale];
      assert.equal(copy.locale, locale);
      // Same keys everywhere (the treatments' notes and the FAQ may differ only in wording).
      assert.deepEqual(shape({ ...copy, faq: null }), shape({ ...pt, faq: null }), locale);
      assert.equal(copy.faq.items.length, pt.faq.items.length, locale);
      copy.rituals.list.forEach((ritual, i) => {
        assert.equal(ritual.image, pt.rituals.list[i].image);
        assert.deepEqual(
          ritual.treatments.map((t) => [t.minutes, t.price]),
          pt.rituals.list[i].treatments.map((t) => [t.minutes, t.price]),
          `${locale} ${ritual.id}`,
        );
      });
      assert.deepEqual(
        copy.journey.steps.map((s) => s.minutes),
        [5, 15, 30, 10],
      );
      assert.equal(copy.visit.hoursDays.length, orve.hours.length, locale);
      // Every string is filled in.
      JSON.stringify(copy, (key, value) => {
        if (typeof value === "string") assert.ok(value.trim().length > 0, `${locale} ${key}`);
        return value;
      });
    }
    // The other languages are really translated (no Portuguese left behind).
    for (const locale of orveLocales.filter((l) => l !== "pt")) {
      for (const pick of [(c) => c.hero.title, (c) => c.booking.intro, (c) => c.faq.items[3].a, (c) => c.visit.hoursDays[0], (c) => c.notFound.title]) {
        assert.notEqual(pick(orveCopy[locale]), pick(pt), locale);
      }
    }
  });

  it("never writes «NFC», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54|#34b7f1|bg-green|text-green/i, path);
    }
  });

  it("has no pause button on the strip", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /pausar|aria-label="(pause|play)/i, path);
  });

  it("says it is a fictional business in every language", () => {
    const fictional = { pt: /fictíci/, en: /fictional/i, es: /ficticio/i, fr: /fictive/i, de: /fiktiv/i, it: /immaginari/i };
    for (const locale of orveLocales) {
      const copy = orveCopy[locale];
      for (const text of [copy.demo, copy.footer.fictional, copy.team.note, copy.rituals.demoNote]) assert.match(text, fictional[locale], locale);
      assert.match(copy.footer.fictional, /Steevanz/, locale);
      assert.match(copy.booking.demoNote, /Steevanz/, locale);
    }
  });

  it("puts Steevanz's phone and WhatsApp on the demo, and the booking message says it is a test (owner, 2026-10-24)", () => {
    assert.equal(orve.phoneHref, site.phoneHref);
    assert.equal(orve.whatsappNumber, site.whatsappNumber);
    assert.equal(orve.phoneDisplayIntl, site.phoneDisplay);
    assert.equal(orvePhoneDisplay("pt"), "961 292 679");
    assert.equal(orvePhoneDisplay("de"), "+351 961 292 679");
    assert.match(orveWhatsappHref("Olá"), /^https:\/\/wa\.me\/351961292679\?text=Ol%C3%A1$/);
    assert.ok(orveCopy.pt.booking.message.startsWith("Olá! Estou a experimentar o site de demonstração Orvé."));
    const demo = { pt: /demonstração Orvé/, en: /Orvé demo website/, es: /demostración Orvé/, fr: /démonstration Orvé/, de: /Demo-Website von Orvé/, it: /dimostrativo Orvé/ };
    for (const locale of orveLocales) {
      const { message, messageName, summaryWhen } = orveCopy[locale].booking;
      assert.match(message, demo[locale], locale);
      for (const slot of ["{nome}", "{ritual}", "{dia}", "{hora}"]) assert.ok(message.includes(slot), `${locale} ${slot}`);
      assert.ok(messageName.includes("{nome}"), locale);
      assert.ok(summaryWhen.includes("{dia}") && summaryWhen.includes("{hora}"), locale);
    }
    // No placeholder number left anywhere.
    for (const { path, text } of files) assert.doesNotMatch(text, /900 ?000 ?000|orve\.example/, path);
  });

  it("uses only its own media files, with their licences written down", () => {
    const paths = [...Object.values(orve.media), ...Object.values(orvePhotos).map((p) => p.src)];
    for (const src of paths) {
      assert.ok(src.startsWith("/media/clients/orve/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    const licences = readFileSync("public/media/clients/orve/LICENCAS.txt", "utf8");
    for (const src of paths) {
      const file = src.split("/").pop();
      assert.ok(licences.includes(file), `LICENCAS.txt names ${file}`);
    }
  });
});
