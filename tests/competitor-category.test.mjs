import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  categoryMatch,
  categorySearches,
  customerKinds,
  familiesOf,
  meaningfulStems,
  nameHintFamilies,
  narrowerSearch,
  normalizeCategory,
  similarCategories,
} from "../src/lib/reviews/competitor-category.ts";

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
    assert.equal(narrowerSearch("Centro de bem-estar"), null);
  });

  it("a shared word is not enough when both categories say something the other does not", () => {
    assert.equal(similarCategories("Treinador pessoal", "Treinador de animais de estimação"), false);
    assert.equal(similarCategories("Restaurante de doner kebab", "Restaurante de kebab"), true);
    assert.equal(similarCategories("Restaurante de kebab", "Restaurante de doner kebab"), true);
    assert.equal(similarCategories("Estúdio de tatuagem", "Estúdio de fotografia"), false);
    assert.equal(similarCategories("Restaurante", "Restaurante português"), false);
  });

  it("Urban Gym (main category «Treinador pessoal», a gym by name): gyms and personal trainers, never a pet trainer", () => {
    const urban = customerKinds(["Treinador Pessoal"], "Urban Gym Health Club");
    assert.deepEqual(urban.families, ["fitness"]);
    assert.equal(categoryMatch(urban, known("Treinador pessoal")), "same");
    assert.equal(categoryMatch(urban, known("Ginásio")), "similar");
    assert.equal(categoryMatch(urban, known("Health club")), "similar");
    assert.equal(categoryMatch(urban, known("Centro de fitness")), "similar");
    assert.equal(categoryMatch(urban, known("Fitness center")), "similar");
    assert.equal(categoryMatch(urban, known("Box de CrossFit")), "similar");
    assert.equal(categoryMatch(urban, known("Treinador de animais de estimação")), null);
    assert.equal(categoryMatch(urban, known("Estúdio de pilates")), null);
    assert.equal(categoryMatch(urban, known("Loja de equipamento de fitness")), null);
    assert.equal(categoryMatch(urban, { category: null, name: "Fitness Hut Albufeira", fromCategorySearch: true }), "name");
    assert.deepEqual(categorySearches(urban), ["Treinador Pessoal", "Ginásio"]);
  });

  it("a gym without the name hint: the fitness family comes from its own category", () => {
    assert.equal(categoryMatch("Ginásio", known("Treinador pessoal")), "similar");
    assert.equal(categoryMatch("Ginásio", known("Health club")), "similar");
    assert.equal(categoryMatch("Treinador pessoal", known("Treinador de animais de estimação")), null);
  });

  it("all the customer's categories count, the secondary ones too", () => {
    const own = customerKinds(["Restaurante", "Restaurante de sushi"], "Sakura");
    assert.equal(categoryMatch(own, known("Restaurante")), "same");
    assert.equal(categoryMatch(own, known("Restaurante de sushi")), "same");
    assert.equal(categoryMatch(own, known("Restaurante japonês")), "similar");
    assert.equal(categoryMatch(own, known("Restaurante português")), null);
    assert.deepEqual(categorySearches(own), ["Restaurante", "Restaurante de sushi"]);
  });

  it("searches: main first, then the family the name names, then secondary categories; at most 3, no repeats", () => {
    const kebab = customerKinds(["Restaurante de doner kebab", "Restaurante de doner kebab", "Restaurante halal", "Pizaria"], "King Kebab");
    assert.deepEqual(kebab.categories, ["Restaurante de doner kebab", "Restaurante halal", "Pizaria"]);
    assert.deepEqual(categorySearches(kebab), ["Restaurante de doner kebab", "Restaurante de kebab", "Restaurante halal"]);
    assert.deepEqual(categorySearches(customerKinds(["Ginásio"], "Urban Gym")), ["Ginásio"]);
  });

  it("the customer's name only counts when it clearly names the trade", () => {
    assert.deepEqual(nameHintFamilies("Urban Gym Health Club"), ["fitness"]);
    assert.deepEqual(nameHintFamilies("Momentum Fitness Studio"), ["fitness"]);
    assert.deepEqual(nameHintFamilies("King Kebab Armação Pêra"), ["kebab"]);
    assert.deepEqual(nameHintFamilies("Barbearia do Zé"), ["barber"]);
    assert.deepEqual(nameHintFamilies("Gymnasium Bar"), []);
    assert.deepEqual(nameHintFamilies("400 Degrees Restaurante Italiano"), []);
    // "Centro de bem-estar" alone says nothing; the name says it is a gym.
    const momentum = customerKinds(["Centro de bem-estar"], "Momentum Fitness Studio");
    assert.equal(categoryMatch(momentum, known("Ginásio")), "similar");
    assert.equal(categoryMatch(momentum, known("Centro de bem-estar")), "same");
    assert.equal(categoryMatch(momentum, known("Centro de estética")), null);
    assert.equal(categoryMatch(momentum, { category: null, name: "Centro de Bem Estar Animal", fromCategorySearch: true }), null);
  });

  it("barbers and hairdressers: men's hairdressers with barbers, hair salons apart", () => {
    assert.equal(categoryMatch("Barbearia", known("Cabeleireiro para homem")), "similar");
    assert.equal(categoryMatch("Barbearia", known("Hair salon")), null);
    assert.equal(categoryMatch("Cabeleireiro", known("Salão de beleza")), "similar");
    assert.equal(categoryMatch("Cabeleireiro", known("Hair salon")), "similar");
    assert.equal(categoryMatch("Cabeleireiro", known("Barbearia")), null);
    assert.equal(categoryMatch("Cabeleireiro", known("Centro de estética")), null);
    assert.equal(categoryMatch(customerKinds(["Cabeleireiro"], "Barbearia Clássica"), known("Barbearia")), "similar");
  });

  it("families: dentists, pizza places, vets, real estate, bakeries", () => {
    assert.deepEqual(familiesOf("Centro de fitness"), ["fitness"]);
    assert.deepEqual(familiesOf("Restaurante"), []);
    assert.equal(categoryMatch("Dentista", known("Clínica dentária")), "similar");
    assert.equal(categoryMatch("Pizaria", known("Pizzaria")), "similar");
    assert.equal(categoryMatch("Pizaria", known("Restaurante italiano")), null);
    assert.equal(categoryMatch("Veterinário", known("Animal hospital")), "similar");
    assert.equal(categoryMatch("Imobiliária", known("Real estate agency")), "similar");
    assert.equal(categoryMatch("Pastelaria", known("Padaria")), "similar");
    assert.equal(categoryMatch("Pastelaria", known("Café")), null);
  });
});
