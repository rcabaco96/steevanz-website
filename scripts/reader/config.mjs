// Settings of the local reader: command line, .env.local and fixed limits.
import { existsSync, readFileSync } from "node:fs";
import { readerSlotsFrom } from "../../src/lib/reviews/maps-reader.ts";
import { throttleFrom } from "../../src/lib/reviews/reader-throttle.ts";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

export const version = "3";

function loadEnv() {
  const file = join(import.meta.dirname, "../../.env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const { values: args } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    place: { type: "string" },
    business: { type: "string" },
    kind: { type: "string" },
  },
  strict: true,
});

/**
 * --dry-run --kind <kind> (--place <placeId> | --business <slug>): reads one place in a separate
 * browser (own port and profile), never touches the queue and never writes to Supabase: it prints
 * what it would write. For checking the reader against Google without disturbing the real one.
 */
export const dryRun = args["dry-run"]
  ? { kind: args.kind ?? (args.place ? "competitor" : "update"), place: args.place ?? null, business: args.business ?? null }
  : null;

export const readerId = hostname();
/** Tabs at once: READER_SLOTS in .env.local or the server's environment, else 4. */
export const slots = readerSlotsFrom(process.env.READER_SLOTS);
/**
 * Pacing against Google's limits (defaults in reader-throttle.ts): READER_COMPETITOR_SLOTS (3),
 * READER_COMPETITOR_PAUSE_MS (5000), READER_COOLDOWN_MIN (10), READER_COOLDOWN_MAX_MIN (60),
 * READER_LIMIT_ATTEMPTS (5).
 */
export const throttle = throttleFrom(process.env, slots);
/** Chrome, Chromium or Edge. CHROME_PATH (or EDGE_PATH) wins; otherwise the usual places per system. */
function findBrowser() {
  const configured = process.env.CHROME_PATH ?? process.env.EDGE_PATH;
  if (configured) return configured;
  const candidates = {
    win32: [
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
    ],
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"],
    linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge", "/snap/bin/chromium"],
  }[process.platform] ?? [];
  return candidates.find((path) => existsSync(path)) ?? candidates[0] ?? "chrome";
}
export const browserPath = findBrowser();
/** Extra browser switches, e.g. "--no-sandbox" when a Linux server runs it as root. */
export const browserArgs = (process.env.READER_BROWSER_ARGS ?? "").split(/\s+/).filter(Boolean);
export const profileDir = process.env.READER_PROFILE_DIR
  ? join(process.env.READER_PROFILE_DIR, dryRun ? "dry-run" : "")
  : join(homedir(), dryRun ? ".steevanz-reader-dry-run" : ".steevanz-reader");
export const port = Number(dryRun ? (process.env.READER_DRY_RUN_PORT ?? 9351) : (process.env.READER_PORT ?? 9350));
export const siteUrl = (process.env.READER_SITE_URL ?? "https://steevanz.com").replace(/\/+$/, "");
export const cronSecret = process.env.CRON_SECRET ?? null;
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const heartbeatMs = 5000;
export const pollMs = 2000;
/** A running job without progress for this long was left behind by a reader that stopped. */
export const staleJobMs = 2 * 60_000;
/** Without a new page for this long after scrolling, Google is asked again (then the read stops). */
export const pageTimeoutMs = 8000;
/** "full": the newest reviews written one page at a time, so the panel is useful within seconds. */
export const fullFirstPhaseReviews = 50;
/** "full", after the first phase: reviews written per database call. */
export const fullBatchReviews = 100;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** Human-like pause before opening a place: 0.5 to 2 seconds. */
export const humanPause = () => sleep(500 + Math.random() * 1500);
export const log = (...parts) => console.log(new Date().toLocaleTimeString("pt-PT"), ...parts);

/** An error whose message is meant for the customer (Portuguese); others are stored as a generic message. */
export class UserError extends Error {}

/**
 * Google is limiting this browser (limited view, sign-in gate, reviews that do not load, sort refused,
 * a list that stops early): the job goes back to the queue for later and counts towards a cool-down
 * of the whole reader (reader-throttle.ts). Real errors (place not found…) are plain UserErrors.
 */
export class GoogleLimitError extends UserError {}
