// What `npm run reader` starts: keeps the Steevanz reader running in this window. The reader exits
// with 75 when its code changed on disk (after an update, once its running jobs are done) and is
// started again straight away with the new code; after a crash it is started again in 10 s. Exit 2
// (another reader running, missing setup) and a normal stop (Ctrl+C) end it.
import { spawn } from "node:child_process";
import { join } from "node:path";

const exitNewCode = 75;
const exitFatal = 2;
const args = ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", join(import.meta.dirname, "reader.mjs"), ...process.argv.slice(2)];
const time = () => new Date().toLocaleTimeString("pt-PT");
let child = null;
let stopping = false;

function start() {
  child = spawn(process.execPath, args, { stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (stopping || code === 0 || code === exitFatal) process.exit(code ?? 0);
    if (code === exitNewCode) {
      console.log(time(), "a arrancar o leitor com o código novo…");
      return start();
    }
    console.log(time(), `o leitor parou (${code ?? signal}); volta a arrancar daqui a 10 s…`);
    setTimeout(start, 10_000);
  });
}

// Ctrl+C reaches the reader too (same console): it marks its jobs and closes; then this ends.
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    stopping = true;
    child?.kill(signal);
  });
}

start();
