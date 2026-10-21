// Text out of the files the business sends, on the server and with free code: Word (.docx) read
// here with Node's zlib (a .docx is a zip of XML files), PDF through the open-source `unpdf`
// (pdf.js), text, Markdown and HTML as they are. Scanned PDFs (images) have no text: they are refused
// with a clear message (OCR would be a paid or heavy extra).
import { inflateRawSync } from "node:zlib";
import { cleanText, decodeEntities, documentKindOf, htmlToText, type DocumentKind } from "./documents.ts";

export class ExtractError extends Error {}

/** The files inside a zip (names → bytes), enough for .docx (stored or deflated entries). */
export function readZip(buffer: Uint8Array): Map<string, Uint8Array> {
  const data = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let end = -1;
  for (let offset = data.length - 22; offset >= Math.max(0, data.length - 65_557); offset--) {
    if (data.readUInt32LE(offset) === 0x06054b50) {
      end = offset;
      break;
    }
  }
  if (end < 0) throw new ExtractError("O ficheiro Word está danificado (não é um .docx válido).");
  const count = data.readUInt16LE(end + 10);
  let pointer = data.readUInt32LE(end + 16);
  const files = new Map<string, Uint8Array>();
  for (let index = 0; index < count; index++) {
    if (data.readUInt32LE(pointer) !== 0x02014b50) throw new ExtractError("O ficheiro Word está danificado.");
    const method = data.readUInt16LE(pointer + 10);
    const compressedSize = data.readUInt32LE(pointer + 20);
    const nameLength = data.readUInt16LE(pointer + 28);
    const extraLength = data.readUInt16LE(pointer + 30);
    const commentLength = data.readUInt16LE(pointer + 32);
    const localOffset = data.readUInt32LE(pointer + 42);
    const name = data.subarray(pointer + 46, pointer + 46 + nameLength).toString("utf8");
    pointer += 46 + nameLength + extraLength + commentLength;
    const localNameLength = data.readUInt16LE(localOffset + 26);
    const localExtraLength = data.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const raw = data.subarray(start, start + compressedSize);
    if (method === 0) files.set(name, raw);
    else if (method === 8) files.set(name, inflateRawSync(raw));
  }
  return files;
}

/** Word's document.xml → text, with «# » before headings («Heading1», «Título1», «Titre1»…). */
export function docxXmlToText(xml: string): string {
  const paragraphs: string[] = [];
  for (const match of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>|<w:p\/>/g)) {
    const paragraph = match[0];
    const style = paragraph.match(/<w:pStyle w:val="([^"]+)"/)?.[1] ?? "";
    const level = style.match(/^(?:heading|ttulo|t[ií]tulo|titre|berschrift|[üu]berschrift|titolo)\s*(\d)$/i)?.[1];
    const isTitle = /^(title|ttulo|t[ií]tulo|titre|titel|titolo)$/i.test(style);
    const pieces = [...paragraph.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br[^>]*\/>/g)].map((piece) =>
      piece[0].startsWith("<w:tab") ? "\t" : piece[0].startsWith("<w:br") ? "\n" : (piece[1] ?? ""),
    );
    const text = decodeEntities(pieces.join(""));
    if (!text.trim()) {
      paragraphs.push("");
      continue;
    }
    paragraphs.push(level ? `${"#".repeat(Math.min(6, Number(level)))} ${text.trim()}` : isTitle ? `# ${text.trim()}` : text);
  }
  return paragraphs.join("\n\n");
}

export function docxToText(buffer: Uint8Array): string {
  const files = readZip(buffer);
  const document = files.get("word/document.xml");
  if (!document) throw new ExtractError("Este ficheiro não parece ser um documento Word (.docx).");
  return cleanText(docxXmlToText(Buffer.from(document).toString("utf8")));
}

async function pdfToText(buffer: Uint8Array): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  return cleanText(pages.join("\n\n"));
}

export interface ExtractedDocument {
  kind: DocumentKind;
  text: string;
  /** From the file (HTML <title>) when there is one. */
  title: string | null;
}

export async function extractDocument(name: string, mime: string, bytes: Uint8Array): Promise<ExtractedDocument> {
  const kind = documentKindOf(name, mime, bytes.subarray(0, 8));
  if (!kind) throw new ExtractError("Formato não suportado. Envie PDF, Word (.docx), texto (.txt) ou Markdown (.md).");
  let text = "";
  let title: string | null = null;
  try {
    if (kind === "pdf") text = await pdfToText(bytes);
    else if (kind === "docx") text = docxToText(bytes);
    else {
      const raw = new TextDecoder("utf-8").decode(bytes);
      if (kind === "html") ({ title, text } = htmlToText(raw));
      else text = cleanText(raw);
    }
  } catch (error) {
    if (error instanceof ExtractError) throw error;
    throw new ExtractError(`Não consegui ler o ficheiro (${error instanceof Error ? error.message.slice(0, 120) : "erro desconhecido"}).`);
  }
  if (text.replace(/\s/g, "").length < 20) {
    throw new ExtractError(kind === "pdf" ? "Este PDF não tem texto (parece ser uma imagem digitalizada). Envie o original em Word ou cole o texto." : "O documento está vazio.");
  }
  return { kind, text, title };
}

/** Addresses the server must never fetch for a «Ler de um endereço» request. */
export function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^(127|10|0)\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
  return host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80");
}
