// Steevanz prospector: runs the prospecting searches asked for in the admin (Contactos › Encontrar clientes).
// Picks the next search from Supabase, asks the open-source google-maps-scraper (Docker, only on
// localhost, see docker-compose.yml here) to run it, and stores the businesses it found. Like the
// reviews reader, it only makes outgoing connections: nothing on this computer is opened to the web.
// Between searches it also opens the website of each business not checked yet (free, one page each)
// and labels it for the CRM (no site of its own, down, out of date…).
//   docker compose -f scripts/prospector/docker-compose.yml up -d
//   npm run prospector
// Needs .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv, prospectFromRow } from "../../src/lib/prospects/rules.ts";
import { checkSite } from "../../src/lib/prospects/site-check.ts";

const envFile = join(import.meta.dirname, "../../.env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const scraper = (process.env.GMAPS_SCRAPER_URL ?? "http://127.0.0.1:8080").replace(/\/+$/, "");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const pollMs = 10_000;
/** A search left "running" this long was interrupted (the prospector or the computer stopped). */
const staleMs = 45 * 60_000;
/** Longest a single search may take in the scraper. */
const maxSearchMs = 30 * 60_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (...parts) => console.log(new Date().toLocaleTimeString("pt-PT"), ...parts);
const check = ({ error }) => {
  if (error) throw new Error(error.message);
};

async function scraperFetch(path, init) {
  const response = await fetch(`${scraper}${path}`, init);
  if (!response.ok) throw new Error(`scraper ${init?.method ?? "GET"} ${path}: ${response.status} ${(await response.text()).slice(0, 200)}`);
  return response;
}

/** Searches left running by a prospector that stopped are marked as failed (they can be asked again). */
async function failInterrupted() {
  const { data } = await db
    .from("prospect_searches")
    .update({ status: "failed", error: "Interrompida: o prospetor parou a meio. Peça a pesquisa outra vez.", finished_at: new Date().toISOString() })
    .eq("status", "running")
    .lt("started_at", new Date(Date.now() - staleMs).toISOString())
    .select("id");
  if (data?.length) log(`${data.length} pesquisa(s) interrompida(s) marcadas como falhadas`);
}

/** The oldest queued search, claimed so that two prospectors never run the same one. */
async function claim() {
  const { data: next } = await db.from("prospect_searches").select("id").eq("status", "queued").order("created_at").limit(1).maybeSingle();
  if (!next) return null;
  const { data } = await db
    .from("prospect_searches")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", next.id)
    .eq("status", "queued")
    .select("*")
    .maybeSingle();
  return data;
}

async function runScraper(search) {
  // depth = how far the result list is scrolled (about 10 places each), with some margin.
  const depth = Math.min(30, Math.max(2, Math.ceil(search.max_results / 8)));
  const created = await (
    await scraperFetch("/api/v1/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `steevanz-${search.id}`, keywords: [`${search.query} ${search.area}`], lang: "pt", zoom: 15, depth, email: true, max_time: Math.round(maxSearchMs / 1000) }),
    })
  ).json();
  const jobId = created.id ?? created.ID;
  if (!jobId) throw new Error(`o scraper não devolveu o id da pesquisa: ${JSON.stringify(created).slice(0, 200)}`);
  await db.from("prospect_searches").update({ scraper_job: String(jobId) }).eq("id", search.id);
  const deadline = Date.now() + maxSearchMs + 5 * 60_000;
  for (;;) {
    await sleep(pollMs);
    const job = await (await scraperFetch(`/api/v1/jobs/${jobId}`)).json();
    const status = String(job.status ?? job.Status ?? "").toLowerCase();
    if (status === "ok") break;
    if (status === "failed") throw new Error("o scraper não conseguiu fazer a pesquisa");
    if (Date.now() > deadline) throw new Error("a pesquisa demorou demasiado");
  }
  const csv = await (await scraperFetch(`/api/v1/jobs/${jobId}/download`)).text();
  // The scraper keeps its own copy of every job; ours is in Supabase now.
  await scraperFetch(`/api/v1/jobs/${jobId}`, { method: "DELETE" }).catch(() => {});
  return csv;
}

/** Stores the businesses: new ones as «Novo»; known ones get fresh data but keep their status and notes. */
async function store(search, csv) {
  const seen = new Set();
  const found = parseCsv(csv)
    .map(prospectFromRow)
    .filter((row) => row && !seen.has(row.place_id) && seen.add(row.place_id))
    .slice(0, search.max_results);
  const ids = found.map((row) => row.place_id);
  const known = new Set();
  for (let index = 0; index < ids.length; index += 200) {
    const { data, error } = await db.from("prospects").select("place_id").in("place_id", ids.slice(index, index + 200));
    if (error) throw new Error(error.message);
    for (const row of data) known.add(row.place_id);
  }
  const now = new Date().toISOString();
  const fresh = found.filter((row) => !known.has(row.place_id)).map((row) => ({ ...row, first_search_id: search.id, last_search_id: search.id }));
  if (fresh.length) check(await db.from("prospects").insert(fresh));
  for (const row of found.filter((item) => known.has(item.place_id))) {
    check(await db.from("prospects").update({ ...row, last_search_id: search.id, updated_at: now }).eq("place_id", row.place_id));
  }
  // The database links each business to this search (prospect_search_hits, by trigger).
  return { results: found.length, newResults: fresh.length };
}

async function work(search) {
  log(`a pesquisar «${search.query}» em ${search.area} (até ${search.max_results})`);
  try {
    const csv = await runScraper(search);
    const { results, newResults } = await store(search, csv);
    check(await db.from("prospect_searches").update({ status: "done", results, new_results: newResults, finished_at: new Date().toISOString(), error: null }).eq("id", search.id));
    log(`concluída: ${results} negócios, ${newResults} novos`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const offline = /fetch failed|ECONNREFUSED/i.test(reason);
    log("falhou:", reason);
    await db
      .from("prospect_searches")
      .update({
        status: "failed",
        error: (offline ? "O scraper não está a correr (abra o Docker e corra o docker compose do prospetor)." : `Falhou: ${reason}`).slice(0, 500),
        finished_at: new Date().toISOString(),
      })
      .eq("id", search.id);
  }
}

/**
 * Labels the websites not checked yet, a few at a time (newest businesses first). Only rows still
 * unchecked are written, so a label set by hand in the CRM is never overwritten. Returns how many.
 */
async function checkSites(limit = 24) {
  const { data, error } = await db.from("prospects").select("place_id, name, website").is("site_checked_at", null).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  if (!data.length) return 0;
  const queue = [...data];
  const worker = async () => {
    for (let prospect = queue.shift(); prospect; prospect = queue.shift()) {
      // A check that breaks leaves the label empty («por verificar») but is not tried again in a loop.
      const verdict = await checkSite(prospect.website).catch(() => ({ status: null, reasons: [] }));
      check(
        await db
          .from("prospects")
          .update({ site_status: verdict.status, site_reasons: verdict.reasons, site_checked_at: new Date().toISOString() })
          .eq("place_id", prospect.place_id)
          .is("site_checked_at", null),
      );
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  log(`${data.length} site(s) vistos`);
  return data.length;
}

log(`prospetor ligado · scraper em ${scraper}`);
for (;;) {
  try {
    await failInterrupted();
    const search = await claim();
    if (search) await work(search);
    else if (!(await checkSites())) await sleep(pollMs);
  } catch (error) {
    log("erro:", error instanceof Error ? error.message : error);
    await sleep(pollMs);
  }
}
