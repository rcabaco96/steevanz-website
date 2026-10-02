export type ThemeId = "service" | "quality" | "price" | "waiting" | "cleanliness" | "ambience" | "location";

export const themeIds: ThemeId[] = ["service", "quality", "price", "waiting", "cleanliness", "ambience", "location"];

const themePatterns: Record<ThemeId, RegExp> = {
  service:
    /\b(atendiment\w*|atencios\w*|simpati\w*|antipati\w*|empregad\w*|funcionari\w*|staff|equipa|servi[cç]o|profissiona\w*|acolhiment\w*|educad\w*|mal[ -]educad\w*|rude|friendly|service|waiter\w*|waitress\w*|helpful)\b/,
  quality:
    /\b(comida|prat\w+|sabor\w*|delicios\w*|qualidade|frescos?|frescas?|bolos?|pasteis|pastel|cafe|caf[eé]s|tostas?|refei[cç]\w+|food|tasty|delicious|quality|fresh|coffee|meal)\b/,
  price: /\b(pre[cç]os?|caros?|caras?|barat\w*|conta|valor|pagar|pre[cç]o[- ]qualidade|price\w*|expensive|cheap|value|overpriced)\b/,
  waiting: /\b(espera\w*|esperar|demor\w*|rapid\w*|r[aá]pid\w*|lent\w*|filas?|minutos|wait\w*|slow|quick\w*|fast)\b/,
  cleanliness: /\b(limp\w*|suj\w*|higiene|wc|casa de banho|clean\w*|dirty|hygien\w*)\b/,
  ambience: /\b(ambiente|espa[cç]o|decora[cç]\w*|acolhedor\w*|barulh\w*|m[uú]sica|esplanada|confort\w*|atmospher\w*|cozy|cosy|noisy|vibe)\b/,
  location: /\b(localiza[cç]\w*|estacion\w*|parque|acesso|centro|perto|location|parking|located)\b/,
};

const stopwords = new Set(
  (
    "para pela pelo pelas pelos como mais muito muita muitos muitas mesmo esta este estes estas isto isso aquilo " +
    "sempre tudo todos todas onde quando porque pois que qual quem cada outra outro outros outras sobre entre " +
    "depois antes ainda tambem também nada nunca algum alguma alguns algumas tenho temos tinha foram fomos " +
    "estava estavam estar estou somos sera será seria ser sido sao são tem tém vez vezes aqui ali local sitio " +
    "sítio casa fica ficou ficamos vamos voltar voltaremos recomendo recomendado bem bom boa bons boas otimo " +
    "ótimo otima ótima excelente muito pouco nao não sim hora horas veio vieram saem sentimo-nos sentimos dia dias " +
    "with that this they were have very from just there " +
    "their what about would could really place good great nice best also only been will your more than"
  )
    .split(" ")
    .map((word) => normalize(word).trim()),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ");
}

export function themesIn(text: string | null): ThemeId[] {
  if (!text) return [];
  const value = normalize(text);
  return themeIds.filter((theme) => themePatterns[theme].test(value));
}

export interface WordToken {
  key: string;
  surface: string;
}

/** Distinct meaningful words, keyed without accents but keeping the original spelling for display. */
export function significantWords(text: string | null): WordToken[] {
  if (!text) return [];
  const tokens = new Map<string, string>();
  for (const raw of text.toLowerCase().split(/[^\p{L}\p{N}-]+/u)) {
    const surface = raw.replace(/^-+|-+$/g, "");
    const key = normalize(surface).trim();
    if (key.length < 4 || stopwords.has(key) || /^\d+$/.test(key) || tokens.has(key)) continue;
    tokens.set(key, surface);
  }
  return [...tokens].map(([key, surface]) => ({ key, surface }));
}

/** The sentences of a review that mention a theme, so the dashboard can quote what customers said. */
export function themeSentences(text: string | null, theme: ThemeId): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && themePatterns[theme].test(normalize(sentence)));
}
