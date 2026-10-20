import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { legalDocuments } from "../src/content/legal.ts";

// Owner, 2026-10-20 (absolute): «nunca mostramos preços com IVA». No customer-facing text in pt, en, es,
// fr or de may say that prices or totals are shown with VAT included (Italian is checked by its own pass).
const vatInclusive = [
  /com IVA|IVA incluíd|c\/ IVA/i,
  /(price|prices|total|totals|amount|amounts)( shown| displayed)? (with|incl\.?|including) VAT|VAT[- ]inclusive|VAT included|incl\.? VAT|including VAT/i,
  /\b(precios?|total|importes?) con IVA|IVA incluid/i,
  /\b(prix|total|montants?)( affichés?)? avec (la )?TVA|TVA (comprise|incluse)|\bTTC\b/i,
  /\b(Preise?|Gesamtbetrag|Betrag|Beträge) (mit|inkl\.?|einschließlich) MwSt|inkl\.? MwSt|MwSt\.? inklusive/i,
];

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

/** The source without its comments (they explain the rule and may name what is forbidden). */
function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

describe("VAT wording (owner, 2026-10-20)", () => {
  it("never says prices are shown with VAT in the site's content, pages, components or emails", () => {
    for (const path of ["src/content", "src/components", "src/app", "src/lib"].flatMap(files)) {
      const lines = withoutComments(readFileSync(path, "utf8")).split(/\r?\n/);
      lines.forEach((line, index) => {
        for (const pattern of vatInclusive) assert.doesNotMatch(line, pattern, `${path}:${index + 1}`);
      });
    }
  });

  it("states in the terms that site orders are requests, not paid online, confirmed by a proposal without VAT", () => {
    const point1 = {
      pt: [/não são pagos online/, /proposta escrita/, /sem IVA, ao qual acresce o IVA à taxa legal/, /aceitação da proposta/],
      en: [/not paid online/, /written proposal/, /excluding VAT, with VAT added at the legal rate/, /proposal is accepted/],
      es: [/no se pagan en línea/, /propuesta por escrito/, /sin IVA, al que se suma el IVA al tipo legal/, /aceptación de la propuesta/],
      fr: [/ne sont pas payées en ligne/, /proposition écrite/, /hors TVA, la TVA s'y ajoutant au taux légal/, /acceptation de la proposition/],
      de: [/nicht online bezahlt/, /schriftlichen Angebot/, /ohne MwSt\.; die MwSt\. kommt zum geltenden gesetzlichen Satz hinzu/, /Annahme des Angebots/],
    };
    for (const [locale, patterns] of Object.entries(point1)) {
      const text = legalDocuments.terms[locale].sections[0].paragraphs.join(" ");
      for (const pattern of patterns) assert.match(text, pattern, `terms.${locale}`);
      assert.doesNotMatch(text, /Não é possível comprar|cannot be bought|No es posible comprar|n'est pas possible d'acheter|nicht direkt gekauft/, `terms.${locale}`);
    }
    const date = { pt: /20 de outubro de 2026/, en: /20 October 2026/, es: /20 de octubre de 2026/, fr: /20 octobre 2026/, de: /20\. Oktober 2026/ };
    for (const [locale, pattern] of Object.entries(date)) assert.match(legalDocuments.terms[locale].updated, pattern, `terms.${locale} date`);
  });
});
