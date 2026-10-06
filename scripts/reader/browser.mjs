// A visible browser (Edge on Windows; Chrome or Chromium on a Linux server, headed under Xvfb)
// driven through the DevTools protocol, with a pool of reusable tabs. Each tab lives in its own
// window: browsers pause pages in background tabs (no scrolling, no new pages), while separate
// windows keep working side by side.
import { spawn } from "node:child_process";
import { browserArgs, browserPath, log, port, profileDir, sleep, slots as readerSlots, UserError } from "./config.mjs";

const commandTimeoutMs = 30_000;
/** Images, fonts and map tiles are not needed: pages open much faster without them. */
const blockedUrls = ["*.png", "*.jpg", "*.jpeg", "*.webp", "*.gif", "*.woff", "*.woff2", "*/maps/vt*", "*/kh/v=*", "*googleusercontent.com/*", "*/maps/preview/log204*"];

let edge = null;
let browserConnection = null;
const tabs = [];

async function devtools(path, init) {
  return (await fetch(`http://127.0.0.1:${port}${path}`, init)).json();
}

/** One DevTools connection (browser or page). Commands reject when the window was closed. */
async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", () => reject(new UserError("O navegador do leitor não respondeu.")), { once: true });
  });
  let seq = 0;
  const pending = new Map();
  const listeners = new Set();
  const connection = { alive: true, listeners };
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, timer } = pending.get(msg.id);
      clearTimeout(timer);
      pending.delete(msg.id);
      resolve(msg);
    }
    for (const listener of listeners) listener(msg);
  });
  ws.addEventListener("close", () => {
    connection.alive = false;
    for (const { reject, timer } of pending.values()) {
      clearTimeout(timer);
      reject(new UserError("A janela do navegador do leitor foi fechada a meio."));
    }
    pending.clear();
  });
  connection.send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      if (!connection.alive) return reject(new UserError("A janela do navegador do leitor foi fechada a meio."));
      const id = ++seq;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new UserError("O navegador do leitor deixou de responder."));
      }, commandTimeoutMs);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
  connection.close = () => ws.close();
  return connection;
}

async function ensureBrowser() {
  try {
    await devtools("/json/version");
    return;
  } catch {}
  browserConnection = null;
  log(`a abrir o navegador (porta ${port}): ${browserPath}`);
  edge = spawn(
    browserPath,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      // Windows side by side or covered by others keep loading pages.
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--window-size=1200,900",
      ...browserArgs,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  edge.on("error", (error) => log("aviso: o navegador não arrancou:", error.message));
  for (let i = 0; i < 100; i++) {
    await sleep(150);
    try {
      await devtools("/json/version");
      return;
    } catch {}
  }
  throw new UserError("O navegador do leitor não arrancou.");
}

async function browser() {
  await ensureBrowser();
  if (!browserConnection?.alive) browserConnection = await connect((await devtools("/json/version")).webSocketDebuggerUrl);
  return browserConnection;
}

async function openTab(index) {
  const root = await browser();
  const created = await root.send("Target.createTarget", { url: "about:blank", newWindow: true });
  const targetId = created.result?.targetId;
  if (!targetId) throw new UserError("Não foi possível abrir uma janela no navegador do leitor.");
  // Cascade the windows so each one stays visible.
  try {
    const { result } = await root.send("Browser.getWindowForTarget", { targetId });
    await root.send("Browser.setWindowBounds", { windowId: result.windowId, bounds: { left: 40 + index * 60, top: 40 + index * 40, width: 1200, height: 900, windowState: "normal" } });
  } catch {}
  const connection = await connect(`ws://127.0.0.1:${port}/devtools/page/${targetId}`);
  await connection.send("Page.enable");
  await connection.send("Network.enable", { maxTotalBufferSize: 200_000_000, maxResourceBufferSize: 20_000_000 });
  await connection.send("Network.setBlockedURLs", { urls: blockedUrls });
  await connection.send("Emulation.setFocusEmulationEnabled", { enabled: true }).catch(() => {});
  const evaluate = async (expression) => (await connection.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
  return { ...connection, connection, targetId, evaluate, busy: false, index };
}

/** A free tab (reused when possible). The scheduler never runs more jobs than there are slots. */
export async function acquireTab() {
  const free = tabs.find((tab) => !tab.busy && tab.connection.alive);
  if (free) {
    free.busy = true;
    return free;
  }
  // Closed windows are dropped and replaced.
  for (let i = tabs.length - 1; i >= 0; i--) if (!tabs[i].connection.alive && !tabs[i].busy) tabs.splice(i, 1);
  if (tabs.length >= readerSlots) throw new UserError("Não há janelas livres no navegador do leitor.");
  const slot = { busy: true, connection: { alive: true }, index: tabs.length };
  tabs.push(slot);
  try {
    Object.assign(slot, await openTab(slot.index), { busy: true });
    return slot;
  } catch (error) {
    tabs.splice(tabs.indexOf(slot), 1);
    throw error;
  }
}

export async function releaseTab(tab) {
  tab.listeners.clear();
  if (tab.connection.alive) await tab.send("Page.navigate", { url: "about:blank" }).catch(() => {});
  tab.busy = false;
}

/** Closes the browser this process opened (one that was already running is left alone). */
export async function closeBrowser() {
  if (!edge) return;
  if (browserConnection?.alive) await browserConnection.send("Browser.close").catch(() => {});
  edge.kill();
}
