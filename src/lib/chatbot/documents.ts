// Documents the business gives the assistant (PDF, Word, text, Markdown, a web page): their text,
// cut into short sections («chunks») with a title each, so the free search can find the right part
// and the answer can quote it. Pure module (tests/chatbot-documents.test.mjs). Later, the same chunks
// can get embeddings or go to a real model without changing how they are stored.

/** Limits per document: enough for a menu, a house guide or a price list; keeps the bot fast. */
export const documentLimits = {
  /** Bytes of an uploaded file (server actions accept 3 MB in next.config.ts). */
  maxFileBytes: 2_500_000,
  /** Characters of text kept from one document. */
  maxChars: 300_000,
  maxChunks: 400,
  /** Target and ceiling of one chunk, in characters. */
  chunkTarget: 800,
  chunkMax: 1200,
};

export type DocumentKind = "pdf" | "docx" | "text" | "markdown" | "html";

/** What kind of file this is, from its name, type and first bytes. */
export function documentKindOf(name: string, mime: string, head: Uint8Array): DocumentKind | null {
  const lower = name.toLowerCase();
  const startsWith = (...bytes: number[]) => bytes.every((byte, index) => head[index] === byte);
  if (startsWith(0x25, 0x50, 0x44, 0x46) || lower.endsWith(".pdf") || mime === "application/pdf") return "pdf";
  if ((startsWith(0x50, 0x4b, 0x03, 0x04) && lower.endsWith(".docx")) || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (lower.endsWith(".md") || lower.endsWith(".markdown") || mime === "text/markdown") return "markdown";
  if (lower.endsWith(".html") || lower.endsWith(".htm") || mime === "text/html") return "html";
  if (lower.endsWith(".txt") || mime.startsWith("text/")) return "text";
  return null;
}

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»", euro: "€", ndash: "–", mdash: "—", hellip: "…" };

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const value = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) && value > 0 && value < 0x110000 ? String.fromCodePoint(value) : whole;
    }
    return entities[code.toLowerCase()] ?? whole;
  });
}

/** A web page's readable text: headings become «# …» lines, scripts, menus and footers are dropped. */
export function htmlToText(html: string): { title: string | null; text: string } {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const body = html
    .replace(/<(script|style|noscript|svg|nav|footer|header|form|iframe|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, inner: string) => `\n\n${"#".repeat(Number(level))} ${inner.replace(/<[^>]+>/g, " ")}\n\n`)
    .replace(/<(br|hr)\b[^>]*>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<\/(p|div|section|article|li|ul|ol|table|tr|h[4-6]|blockquote)>/gi, "\n\n")
    .replace(/<(td|th)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return { title: title ? decodeEntities(title.replace(/\s+/g, " ").trim()) || null : null, text: cleanText(decodeEntities(body)) };
}

/** Tidy extracted text: one space between words, at most one blank line, no hyphen splits at line ends. */
export function cleanText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/­/g, "")
    .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2")
    .replace(/[ \t\f\v ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface DocumentChunk {
  /** «Título do documento › Secção» (or the document's title when it has no sections). */
  heading: string;
  body: string;
}

/**
 * A line that looks like a section title: Markdown «#», a short numbered title («4. Serviços e
 * preços»), a short line in capitals, or a very short line ending in «:». Only a hint for the
 * section names shown in the admin: every line is searched whatever this says (passages.ts).
 */
export function headingOf(line: string): { level: number; text: string } | null {
  const markdown = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
  if (markdown) return { level: markdown[1].length, text: markdown[2].trim() };
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 70) return null;
  const tokens = trimmed.split(/\s+/);
  // Letter-spaced decoration («B A R B E A R I A · P O R T O») is not a title.
  if (tokens.length >= 6 && tokens.filter((token) => token.length === 1).length / tokens.length >= 0.7) return null;
  if (/€|\d{1,2}[:h]\d{2}/.test(trimmed)) return null;
  const numbered = trimmed.match(/^(\d{1,2}(?:\.\d{1,2})?)\.?\s+(\p{Lu}.*)$/u);
  if (numbered && tokens.length <= 8 && !/[.!?;:,]$/.test(trimmed)) return { level: numbered[1].includes(".") ? 3 : 2, text: trimmed };
  const letters = trimmed.replace(/[^\p{L}]/gu, "");
  if (letters.length >= 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase() && !/[.!?;,]$/.test(trimmed)) return { level: 2, text: trimmed };
  if (trimmed.endsWith(":") && tokens.length <= 4 && !/[.!?]/.test(trimmed.slice(0, -1))) return { level: 3, text: trimmed.slice(0, -1).trim() };
  return null;
}

function splitLong(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const sentences = text.split(/(?<=[.!?…])\s+/);
  const parts: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current + " " + sentence).length > max) {
      parts.push(current);
      current = "";
    }
    if (sentence.length > max) {
      // A very long «sentence» (a list without full stops): cut between words.
      let rest = sentence;
      while (rest.length > max) {
        const space = rest.lastIndexOf(" ", max);
        const cut = space > max / 2 ? space : max;
        parts.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
      }
      current = rest;
      continue;
    }
    current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Cuts a document into sections of about `chunkTarget` characters, at line boundaries, each with the
 * title path it sits under (titles are kept in the path, the other lines exactly as they were, so
 * the whole text can be read back in order: passages.ts → documentLines).
 */
export function splitIntoChunks(text: string, documentTitle: string, limits = documentLimits): DocumentChunk[] {
  const lines = cleanText(text).slice(0, limits.maxChars).split("\n");
  const path: string[] = [];
  const chunks: DocumentChunk[] = [];
  let paragraphs: string[] = [];
  let size = 0;
  let headingAtStart = documentTitle;

  const currentHeading = () => [documentTitle, ...path.filter(Boolean)].join(" › ");
  const flush = () => {
    const body = paragraphs.join("\n").trim();
    if (body) for (const part of splitLong(body, limits.chunkMax)) chunks.push({ heading: headingAtStart, body: part });
    paragraphs = [];
    size = 0;
  };

  let paragraph = "";
  const endParagraph = () => {
    const value = paragraph.trim();
    paragraph = "";
    if (!value) return;
    if (size && size + value.length > limits.chunkTarget) flush();
    if (!paragraphs.length) headingAtStart = currentHeading();
    paragraphs.push(value);
    size += value.length + 1;
  };

  for (const line of lines) {
    const heading = headingOf(line);
    if (heading) {
      endParagraph();
      flush();
      path.length = Math.max(0, heading.level - 1);
      path[heading.level - 1] = heading.text;
      continue;
    }
    if (!line.trim()) {
      endParagraph();
      // Blank lines are kept: they separate things for the search.
      if (paragraphs.length && paragraphs[paragraphs.length - 1] !== "") paragraphs.push("");
      continue;
    }
    // Every line stays a line: the search decides later which lines belong together.
    paragraph = line.trim();
    endParagraph();
    if (chunks.length >= limits.maxChunks) break;
  }
  endParagraph();
  flush();
  return chunks.slice(0, limits.maxChunks);
}
