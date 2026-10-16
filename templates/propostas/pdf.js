// Exporta proposta.pdf (16:9, um diapositivo por página), orcamento.pdf (A4 ao alto) e placas.png (ilustração das placas, para o PowerPoint) com o Microsoft Edge em modo headless.
// Uso: node pdf.js [proposta.json] [--saida pasta] [--so proposta|orcamento|placas]
// O caminho do Edge pode ser mudado com a variável de ambiente EDGE_PATH.
// Usa um perfil temporário próprio e só termina o processo que ele próprio lançou.
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const carregar = require("./dados");

const edge = process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const argv = process.argv.slice(2);
const so = argv.includes("--so") ? argv[argv.indexOf("--so") + 1] : null;
const { pastaSaida } = carregar(argv.filter((a, i) => a !== "--so" && argv[i - 1] !== "--so"));

const trabalhos = [["proposta.html", "proposta.pdf"], ["orcamento.html", "orcamento.pdf"], ["placas.html", "placas.png"]].filter(([, out]) => !so || out.startsWith(so));
for (const [html, pdf] of trabalhos) {
  const origem = path.join(pastaSaida, html);
  if (!fs.existsSync(origem)) { console.error(`Falta ${origem}: corra primeiro «node build.js».`); process.exit(1); }
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "steevanz-pdf-"));
  const url = "file:///" + origem.split(path.sep).join("/");
  const r = spawnSync(edge, [
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=15000", `--user-data-dir=${perfil}`,
    ...(pdf.endsWith(".png")
      ? ["--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1120,880", `--screenshot=${path.join(pastaSaida, pdf)}`]
      : [`--print-to-pdf=${path.join(pastaSaida, pdf)}`]),
    url,
  ], { timeout: 120000, encoding: "utf8" }); // on timeout, Node kills only this child
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
  if (r.error || r.status !== 0) { console.error(`${pdf}: falhou`, r.error ? r.error.message : r.status); process.exit(1); }
  console.log(`${pdf} → ${pastaSaida}`);
}
