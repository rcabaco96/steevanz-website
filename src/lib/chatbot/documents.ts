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

/** A line that is a section title: Markdown «#», a short line in capitals, or a short line ending in «:». */
export function headingOf(line: string): { level: number; text: string } | null {
  const markdown = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
  if (markdown) return { level: markdown[1].length, text: markdown[2].trim() };
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 70) return null;
  const letters = trimmed.replace(/[^\p{L}]/gu, "");
  if (letters.length >= 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase() && !/[.!?;,]$/.test(trimmed)) return { level: 2, text: trimmed };
  if (trimmed.endsWith(":") && trimmed.length <= 60 && !/[.!?]/.test(trimmed.slice(0, -1))) return { level: 3, text: trimmed.slice(0, -1).trim() };
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
      for (let start = 0; start < sentence.length; start += max) parts.push(sentence.slice(start, start + max));
      continue;
    }
    current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Cuts a document into sections of about `chunkTarget` characters, at paragraph boundaries, each
 * with the title path it sits under. Headings never end up alone in a chunk.
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
      continue;
    }
    // A line that ends a sentence or starts a list item closes the paragraph (PDF lines break mid-sentence).
    if (/^\s*([•\-*–]|\d+[.)])\s/.test(line)) endParagraph();
    paragraph = paragraph ? `${paragraph} ${line.trim()}` : line.trim();
    if (/[.!?:]$/.test(line.trim()) && paragraph.length > limits.chunkTarget / 2) endParagraph();
    if (chunks.length >= limits.maxChunks) break;
  }
  endParagraph();
  flush();
  return chunks.slice(0, limits.maxChunks);
}

/** The best 1–3 sentences of a chunk for a question, in their original order (for quoting). */
export function bestSentences(body: string, isRelevant: (sentence: string) => number, max = 3, maxChars = 600): string {
  const sentences = body
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const scored = sentences.map((sentence, index) => ({ sentence, index, score: isRelevant(sentence) }));
  const picked = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, max)
    .sort((a, b) => a.index - b.index);
  const chosen = picked.length ? picked.map((item) => item.sentence) : sentences.slice(0, 2);
  let text = "";
  for (const sentence of chosen) {
    if (text && (text + " " + sentence).length > maxChars) break;
    text = text ? `${text} ${sentence}` : sentence.slice(0, maxChars);
  }
  return text;
}
