import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { briefDetails, briefRows, cartNeedsBrief, parseBrief } from "../src/lib/cart/brief.ts";
import { maxQuantityFor, priceCart, sanitizeLines } from "../src/lib/cart/pricing.ts";

const complete = {
  webBusiness: "  Barbearia com 3 cadeiras em Évora  ",
  webGoal: "book",
  webPages: "Início, Serviços, Equipa, Contactos",
  webSite: "",
  webDomain: "new",
  webContent: "partial",
  webDeadline: "Antes do verão",
  webReferences: "",
};

describe("web products in the cart", () => {
  it("keeps a website project at quantity 1", () => {
    const lines = sanitizeLines([
      { id: "a", productId: "website", quantity: 3 },
      { id: "b", productId: "online-shop", quantity: 2 },
      { id: "c", productId: "landing-page", quantity: 1 },
    ]);
    assert.deepEqual(
      lines.map((line) => line.quantity),
      [1, 1, 1],
    );
  });

  it("locks every project product, but not plates or monthly products", () => {
    assert.equal(maxQuantityFor("landing-page"), 1);
    assert.equal(maxQuantityFor("automation"), 1);
    assert.equal(maxQuantityFor("nfc-google-reviews"), 99);
    assert.equal(maxQuantityFor("bookings"), 99);
    assert.equal(sanitizeLines([{ id: "p", productId: "nfc-social", quantity: 4 }])[0].quantity, 4);
  });

  it("prices the web products as one-off «desde» amounts before VAT", () => {
    const { oneTime, monthly } = priceCart(sanitizeLines([{ id: "w", productId: "website", quantity: 1 }, { id: "s", productId: "online-shop", quantity: 1 }]));
    assert.equal(oneTime.subtotalCents, 35000 + 149000);
    assert.equal(oneTime.vatCents, Math.round((184000 * 23) / 100));
    assert.equal(monthly.lines.length, 0);
  });

  it("asks for the brief only when a web product is in the cart", () => {
    assert.equal(cartNeedsBrief([{ productId: "nfc-menu" }, { productId: "bookings" }]), false);
    assert.equal(cartNeedsBrief([{ productId: "nfc-menu" }, { productId: "landing-page" }]), true);
    assert.equal(cartNeedsBrief([{ productId: "automation" }]), false);
  });
});

describe("web brief validation", () => {
  it("accepts a brief and trims the answers", () => {
    const result = parseBrief(complete);
    assert.equal(result.ok, true);
    assert.equal(result.brief.business, "Barbearia com 3 cadeiras em Évora");
    assert.equal(result.brief.site, null);
    assert.equal(result.brief.domain, "new");
  });

  it("requires only the business and the main goal", () => {
    assert.deepEqual(parseBrief({}), { ok: false, fields: ["webBusiness", "webGoal"] });
    assert.deepEqual(parseBrief({ webBusiness: "ok", webGoal: "book" }), { ok: false, fields: ["webBusiness"] });
    assert.deepEqual(parseBrief({ webBusiness: "Clínica dentária", webGoal: "sell-everything" }), { ok: false, fields: ["webGoal"] });
    assert.equal(parseBrief({ webBusiness: "Clínica dentária", webGoal: "quote" }).ok, true);
  });

  it("drops unknown choices and cuts long answers", () => {
    const result = parseBrief({ ...complete, webDomain: "maybe", webContent: "<script>", webReferences: "x".repeat(5000) });
    assert.equal(result.brief.domain, null);
    assert.equal(result.brief.content, null);
    assert.equal(result.brief.references.length, 600);
  });
});

describe("web brief in the order emails", () => {
  const { brief } = parseBrief(complete);

  it("lists the answered questions in form order, with readable choices (pt)", () => {
    assert.deepEqual(briefRows(brief, "pt"), [
      { label: "Negócio", value: "Barbearia com 3 cadeiras em Évora" },
      { label: "Objetivo principal", value: "Reservar ou marcar" },
      { label: "Páginas / produtos", value: "Início, Serviços, Equipa, Contactos" },
      { label: "Domínio", value: "Ainda não tenho: quero ajuda a registar" },
      { label: "Conteúdos", value: "Tenho uma parte (ex.: logótipo e fotos, sem textos)" },
      { label: "Prazo", value: "Antes do verão" },
    ]);
  });

  it("uses the customer's language for the confirmation", () => {
    const rows = briefRows(brief, "en");
    assert.equal(rows[0].label, "Business");
    assert.equal(rows[1].value, "Book an appointment or table");
  });

  it("stores the brief as detail lines on the order", () => {
    const details = briefDetails(brief);
    assert.equal(details[0], "Briefing web:");
    assert.equal(details[1], "Negócio: Barbearia com 3 cadeiras em Évora");
    assert.equal(details.length, 7);
  });
});
