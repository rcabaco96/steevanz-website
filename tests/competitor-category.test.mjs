import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categoryMatch, meaningfulStems, narrowerSearch, normalizeCategory } from "../src/lib/reviews/competitor-category.ts";

const known = (category) => ({ category, name: "X", fromCategorySearch: true });

describe("competitor categories (rule 5)", () => {
  it("ignores case, accents and generic words", () => {
    assert.equal(normalizeCategory("Clínica Veterinária"), "clinica veterinaria");
    assert.deepEqual([...meaningfulStems("Restaurante de doner kebab")], ["doner", "kebab"]);
    assert.deepEqual([...meaningfulStems("Restaurante")], []);
    assert.deepEqual([...meaningfulStems("Bar e café")], []);
  });

  it("a kebab place: kebab places only, never any restaurant", () => {
    const own = "Restaurante de doner kebab";
    assert.equal(categoryMatch(own, known("Restaurante de doner kebab")), "same");
    assert.equal(categoryMatch(own, known("restaurante de DÖNER kebab")), "same");
    assert.equal(categoryMatch(own, known("Restaurante de kebab")), "similar");
    assert.equal(categoryMatch(own, known("Kebab")), "similar");
    assert.equal(categoryMatch(own, known("Restaurante")), null);
    assert.equal(categoryMatch(own, known("Restaurante português")), null);
    assert.equal(categoryMatch(own, known("Marisqueira")), null);
    assert.equal(categoryMatch(own, known("Pizzaria")), null);
  });

  it("unknown category: only from the category search and with a name that shares a word", () => {
    const own = "Restaurante de doner kebab";
    assert.equal(categoryMatch(own, { category: null, name: "Vento Kebab Pizza", fromCategorySearch: true }), "name");
    assert.equal(categoryMatch(own, { category: null, name: "Vento Kebab Pizza", fromCategorySearch: false }), null);
    assert.equal(categoryMatch(own, { category: null, name: "Olivalmar", fromCategorySearch: true }), null);
    assert.equal(categoryMatch(own, { category: "", name: "Restaurante Ocean", fromCategorySearch: true }), null);
  });

  it("a barber: barber shops, not hairdressers", () => {
    const own = "Barbearia";
    assert.equal(categoryMatch(own, known("Barbearia")), "same");
    assert.equal(categoryMatch(own, known("Barber shop")), "similar");
    assert.equal(categoryMatch(own, known("Barbeiro")), "similar");
    assert.equal(categoryMatch(own, known("Cabeleireiro")), null);
    assert.equal(categoryMatch(own, known("Salão de beleza")), null);
  });

  it("a vet: veterinary clinics and hospitals, not pet shops", () => {
    const own = "Veterinário";
    assert.equal(categoryMatch(own, known("veterinario")), "same");
    assert.equal(categoryMatch(own, known("Clínica veterinária")), "similar");
    assert.equal(categoryMatch(own, known("Hospital veterinário")), "similar");
    assert.equal(categoryMatch(own, known("Loja de animais")), null);
    assert.equal(categoryMatch(own, known("Clínica dentária")), null);
  });

  it("a generic restaurant: the same category only", () => {
    const own = "Restaurante";
    assert.equal(categoryMatch(own, known("Restaurante")), "same");
    assert.equal(categoryMatch(own, known("Restaurante português")), null);
    assert.equal(categoryMatch(own, known("Restaurante de kebab")), null);
    assert.equal(categoryMatch(own, { category: null, name: "Restaurante Ocean", fromCategorySearch: true }), null);
  });

  it("searches again with the meaningful words only, never a generic word", () => {
    assert.equal(narrowerSearch("Restaurante de doner kebab"), "doner kebab");
    assert.equal(narrowerSearch("Clínica veterinária"), "veterinária");
    assert.equal(narrowerSearch("Restaurante"), null);
    assert.equal(narrowerSearch("Marisqueira"), null);
  });
});
