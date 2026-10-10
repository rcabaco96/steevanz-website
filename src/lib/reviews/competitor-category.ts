/**
 * Business rule (regras-negocio-reviews, rule 5, owner 2026-10-09): a customer is only compared with
 * places of the same Google category, or of a very similar one: a "Restaurante de doner kebab" with
 * "Restaurante de kebab", never with any "Restaurante". Fewer than 30 competitors is fine; the list is
 * never padded with unrelated places. Pure module (tests in tests/competitor-category.test.mjs).
 *
 * Rule 3 (2026-10-10, «Urban Gym Health Club»: a gym whose main Google category is "Treinador
 * pessoal" got a pet trainer and no gym):
 * - all the customer's Google categories count (the main one and the secondary ones);
 * - small curated families of near-equivalent categories (a gym, a health club, a personal trainer);
 * - a shared word is not enough when both categories also say something the other does not
 *   ("Treinador pessoal" / "Treinador de animais de estimação");
 * - a customer whose own name names its trade ("Gym", "Barbearia", "Kebab") gets that family too.
 */

/**
 * Version of the selection rule. A list chosen with an older rule (review_businesses.competitors_rule_version;
 * null = 1, which filled up to 30 with the broader search; 2 = the main category only, any shared
 * word) is searched again by the reader.
 */
export const competitorRuleVersion = 3;

/** Words that say nothing about what a place does (Portuguese and English, without accents). */
const genericWords = new Set([
  "a", "o", "as", "os", "e", "de", "do", "da", "dos", "das", "em", "no", "na", "com", "para", "por", "ao",
  "the", "of", "and", "for", "in",
  "restaurante", "restaurantes", "restaurant", "restaurants", "bar", "bares", "cafe", "cafes", "coffee",
  "loja", "lojas", "store", "shop", "servico", "servicos", "service", "services", "empresa", "company",
  "casa", "centro", "center", "centre", "clinica", "clinic", "agencia", "agency", "local", "snack",
  // "Centro de bem-estar" says nothing about what is done there (a gym, a spa, a psychologist, a vet's
  // «bem-estar animal»): a customer with only that category is compared with that exact category.
  "bem", "estar",
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
const within = (a: Set<string>, b: Set<string>) => [...a].every((stem) => b.has(stem));
const sameStems = (a: Set<string>, b: Set<string>) => a.size === b.size && within(a, b);

/**
 * Two categories are very similar when they share a meaningful word and one says nothing the other
 * does not: "Restaurante de doner kebab" ~ "Restaurante de kebab" ~ "Kebab", "Veterinário" ~
 * "Hospital veterinário". Both with words of their own is another trade that happens to share a
 * word: "Treinador pessoal" ≁ "Treinador de animais de estimação".
 */
export function similarCategories(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = meaningfulStems(a);
  const right = meaningfulStems(b);
  return left.size > 0 && right.size > 0 && shares(left, right) && (within(left, right) || within(right, left));
}

/**
 * A family of Google categories a customer really chooses between (pt-PT and English labels, as
 * Google shows them in Portugal). A category belongs to a family when it is one of its labels,
 * ignoring case, accents and generic words ("Centro de fitness" = "Fitness center"). `search` is the
 * zone search for the family; `nameWords` are the words that, in the customer's own name, name the
 * trade ("Urban Gym").
 */
export interface CategoryFamily {
  id: string;
  search: string;
  labels: string[];
  nameWords: string[];
}

/** Conservative: a family only when a customer would pick one or the other. */
export const categoryFamilies: CategoryFamily[] = [
  {
    // Gyms, health clubs, CrossFit boxes and personal trainers. Not yoga, pilates, dance or martial
    // arts (another activity), nor fitness equipment shops.
    id: "fitness",
    search: "Ginásio",
    labels: [
      "Ginásio", "Gym", "Health club", "Clube de saúde", "Centro de fitness", "Fitness center", "Academia de ginástica",
      "Ginásio de CrossFit", "CrossFit", "Box de CrossFit", "Treinador pessoal", "Personal trainer",
      "Estúdio de treino personalizado", "Treino personalizado",
    ],
    nameWords: ["gym", "ginasio", "fitness", "crossfit", "health club"],
  },
  {
    // Barbers and men's hairdressers. A hair salon is another family (a barber is not a hairdresser).
    id: "barber",
    search: "Barbearia",
    labels: ["Barbearia", "Barber shop", "Barbeiro", "Cabeleireiro para homem", "Cabeleireiro masculino", "Men's hair salon"],
    nameWords: ["barbearia", "barber", "barbershop", "barbeiro", "barbeiros"],
  },
  {
    id: "hair",
    search: "Cabeleireiro",
    labels: ["Cabeleireiro", "Cabeleireira", "Salão de cabeleireiro", "Hair salon", "Hairdresser", "Salão de beleza", "Beauty salon"],
    nameWords: ["cabeleireiro", "cabeleireira", "cabeleireiros"],
  },
  {
    // Beauty treatments. Not aesthetic medicine clinics (medical), nor nail salons.
    id: "beauty",
    search: "Centro de estética",
    labels: ["Centro de estética", "Estética", "Esteticista", "Instituto de beleza", "Salão de beleza", "Beauty salon"],
    nameWords: ["estetica", "esteticista"],
  },
  {
    id: "vet",
    search: "Veterinário",
    labels: ["Veterinário", "Clínica veterinária", "Hospital veterinário", "Veterinarian", "Veterinary clinic", "Animal hospital", "Hospital para animais"],
    nameWords: ["veterinario", "veterinaria", "veterinarios"],
  },
  {
    id: "dentist",
    search: "Dentista",
    labels: ["Dentista", "Clínica dentária", "Clínica de medicina dentária", "Consultório dentário", "Dentist", "Dental clinic"],
    nameWords: ["dentista", "dentistas", "dental", "dentaria", "dentario"],
  },
  {
    id: "kebab",
    search: "Restaurante de kebab",
    labels: [
      "Restaurante de kebab", "Kebab", "Loja de kebab", "Kebab shop", "Restaurante de doner kebab", "Doner kebab restaurant",
      "Restaurante de shawarma", "Shawarma restaurant", "Shawarma",
    ],
    nameWords: ["kebab", "kebabs", "kebap", "doner", "donner", "shawarma"],
  },
  {
    // Google writes "Pizaria" in pt-PT.
    id: "pizza",
    search: "Pizaria",
    labels: ["Pizaria", "Pizzaria", "Pizzeria", "Restaurante de pizza", "Pizza restaurant", "Pizza para levar", "Pizza takeaway", "Entrega de pizza", "Pizza delivery"],
    nameWords: ["pizaria", "pizzaria", "pizzeria"],
  },
  {
    id: "sushi",
    search: "Restaurante de sushi",
    labels: ["Restaurante de sushi", "Sushi restaurant", "Sushi", "Sushi para levar", "Sushi takeaway", "Restaurante japonês", "Japanese restaurant"],
    nameWords: ["sushi"],
  },
  {
    id: "burger",
    search: "Hamburgueria",
    labels: ["Hamburgueria", "Restaurante de hambúrgueres", "Hamburger restaurant"],
    nameWords: ["hamburgueria"],
  },
  {
    // A café on its own is too broad (any coffee place): left out.
    id: "bakery",
    search: "Pastelaria",
    labels: ["Pastelaria", "Padaria", "Confeitaria", "Padaria e pastelaria", "Bakery", "Pastry shop"],
    nameWords: ["pastelaria", "padaria", "confeitaria"],
  },
  {
    // Small lodging. Hotels are left out (another kind of stay and price).
    id: "guesthouse",
    search: "Alojamento local",
    labels: ["Alojamento local", "Guest house", "Casa de hóspedes", "Pensão", "Bed & breakfast"],
    nameWords: ["guest house", "guesthouse", "alojamento local"],
  },
  {
    id: "realestate",
    search: "Imobiliária",
    labels: ["Imobiliária", "Agência imobiliária", "Agente imobiliário", "Consultor imobiliário", "Mediação imobiliária", "Real estate agency", "Real estate agent"],
    nameWords: ["imobiliaria", "imobiliario", "imoveis", "real estate"],
  },
];

const familyStems = categoryFamilies.map((family) => ({ id: family.id, stems: family.labels.map((label) => meaningfulStems(label)) }));

/** The families a Google category belongs to (none for most categories). */
export function familiesOf(category: string | null | undefined): string[] {
  const stems = meaningfulStems(category);
  if (!stems.size) return [];
  return familyStems.filter((family) => family.stems.some((label) => sameStems(label, stems))).map((family) => family.id);
}

/**
 * The families the customer's own name clearly names ("Urban Gym Health Club" → fitness, "King
 * Kebab" → kebab): whole words only, from a short list per family.
 */
export function nameHintFamilies(name: string | null | undefined): string[] {
  const text = ` ${normalizeCategory(name)} `;
  if (!text.trim()) return [];
  return categoryFamilies.filter((family) => family.nameWords.some((words) => text.includes(` ${words} `))).map((family) => family.id);
}

/** What the customer is, for the competitor choice. */
export interface CustomerKinds {
  /** Its Google categories, the main one first (deduplicated). */
  categories: string[];
  /** The families of any of its categories or of its name. */
  families: string[];
  /** The families its name names (searched before the secondary categories). */
  nameFamilies: string[];
}

export function customerKinds(categories: readonly (string | null | undefined)[], name?: string | null): CustomerKinds {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const category of categories) {
    const text = category?.trim();
    const key = normalizeCategory(text);
    if (!text || !key || seen.has(key)) continue;
    seen.add(key);
    list.push(text);
  }
  const nameFamilies = nameHintFamilies(name);
  const families = [...new Set([...list.flatMap((category) => familiesOf(category)), ...nameFamilies])];
  return { categories: list, families, nameFamilies };
}

export type CategoryMatch = "same" | "similar" | "name" | null;

/**
 * How a found place relates to the customer (its categories, or just one category):
 * - "same": one of the customer's Google categories (ignoring case and accents);
 * - "similar": a category of the same family as any of the customer's categories or its name, or very
 *   similar to one of its categories (similarCategories: "kebab", never "treinador" alone);
 * - "name": category unknown, but the place came from one of the customer's category searches and its
 *   name shares a meaningful word with a customer category or names one of its families
 *   ("Vento kebab pizza");
 * - null: anything else, left out. A category of only generic words ("Restaurante", "Bar") matches
 *   places of exactly that category only.
 */
export function categoryMatch(
  customer: string | CustomerKinds,
  place: { category: string | null | undefined; name: string | null | undefined; fromCategorySearch: boolean },
): CategoryMatch {
  const kinds = typeof customer === "string" ? customerKinds([customer]) : customer;
  const theirs = normalizeCategory(place.category);
  if (theirs) {
    if (kinds.categories.some((category) => normalizeCategory(category) === theirs)) return "same";
    if (familiesOf(place.category).some((family) => kinds.families.includes(family))) return "similar";
    return kinds.categories.some((category) => similarCategories(category, place.category)) ? "similar" : null;
  }
  if (!place.fromCategorySearch) return null;
  const nameStems = meaningfulStems(place.name);
  if (kinds.categories.some((category) => shares(meaningfulStems(category), nameStems))) return "name";
  return nameHintFamilies(place.name).some((family) => kinds.families.includes(family)) ? "name" : null;
}

/** Ranking of the matches: same category first, then similar, then the unknown ones matched by name. */
export const matchRank: Record<Exclude<CategoryMatch, null>, number> = { same: 0, similar: 1, name: 2 };

/** Zone searches by category in one competitor search (the narrower one comes on top). */
export const maxCategorySearches = 3;

/**
 * The category zone searches of a competitor search, at most 3, no repeats: the main category, the
 * family the customer's name names ("Ginásio" for "Urban Gym", whose main category is "Treinador
 * pessoal"), the secondary categories, then the families of its categories.
 */
export function categorySearches(kinds: CustomerKinds, max = maxCategorySearches): string[] {
  const searchOf = (id: string) => categoryFamilies.find((family) => family.id === id)?.search;
  const [main, ...secondary] = kinds.categories;
  const wanted = [main, ...kinds.nameFamilies.map(searchOf), ...secondary, ...kinds.families.map(searchOf)];
  const seen = new Set<string>();
  const searches: string[] = [];
  for (const text of wanted) {
    const key = normalizeCategory(text);
    if (!text || !key || seen.has(key)) continue;
    seen.add(key);
    searches.push(text);
    if (searches.length >= max) break;
  }
  return searches;
}

/** Whether a search text is one of the given searches (ignoring case and accents). */
export function isCategorySearch(searchString: string | null | undefined, searches: readonly string[]): boolean {
  const key = normalizeCategory(searchString);
  return !!key && searches.some((search) => normalizeCategory(search) === key);
}

/**
 * The extra zone search when the category searches found fewer than 30: the customer's meaningful
 * words ("doner kebab" for "Restaurante de doner kebab"), never a generic word like "Restaurante". Null
 * when there is nothing more specific to search (a generic category, or the same text again).
 */
export function narrowerSearch(customerCategory: string): string | null {
  const words = customerCategory.split(/\s+/).filter((word) => meaningfulStems(word).size > 0);
  const text = words.join(" ");
  return text && normalizeCategory(text) !== normalizeCategory(customerCategory) ? text : null;
}
