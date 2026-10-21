// A document's text cut into small passages (a line, a sentence, one line of a price list, a
// question with its answer), whatever the layout: PDFs with or without titles, Word lists, a text
// pasted from Instagram or WhatsApp, a flat block without line breaks. The free search ranks windows
// of passages and quotes the best passages (knowledge.ts, doc-answers.ts). Titles, when a document
// happens to have them, are only an extra signal. Pure module (tests/chatbot-passages.test.mjs).
import { searchWords } from "./text.ts";
import type { KnowledgeChunk } from "./types.ts";

/** «16 €», «€16», «16,50€», «16 euros». */
export const pricePattern = /(?:€\s?\d+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?\s?(?:€|eur(?:os?)?\b))/i;
/** «10:00», «10h30», «9h». */
export const timePattern = /\b\d{1,2}(?::\d{2}|h\d{2}\b|h\b)/i;

/** A line that ends with a price, a time or a duration: the end of one line of a list. */
const valueEnd = /(?:€|\beur(?:os?)?|\d{1,2}[:h]\d{2}|\d+\s?min\.?)\s*[)\]]?$/i;
/** List markers and emoji at the start of a line (removed from the text). */
const bulletStart = /^(?:[•·▪◦●○■□►▸‣⁃✓✔☑→*+\-–—]|\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u;
/** «Email: …», «Animais: …»: a line that starts with a short label. */
const labelStart = /^\p{Lu}[\p{L}\-' ]{0,25}:\s/u;

export interface Passage {
  text: string;
  /** Normalized search words (searchWords). */
  words: string[];
  documentId: string;
  /** The stored section it comes from (for the admin's sources, its language and property). */
  chunk: KnowledgeChunk;
  /** All passages of the same document, in order, and this one's place among them. */
  siblings: Passage[];
  position: number;
  /** Passages cut from the same line or paragraph share this number (a sentence like «Atende de terça a sábado.» belongs with the name before it). */
  group: number;
  /** Ends with «?»: a question, usually followed by its answer. */
  question: boolean;
  /** Short line without a sentence ending, price or time: a title or a label. */
  titleLike: boolean;
  price: boolean;
  time: boolean;
}

/** A short line that reads like a title or a label («Morada», «4. Serviços e preços», «Domingo Fechado»). */
export function isTitleLike(text: string): boolean {
  const core = text.replace(/^#+\s*/, "").replace(/^\d{1,2}(?:\.\d{1,2})*\.?\s+/, "").trim();
  if (!core || /[.!?;:,…]["»”')\]]*$/.test(core)) return false;
  if (/\d/.test(core) || /@|https?:|www\./i.test(core)) return false;
  // «Falamos português, inglês e espanhol 🇬🇧», «We speak English»: a sentence said by the business, not a heading.
  if (/^(?:\p{L}{2,}(?:amos|emos|imos)|we|nous|wir|noi|nosotros)\b/iu.test(core)) return false;
  return /^["«“]?\p{Lu}/u.test(core) && core.length <= 60 && core.split(/\s+/).length <= 6;
}

function isShortLine(text: string): boolean {
  return isTitleLike(text) && text.split(/\s+/).length <= 4;
}

/** «B A R B E A R I A · P O R T O» → «BARBEARIA · PORTO». */
export function collapseLetterSpacing(line: string): string {
  const tokens = line.trim().split(/\s+/);
  if (tokens.length < 6 || tokens.filter((token) => token.length === 1).length / tokens.length < 0.7) return line;
  const out: string[] = [];
  let word = "";
  for (const token of tokens) {
    if (token.length === 1 && /[\p{L}\p{N}]/u.test(token)) word += token;
    else {
      if (word) out.push(word);
      word = "";
      out.push(token);
    }
  }
  if (word) out.push(word);
  return out.join(" ");
}

/** Articles, prepositions and «and/or» in the six languages: a line that ends with one was wrapped mid-sentence. */
const functionWords = new Set(
  (
    "a o as os um uma de do da dos das no na nos nas em e ou com para por ao aos à às pelo pela pelos pelas sem que " +
    "até desde entre como mas nem se já não também muito mais menos cada quando onde seu sua seus suas " +
    "the an of to in on at for and or with by from " +
    "el la los las del al y en con para por " +
    "le les des du et au aux pour avec sur " +
    "der die das den dem des und mit für von zu im am " +
    "il lo gli di della dello degli con per alla nel nella"
  ).split(" "),
);

/** A short title in capitals («EMENTA», «HORÁRIO», «SERVIÇOS E PREÇOS»): what follows is a new passage, whatever its case. */
function isCapitalTitle(text: string): boolean {
  const letters = text.replace(/[^\p{L}]/gu, "");
  return letters.length >= 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase() && text.split(/\s+/).length <= 4 && !/[.!?;,]$/.test(text);
}

/** Whether a new line starts a new passage or continues the previous one (a PDF or pasted text wraps lines anywhere). */
function startsNewPassage(previous: string, line: string, bullet: boolean): boolean {
  if (bullet || /^\d{1,2}[.)]\s/.test(line)) return true;
  if (isCapitalTitle(previous)) return true;
  // «… (não precisam de esperar por ninguém)» + «porta do prédio: …», «… código 4729#» + «caixa das chaves …» (a
  // WhatsApp list without bullets): after a closed bracket or «#», a lower-case line starts anew, unless it begins
  // with «e», «de», «até»… (a sentence wrapped there). Not after a number: «… 40» + «min 18 €» is one line.
  if (/^\p{Ll}/u.test(line) && /[)#]$/.test(previous) && !functionWords.has(line.split(/\s+/)[0])) return true;
  if (/^[\p{Ll}(\[,;)–\-]/u.test(line)) return false;
  if (/[.!?…:;]["»”')\]]*$/.test(previous)) return true;
  // An open bracket: «… 24 de junho (São» + «João), …».
  if ((previous.match(/\(/g) ?? []).length > (previous.match(/\)/g) ?? []).length) return false;
  if (/(?:€|\beur(?:os?)?)\s*[)\]]?$/i.test(previous)) return true;
  // «… (confirmo os códigos no dia da chegada)» + «Chegadas depois das 22:00…»: a capital after a closed bracket starts anew.
  if (/\)$/.test(previous) && /^\p{Lu}/u.test(line)) return true;
  // «… 40 min» + «18 €», «… loja B» + «4050-032 Porto»: the same line, wrapped.
  if (/^[\d€+]/.test(line)) return false;
  if (valueEnd.test(previous)) return true;
  // «Estacionamento gratuito no Largo da» + «Ribeira (poucos lugares)…»: a line that ends with «da», «de», «and»… goes on.
  if (functionWords.has(previous.split(/\s+/).pop() ?? "")) return false;
  if (labelStart.test(line)) return true;
  if (isShortLine(previous) || isShortLine(line)) return true;
  // A title («12. Reclamações e contacto com a gerência») followed by a sentence.
  return isTitleLike(previous) && line.split(/\s+/).length >= 6;
}

/** Sentences, and the lines of a price list or timetable written without line breaks. */
export function splitPassage(text: string): string[] {
  return text
    // Not after «Dra.», «Sr.», «D.», «Av.»… («Diretora clínica: Dra. Sofia Ramalhete»).
    .split(/(?<=[.!?…]["»”')\]]*)(?<!\b(?:Dr|Dra|Sr|Sra|Srs|Prof|Profa|Eng|Arq|Av|Mr|Mrs|Ms|St|Sto|Sta|D)\.)\s+(?=(?:\p{Extended_Pictographic}\uFE0F?\s*)*["«“(¿¡]?[\p{Lu}\d])/u)
    .flatMap((part) => part.split(/(?<=(?:€|\b(?:eur(?:os?)?|EUR|Euros?)\b|\d{1,2}[:h]\d{2}\b)\)?)\s+(?=["«“]?\p{Lu})/u))
    // A text flattened to one line: a web address or e-mail ends its item («… reservas.casa.example Check-in (entrada) …»),
    // and «Label: …» after a name, a number or a bracket starts one («… 2655-319 Ericeira Anfitriã: Marta …», «… (exemplo)
    // Email: …»; not «Praia dos Pescadores: …» nor «… para Portugal continental: 3,90 €», inside a sentence).
    .flatMap((part) => part.split(/(?<=\b[\w.-]+\.(?:com|pt|es|fr|de|it|eu|net|org|io|app|example)\b\/?)\s+(?=\p{Lu})|(?<=(?:^|\s)(?:\p{Lu}\S*|\S*[^\p{L}\s]))\s+(?=\p{Lu}\p{Ll}[\p{Ll}\-']*(?:\s+\p{Ll}[\p{Ll}\-']*){0,4}:\s)/u))
    .flatMap((part) => part.split(/\s+[•|]\s+/))
    // «queijo 9,50€ · enchidos 8,00€ · sopa 3,00€»: a list separated by middle dots (not «16€ · 30 min», a price and its duration).
    .flatMap((part) => {
      const prices = new RegExp(pricePattern.source, "i");
      if ((part.match(new RegExp(pricePattern.source, "gi")) ?? []).length < 2) return [part];
      return part.split(/\s+·\s+/).reduce<string[]>((pieces, piece) => {
        if (pieces.length && !prices.test(piece)) pieces[pieces.length - 1] += ` · ${piece}`;
        else pieces.push(piece);
        return pieces;
      }, []);
    })
    // «pomada 16€, cera 15€, óleo 14€»: a price list written as one sentence.
    .flatMap((part) => ((part.match(new RegExp(pricePattern.source, "gi")) ?? []).length >= 3 ? part.split(/(?<=(?:€|\beuros?\b)(?:\s*\([^)]{0,30}\))?)\s*[,;]\s+(?=\p{L})/iu) : [part]))
    .map((part) => part.replace(bulletStart, "").trim())
    .filter(Boolean)
    .reduce<string[]>((parts, part) => {
      // «4.» of «4. Serviços e preços» stays with its title.
      if (parts.length && /^\d{1,3}[.)]$/.test(parts[parts.length - 1])) parts[parts.length - 1] += ` ${part}`;
      else parts.push(part);
      return parts;
    }, []);
}

/** Column titles of a table in the six languages (accents kept as written, compared in lower case). */
const captionTitles = new Set(
  (
    "serviço serviços duração preço preços produto produtos dia dias horário horários descrição valor tempo " +
    "service services duration price prices product products day days hours description item " +
    "servicio duración precio producto descripción jour horaire prix produit durée tag zeit preis produkt dauer giorno orario prezzo prodotto durata"
  ).split(" "),
);

/** «Cabeleireiro Serviço Duração Preço Corte de senhora…» (a table flattened into the text): the column titles go. */
function withoutCaptions(text: string): string {
  const tokens = text.split(" ");
  const keep = tokens.map(() => true);
  for (let start = 0; start < tokens.length; start++) {
    let end = start;
    while (end < tokens.length && /^\p{Lu}/u.test(tokens[end]) && captionTitles.has(tokens[end].toLowerCase())) end++;
    if (end - start >= 2) for (let at = start; at < end; at++) keep[at] = false;
    start = Math.max(start, end - 1);
  }
  return keep.every(Boolean) ? text : tokens.filter((_, at) => keep[at]).join(" ");
}

/** Column titles repeated across a document («Serviço Duração Preço» in every table): noise, removed. */
function dropRepeatedCaptions(texts: string[]): string[] {
  let current = texts;
  for (let round = 0; round < 5; round++) {
    const counts = new Map<string, number>();
    for (const text of current) {
      for (const run of text.match(/(?:\p{Lu}[\p{L}]*\s+){2,}\p{Lu}[\p{L}]*/gu) ?? []) {
        const words = run.split(/\s+/);
        for (let start = 0; start + 3 <= words.length; start++) {
          const gram = words.slice(start, start + 3).join(" ");
          counts.set(gram, (counts.get(gram) ?? 0) + 1);
        }
      }
    }
    const [top] = [...counts.entries()].filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1]);
    if (!top) break;
    const caption = new RegExp(`(?<![\\p{L}])${top[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")}(?![\\p{L}])`, "gu");
    current = current.map((text) => text.replace(caption, " ").replace(/\s+/g, " ").trim());
  }
  return current;
}

/**
 * A document's lines in order, rebuilt from its stored sections. Titles found when it was cut are
 * kept in the section's heading («Documento › Título»), so they come back here as lines; documents
 * cut by older versions (lines joined into paragraphs) come back as long lines, which the passages
 * below cut again.
 */
export function documentLines(chunks: readonly KnowledgeChunk[]): { text: string; chunk: KnowledgeChunk }[] {
  const lines: { text: string; chunk: KnowledgeChunk }[] = [];
  let previous: string[] = [];
  for (const chunk of chunks) {
    const parts = chunk.heading.split(" › ").map((part) => part.trim());
    if (parts[0] === chunk.documentTitle.trim()) parts.shift();
    let same = 0;
    while (same < parts.length && parts[same] === previous[same]) same++;
    const start = chunk.body.slice(0, 300);
    for (const part of parts.slice(same)) if (part && !start.includes(part)) lines.push({ text: part, chunk });
    previous = parts;
    for (const line of chunk.body.split("\n")) lines.push({ text: line, chunk });
  }
  return lines;
}

/** One document's passages, in order (chunks: its stored sections, in order). */
export function documentPassages(chunks: readonly KnowledgeChunk[]): Passage[] {
  if (!chunks.length) return [];
  const groups: { text: string; chunk: KnowledgeChunk }[] = [];
  let open: { text: string; chunk: KnowledgeChunk; last: string; bullet: boolean } | null = null;
  const close = () => {
    if (open) groups.push({ text: open.text, chunk: open.chunk });
    open = null;
  };
  // A blank line or a list marker ends a passage, except in the middle of a sentence («… com pelo menos uma»
  // + blank or «- » + «semana de antecedência.»: a PDF or a pasted text broke it there).
  let blank = false;
  for (const raw of documentLines(chunks)) {
    const trimmed = collapseLetterSpacing(raw.text.replace(/\s+/g, " ").trim());
    if (!trimmed) {
      blank = true;
      continue;
    }
    const bullet = bulletStart.test(trimmed);
    const line = trimmed
      .replace(bulletStart, "")
      .replace(/^#+\s+/, "")
      // WhatsApp/Markdown emphasis: «*HORÁRIO*» → «HORÁRIO».
      .replace(/(^|\s)[*_~]+(?=\S)/g, "$1")
      .replace(/(?<=\S)[*_~]+(?=\s|$|[.,;:!?)])/g, "")
      .trim();
    if (!line) continue;
    const current: { text: string; chunk: KnowledgeChunk; last: string; bullet: boolean } | null = open;
    // «… a 6 minutos a pé» + «- (pago nos dias úteis…)»: a bracket that goes on a sentence, whatever list marker the copy added.
    // «… para saber se uma cor ou» + «• um lote está disponível»: after «ou», «de», «e»… the sentence goes on, bullets or not.
    const midSentence =
      current !== null &&
      ((/\p{Ll}$/u.test(current.last) && ((/^\p{Ll}/u.test(line) && !(bullet && current.bullet)) || /^\(/.test(line))) ||
        (/^\p{Ll}/u.test(line) && functionWords.has(current.last.split(/\s+/).pop() ?? "")));
    const joins = current !== null && (midSentence || (!blank && !startsNewPassage(current.last, line, bullet)));
    blank = false;
    if (current && joins) {
      current.text = `${current.text} ${line}`;
      current.last = line;
    } else {
      close();
      open = { text: line, chunk: raw.chunk, last: line, bullet };
    }
  }
  close();

  const pieces: { text: string; chunk: KnowledgeChunk; group: number }[] = [];
  groups.forEach((group, number) => {
    for (const text of splitPassage(group.text)) pieces.push({ text, chunk: group.chunk, group: number });
  });
  const cleaned = dropRepeatedCaptions(pieces.map((piece) => piece.text)).map(withoutCaptions);
  const siblings: Passage[] = [];
  cleaned.forEach((text, index) => {
    const words = searchWords(text);
    if (!text || !words.length) return;
    siblings.push({
      text,
      words,
      documentId: pieces[index].chunk.documentId,
      chunk: pieces[index].chunk,
      siblings,
      position: siblings.length,
      group: pieces[index].group,
      question: /\?["»”')\]]*$/.test(text) && words.length >= 2,
      titleLike: isTitleLike(text),
      price: pricePattern.test(text),
      time: timePattern.test(text),
    });
  });
  // «Surf? Ribeira d'Ilhas a 5 km…», «Alergias? Avise antes…»: a one-word question with its answer on the same line.
  for (const passage of siblings) {
    const next = siblings[passage.position + 1];
    if (!passage.question && passage.words.length === 1 && /\?["»”')\]]*$/.test(passage.text) && next?.group === passage.group) passage.question = true;
  }
  return siblings;
}

/** The answer that follows a question in the text (a frequent-questions list), or nothing. */
export function answerAfter(question: Passage, maxChars = 450): Passage[] {
  const answer: Passage[] = [];
  let size = 0;
  for (let index = question.position + 1; index < question.siblings.length && answer.length < 3; index++) {
    const next = question.siblings[index];
    if (next.question || /^\d{1,2}\.\s+\p{Lu}/u.test(next.text) || (next.titleLike && !/^(sim|não|nao|yes|no|non|nein|si|sí|oui|ja)\b/i.test(next.text))) break;
    if (answer.length && size + next.text.length > maxChars) break;
    answer.push(next);
    size += next.text.length + 1;
  }
  return answer;
}

/** What follows a title or label («Morada» → the address lines), skipping other labels right after it. */
export function blockAfter(title: Passage, maxPassages = 6, maxChars = 450): Passage[] {
  const block: Passage[] = [];
  let size = 0;
  let skipped = 0;
  for (let index = title.position + 1; index < title.siblings.length && block.length < maxPassages; index++) {
    const next = title.siblings[index];
    if (next.question) break;
    if (next.titleLike) {
      if (block.length || ++skipped > 2) break;
      continue;
    }
    if (block.length && size + next.text.length > maxChars) break;
    block.push(next);
    size += next.text.length + 1;
  }
  return block;
}
