// Copies hls.js's worker into public/hls/<version>/ before a build (and before dev), so the video
// menus' players unpack their video off the page's thread: the module build of hls.js the site
// imports has no worker of its own. The folder is ignored by git: always the installed version's.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const manifest = require.resolve("hls.js/package.json");
const { version } = JSON.parse(readFileSync(manifest, "utf8"));
const target = join("public", "hls", version);
mkdirSync(target, { recursive: true });
copyFileSync(join(dirname(manifest), "dist", "hls.worker.js"), join(target, "hls.worker.js"));
console.log(`hls.js ${version} worker -> ${target}`);
