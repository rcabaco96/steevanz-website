// Downloads O Quintal's product photos from its current shop (o-quintal.com, Jumpseller) into
// public/media/clients/o-quintal/produtos/<id>.webp and rewrites src/content/o-quintal/images.ts.
//
//   node scripts/o-quintal/fetch-images.mjs
//
// Free (plain image downloads, no API). Each file is treated as untrusted: only http(s) images from the
// Jumpseller CDN, at most 8 MB, checked by its first bytes (JPEG/PNG/WebP/GIF) and re-encoded by sharp to WebP
// (nothing downloaded is ever executed). Products whose photo fails keep the placeholder.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const allowedHosts = new Set(["cdnx.jumpseller.com", "images.jumpseller.com", "assets.jumpseller.com"]);
const maxBytes = 8 * 1024 * 1024;
const outDir = join("public", "media", "clients", "o-quintal", "produtos");
const publicPrefix = "/media/clients/o-quintal/produtos";

// The catalogue is TypeScript: read the ids and image paths from its source text (no TS loader needed).
const source = readFileSync(join("src", "content", "o-quintal", "products.ts"), "utf8");
// One block per `product({ … })`, so a product without a photo never borrows the next one's.
const rows = source
  .split("product({")
  .slice(1)
  .map((block) => ({ id: /\bid: "([^"]+)"/.exec(block)?.[1], image: /\bimage: "([^"]+)"/.exec(block)?.[1] }))
  .filter((row) => row.id && row.image)
  .map((row) => ({ id: row.id, url: `https://cdnx.jumpseller.com/oquintal/image/${row.image}` }));

function looksLikeImage(bytes) {
  const b = bytes.subarray(0, 12);
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const webp = b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP";
  const gif = b.toString("ascii", 0, 3) === "GIF";
  return jpeg || png || webp || gif;
}

mkdirSync(outDir, { recursive: true });
const saved = {};
for (const { id, url } of rows) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname)) throw new Error("host not allowed");
    const response = await fetch(parsed, { redirect: "error" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error(`not an image (${type})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > maxBytes) throw new Error("too large");
    if (!looksLikeImage(bytes)) throw new Error("unknown image format");
    const file = join(outDir, `${id}.webp`);
    const info = await sharp(bytes, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(file);
    saved[id] = { src: `${publicPrefix}/${id}.webp`, width: info.width, height: info.height };
    console.log("ok  ", id, `${info.width}×${info.height}`);
  } catch (error) {
    console.warn("fail", id, error instanceof Error ? error.message : error);
  }
}

const header = readFileSync(join("src", "content", "o-quintal", "images.ts"), "utf8").split("export const oQuintalLocalImages")[0];
const body = Object.entries(saved)
  .map(([id, image]) => `  ${JSON.stringify(id)}: { src: ${JSON.stringify(image.src)}, width: ${image.width}, height: ${image.height} },`)
  .join("\n");
writeFileSync(
  join("src", "content", "o-quintal", "images.ts"),
  `${header}export const oQuintalLocalImages: Readonly<Record<string, OQuintalLocalImage>> = {${body ? `\n${body}\n` : ""}};\n`,
);
console.log(`\n${Object.keys(saved).length} of ${rows.length} photos saved. Record them in public/media/clients/o-quintal/LICENCAS.txt.`);
