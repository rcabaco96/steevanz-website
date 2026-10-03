/**
 * Replies built by rules, with no paid AI. A reply is assembled from sentences:
 * opening → one sentence per theme the review mentions → contact (negatives) → closing → signature.
 * Each sentence comes from the owner's own library (learned in "Treinar" and from edits) and,
 * while that library has nothing for the case, from the Steevanz base sentences below.
 * Pure module so it can be tested with node --test.
 */
import { isNegative } from "./analytics.ts";
import { normalize, themesByMention, type ThemeId } from "./text.ts";
import type { AddressForm, ReplySettings } from "./replies.ts";

export type SnippetKind = "opening" | "theme" | "contact" | "closing";
export type Sentiment = "positive" | "negative";

export interface Snippet {
  id: string;
  kind: SnippetKind;
  sentiment: Sentiment;
  theme: ThemeId | null;
  text: string;
  accepted: number;
  rejected: number;
}

/**
 * Base sentence. `{você|tu|sem tratamento}` picks a variant by the owner's address form; a
 * two-option group uses the first for "sem tratamento". `<contacto>` is the owner's contact.
 */
interface BaseSnippet {
  id: string;
  kind: SnippetKind;
  sentiment: Sentiment;
  theme?: ThemeId;
  tones?: string[];
  text: string;
}

export const themeNames: Record<ThemeId, string> = {
  service: "atendimento",
  quality: "qualidade",
  price: "preço",
  waiting: "espera",
  cleanliness: "limpeza",
  ambience: "ambiente",
  location: "localização",
};

const base: BaseSnippet[] = [
  // Openings, positive (by tone)
  { id: "op-p-1", kind: "opening", sentiment: "positive", tones: ["proximo"], text: "Muito obrigado pela {sua |tua |}review!" },
  { id: "op-p-2", kind: "opening", sentiment: "positive", tones: ["proximo"], text: "Obrigado por {partilhar|partilhares|partilhar} a {sua |tua |}experiência connosco!" },
  { id: "op-p-3", kind: "opening", sentiment: "positive", tones: ["profissional"], text: "Agradecemos a {sua |tua |}avaliação." },
  { id: "op-p-4", kind: "opening", sentiment: "positive", tones: ["profissional"], text: "Obrigado pelo tempo dedicado a esta avaliação." },
  { id: "op-p-5", kind: "opening", sentiment: "positive", tones: ["caloroso"], text: "Que alegria ler estas palavras!" },
  { id: "op-p-6", kind: "opening", sentiment: "positive", tones: ["caloroso"], text: "Ficámos de coração cheio com esta review!" },
  { id: "op-p-7", kind: "opening", sentiment: "positive", tones: ["divertido"], text: "Assim dá gosto!" },
  { id: "op-p-8", kind: "opening", sentiment: "positive", tones: ["divertido"], text: "Que review espetacular, obrigado!" },
  { id: "op-p-9", kind: "opening", sentiment: "positive", tones: ["elegante"], text: "Agradecemos sinceramente as {suas |tuas |}palavras." },
  { id: "op-p-10", kind: "opening", sentiment: "positive", tones: ["elegante"], text: "É um privilégio receber uma avaliação assim." },
  { id: "op-p-11", kind: "opening", sentiment: "positive", text: "Obrigado pelas {suas |tuas |}palavras!" },
  { id: "op-p-12", kind: "opening", sentiment: "positive", text: "Que bom ler isto, muito obrigado!" },
  { id: "op-p-13", kind: "opening", sentiment: "positive", text: "Ficámos mesmo contentes com esta review." },
  { id: "op-p-14", kind: "opening", sentiment: "positive", text: "Obrigado por {ter tirado|teres tirado|tirar} um momento para nos avaliar." },
  // Openings, negative
  { id: "op-n-1", kind: "opening", sentiment: "negative", text: "Obrigado por {partilhar|partilhares|partilhar} a {sua |tua |}opinião." },
  { id: "op-n-2", kind: "opening", sentiment: "negative", text: "Agradecemos o {seu |teu |}feedback e lamentamos que a experiência não tenha correspondido ao esperado." },
  { id: "op-n-3", kind: "opening", sentiment: "negative", text: "Lamentamos que a visita não tenha corrido {como esperava|como esperavas|como esperado}." },
  { id: "op-n-4", kind: "opening", sentiment: "negative", text: "Obrigado pela {sua |tua |}franqueza: é assim que conseguimos melhorar." },
  { id: "op-n-5", kind: "opening", sentiment: "negative", text: "Lamentamos sinceramente esta experiência." },
  { id: "op-n-6", kind: "opening", sentiment: "negative", text: "Agradecemos o tempo que {dedicou|dedicaste|foi dedicado} a deixar esta review." },
  // Themes, positive
  { id: "th-p-service-1", kind: "theme", sentiment: "positive", theme: "service", text: "Ficamos muito contentes por saber que o atendimento esteve à altura." },
  { id: "th-p-service-2", kind: "theme", sentiment: "positive", theme: "service", text: "A equipa vai adorar ler este elogio." },
  { id: "th-p-service-3", kind: "theme", sentiment: "positive", theme: "service", text: "Transmitimos o {seu |teu |}elogio à equipa, que vai ficar muito contente." },
  { id: "th-p-service-4", kind: "theme", sentiment: "positive", theme: "service", text: "Receber bem quem nos visita é o que mais nos importa." },
  { id: "th-p-quality-1", kind: "theme", sentiment: "positive", theme: "quality", text: "Ficamos felizes por saber que a qualidade esteve à altura." },
  { id: "th-p-quality-2", kind: "theme", sentiment: "positive", theme: "quality", text: "Pomos muito cuidado em tudo o que fazemos e é ótimo ver isso reconhecido." },
  { id: "th-p-quality-3", kind: "theme", sentiment: "positive", theme: "quality", text: "Saber que {gostou|gostaste|agradou} é o melhor elogio que podemos receber." },
  { id: "th-p-quality-4", kind: "theme", sentiment: "positive", theme: "quality", text: "Trabalhamos todos os dias para manter esta qualidade." },
  { id: "th-p-price-1", kind: "theme", sentiment: "positive", theme: "price", text: "Ficamos contentes por sentir que a relação qualidade-preço compensa." },
  { id: "th-p-price-2", kind: "theme", sentiment: "positive", theme: "price", text: "Trabalhamos para ter um preço justo, por isso este comentário é especialmente importante." },
  { id: "th-p-price-3", kind: "theme", sentiment: "positive", theme: "price", text: "É bom saber que o preço está à altura do que oferecemos." },
  { id: "th-p-price-4", kind: "theme", sentiment: "positive", theme: "price", text: "Queremos que cada visita valha a pena, também no preço." },
  { id: "th-p-waiting-1", kind: "theme", sentiment: "positive", theme: "waiting", text: "Ainda bem que o serviço foi rápido: sabemos que o tempo de cada cliente conta." },
  { id: "th-p-waiting-2", kind: "theme", sentiment: "positive", theme: "waiting", text: "Fazemos questão de não deixar ninguém à espera, por isso é bom ler isto." },
  { id: "th-p-waiting-3", kind: "theme", sentiment: "positive", theme: "waiting", text: "É ótimo saber que não houve tempo perdido." },
  { id: "th-p-waiting-4", kind: "theme", sentiment: "positive", theme: "waiting", text: "A rapidez é algo em que trabalhamos muito, obrigado por reparar." },
  { id: "th-p-cleanliness-1", kind: "theme", sentiment: "positive", theme: "cleanliness", text: "A limpeza é uma prioridade para nós, por isso agradecemos o reparo." },
  { id: "th-p-cleanliness-2", kind: "theme", sentiment: "positive", theme: "cleanliness", text: "É bom saber que o cuidado com a limpeza não passa despercebido." },
  { id: "th-p-cleanliness-3", kind: "theme", sentiment: "positive", theme: "cleanliness", text: "Manter tudo limpo e arrumado é um compromisso diário." },
  { id: "th-p-cleanliness-4", kind: "theme", sentiment: "positive", theme: "cleanliness", text: "Obrigado por reparar no cuidado que temos com a limpeza." },
  { id: "th-p-ambience-1", kind: "theme", sentiment: "positive", theme: "ambience", text: "Ficamos felizes por saber que o nosso espaço agradou." },
  { id: "th-p-ambience-2", kind: "theme", sentiment: "positive", theme: "ambience", text: "Pensámos o espaço para quem nos visita se sentir bem, por isso este elogio sabe mesmo bem." },
  { id: "th-p-ambience-3", kind: "theme", sentiment: "positive", theme: "ambience", text: "É muito bom saber que o ambiente foi do {seu |teu |}agrado." },
  { id: "th-p-ambience-4", kind: "theme", sentiment: "positive", theme: "ambience", text: "Fazemos questão de ter um espaço acolhedor." },
  { id: "th-p-location-1", kind: "theme", sentiment: "positive", theme: "location", text: "Ainda bem que foi fácil chegar até nós." },
  { id: "th-p-location-2", kind: "theme", sentiment: "positive", theme: "location", text: "Ficamos contentes por saber que a localização é prática." },
  { id: "th-p-location-3", kind: "theme", sentiment: "positive", theme: "location", text: "Estamos sempre aqui, à {sua |tua |}espera." },
  { id: "th-p-location-4", kind: "theme", sentiment: "positive", theme: "location", text: "Ainda bem que a nossa localização dá jeito." },
  // Themes, negative
  { id: "th-n-service-1", kind: "theme", sentiment: "negative", theme: "service", text: "Lamentamos muito que o atendimento não tenha estado à altura." },
  { id: "th-n-service-2", kind: "theme", sentiment: "negative", theme: "service", text: "Não é esse o atendimento que queremos dar e já partilhámos o {seu |teu |}comentário com a equipa." },
  { id: "th-n-service-3", kind: "theme", sentiment: "negative", theme: "service", text: "Vamos falar com a equipa para que isto não se repita." },
  { id: "th-n-service-4", kind: "theme", sentiment: "negative", theme: "service", text: "Pedimos desculpa pelo atendimento: não reflete o que queremos ser." },
  { id: "th-n-quality-1", kind: "theme", sentiment: "negative", theme: "quality", text: "Lamentamos que a qualidade não tenha correspondido {ao que esperava|ao que esperavas|às expectativas}." },
  { id: "th-n-quality-2", kind: "theme", sentiment: "negative", theme: "quality", text: "Levamos a qualidade muito a sério e vamos rever o que aconteceu." },
  { id: "th-n-quality-3", kind: "theme", sentiment: "negative", theme: "quality", text: "Vamos analisar o que falhou para garantir que não volta a acontecer." },
  { id: "th-n-quality-4", kind: "theme", sentiment: "negative", theme: "quality", text: "Pedimos desculpa: não é esta a qualidade que queremos oferecer." },
  { id: "th-n-price-1", kind: "theme", sentiment: "negative", theme: "price", text: "Percebemos a {sua |tua |}observação sobre o preço e vamos tê-la em conta." },
  { id: "th-n-price-2", kind: "theme", sentiment: "negative", theme: "price", text: "Procuramos sempre um preço justo e lamentamos que não tenha sido essa a sensação." },
  { id: "th-n-price-3", kind: "theme", sentiment: "negative", theme: "price", text: "Agradecemos o comentário sobre os preços e vamos analisá-lo." },
  { id: "th-n-price-4", kind: "theme", sentiment: "negative", theme: "price", text: "Queremos que cada visita valha o que custa e vamos rever este ponto." },
  { id: "th-n-waiting-1", kind: "theme", sentiment: "negative", theme: "waiting", text: "Pedimos desculpa pela espera, que não é o que queremos para quem nos visita." },
  { id: "th-n-waiting-2", kind: "theme", sentiment: "negative", theme: "waiting", text: "Lamentamos a demora e estamos a trabalhar para tornar o serviço mais rápido." },
  { id: "th-n-waiting-3", kind: "theme", sentiment: "negative", theme: "waiting", text: "Sabemos que esperar é frustrante e pedimos desculpa pelo tempo perdido." },
  { id: "th-n-waiting-4", kind: "theme", sentiment: "negative", theme: "waiting", text: "Vamos rever a organização para reduzir os tempos de espera." },
  { id: "th-n-cleanliness-1", kind: "theme", sentiment: "negative", theme: "cleanliness", text: "Lamentamos o que {encontrou|encontraste|foi encontrado} em termos de limpeza e vamos corrigi-lo de imediato." },
  { id: "th-n-cleanliness-2", kind: "theme", sentiment: "negative", theme: "cleanliness", text: "A limpeza é uma prioridade e este comentário vai ser revisto com a equipa." },
  { id: "th-n-cleanliness-3", kind: "theme", sentiment: "negative", theme: "cleanliness", text: "Pedimos desculpa: a limpeza tem de estar sempre impecável." },
  { id: "th-n-cleanliness-4", kind: "theme", sentiment: "negative", theme: "cleanliness", text: "Vamos reforçar os cuidados de limpeza de imediato." },
  { id: "th-n-ambience-1", kind: "theme", sentiment: "negative", theme: "ambience", text: "Lamentamos que o ambiente não tenha sido o mais agradável." },
  { id: "th-n-ambience-2", kind: "theme", sentiment: "negative", theme: "ambience", text: "Vamos ter em conta o {seu |teu |}comentário sobre o espaço." },
  { id: "th-n-ambience-3", kind: "theme", sentiment: "negative", theme: "ambience", text: "Pedimos desculpa se o espaço não esteve confortável." },
  { id: "th-n-ambience-4", kind: "theme", sentiment: "negative", theme: "ambience", text: "Queremos que todos se sintam bem e vamos ver o que podemos melhorar no espaço." },
  { id: "th-n-location-1", kind: "theme", sentiment: "negative", theme: "location", text: "Percebemos que o acesso nem sempre é fácil e agradecemos o reparo." },
  { id: "th-n-location-2", kind: "theme", sentiment: "negative", theme: "location", text: "Vamos ver como tornar mais fácil chegar até nós." },
  { id: "th-n-location-3", kind: "theme", sentiment: "negative", theme: "location", text: "Lamentamos a dificuldade em chegar até nós." },
  { id: "th-n-location-4", kind: "theme", sentiment: "negative", theme: "location", text: "Agradecemos o reparo sobre o acesso e vamos ver o que está ao nosso alcance." },
  // Contact (negatives)
  { id: "ct-1", kind: "contact", sentiment: "negative", text: "Gostávamos de falar {consigo|contigo|diretamente} para perceber melhor o que aconteceu: <contacto>." },
  { id: "ct-2", kind: "contact", sentiment: "negative", text: "Para resolvermos isto, {contacte-nos através de|contacta-nos através de|o contacto é} <contacto>." },
  { id: "ct-3", kind: "contact", sentiment: "negative", text: "Se {quiser|quiseres|for possível}, {fale|fala|basta falar} connosco para podermos resolver." },
  { id: "ct-4", kind: "contact", sentiment: "negative", text: "{Escreva-nos|Escreve-nos|Pode escrever-nos} para <contacto> e tratamos disto pessoalmente." },
  { id: "ct-5", kind: "contact", sentiment: "negative", text: "Estamos disponíveis em <contacto> para encontrar uma solução." },
  { id: "ct-6", kind: "contact", sentiment: "negative", text: "{Gostaríamos|Gostávamos|Gostaríamos} de ouvir mais sobre o que aconteceu, diretamente connosco." },
  // Closings
  { id: "cl-p-1", kind: "closing", sentiment: "positive", tones: ["proximo", "caloroso", "divertido"], text: "{Volte sempre!|Volta sempre!|Até breve!}" },
  { id: "cl-p-2", kind: "closing", sentiment: "positive", tones: ["proximo", "caloroso", "profissional"], text: "Contamos com a {sua |tua |}próxima visita!" },
  { id: "cl-p-3", kind: "closing", sentiment: "positive", tones: ["profissional", "elegante"], text: "Será sempre um prazer receber a {sua |tua |}visita." },
  { id: "cl-p-4", kind: "closing", sentiment: "positive", tones: ["divertido"], text: "Até à próxima!" },
  { id: "cl-p-5", kind: "closing", sentiment: "positive", text: "Esperamos voltar a receber a {sua |tua |}visita em breve." },
  { id: "cl-p-6", kind: "closing", sentiment: "positive", text: "Até breve, e obrigado mais uma vez!" },
  { id: "cl-p-7", kind: "closing", sentiment: "positive", text: "{Será sempre bem-vindo de volta.|Serás sempre bem-vindo de volta.|As portas estão sempre abertas.}" },
  { id: "cl-n-1", kind: "closing", sentiment: "negative", text: "Esperamos ter a oportunidade de fazer melhor numa próxima visita." },
  { id: "cl-n-2", kind: "closing", sentiment: "negative", text: "Obrigado por nos {ajudar|ajudares|ajudar} a melhorar." },
  { id: "cl-n-3", kind: "closing", sentiment: "negative", text: "Contamos poder {mostrar-lhe|mostrar-te|mostrar} uma experiência diferente." },
  { id: "cl-n-4", kind: "closing", sentiment: "negative", text: "Esperamos ter a oportunidade de recuperar a {sua |tua |}confiança." },
];

/** Reviews without text: no theme to talk about. */
const emptyBase: Record<Sentiment, string[]> = {
  positive: ["Muito obrigado pelas <estrelas> estrelas!", "Obrigado pela avaliação de <estrelas> estrelas!", "<estrelas> estrelas: obrigado, fica-nos mesmo bem!"],
  negative: [
    "Lamentamos que a experiência não tenha sido a melhor. Gostávamos de saber o que correu mal para podermos melhorar.",
    "Obrigado pela avaliação. Lamentamos não ter correspondido e gostávamos de perceber porquê.",
    "Lamentamos esta avaliação e queremos muito saber o que podemos fazer melhor.",
  ],
};

/** English reviews (tourists): the owner's library is Portuguese, so these get a short base reply. */
const englishBase: Record<Sentiment, string[][]> = {
  positive: [
    ["Thank you so much for your review!", "Thanks a lot for the kind words!", "We really appreciate your review!"],
    ["We're delighted you enjoyed your visit.", "It's great to hear you had a good time with us.", "Your feedback means a lot to the whole team."],
    ["We hope to see you again soon!", "Looking forward to your next visit!", "See you next time!"],
  ],
  negative: [
    ["Thank you for your feedback, and we're sorry your visit didn't meet your expectations.", "We're sorry to read about your experience.", "Thank you for taking the time to share this, and we apologise."],
    ["We'd love to hear more so we can make it right.", "We'll look into what happened so it doesn't happen again.", "Your comments will help us improve."],
  ],
};

const addressIndex: Record<AddressForm, number> = { voce: 0, tu: 1, neutro: 2 };

/** Picks the variant of every `{você|tu|sem tratamento}` group for the owner's address form. */
export function applyAddress(text: string, form: AddressForm): string {
  return text.replace(/\{([^{}]*)\}/g, (_, group: string) => {
    const options = group.split("|");
    return options[addressIndex[form]] ?? options[0];
  });
}

export function isEnglish(text: string | null): boolean {
  if (!text) return false;
  const words = normalize(text).split(/\s+/).filter(Boolean);
  const english = words.filter((word) => /^(the|and|was|were|very|we|our|is|it|with|for|great|staff|food|really|place|you|they|had|but|not|this)$/.test(word)).length;
  const portuguese = words.filter((word) => /^(o|a|os|as|e|que|de|do|da|muito|foi|com|para|nao|um|uma|mas|nos|ja|bem|estava)$/.test(word)).length;
  return english >= 3 && english > portuguese * 1.5;
}

/** Small deterministic hash, so a review always gets the same choice and different reviews vary. */
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
}

/** Owner sentences rejected more than accepted (twice or more) stop being used. */
export function snippetRetired(snippet: Pick<Snippet, "accepted" | "rejected">): boolean {
  return snippet.rejected >= 2 && snippet.rejected > snippet.accepted;
}

export interface ComposeInput {
  review: { id: string; rating: number; text: string | null };
  settings: Pick<ReplySettings, "addressForm" | "tone" | "length" | "emojis" | "signature" | "negativeContact" | "emptyPositive" | "emptyNegative">;
  library: Snippet[];
  /** Sentences to avoid (used in a draft the owner just rejected). */
  exclude?: string[];
  /** -1 shorter, +1 longer (from the rejection reasons). */
  lengthDelta?: number;
  /** 0 = the usual reply (owner's best sentences first); 1+ = alternatives that pick again. */
  variant?: number;
  /** Alternatives may also use base sentences of other tones when the owner's tone has few. */
  looseTone?: boolean;
}

export interface ComposedReply {
  reply: string;
  reasoning: string;
  snippetIds: string[];
}

export function composeReply({ review, settings, library, exclude = [], lengthDelta = 0, variant = 0, looseTone = false }: ComposeInput): ComposedReply {
  const sentiment: Sentiment = isNegative(review.rating) ? "negative" : "positive";
  const contact = settings.negativeContact.trim();
  const text = review.text?.trim() ?? "";
  const signature = settings.signature.trim();
  const finish = (sentences: string[], reasoning: string, snippetIds: string[]): ComposedReply => ({
    reply: [sentences.filter(Boolean).join(" "), signature].filter(Boolean).join("\n\n"),
    reasoning,
    snippetIds,
  });
  const stars = `${sentiment === "positive" ? "Positiva" : "Negativa"} (${review.rating}★)`;

  if (isEnglish(text)) {
    const sentences = englishBase[sentiment].map((options, slot) => options[hash(`${review.id}:en:${slot}:${variant}`) % options.length]);
    if (sentiment === "negative" && contact) sentences.push(`You can reach us at ${contact}.`);
    return finish(sentences, `${stars} · review em inglês: resposta-base em inglês, sem frases suas. Reveja antes de aceitar.`, ["default:english"]);
  }

  const fill = (sentence: string) => sentence.replaceAll("<contacto>", contact).replaceAll("<estrelas>", String(review.rating));

  const skip = new Set(exclude);
  const usable = (snippet: Snippet) => !skip.has(snippet.id) && !snippetRetired(snippet) && (contact || !snippet.text.includes("<contacto>"));
  let ownCount = 0;
  let baseCount = 0;
  const used: string[] = [];

  function sourcesText(): string {
    return [ownCount ? `${ownCount} ${ownCount === 1 ? "frase sua" : "frases suas"}` : null, baseCount ? `${baseCount} ${baseCount === 1 ? "frase-base" : "frases-base"} da Steevanz` : null]
      .filter(Boolean)
      .join(" e ");
  }

  function withEmoji(sentences: (string | null)[]): string[] {
    const final = sentences.filter((sentence): sentence is string => Boolean(sentence));
    if (sentiment === "positive" && settings.emojis && final.length && !/\p{Extended_Pictographic}/u.test(final.join(" "))) final[final.length - 1] += " 😊";
    return final;
  }

  function pick(kind: SnippetKind, theme: ThemeId | null = null): string | null {
    const seed = hash(`${review.id}:${kind}:${theme ?? ""}:${variant}`);
    const own = library
      .filter((snippet) => snippet.kind === kind && snippet.sentiment === sentiment && (kind !== "theme" || snippet.theme === theme) && usable(snippet))
      .sort((a, b) => b.accepted - b.rejected - (a.accepted - a.rejected));
    const takeOwn = (choice: Snippet) => {
      ownCount++;
      used.push(choice.id);
      return fill(choice.text);
    };
    // The usual reply uses the owner's best sentences; alternatives also mix in base sentences.
    if (own.length && variant === 0) return takeOwn(own[seed % Math.min(3, own.length)]);
    const candidates = base.filter(
      (snippet) =>
        snippet.kind === kind &&
        snippet.sentiment === sentiment &&
        (kind !== "theme" || snippet.theme === theme) &&
        !skip.has(`default:${snippet.id}`) &&
        // With a contact, contact sentences always give it; without one, never a placeholder.
        (kind !== "contact" || (contact ? snippet.text.includes("<contacto>") : !snippet.text.includes("<contacto>"))),
    );
    const toned = candidates.filter((snippet) => !snippet.tones || snippet.tones.some((tone) => settings.tone.includes(tone)));
    const basePool = looseTone || !toned.length ? candidates : toned;
    const total = own.length + basePool.length;
    if (!total) return null;
    const index = seed % total;
    if (index < own.length) return takeOwn(own[index]);
    const choice = basePool[index - own.length];
    baseCount++;
    used.push(`default:${choice.id}`);
    return fill(applyAddress(choice.text, settings.addressForm));
  }

  if (!text) {
    const template = splitSentences(sentiment === "positive" ? settings.emptyPositive : settings.emptyNegative);
    const baseOptions = emptyBase[sentiment];
    // The usual reply starts with the owner's template; alternatives rotate through base openings too.
    const slot = hash(`${review.id}:empty:${variant}`) % (baseOptions.length + (template.length ? 1 : 0));
    const opening = template.length && !skip.has("settings:empty") && (variant === 0 || slot === baseOptions.length) ? template[0] : null;
    // Only the first sentence of the owner's template: the whole template word for word would be
    // a reply the owner wrote, and suggestions must never repeat those exactly.
    const sentences: (string | null)[] = [fill(opening ?? applyAddress(baseOptions[slot % baseOptions.length], settings.addressForm))];
    if (opening) ownCount++;
    else baseCount++;
    used.push(opening ? "settings:empty" : "default:empty");
    if (sentiment === "negative" && !(contact && sentences[0]!.includes(contact))) sentences.push(pick("contact"));
    sentences.push(pick("closing"));
    return finish(withEmoji(sentences), `${stars} · review só com estrelas · ${sourcesText()}.`, used);
  }

  const themes = themesByMention(text);
  const maxThemes = Math.max(0, Math.min(3, (settings.length === "curta" ? 1 : 2) + lengthDelta));
  const chosenThemes = themes.slice(0, maxThemes);
  const short = settings.length === "curta" && lengthDelta <= 0;

  const sentences: (string | null)[] = [pick("opening")];
  for (const theme of chosenThemes) sentences.push(pick("theme", theme));
  if (sentiment === "negative") sentences.push(pick("contact"));
  // Short positive replies with a theme end on the theme sentence; negatives end on the contact.
  if (!(short && (sentiment === "negative" || chosenThemes.length > 0))) sentences.push(pick("closing"));

  const about = chosenThemes.length ? `fala de ${chosenThemes.map((theme) => themeNames[theme]).join(" e ")}` : "sem temas reconhecidos";
  return finish(withEmoji(sentences), `${stars} · ${about} · ${sourcesText()}.`, used);
}

/** Splits a text into sentences (also on line breaks). */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/** Comparison key: case, accents, punctuation, emojis and spacing do not count. */
export function replyKey(text: string): string {
  return normalize(text).replace(/\s+/g, " ").trim();
}

/** Keys of a text the owner wrote: whole, and without its last line (usually a signature). */
export function ownTextKeys(text: string): string[] {
  const lines = text.trim().split(/\n+/);
  const keys = [replyKey(text)];
  if (lines.length > 1) keys.push(replyKey(lines.slice(0, -1).join(" ")));
  return keys.filter(Boolean);
}

/** Whether a suggestion is exactly a text the owner wrote (with or without the signature). */
export function isOwnText(reply: string, signature: string, ownKeys: Set<string>): boolean {
  const sign = signature.trim();
  const trimmed = reply.trimEnd();
  const body = sign && trimmed.endsWith(sign) ? trimmed.slice(0, -sign.length) : reply;
  return ownKeys.has(replyKey(reply)) || ownKeys.has(replyKey(body));
}

/** Variants tried per relaxation step when looking for different replies. */
const variantsPerStep = 30;

/**
 * Up to `count` replies with different texts for one review, the usual one first. Business rules:
 * none is exactly a reply the owner wrote (training answers, edited replies, replies on Google,
 * star-only templates), and none repeats a reply already shown for this review (`shownKeys`, from
 * replyKey). When the owner's tone has few sentences it also tries base sentences of other tones,
 * then one sentence more or less. May return fewer than `count`, or none.
 */
export function composeOptions(input: ComposeInput, ownKeys: Set<string>, shownKeys: Set<string> = new Set(), count = 5): ComposedReply[] {
  const signature = input.settings.signature;
  const seen = new Set(shownKeys);
  const options: ComposedReply[] = [];
  const delta = input.lengthDelta ?? 0;
  const steps: Partial<ComposeInput>[] = [{}, { looseTone: true }, { lengthDelta: delta + 1 }, { lengthDelta: delta - 1 }, { looseTone: true, lengthDelta: delta + 1 }];
  // Shares at most half of its sentences with every option already chosen, so options really differ.
  const different = (option: ComposedReply) =>
    options.every((other) => option.snippetIds.filter((id) => other.snippetIds.includes(id)).length <= Math.floor(option.snippetIds.length / 2));
  // First pass: clearly different options; second pass: any new text, to fill up when sentences are few.
  for (const strict of [true, false]) {
    for (const step of steps) {
      for (let variant = 0; variant < variantsPerStep && options.length < count; variant++) {
        const option = composeReply({ ...input, ...step, variant });
        const key = replyKey(option.reply);
        if (seen.has(key) || isOwnText(option.reply, signature, ownKeys) || (strict && !different(option))) continue;
        seen.add(key);
        options.push(option);
      }
      if (options.length >= count) return options;
    }
  }
  return options;
}

/** One reply that is neither the owner's own text nor one already shown; null when none exists. */
export function composeDistinct(input: ComposeInput, ownKeys: Set<string>, shownKeys: Set<string> = new Set()): ComposedReply | null {
  return composeOptions(input, ownKeys, shownKeys, 1)[0] ?? null;
}

export interface LearnedSnippet {
  kind: SnippetKind;
  sentiment: Sentiment;
  theme: ThemeId | null;
  text: string;
}

const contactPattern = /@|\b\d{9}\b|\b(contact\w*|fale connosco|fala connosco|ligue|liga-nos|envie|mensagem|telefone|email)\b/i;

/**
 * Splits an answer the owner wrote into sentences and files each one: theme sentences by the
 * theme they mention, contact invitations, the first sentence as an opening, the rest as closings.
 */
export function learnFromAnswer(answer: string, rating: number, settings: Pick<ReplySettings, "signature" | "negativeContact">): LearnedSnippet[] {
  const sentiment: Sentiment = isNegative(rating) ? "negative" : "positive";
  const signature = settings.signature.trim();
  const contact = settings.negativeContact.trim();
  let body = answer.trim();
  if (signature && body.endsWith(signature)) body = body.slice(0, -signature.length).trim().replace(/[—–-]\s*$/, "").trim();
  const sentences = splitSentences(body).filter((sentence) => sentence.length >= 3 && sentence.length <= 400 && (!signature || sentence !== signature));

  const learned: LearnedSnippet[] = [];
  sentences.forEach((sentence, index) => {
    const text = contact ? sentence.replaceAll(contact, "<contacto>") : sentence;
    const theme = themesByMention(sentence)[0] ?? null;
    let kind: SnippetKind;
    if (text.includes("<contacto>") || contactPattern.test(sentence)) kind = "contact";
    else if (theme) kind = "theme";
    else if (index === 0) kind = "opening";
    else kind = "closing";
    learned.push({ kind, sentiment, theme: kind === "theme" ? theme : null, text });
  });
  return learned;
}

export const snippetKindLabels: Record<SnippetKind, string> = {
  opening: "Abertura",
  theme: "Sobre",
  contact: "Contacto",
  closing: "Fecho",
};
