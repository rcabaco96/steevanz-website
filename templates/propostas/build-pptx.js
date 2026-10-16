// Gera proposta.pptx (editável, 16:9) a partir do ficheiro de dados.
// Uso: node build-pptx.js [proposta.json] [--saida pasta]
// Usa Georgia e Segoe UI: as fontes da marca (Fraunces, Hanken Grotesk) costumam não estar instaladas
// e o PowerPoint substitui-as mal (palavras repetidas na quebra de linha).
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const QRCode = require("qrcode");
const carregar = require("./dados");

const { v, pastaSaida } = carregar();
const placasPng = path.join(pastaSaida, "placas.png"); // gerada pelo pdf.js a partir de placas.html
const A = (n) => path.join(__dirname, "assets", n);
const C = { bg: "FBF7F1", surface: "FFFFFF", surface2: "F7F0E7", line: "E7DDD0", text: "1D1220", muted: "574659", subtle: "6F5D71", accent: "7A2D60", accentSoft: "F4E4EE", gold: "CFA563", goldSoft: "F6EAD3", goldText: "7F5A1C", hl: "EFD6A0" };
const SERIF = "Georgia", SANS = "Segoe UI";
const TOTAL = 14;
const MENU_DEMO_URL = "https://www.steevanz.com/raza17raza";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Steevanz";
pptx.company = "Steevanz";
pptx.title = `Proposta · Landing page + Menu digital em vídeo · ${v.cliente}`;

// «Texto <span class="hl">realçado</span> e <span class="scrib">sublinhado</span>» → runs
function runs(markup, base = {}) {
  const out = [];
  const re = /<span class="(hl|scrib)">(.*?)<\/span>/g;
  let last = 0, m;
  while ((m = re.exec(markup))) {
    if (m.index > last) out.push({ text: markup.slice(last, m.index), options: { ...base } });
    out.push({ text: m[2], options: m[1] === "hl" ? { ...base, highlight: C.hl } : { ...base, italic: true, color: C.accent } });
    last = re.lastIndex;
  }
  if (last < markup.length) out.push({ text: markup.slice(last), options: { ...base } });
  return out;
}
// Shape with text on top (drawn as two objects: PowerPoint ignores vertical centring of text inside pptxgenjs shapes).
function shapeText(s, t, o) {
  const { shape, fill, line, rectRadius, ...rest } = o;
  s.addShape(shape, { x: o.x, y: o.y, w: o.w, h: o.h, fill, line, rectRadius, rotate: o.rotate });
  s.addText(t, rest);
}
function base(n, footLeft = " · Proposta") {
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addText([{ text: "Steevanz", options: { fontFace: SERIF, bold: true, color: C.accent } }, { text: footLeft, options: { color: C.subtle } }], { x: 0.7, y: 7.0, w: 7, h: 0.3, fontFace: SANS, fontSize: 9, margin: 0 });
  s.addText(`${n} / ${TOTAL}`, { x: 11.6, y: 7.0, w: 1.0, h: 0.3, fontFace: SANS, fontSize: 9, color: C.subtle, align: "right", margin: 0 });
  return s;
}
const kicker = (s, t, y = 0.45) => s.addText(t.toUpperCase(), { x: 0.7, y, w: 11.9, h: 0.3, fontFace: SANS, fontSize: 10, bold: true, color: C.accent, charSpacing: 2, margin: 0 });
const title = (s, markup, y = 0.78, h = 1.0, size = 32, w = 11.9) => s.addText(runs(markup), { x: 0.7, y, w, h, fontFace: SERIF, fontSize: size, bold: true, color: C.text, margin: 0, valign: "top" });
const card = (s, x, y, w, h, fill = C.surface, line = C.line) => s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: line, width: 0.75 }, rectRadius: 0.14 });
const text = (s, t, x, y, w, h, o = {}) => s.addText(t, Object.assign({ x, y, w, h, fontFace: SANS, fontSize: 14, color: C.muted, margin: 0, valign: "top", paraSpaceAfter: 4 }, o));
const tag = (s, t, x, y, w, color = C.goldText) => s.addText(t.toUpperCase(), { x, y, w, h: 0.25, fontFace: SANS, fontSize: 9, bold: true, color, charSpacing: 1.5, margin: 0 });
const h3 = (s, t, x, y, w, color = C.text, size = 17, face = SERIF) => s.addText(t, { x, y, w, h: 0.42, fontFace: face, fontSize: size, bold: true, color, margin: 0, valign: "top" });
function sticker(s, t, x, y, w, kind = "gold", rotate = -4, size = 11) {
  const fill = kind === "plum" ? C.accent : kind === "cream" ? C.surface : C.gold;
  const color = kind === "plum" ? "FFFFFF" : kind === "cream" ? C.accent : C.text;
  shapeText(s, t, { shape: pptx.ShapeType.roundRect, x, y, w, h: 0.42, rectRadius: 0.21, fill: { color: fill }, line: { color: kind === "cream" ? C.gold : fill, width: kind === "cream" ? 1.25 : 0, dashType: kind === "cream" ? "dash" : "solid" }, rotate, fontFace: SANS, fontSize: size, bold: true, color, align: "center", valign: "middle", margin: 0 });
}
function pill(s, t, x, y, w, kind = "plain", h = 0.42) {
  const fill = kind === "end" ? C.accent : kind === "gold" ? C.gold : kind === "soft" ? C.surface2 : C.surface;
  const color = kind === "end" ? "FFFFFF" : C.text;
  shapeText(s, t, { shape: pptx.ShapeType.roundRect, x, y, w, h, rectRadius: h / 2, fill: { color: fill }, line: { color: kind === "plain" ? C.line : fill, width: 1 }, fontFace: SANS, fontSize: 12, bold: true, color, align: "center", valign: "middle", margin: 0 });
}
function num(s, n, x, y, fill = C.accent, color = "FFFFFF") {
  shapeText(s, String(n), { shape: pptx.ShapeType.ellipse, x, y, w: 0.38, h: 0.38, fill: { color: fill }, line: { color: fill, width: 0 }, fontFace: SANS, fontSize: 12, bold: true, color, align: "center", valign: "middle", margin: 0 });
}
function phone(s, img, x, y, h, cap) {
  const w = h * 390 / 844, b = h * 0.022;
  s.addShape(pptx.ShapeType.roundRect, { x: x - b, y: y - b, w: w + 2 * b, h: h + 2 * b, fill: { color: C.text }, line: { color: C.text, width: 0 }, rectRadius: 0.18 });
  s.addImage({ path: A(img), x, y, w, h });
  if (cap) s.addText(cap, { x: x - 0.3, y: y + h + 0.1, w: w + 0.6, h: 0.45, fontFace: SANS, fontSize: 10, color: C.muted, align: "center", margin: 0, valign: "top" });
}
function label(s, t, x, y, w) {
  shapeText(s, t, { shape: pptx.ShapeType.roundRect, x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: C.goldSoft }, line: { color: C.goldSoft, width: 0 }, fontFace: SANS, fontSize: 11, bold: true, color: C.goldText, margin: 0, align: "center", valign: "middle" });
}

(async () => {
  const qrAceitacao = await QRCode.toDataURL(v.aceitacaoUrl, { margin: 1, width: 700, errorCorrectionLevel: "M", color: { dark: "#1d1220", light: "#ffffff" } });
  const qrMenu = await QRCode.toDataURL(MENU_DEMO_URL, { margin: 1, width: 500, errorCorrectionLevel: "M", color: { dark: "#1d1220", light: "#ffffff" } });

  // 1 · Capa
  {
    const s = base(1, " · www.steevanz.com · 961 292 679");
    s.addShape(pptx.ShapeType.ellipse, { x: 8.3, y: -1.7, w: 6.5, h: 6.0, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 } });
    sticker(s, "Proposta · Landing page + Menu digital em vídeo", 0.75, 0.95, 4.6, "gold", -3, 11);
    s.addText(runs('O seu restaurante, a <span class="scrib">abrir o apetite</span> no telemóvel.'), { x: 0.7, y: 1.6, w: 7.2, h: 2.3, fontFace: SERIF, fontSize: 40, bold: true, color: C.text, margin: 0, valign: "top" });
    text(s, "Uma página para o encontrarem e escolherem. Um menu em vídeo para verem os pratos antes de pedir.", 0.7, 3.95, 7.0, 0.8, { fontSize: 16 });
    sticker(s, "PARA", 0.75, 4.95, 0.95, "plum", -3, 10);
    s.addText(v.cliente, { x: 1.9, y: 4.85, w: 5.8, h: 0.6, fontFace: SERIF, fontSize: 26, bold: true, color: C.text, margin: 0, valign: "middle" });
    text(s, `Proposta de ${v.dataFmt} · válida até ${v.validadeFmt} (${v.validadeDias} dias)`, 0.7, 5.6, 7.0, 0.3, { fontSize: 12, color: C.subtle });
    text(s, "Tecnologia do amanhã, com os bons modos de antigamente.", 0.7, 6.15, 7.0, 0.35, { fontFace: SERIF, italic: true, fontSize: 14, color: C.accent });
    phone(s, "lp-hero.jpg", 8.35, 1.45, 4.7);
    phone(s, "vm-full-brownie.jpg", 10.65, 1.2, 4.7);
  }

  // 2 · Problema
  {
    const s = base(2);
    kicker(s, "Sejamos honestos");
    title(s, 'Uma ementa em papel <span class="scrib">não abre o apetite</span>.');
    const col = (x, tg, t, b, q) => {
      card(s, x, 2.0, 5.85, 3.4);
      tag(s, tg, x + 0.35, 2.3, 5);
      h3(s, t, x + 0.35, 2.65, 5.2, C.text, 22);
      text(s, b, x + 0.35, 3.25, 5.2, 1.1, { fontSize: 15 });
      shapeText(s, q, { shape: pptx.ShapeType.roundRect, x: x + 0.35, y: 4.5, w: 4.2, h: 0.55, rectRadius: 0.2, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, fontFace: SERIF, italic: true, fontSize: 14, color: C.accent, margin: 0, align: "center", valign: "middle" });
    };
    col(0.7, "Antes de vir", "Procuram-no no telemóvel.", "Querem ver o que serve, onde fica e a que horas abre. Se não encontram depressa, vão ao vizinho.", "«Isto abre hoje? Onde é que fica?»");
    col(6.75, "Já à mesa", "«O que é isto, ao certo?»", "O nome de um prato diz pouco. O cliente hesita, o empregado explica pela enésima vez e sai o de sempre.", "«Traga o de sempre, se faz favor.»");
    shapeText(s, [{ text: "A boa notícia: ", options: { bold: true, color: C.text } }, { text: "resolve-se com duas coisas simples. Nós tratamos da tecnologia, o seu restaurante trata dos clientes.", options: { color: C.text } }], { shape: pptx.ShapeType.roundRect, x: 0.7, y: 6.1, w: 11.9, h: 0.62, rectRadius: 0.1, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, fontFace: SANS, fontSize: 14, margin: 0, align: "center", valign: "middle" });
  }

  // 3 · Proposta
  {
    const s = base(3);
    kicker(s, "O que propomos");
    title(s, 'Duas peças, um objetivo: <span class="hl">mais gente à sua mesa</span>.');
    const items = [
      ["1 · Landing page", "A sua casa, numa página", "Rápida, feita para telemóvel, com um botão claro: ver o menu, reservar ou chegar lá.", `${v.lpPreco} € + IVA · depois ${v.lpAnual} €/ano`, "lp-hero.jpg", 0.15],
      ["2 · Menu digital em vídeo", "Os pratos a mexer", "Um vídeo curto por prato, com nome e preço. Desliza-se como nos Reels.", `${v.menuAnual} €/ano + IVA`, "vm-grid-gel-b.jpg", 0.95],
      ["3 · Placas de mesa", "O menu num toque", "As placas da sua mesa: um toque ou o QR, e abre o menu. Sem apps.", `${v.placasUnit} € + IVA · ${v.placasVol} € a partir de ${v.placasDe}`, null, 0],
    ];
    items.forEach(([tg, t, b, price, img, cropY], i) => {
      const x = 0.7 + i * 4.05;
      card(s, x, 2.0, 3.8, 4.7);
      if (img) s.addImage({ path: A(img), x: x + 0.25, y: 2.22, w: 3.3, h: 3.3 * 844 / 390, sizing: { type: "crop", x: 0, y: cropY, w: 3.3, h: 1.75 } });
      else {
        s.addShape(pptx.ShapeType.rect, { x: x + 0.25, y: 2.22, w: 3.3, h: 1.75, fill: { color: "FBF7F1" }, line: { color: "FBF7F1", width: 0 } });
        s.addImage({ path: placasPng, x: x + 0.25 + (3.3 - 1.75 * 1120 / 880) / 2, y: 2.22, w: 1.75 * 1120 / 880, h: 1.75 });
      }
      tag(s, tg, x + 0.25, 4.12, 3.3);
      h3(s, t, x + 0.25, 4.4, 3.3, C.text, 15, SANS);
      text(s, b, x + 0.25, 4.8, 3.3, 1.1, { fontSize: 12.5 });
      shapeText(s, price, { shape: pptx.ShapeType.roundRect, x: x + 0.25, y: 5.95, w: 3.3, h: 0.42, rectRadius: 0.21, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, fontFace: SANS, fontSize: 11.5, bold: true, color: C.accent, margin: 0, align: "center", valign: "middle" });
    });
  }

  // 4 · Landing page
  {
    const s = base(4);
    kicker(s, "Landing page");
    title(s, 'Uma página, um objetivo: <span class="scrib">mais contactos e reservas</span>.', 0.78, 1.2, 32, 10.0);
    sticker(s, "Pronta em 5 dias úteis", 10.55, 0.55, 2.2, "plum", 3, 11);
    text(s, "Para o link da bio do Instagram, para o Google e para mandar por mensagem. Com o seu logótipo e as suas cores.", 0.7, 2.05, 9.5, 0.7, { fontSize: 16 });
    const chips = ["Feita primeiro para o telemóvel", "Rápida, mesmo com rede fraca", "Animações com bom gosto", "Botão «Ver o menu»", "Google Maps e «Como chegar»", "Os seus reels do Instagram", "WhatsApp e formulário de contacto", "Encontrada no Google", "Cookies, privacidade e Livro de Reclamações"];
    const widths = [3.3, 3.2, 2.9, 2.4, 3.1, 3.0, 3.6, 2.6, 4.6];
    let x = 0.7, y = 3.2;
    chips.forEach((c, i) => {
      if (x + widths[i] > 12.6) { x = 0.7; y += 0.62; }
      pill(s, "✓  " + c, x, y, widths[i], "plain", 0.48);
      x += widths[i] + 0.18;
    });
    text(s, "Até 8 secções, design a partir de um modelo do seu setor, 2 rondas de alterações e publicação no seu domínio com certificado de segurança.", 0.7, y + 0.85, 11.9, 0.4, { fontSize: 12, color: C.subtle });
  }

  // 5 · Landing page: exemplo
  {
    const s = base(5);
    kicker(s, "Landing page · trabalho real");
    title(s, v.exLandingTitulo);
    [["lp-hero.jpg", "O gelado em 3D e o botão «Ver o menu»"], ["lp-reels.jpg", "Os reels do Instagram dentro da página"], ["lp-menu.jpg", "Direto para o menu em vídeo"], ["lp-place.jpg", "O espaço, a esplanada e como chegar"]].forEach(([img, cap], i) => phone(s, img, 2.3 + i * 2.35, 1.8, 3.75, cap));
    label(s, v.exLandingEtiqueta, 0.7, 6.4, 8.6);
  }

  // 6 · Landing page: como
  {
    const s = base(6);
    kicker(s, "Landing page · como fazemos");
    title(s, 'Do «sim» ao «já está no ar» em <span class="scrib">5 dias úteis</span>.');
    [["Conversa de 20 minutos", "Sobre a casa, os pratos e o estilo. Sem jargão."], ["Envia-nos os conteúdos", "Logótipo, fotos, horário e links. Os 5 dias úteis contam a partir daqui."], ["Primeira versão num link privado", "Vê, comenta e afinamos: 2 rondas de alterações incluídas."], ["No ar, no seu domínio", "E registada no Google."]].forEach(([t, b], i) => {
      const y = 2.0 + i * 1.12;
      num(s, i + 1, 0.7, y);
      h3(s, t, 1.25, y - 0.02, 5.6, C.text, 16, SANS);
      text(s, b, 1.25, y + 0.38, 5.6, 0.6, { fontSize: 14 });
    });
    card(s, 7.3, 1.95, 5.3, 3.4, C.accent, C.accent);
    tag(s, `Depois · ${v.lpAnual} €/ano ou ${v.lpMensal} €/mês + IVA`, 7.6, 2.2, 4.8, C.gold);
    h3(s, "Nós tratamos do resto.", 7.6, 2.5, 4.8, "FFFFFF", 20);
    text(s, ["Alojamento, segurança e cópias de segurança", "Até 30 minutos de pequenas alterações por mês", "Uma pessoa real do outro lado do WhatsApp"].map((t, i, a) => ({ text: t, options: { bullet: { code: "25CF", indent: 16 }, breakLine: i < a.length - 1 } })), 7.6, 3.05, 4.8, 1.3, { fontSize: 14, color: "FFFFFF" });
    text(s, `Anual com ${v.mesesOferta} meses grátis, ou mensal sem período mínimo: fica porque funciona, não porque é obrigado.`, 7.6, 4.4, 4.8, 0.8, { fontSize: 13, color: "FFFFFF" });
  }

  // 7 · Menu
  {
    const s = base(7);
    kicker(s, "Menu digital em vídeo", 0.9);
    title(s, 'O menu ganha vida <span class="scrib">num toque na mesa</span>.', 1.22, 1.3, 32, 7.8);
    text(s, [
      [{ b: "Cada prato, um vídeo. " }, "Curto, na vertical, com nome, preço e descrição."],
      [{ b: "Coleções. " }, "Brunch, Bebidas, Sobremesas… à sua medida."],
      [{ b: "Ecrã inteiro, como nos Reels. " }, "Toca e desliza."],
      [{ b: "Abre com o seu logótipo. " }, "Sem apps e sem registos."],
      [{ b: "Nós tratamos de tudo. " }, "Montamos o menu e tratamos do alojamento do menu e dos vídeos."],
    ].flatMap((parts) => parts.map((p, i) => ({ text: typeof p === "object" ? p.b : p, options: { bullet: i === 0 ? { code: "25CF", indent: 16 } : false, bold: typeof p === "object", color: typeof p === "object" ? C.text : C.muted, breakLine: i === parts.length - 1 } }))), 0.7, 2.6, 7.6, 2.8, { fontSize: 15, paraSpaceAfter: 6 });
    sticker(s, "Sem tradução: um vídeo explica o prato", 0.75, 5.75, 3.9, "gold", -3, 11);
    sticker(s, "Mudou um preço? Basta uma mensagem", 4.85, 5.75, 3.7, "cream", -2, 11);
    phone(s, "vm-full-brownie.jpg", 9.4, 0.9, 5.55);
  }

  // 8 · Menu: exemplo
  {
    const s = base(8);
    kicker(s, "Menu digital em vídeo · a funcionar");
    title(s, v.exMenuTitulo);
    [["vm-open.jpg", "Abre com o logótipo da casa"], ["vm-grid-gel-b.jpg", "Os pratos em vídeo, com preço"], ["vm-sheet.jpg", "As coleções"], ["vm-full-brownie.jpg", "Ecrã inteiro, a deslizar"]].forEach(([img, cap], i) => phone(s, img, 2.35 + i * 2.3, 1.75, 3.6, cap));
    label(s, v.exMenuEtiqueta, 0.7, 6.0, 9.6);
    text(s, "Nesta demonstração, os vídeos e os preços são de exemplo. No seu menu, os vídeos, os pratos e os preços são os seus.", 0.7, 6.45, 11.9, 0.3, { fontSize: 11, color: C.subtle });
  }

  // 9 · Placas
  {
    const s = base(9);
    kicker(s, "Placas de mesa");
    title(s, 'Um toque ou o QR code. <span class="hl">Sem apps, sem complicações.</span>');
    [["Um toque", "Aproxima o telemóvel da placa e o menu abre. Tecnologia Steevanz."], ["QR code", "Em todas as placas, para qualquer telemóvel com câmara."], ["«Ver o menu»", "O botão da sua página e o link na bio."]].forEach(([t, b], i) => {
      const x = 0.7 + i * 2.5;
      card(s, x, 2.15, 2.3, 2.1);
      num(s, i + 1, x + 0.2, 2.35);
      h3(s, t, x + 0.2, 2.82, 1.95, C.text, 14, SANS);
      text(s, b, x + 0.2, 3.2, 1.95, 1.0, { fontSize: 11.5 });
    });
    text(s, "Uma por mesa, em pé ou plana, com o seu logótipo e as cores da casa. Saem gravadas e testadas em iPhone e Android, e o destino muda sem trocar as placas.", 0.7, 4.45, 7.3, 0.8, { fontSize: 13.5 });
    sticker(s, `${v.placasUnit} € + IVA por placa`, 0.75, 5.5, 2.4, "plum", 3, 11.5);
    sticker(s, `${v.placasVol} € por placa a partir de ${v.placasDe} placas`, 3.35, 5.45, 3.8, "gold", -3, 11.5);
    s.addImage({ path: placasPng, x: 8.2, y: 1.95, w: 4.4, h: 4.4 * 880 / 1120 });
    text(s, "As placas da sua mesa, com o seu logótipo. Experimente: leia o QR e abra a demonstração do menu.", 8.3, 5.5, 4.2, 0.6, { fontSize: 11, color: C.subtle, align: "center" });
  }

  // 10 · Vídeos
  {
    const s = base(10);
    kicker(s, "Os vídeos");
    title(s, 'Quem grava? Você, com o telemóvel. <span class="scrib">Nós ajudamos.</span>');
    [["Grave com o nosso guia", "Um guia simples, passo a passo: enquadramento, luz e ângulos. Sem equipamento caro.", false], ["Envie-nos os vídeos", "Um vídeo por prato, com o nome e o preço de cada um.", false], ["Nós tratamos do resto", "Montamos o menu e tratamos do alojamento do menu e dos vídeos.", true]].forEach(([t, b, hero], i) => {
      const x = 0.7 + i * 4.05;
      card(s, x, 2.0, 3.8, 2.35, hero ? C.accent : C.surface, hero ? C.accent : C.line);
      num(s, i + 1, x + 0.3, 2.25, hero ? C.gold : C.accent, hero ? C.text : "FFFFFF");
      h3(s, t, x + 0.3, 2.75, 3.3, hero ? "FFFFFF" : C.text, 17);
      text(s, b, x + 0.3, 3.25, 3.25, 1.0, { fontSize: 13, color: hero ? "FFFFFF" : C.muted });
    });
    [["Na vertical", "Telemóvel de pé, como num Reel"], ["10–20 s", "Por prato"], ["Sem som", "O menu toca em silêncio"], ["Luz de janela", "De lado, sem flash"], ["Prato ao centro", "O nome e o preço escrevemos nós"]].forEach(([t, b], i) => {
      const x = 0.7 + i * 2.4;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 4.7, w: 2.25, h: 1.15, fill: { color: C.goldSoft }, line: { color: C.goldSoft, width: 0 }, rectRadius: 0.1 });
      s.addText(t, { x: x + 0.15, y: 4.8, w: 2.0, h: 0.38, fontFace: SERIF, fontSize: 15, bold: true, color: C.accent, margin: 0 });
      text(s, b, x + 0.15, 5.2, 2.0, 0.6, { fontSize: 11 });
    });
    text(s, "Sem tempo para gravar? Trabalhamos com parceiros que criam vídeos de pratos e pedimos orçamento por si (não incluído).", 0.7, 6.15, 11.9, 0.35, { fontSize: 11.5, color: C.subtle });
  }

  // 11 · Juntos
  {
    const s = base(11);
    kicker(s, "Como funcionam juntos");
    title(s, 'Antes da visita e à mesa, <span class="scrib">o mesmo menu</span>.');
    const path_ = (x, tg, pills, body) => {
      card(s, x, 2.1, 5.85, 2.6);
      tag(s, tg, x + 0.35, 2.35, 5);
      let px = x + 0.35;
      pills.forEach(([t, w], i) => {
        pill(s, t, px, 2.75, w, i === pills.length - 1 ? "end" : "soft", 0.46);
        px += w;
        if (i < pills.length - 1) { s.addText("→", { x: px, y: 2.75, w: 0.35, h: 0.46, fontSize: 14, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 }); px += 0.35; }
      });
      text(s, body, x + 0.35, 3.5, 5.2, 0.9, { fontSize: 14 });
    };
    path_(0.7, "Antes de vir", [["Google ou Instagram", 1.9], ["A sua página", 1.4], ["«Ver o menu»", 1.45]], "Vê a casa, o espaço e os pratos a mexer. E já vem com vontade.");
    path_(6.75, "Já à mesa", [["Placa na mesa", 1.45], ["Um toque ou o QR", 1.75], ["O menu", 1.05]], "Escolhe enquanto espera. O empregado chega a uma mesa já decidida.");
    sticker(s, "Um só menu para atualizar", 1.6, 5.3, 2.8, "gold", -3, 11);
    sticker(s, "A mesma imagem em todo o lado", 4.7, 5.3, 3.1, "plum", 3, 11);
    sticker(s, "Alojamento do menu e dos vídeos por nossa conta", 8.05, 5.3, 4.3, "cream", -2, 11);
  }

  // 12 · Investimento
  {
    const s = base(12);
    kicker(s, "Investimento");
    title(s, 'Preços claros, <span class="scrib">zero letras miudinhas</span>.');
    const none = [{ type: "none" }, { type: "none" }, { type: "none" }, { type: "none" }];
    const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: SANS, fontSize: 13, color: C.text, border: [{ type: "none" }, { type: "none" }, { pt: 0.75, color: C.line }, { type: "none" }], valign: "middle" }, o) });
    const rich = (t1, t2, o = {}) => ({ text: [{ text: t1, options: { breakLine: true } }, { text: t2, options: { fontSize: 10, color: C.subtle } }], options: cell("", o).options });
    const sub = { color: C.muted, border: none };
    const richSave = (t1, t2, save) => ({ text: [{ text: t1, options: { breakLine: true } }, { text: t2, options: { fontSize: 10, color: C.subtle } }, { text: save, options: { fontSize: 10, bold: true, color: "1E7A4C", highlight: "E3F3EA" } }], options: cell("").options });
    const struck = (old, val, o = {}) => ({ text: [{ text: old + "  ", options: { strike: "sngStrike", color: C.subtle, fontSize: 11 } }, { text: val }], options: cell("", { ...o, align: "right" }).options });
    const tot = { bold: true, fontSize: 15, color: C.accent, border: [{ pt: 1.5, color: C.text }, { type: "none" }, { type: "none" }, { type: "none" }] };
    card(s, 0.7, 1.95, 5.85, 3.55);
    tag(s, "Uma vez", 0.95, 2.15, 5);
    s.addTable([
      [rich("Landing page", "Até 8 secções, 2 rondas de alterações"), cell(v.lpPrecoEur, { align: "right" })],
      [rich(`Placas de mesa · ${v.placasUnit} € por placa`, `${v.placasVol} € por placa a partir de ${v.placasDe} placas`), cell(`${v.placasQtd} × ${v.placasUsado} € = ${v.placasEur}`, { align: "right" })],
      ...(v.googleStyle ? [] : [[rich(`Placas Google Reviews · ${v.googleNormal} € por placa`, `Pack de ${v.googlePackDe}: ${v.googlePack} € por placa`), cell(`${v.googleQtd} × ${v.googleUsado} € = ${v.googleEur}`, { align: "right" })]]),
      [cell("Subtotal (+ IVA)", sub), cell(v.unicoSubEur, { ...sub, align: "right" })],
      [cell(`IVA ${v.ivaPct}%`, sub), cell(v.unicoIvaEur, { ...sub, align: "right" })],
      [cell("Total com IVA", tot), cell(v.unicoTotEur, { ...tot, align: "right" })],
    ], { x: 0.9, y: 2.5, w: 5.45, colW: [3.25, 2.2], rowH: v.googleStyle ? [0.7, 0.7, 0.4, 0.4, 0.5] : [0.62, 0.62, 0.62, 0.36, 0.36, 0.46] });
    card(s, 6.75, 1.95, 5.85, 4.3, C.surface, C.gold);
    sticker(s, `Recomendado · ${v.mesesOferta} meses grátis`, 9.65, 1.72, 2.8, "gold", -3, 11);
    tag(s, `Plano anual · 12 meses pelo preço de ${v.mesesPagos}`, 7.0, 2.15, 4.5);
    s.addTable([
      [richSave("Alojamento e manutenção da landing page", `${v.lpMensal} €/mês × ${v.mesesPagos}  `, `poupa ${v.lpPoupa} €`), struck(`${v.lpAnualCheio} €`, `${v.lpAnualEur}/ano`)],
      [richSave("Menu digital em vídeo", `Montagem e alojamento incluídos · ${v.menuMensal} €/mês × ${v.mesesPagos}  `, `poupa ${v.menuPoupa} €`), struck(`${v.menuAnualCheio} €`, `${v.menuAnualEur}/ano`)],
      [cell("Subtotal (+ IVA)", sub), struck(`${v.anualCheio} €`, `${v.anualSubEur}/ano`, sub)],
      [cell(`IVA ${v.ivaPct}%`, sub), cell(`${v.anualIvaEur}/ano`, { ...sub, align: "right" })],
      [cell("Total com IVA", tot), cell(`${v.anualTotEur}/ano`, { ...tot, align: "right" })],
    ], { x: 6.95, y: 2.5, w: 5.45, colW: [3.6, 1.85], rowH: [0.7, 0.7, 0.4, 0.4, 0.5] });
    s.addText([{ text: ` Poupa ${v.poupanca} € por ano `, options: { bold: true, color: "1E7A4C", highlight: "E3F3EA" } }, { text: ` + IVA · ${v.poupancaComIvaEur} com IVA`, options: { bold: true, color: C.goldText } }], { x: 7.0, y: 5.3, w: 5.4, h: 0.3, fontFace: SANS, fontSize: 12.5, margin: 0, valign: "top" });
    text(s, `Ou ${v.mensalSub} €/mês + IVA (${v.mensalTotEur} com IVA), sem período mínimo.`, 7.0, 5.65, 5.4, 0.3, { fontSize: 12 });
    s.addText([
      { text: "Na adjudicação: ", options: { bold: true, color: C.text } },
      { text: `itens únicos + 1.º ano = ${v.adjAnualSubEur} + IVA ${v.adjAnualIvaEur} = `, options: { color: C.text } },
      { text: v.adjAnualTotEur, options: { bold: true, color: C.text } },
      { text: ` · com pagamento mensal: ${v.adjMensalSubEur} + IVA`, options: { color: C.muted } },
    ], { x: 0.7, y: 5.7, w: 5.85, h: 0.6, fontFace: SANS, fontSize: 12, margin: 0, valign: "top" });
    text(s, `Preços + IVA (${v.ivaPct}%). O domínio e o email profissional pagam-se à parte, diretamente ao fornecedor, e o domínio fica sempre em seu nome.`, 0.7, 6.45, 11.9, 0.3, { fontSize: 11, color: C.subtle });
  }

  // 13 · Próximos passos
  {
    const s = base(13);
    kicker(s, "Próximos passos");
    title(s, 'Gostou? <span class="scrib">Isto é o que acontece a seguir.</span>');
    const steps = [
      ["Dia 1", "Diz-nos que sim", "Online, no próximo diapositivo, ou por WhatsApp ou telefone."],
      ["Logo a seguir", "Envia-nos o logótipo, fotos e textos", "E o horário e os links. É daqui que contam os 5 dias úteis da página."],
      ["Ao mesmo tempo", "Grava os primeiros vídeos com o telemóvel", "Com o nosso guia ao lado. Não precisa de ser perfeito à primeira."],
      ["5 dias úteis", "Nós montamos a página e o menu", "A página em 5 dias úteis; o menu à medida que os vídeos chegam."],
      ["Num link privado", "Revemos juntos", "Comenta, afinamos. 2 rondas de alterações incluídas."],
      ["", "Página no ar e placas nas mesas", "E nós ficamos por perto, do outro lado do WhatsApp."],
    ];
    steps.forEach(([when, t, b], i) => {
      const x = 0.7 + (i % 3) * 4.05, y = 2.0 + Math.floor(i / 3) * 2.35, last = i === 0;
      card(s, x, y, 3.8, 2.15, last ? C.accent : C.surface, last ? C.accent : C.line);
      num(s, i + 1, x + 0.25, y + 0.22, last ? C.gold : C.accent, last ? C.text : "FFFFFF");
      if (when) shapeText(s, when.toUpperCase(), { shape: pptx.ShapeType.roundRect, x: x + 2.05, y: y + 0.22, w: 1.55, h: 0.32, rectRadius: 0.16, fill: { color: C.goldSoft }, line: { color: C.goldSoft, width: 0 }, fontFace: SANS, fontSize: 8, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 });
      s.addText(t, { x: x + 0.25, y: y + 0.72, w: 3.35, h: 0.65, fontFace: SERIF, fontSize: 15, bold: true, color: last ? "FFFFFF" : C.text, margin: 0, valign: "top" });
      text(s, b, x + 0.25, y + 1.4, 3.35, 0.7, { fontSize: 11.5, color: last ? "FFFFFF" : C.muted });
    });
  }

  // 14 · Adjudicação
  {
    const s = base(14, " · Feito em Portugal");
    kicker(s, "Adjudicação online");
    title(s, 'Vamos a isto? <span class="scrib">Sem papelada.</span>');
    pill(s, "Toque no botão", 0.7, 2.25, 3.2);
    s.addText("→", { x: 3.92, y: 2.25, w: 0.3, h: 0.42, fontSize: 14, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 });
    pill(s, "Veja o orçamento", 4.25, 2.25, 2.0);
    s.addText("→", { x: 6.27, y: 2.25, w: 0.3, h: 0.42, fontSize: 14, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 });
    pill(s, "Preencha os dados da empresa", 0.7, 2.85, 3.0);
    s.addText("→", { x: 3.72, y: 2.85, w: 0.3, h: 0.42, fontSize: 14, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 });
    pill(s, "«Adjudicar proposta»", 4.05, 2.85, 2.2, "gold");
    text(s, "E está feito. Nós tratamos do resto.", 0.7, 3.55, 7, 0.45, { fontSize: 17 });
    shapeText(s, [{ text: "Ver e adjudicar a proposta  →", options: { hyperlink: { url: v.aceitacaoUrl, tooltip: v.aceitacaoUrl } } }], { shape: pptx.ShapeType.roundRect, x: 0.7, y: 4.25, w: 3.9, h: 0.7, rectRadius: 0.35, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, fontFace: SANS, fontSize: 15, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    text(s, v.aceitacaoCurta, 0.7, 5.1, 7, 0.3, { fontSize: 11, color: C.subtle });
    text(s, "Obrigado pelo seu tempo. O resto tratamos nós, com os bons modos de antigamente.", 0.7, 6.15, 7.8, 0.4, { fontFace: SERIF, italic: true, fontSize: 15, color: C.accent });
    s.addText([{ text: "WhatsApp/telefone ", options: { color: C.muted } }, { text: "961 292 679", options: { bold: true, color: C.accent } }, { text: " · www.steevanz.com", options: { color: C.muted } }], { x: 8.4, y: 6.15, w: 4.2, h: 0.4, fontFace: SANS, fontSize: 12, align: "right", margin: 0 });
  }

  const file = path.join(pastaSaida, "proposta.pptx");
  await pptx.writeFile({ fileName: file });
  console.log(`proposta.pptx → ${pastaSaida}`);
})().catch((e) => { console.error(e); process.exit(1); });
