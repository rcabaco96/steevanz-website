// Steevanz review reader: runs on a local computer, picks up jobs queued by the panel and the daily
// routine (review_import_jobs), reads Google Maps in a visible browser window (Edge on Windows, Chrome/Chromium on a Linux server) and writes to Supabase,
// reporting progress as it goes. Start it with: npm run reader (see README.md in this folder).
//
// Business rules (.claude/skills/regras-negocio-reviews): never the name, photo or profile of who
// wrote a review; for competitors only aggregates, never review texts.
import { execFileSync } from "node:child_process";
import { mkdirSync, openSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync, closeSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { cronSecret, siteUrl, heartbeatMs, humanPause, log, pollMs, profileDir, readerId, serviceKey, staleJobMs, supabaseUrl, sleep, slots as readerSlots, GoogleLimitError, throttle, UserError, version, dryRun, WaitError } from "./config.mjs";
import { acquireTab, closeBrowser, releaseTab } from "./browser.mjs";
import { handlers } from "./jobs.mjs";
import { createStore } from "./store.mjs";
import { pickReaderJob, readerJobKey } from "../../src/lib/reviews/maps-reader.ts";
import { handRetiredJobsToReader } from "../../src/lib/reviews/reader-queue.ts";
import { previousCompetitionUpdate, slotLabel } from "../../src/lib/reviews/competition-schedule.ts";
import {
  clientJobKinds,
  competitorPause,
  initialCooldown,
  isCompetitorWork,
  isPaused,
  limitFailNote,
  limitOutcome,
  limitWaitNote,
  lisbonTime,
  recordLimit,
  recordSuccess,
  restoreCooldown,
} from "../../src/lib/reviews/reader-throttle.ts";

// --- One reader per computer (per profile folder) ----------------------------------------------
const lockFile = join(profileDir, "reader.lock");

function processAlive(pid) {
  try {
    process.kill(pid, 0);
  } catch (error) {
    if (error.code !== "EPERM") return false;
  }
  // After a restart the number may belong to another program: only a Node process counts.
  if (process.platform === "linux") {
    try {
      return /node/i.test(readFileSync(`/proc/${pid}/cmdline`, "utf8"));
    } catch {
      return false;
    }
  }
  if (process.platform !== "win32") return true;
  try {
    return /node/i.test(execFileSync("tasklist", ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"], { encoding: "utf8" }));
  } catch {
    return true;
  }
}

// --- Restart with new code -------------------------------------------------------------------------
// Exit codes understood by the supervisor (scripts/reader/run.mjs, what `npm run reader` starts):
// 75 = the code changed, start again now; 2 = cannot run (another reader, missing setup), do not retry.
const exitNewCode = 75;
const exitFatal = 2;
const repoRoot = join(import.meta.dirname, "..", "..");

/** A fingerprint of the code the reader runs (its own files and src/lib): newest change, count and size. */
function codeFingerprint() {
  let newest = 0;
  let files = 0;
  let bytes = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(mjs|ts|tsx)$/.test(entry.name)) {
        const stat = statSync(path);
        newest = Math.max(newest, stat.mtimeMs);
        files++;
        bytes += stat.size;
      }
    }
  };
  try {
    walk(join(repoRoot, "scripts", "reader"));
    walk(join(repoRoot, "src", "lib"));
  } catch {
    return null;
  }
  return `${newest}:${files}:${bytes}`;
}

const startedCode = codeFingerprint();
/** New code on disk: no new job is claimed and the reader restarts once the running ones finish. */
let restartPending = false;

function checkNewCode() {
  if (restartPending || !startedCode) return;
  const current = codeFingerprint();
  if (!current || current === startedCode) return;
  restartPending = true;
  log(running.size ? `código novo do leitor: reinicia quando acabar os ${running.size} pedido(s) em curso (não pega em novos)` : "código novo do leitor: a reiniciar…");
}

function takeLock() {
  mkdirSync(profileDir, { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = openSync(lockFile, "wx");
      writeFileSync(fd, String(process.pid));
      closeSync(fd);
      return;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    const pid = Number(readFileSync(lockFile, "utf8").trim());
    if (pid && pid !== process.pid && processAlive(pid)) {
      console.error(
        `O leitor Steevanz já está a correr neste computador (processo ${pid}). Feche essa janela (ou termine o processo ${pid}) antes de abrir outro.\n` +
          `Se tiver a certeza de que não está a correr, apague o ficheiro ${lockFile}.`,
      );
      process.exit(exitFatal);
    }
    // Left behind by a reader that stopped without cleaning up.
    try {
      unlinkSync(lockFile);
    } catch {}
  }
  throw new Error(`Não foi possível criar ${lockFile}.`);
}

function releaseLock() {
  try {
    if (Number(readFileSync(lockFile, "utf8").trim()) === process.pid) unlinkSync(lockFile);
  } catch {}
}

// --- Supabase -------------------------------------------------------------------------------------
if (!supabaseUrl || !serviceKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(exitFatal);
}
const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const jobColumns = "id, kind, business_id, place_id, priority, requested_at, not_before, attempts";
const now = () => new Date().toISOString();
/** The migration this reader needs (not_before/attempts in the queue, paused_until in the status, competitors_rule_version). */
const throttleMigration = "supabase/migrations/20261010100000_reader_throttle.sql";

/** Jobs this process is running, by target (business or place): { id, kind }. */
const running = new Map();

// --- Pacing against Google's limits (rules in src/lib/reviews/reader-throttle.ts) -------------------
/** Limit signals and the pause: while paused, no new competitor job starts; customers' jobs still do. */
let cooldown = initialCooldown;
/** Why the reader is paused (pt-PT, stored in review_reader_status.pause_reason). */
let pauseReason = null;
/** No competitor job starts before this (a random pause between competitor starts). */
let competitorReadyAt = 0;

const pausedNow = () => isPaused(cooldown, Date.now());

async function heartbeat() {
  const paused = pausedNow();
  const { error } = await db.from("review_reader_status").upsert({
    id: readerId,
    last_seen_at: now(),
    version: `${version} · pid ${process.pid}`,
    busy: running.size > 0,
    paused_until: paused ? new Date(cooldown.pausedUntil).toISOString() : null,
    pause_reason: paused ? pauseReason : null,
  });
  if (error) log("aviso: heartbeat falhou:", error.message);
}

/**
 * A sign that Google is limiting this browser. With enough of them in a short time the reader stops
 * starting competitor work for a while (3 min, then 9, 27, up to 30 while it keeps happening); the
 * customers' own jobs keep running.
 */
function noteLimit(message) {
  const { state, started } = recordLimit(cooldown, Date.now(), throttle);
  cooldown = state;
  if (!started) {
    if (!pausedNow()) log(`  sinal de limite do Google (${cooldown.signals.length} de ${throttle.limitSignals} em ${Math.round(throttle.limitWindowMs / 60_000)} min antes de uma pausa)`);
    return;
  }
  pauseReason = `O Google está a limitar o leitor. Último sinal: ${message}`.slice(0, 300);
  log(`O Google está a limitar o leitor: pausa de ${started} min nas leituras de concorrentes (as dos clientes continuam); retoma às ${lisbonTime(cooldown.pausedUntil)}. Último sinal: ${message}`);
  void heartbeat();
}

/** Logs the end of a pause once and clears it from the status. */
function endPauseIfOver() {
  if (cooldown.pausedUntil === null || pausedNow()) return;
  cooldown = { ...cooldown, pausedUntil: null };
  pauseReason = null;
  log("pausa terminada: o leitor volta às leituras de concorrentes");
  void heartbeat();
}

/**
 * Jobs hit by a Google limit go back to the queue for later (never before the pause ends), with an
 * attempts counter; after the last attempt they fail with a clear message.
 */
async function retryLater(job, message, store) {
  const outcome = limitOutcome(job.attempts ?? 0, Date.now(), cooldown.pausedUntil, throttle, job.kind);
  if (outcome.action === "fail") return failJob(job, limitFailNote(outcome.attempts, message), store, { attempts: outcome.attempts });
  const { error } = await db
    .from("review_import_jobs")
    .update({ status: "queued", started_at: null, reader_id: null, attempts: outcome.attempts, not_before: new Date(outcome.notBefore).toISOString(), error: limitWaitNote(outcome.notBefore), updated_at: now() })
    .eq("id", job.id)
    .eq("status", "running");
  if (error) return log("aviso: não foi possível pôr o pedido de volta na fila:", error.message);
  log(`  pedido ${job.kind} limitado pelo Google: volta à fila às ${lisbonTime(outcome.notBefore)} (tentativa ${outcome.attempts} de ${throttle.limitAttempts})`);
}

/** Waits of a job that is not ready yet (WaitError) before it fails: ~10 min at 30 s. */
const waitAttempts = 20;

/** Not ready yet (WaitError): back to the queue in a few seconds, no pause, no Google limit counted. */
async function waitLater(job, error, store) {
  const attempts = (job.attempts ?? 0) + 1;
  if (attempts > waitAttempts) return failJob(job, "Não foi possível saber onde fica o negócio no Google Maps.", store, { attempts });
  const notBefore = new Date(Date.now() + error.seconds * 1000);
  const { error: dbError } = await db
    .from("review_import_jobs")
    .update({ status: "queued", started_at: null, reader_id: null, attempts, not_before: notBefore.toISOString(), error: error.message, updated_at: now() })
    .eq("id", job.id)
    .eq("status", "running");
  if (dbError) return log("aviso: não foi possível pôr o pedido de volta na fila:", dbError.message);
  log(`  pedido ${job.kind}: ${error.message} (volta a tentar às ${lisbonTime(notBefore)})`);
}

/** The reader needs the columns of the throttle migration: without them, stop clearly. */
async function checkSchema() {
  const [jobs, status, businesses] = await Promise.all([
    db.from("review_import_jobs").select("not_before, attempts").limit(1),
    db.from("review_reader_status").select("id, paused_until, pause_reason").eq("id", readerId).maybeSingle(),
    db.from("review_businesses").select("competitors_rule_version").limit(1),
  ]);
  const error = jobs.error ?? status.error ?? businesses.error;
  if (error) {
    console.error(`Falta aplicar a migração ${throttleMigration} no Supabase (${error.message}). Aplique-a e volte a ligar o leitor.`);
    process.exit(exitFatal);
  }
  // A pause from before a restart still holds (Google does not forget because the reader restarted).
  cooldown = restoreCooldown(status.data?.paused_until, Date.now());
  if (pausedNow()) {
    pauseReason = status.data?.pause_reason ?? "O Google está a limitar o leitor.";
    log(`O Google estava a limitar o leitor antes de reiniciar: sem leituras de concorrentes novas até às ${lisbonTime(cooldown.pausedUntil)} (as dos clientes continuam)`);
  }
}

/** Note on a job put back in the queue after a reader stopped halfway (a second stop fails it). */
const resumedNote = "Retomado: o leitor parou a meio e voltou a pegar neste pedido.";

/**
 * Jobs this reader's kind left "running" when it stopped halfway (closed window, crash): back to
 * the queue once (they resume from what is stored, no gaps); a job that was already resumed fails.
 * Only the reader's own jobs (jobs of Google's official API are not touched).
 */
async function failStaleJobs() {
  const { data, error } = await db
    .from("review_import_jobs")
    .select("id, error")
    .eq("status", "running")
    .eq("provider", "reader")
    .lt("updated_at", new Date(Date.now() - staleJobMs).toISOString());
  if (error) return log("aviso:", error.message);
  let resumed = 0;
  let failed = 0;
  for (const job of data ?? []) {
    const again = job.error === resumedNote;
    const { error: updateError } = await db
      .from("review_import_jobs")
      .update(
        again
          ? { status: "failed", error: "O leitor parou duas vezes a meio deste pedido. Tente outra vez.", finished_at: now(), updated_at: now() }
          : { status: "queued", started_at: null, reader_id: null, error: resumedNote, updated_at: now() },
      )
      .eq("id", job.id)
      .eq("status", "running");
    if (updateError) log("aviso:", updateError.message);
    else if (again) failed++;
    else resumed++;
  }
  if (resumed) log(`${resumed} pedido(s) deixado(s) a meio de volta à fila`);
  if (failed) log(`${failed} pedido(s) que já tinham parado a meio marcados como falhados`);
}

async function claim(job) {
  const { data, error } = await db
    .from("review_import_jobs")
    .update({ status: "running", reader_id: readerId, started_at: now(), updated_at: now() })
    .eq("id", job.id)
    .eq("status", "queued")
    .eq("provider", "reader")
    .or(dueFilter())
    .select(jobColumns)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function failJob(job, message, store, extra = {}) {
  log(`  pedido ${job.kind} falhou:`, message);
  if (job.place_id) await store.readerPlace(job.place_id, { last_error: message }).catch(() => {});
  else if (job.business_id) await store.updateBusiness(job.business_id, { last_sync_error: message }).catch(() => {});
  await finishJob(job, { status: "failed", error: message, ...extra });
}

async function finishJob(job, fields) {
  const { error } = await db
    .from("review_import_jobs")
    .update({ ...fields, finished_at: now(), updated_at: now() })
    .eq("id", job.id);
  if (error) log("aviso: não foi possível fechar o pedido:", error.message);
}

/** Message stored in the job: our own messages are for the customer; anything else is generic. */
function userMessage(error) {
  if (error instanceof UserError) return error.message;
  log("  detalhe técnico:", error instanceof Error ? (error.stack ?? error.message) : error);
  return "O leitor teve um erro inesperado. Tente outra vez daqui a pouco.";
}

async function runJob(job, store) {
  let tab = null;
  const started = Date.now();
  try {
    const handler = handlers[job.kind];
    if (!handler) throw new UserError(`Tipo de pedido desconhecido: ${job.kind}.`);
    // A short human-like pause between places.
    await humanPause();
    tab = await acquireTab();
    // A note (e.g. a customer linked to Google Business Profile, not read) is kept in the job.
    const result = await handler(job, tab, store);
    if (result?.note) log(`  ${result.note}`);
    // Done with what Google showed, but Google limited it: a signal towards a pause. A read that
    // went well makes the next pause short again.
    if (result?.limited) noteLimit(result.note ?? "O Google parou de mostrar reviews a meio.");
    else if (!result?.noGoogle) cooldown = recordSuccess(cooldown);
    await finishJob(job, { status: "done", error: result?.note ?? null });
    log(`  pedido ${job.kind} concluído em ${((Date.now() - started) / 1000).toFixed(1)} s`);
  } catch (error) {
    const message = userMessage(error).slice(0, 300);
    if (error instanceof WaitError) await waitLater(job, error, store);
    else if (error instanceof GoogleLimitError) {
      // Not the place's fault: back to the queue for later, and a signal towards a pause.
      log(`  pedido ${job.kind}: o Google limitou a leitura (${message})`);
      noteLimit(message);
      await retryLater(job, message, store);
    } else await failJob(job, message, store);
  } finally {
    if (tab) await releaseTab(tab);
  }
}

/**
 * Jobs queued for a provider that no longer exists (the old paid services) are taken over: nothing
 * else runs them, and while one waits no new job of that kind can be queued for the same target.
 */
async function takeOverRetiredJobs() {
  try {
    const handed = await handRetiredJobsToReader(db);
    if (handed) log(`${handed} pedido(s) de um fornecedor antigo passado(s) para o leitor`);
  } catch (error) {
    log("aviso:", error instanceof Error ? error.message : error);
  }
}

/** Queued jobs whose time has come (not_before empty or past). */
const dueFilter = () => `not_before.is.null,not_before.lte."${now()}"`;
const clientKindsList = `(${clientJobKinds.join(",")})`;

/**
 * Fills the free slots with queued jobs: priority first, never two jobs for the same target. One tab
 * is always kept for the customers' own jobs (full/update, pickReaderJob); competitor work runs in
 * parallel in the others (READER_COMPETITOR_SLOTS) with a short gap between starts
 * (READER_COMPETITOR_PAUSE_MS) and never waits for the customers' reviews. While Google limits the reader (a pause), no competitor work starts;
 * the customers' jobs still do, so the reader is always there for them.
 */
async function fillSlots(store) {
  if (restartPending) {
    if (!running.size) await shutdown(exitNewCode);
    return;
  }
  endPauseIfOver();
  if (running.size >= readerSlots) return;
  // Customers' jobs and the rest apart, so a long competitor queue never hides a customer's job.
  const [clients, others, active] = await Promise.all([
    db.from("review_import_jobs").select(jobColumns).eq("status", "queued").eq("provider", "reader").in("kind", [...clientJobKinds]).or(dueFilter()).order("priority").order("requested_at").limit(50),
    db.from("review_import_jobs").select(jobColumns).eq("status", "queued").eq("provider", "reader").not("kind", "in", clientKindsList).or(dueFilter()).order("priority").order("requested_at").limit(50),
    // Targets being read right now, here or by another reader.
    db.from("review_import_jobs").select("kind, business_id, place_id").eq("status", "running"),
  ]);
  const error = clients.error ?? others.error ?? active.error;
  if (error) return log("aviso:", error.message);
  let candidates = [...(clients.data ?? []), ...(others.data ?? [])];
  if (!candidates.length) return;
  const busy = new Set([...running.keys(), ...(active.data ?? []).map(readerJobKey)]);
  while (running.size < readerSlots) {
    const gate = {
      now: Date.now(),
      competitorRunning: [...running.values()].filter((job) => isCompetitorWork(job.kind)).length,
      competitorSlots: throttle.competitorSlots,
      competitorReady: Date.now() >= competitorReadyAt,
      paused: pausedNow(),
    };
    const job = pickReaderJob(candidates, busy, running.size, readerSlots, gate);
    if (!job) break;
    candidates = candidates.filter((candidate) => candidate.id !== job.id);
    const claimed = await claim(job);
    if (!claimed) continue;
    if (isCompetitorWork(claimed.kind)) competitorReadyAt = Date.now() + competitorPause(throttle.competitorPauseMs, Math.random());
    const key = readerJobKey(claimed);
    busy.add(key);
    running.set(key, { id: claimed.id, kind: claimed.kind });
    const retry = claimed.attempts ? `, tentativa ${claimed.attempts + 1} de ${throttle.limitAttempts}` : "";
    log(`pedido ${claimed.kind} (prioridade ${claimed.priority}${retry}) — ${running.size}/${readerSlots} em curso`);
    void heartbeat();
    void runJob(claimed, store).finally(() => {
      running.delete(key);
      void heartbeat();
    });
  }
}

// --- Competitor base: 10:00 and 19:00 in Portugal ---------------------------------------------------
/** Slot (ISO) already triggered; null on start, so a slot missed while the reader was off is caught up. */
let triggeredSlot = null;
let triggerRetryAt = 0;
let triggering = false;

/**
 * At each slot (and once on start) asks the site to queue the competitor reads of the slot
 * (GET /api/cron/competition: places not read since the previous slot). Safe to repeat. Checked
 * every minute, so a computer that slept through a slot catches up when it wakes.
 */
async function triggerCompetitionSlot() {
  const slot = previousCompetitionUpdate(new Date()).toISOString();
  if (triggering || slot === triggeredSlot || Date.now() < triggerRetryAt) return;
  if (!cronSecret) {
    triggeredSlot = slot;
    return log("aviso: falta CRON_SECRET no .env.local; a concorrência das 10:00/19:00 não é pedida");
  }
  triggering = true;
  try {
    const response = await fetch(`${siteUrl}/api/cron/competition`, { headers: { authorization: `Bearer ${cronSecret}` }, signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`resposta ${response.status}`);
    triggeredSlot = slot;
    log(`concorrência das ${slotLabel(new Date(slot))} pedida ao site`);
  } catch (error) {
    triggerRetryAt = Date.now() + 5 * 60_000;
    log(`aviso: não foi possível pedir a concorrência ao site (${siteUrl}); nova tentativa em 5 min:`, error instanceof Error ? error.message : error);
  } finally {
    triggering = false;
  }
}

let stopping = false;
async function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  if (running.size && !dryRun) {
    log("a desligar: pedidos em curso marcados como falhados");
    await Promise.race([
      db
        .from("review_import_jobs")
        .update({ status: "failed", error: "O leitor foi desligado a meio. Tente outra vez.", finished_at: now(), updated_at: now() })
        .in("id", [...running.values()].map((job) => job.id))
        .eq("status", "running"),
      sleep(3000),
    ]);
  }
  await Promise.race([closeBrowser(), sleep(2000)]);
  releaseLock();
  process.exit(code);
}

async function main() {
  takeLock();
  process.on("exit", releaseLock);
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(signal, () => void shutdown(0));
  // One tab's stray error (a closed connection, a page that changed) must not close the whole reader:
  // log it and keep serving the other tabs. Each job still fails or finishes on its own.
  process.on("unhandledRejection", (reason) => log("erro inesperado (o leitor continua):", reason instanceof Error ? (reason.stack ?? reason.message) : reason));
  process.on("uncaughtException", (error) => log("erro inesperado (o leitor continua):", error instanceof Error ? (error.stack ?? error.message) : error));

  if (dryRun) return runDryRun();

  const store = createStore(db, { dryRun: false });
  await checkSchema();
  log(`leitor Steevanz ${version} ligado (${readerId}, processo ${process.pid}). Até ${readerSlots} pedidos ao mesmo tempo. À espera de pedidos…`);
  log(
    `ritmo: 1 separador sempre livre para os clientes; concorrência em paralelo, até ${throttle.competitorSlots} de cada vez, ${throttle.competitorPauseMs / 1000}–${(2 * throttle.competitorPauseMs) / 1000} s entre leituras; ` +
      `com ${throttle.limitSignals} sinais de limite do Google em ${Math.round(throttle.limitWindowMs / 60_000)} min, pausa de ${throttle.cooldownMinutes} a ${throttle.cooldownMaxMinutes} min; ` +
      `pedidos limitados voltam à fila (${throttle.limitAttempts} tentativas)`,
  );
  await failStaleJobs();
  await takeOverRetiredJobs();
  setInterval(() => void takeOverRetiredJobs(), 60_000);
  await heartbeat();
  setInterval(() => void heartbeat(), heartbeatMs);
  void triggerCompetitionSlot();
  setInterval(() => void triggerCompetitionSlot(), 60_000);
  setInterval(checkNewCode, 60_000);
  for (;;) {
    await fillSlots(store).catch((error) => log("aviso:", error instanceof Error ? error.message : error));
    await sleep(pollMs);
  }
}

/** --dry-run: one job on a separate browser, nothing written to Supabase and the queue untouched. */
async function runDryRun() {
  const store = createStore(db, { dryRun: true });
  const { kind, place, business } = dryRun;
  if (!handlers[kind]) throw new Error(`--kind tem de ser um de: ${Object.keys(handlers).join(", ")}`);
  const placeJob = kind === "competitor" || kind === "competitor_replies";
  if (placeJob && !place) throw new Error(`--kind ${kind} precisa de --place <placeId>`);
  if (!placeJob && !business) throw new Error(`--kind ${kind} precisa de --business <slug>`);
  const job = {
    id: "dry-run",
    kind,
    priority: 1,
    place_id: placeJob ? place : null,
    business_id: placeJob ? null : (await store.business({ slug: business })).id,
  };
  log(`[dry-run] ${kind} ${place ?? business}: nada é escrito no Supabase`);
  const tab = await acquireTab();
  const started = Date.now();
  try {
    const result = await handlers[kind](job, tab, store);
    if (result?.note) log(`[dry-run] ${result.note}`);
    log(`[dry-run] concluído em ${((Date.now() - started) / 1000).toFixed(1)} s`);
  } catch (error) {
    log("[dry-run] falhou:", error instanceof UserError ? error.message : error);
    process.exitCode = 1;
  } finally {
    await releaseTab(tab);
  }
  await shutdown(process.exitCode ?? 0);
}

await main();
