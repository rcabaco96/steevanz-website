/**
 * Business rule (regras-negocio-reviews, rule 5, owner 2026-10-09): a customer is only compared with
 * places of the same Google category, or of a very similar one (sharing a meaningful word): a
 * "Restaurante de doner kebab" with "Restaurante de kebab", never with any "Restaurante". Fewer than
 * 30 competitors is fine; the list is never padded with unrelated places. Pure module (tests in
 * tests/competitor-category.test.mjs).
 */

/**
 * Version of the selection rule. A list chosen with an older rule (review_businesses.competitors_rule_version,
 * null = 1, the rule that filled up to 30 with the broader search) is searched again by the reader.
 */
export const competitorRuleVersion = 2;

/** Words that say nothing about what a place does (Portuguese and English, without accents). */
const genericWords = new Set([
  "a", "o", "as", "os", "e", "de", "do", "da", "dos", "das", "em", "no", "na", "com", "para", "por", "ao",
  "the", "of", "and", "for", "in",
  "restaurante", "restaurantes", "restaurant", "restaurants", "bar", "bares", "cafe", "cafes", "coffee",
  "loja", "lojas", "store", "shop", "servico", "servicos", "service", "services", "empresa", "company",
  "casa", "centro", "center", "centre", "clinica", "clinic", "agencia", "agency", "local", "snack",
]);

/** Lower case, no accents, letters and digits only. */
export function normalizeCategory(text: string | null | undefined): string {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * The meaningful words of a category or a name, as stems: the first 5 letters, so "barbearia",
 * "barbeiro" and "barber" match, and "veterinário" / "veterinária" too. Words under 3 letters and
 * generic words (restaurante, de, bar, café, loja, serviço…) are left out.
 */
export function meaningfulStems(text: string | null | undefined): Set<string> {
  const stems = new Set<string>();
  for (const word of normalizeCategory(text).split(" ")) {
    if (word.length < 3 || genericWords.has(word) || /^\d+$/.test(word)) continue;
    stems.add(word.slice(0, 5));
  }
  return stems;
}

const shares = (a: Set<string>, b: Set<string>) => [...a].some((stem) => b.has(stem));

export type CategoryMatch = "same" | "similar" | "name" | null;

/**
 * How a found place relates to the customer's category:
 * - "same": the same Google category (ignoring case and accents);
 * - "similar": a known category sharing a meaningful word with the customer's ("kebab");
 * - "name": category unknown, but the place came from the search of the customer's own category and
 *   its name shares a meaningful word ("Vento kebab pizza");
 * - null: anything else, left out. A customer whose category is only generic words ("Restaurante",
 *   "Bar") is compared with places of exactly that category only.
 */
export function categoryMatch(
  customerCategory: string,
  place: { category: string | null | undefined; name: string | null | undefined; fromCategorySearch: boolean },
): CategoryMatch {
  const own = normalizeCategory(customerCategory);
  const theirs = normalizeCategory(place.category);
  if (own && theirs === own) return "same";
  const ownStems = meaningfulStems(customerCategory);
  if (!ownStems.size) return null;
  if (theirs) return shares(ownStems, meaningfulStems(place.category)) ? "similar" : null;
  return place.fromCategorySearch && shares(ownStems, meaningfulStems(place.name)) ? "name" : null;
}

/** Ranking of the matches: same category first, then similar, then the unknown ones matched by name. */
export const matchRank: Record<Exclude<CategoryMatch, null>, number> = { same: 0, similar: 1, name: 2 };

/**
 * The second zone search when the first found fewer than 30: the customer's meaningful words
 * ("doner kebab" for "Restaurante de doner kebab"), never a generic word like "Restaurante". Null
 * when there is nothing more specific to search (a generic category, or the same text again).
 */
export function narrowerSearch(customerCategory: string): string | null {
  const words = customerCategory
    .split(/\s+/)
    .filter((word) => {
      const plain = normalizeCategory(word);
      return plain.length >= 3 && !genericWords.has(plain) && !/^\d+$/.test(plain);
    });
  const text = words.join(" ");
  return text && normalizeCategory(text) !== normalizeCategory(customerCategory) ? text : null;
}
