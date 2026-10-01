import * as THREE from "three";
import { seeded } from "./flowerAssets";

export type CardKind = "stand" | "plate" | "sticker" | "business";

interface CardSpec {
  width: number;
  height: number;
  radius: number;
  face: string;
  ink: string;
  accent: string;
}

export const CARD_SPECS: Record<CardKind, CardSpec> = {
  stand: { width: 0.42, height: 0.6, radius: 0.035, face: "#121012", ink: "#f4ead9", accent: "#d9ab5c" },
  plate: { width: 0.5, height: 0.5, radius: 0.04, face: "#f3ebdd", ink: "#2b0a28", accent: "#a87a2c" },
  sticker: { width: 0.44, height: 0.44, radius: 0.22, face: "#3a0c36", ink: "#f6ecdc", accent: "#e2b464" },
  business: { width: 0.6, height: 0.38, radius: 0.03, face: "#2a0826", ink: "#f6ecdc", accent: "#e2b464" },
};

const DEPTH = 0.016;
const PX = 2048;

function roundedShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** Thin acrylic slab: extruded rounded rectangle; caps use group 0, edges group 1. */
export function createCardGeometry(kind: CardKind) {
  const spec = CARD_SPECS[kind];
  const shape =
    kind === "sticker"
      ? new THREE.Shape().absarc(0, 0, spec.width / 2, 0, Math.PI * 2, false)
      : roundedShape(spec.width, spec.height, spec.radius);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
    curveSegments: 32,
  });
  geometry.translate(0, 0, -DEPTH / 2);
  const back = new THREE.ShapeGeometry(shape, 32);
  back.rotateY(Math.PI);
  back.translate(0, 0, -DEPTH / 2 - 0.0045);
  return { geometry, back };
}

/** Maps a texture drawn over the card's full bounding box onto shape-space UVs. */
function fitTexture(texture: THREE.Texture, spec: CardSpec) {
  texture.repeat.set(1 / spec.width, 1 / spec.height);
  texture.offset.set(0.5, 0.5);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

/** The Steevanz flower mark: five cream petals, aubergine drops, gold heart. */
/** A simple placeholder logo for the client: their initials in a ring. */
function drawMonogram(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, name: string, display: string) {
  const initials = name
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w, _, all) => (all.length === 1 ? w.slice(0, 2) : w[0]))
    .join("")
    .toUpperCase();
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = r * 0.09;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `400 ${r * 1.05}px ${display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, cx, cy + r * 0.06);
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, petal: string, drop: string, heart: string) {
  ctx.save();
  ctx.translate(cx, cy);
  for (let k = 0; k < 5; k++) {
    ctx.save();
    ctx.rotate((k / 5) * Math.PI * 2);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.52, r * 0.42, r * 0.52, 0, 0, Math.PI * 2);
    ctx.fillStyle = petal;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.62);
    ctx.quadraticCurveTo(r * 0.12, -r * 0.3, 0, -r * 0.16);
    ctx.quadraticCurveTo(-r * 0.12, -r * 0.3, 0, -r * 0.62);
    ctx.fillStyle = drop;
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.13, 0, Math.PI * 2);
  ctx.fillStyle = heart;
  ctx.fill();
  ctx.restore();
}

function drawContactless(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = s * 0.11;
  for (let k = 1; k <= 3; k++) {
    ctx.beginPath();
    ctx.arc(cx - s * 0.5, cy, s * 0.26 * k, -0.75, 0.75);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStars(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  for (let k = 0; k < 5; k++) {
    const x = cx + (k - 2) * s * 1.25;
    ctx.beginPath();
    for (let j = 0; j < 10; j++) {
      const a = (j / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = j % 2 === 0 ? s * 0.5 : s * 0.21;
      ctx.lineTo(x + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** A decorative QR-style code (finder squares plus a seeded module pattern). */
function drawQr(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, dark: string, light: string, seed: number) {
  const rand = seeded(seed);
  const n = 25;
  const m = s / n;
  ctx.fillStyle = light;
  ctx.fillRect(x - m, y - m, s + 2 * m, s + 2 * m);
  ctx.fillStyle = dark;
  const finder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * m, y + fy * m, 7 * m, 7 * m);
    ctx.fillStyle = light;
    ctx.fillRect(x + (fx + 1) * m, y + (fy + 1) * m, 5 * m, 5 * m);
    ctx.fillStyle = dark;
    ctx.fillRect(x + (fx + 2) * m, y + (fy + 2) * m, 3 * m, 3 * m);
  };
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const inFinder = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
      if (!inFinder && rand() > 0.52) ctx.fillRect(x + i * m, y + j * m, m + 0.5, m + 0.5);
    }
  }
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
}

function canvasFor(spec: CardSpec) {
  const canvas = document.createElement("canvas");
  canvas.width = PX;
  canvas.height = Math.round((PX * spec.height) / spec.width);
  return [canvas, canvas.getContext("2d")!] as const;
}

/** Front and back artwork for each product, drawn with the page's fonts. */
export function createCardTextures(kind: CardKind, display: string, sans: string, business?: string) {
  const spec = CARD_SPECS[kind];
  const [front, f] = canvasFor(spec);
  const [back, b] = canvasFor(spec);
  const W = front.width;
  const H = front.height;

  for (const ctx of [f, b]) {
    ctx.fillStyle = spec.face;
    ctx.fillRect(0, 0, W, H);
  }

  f.textAlign = "center";
  f.textBaseline = "middle";
  if (kind === "stand") {
    if (business) drawMonogram(f, W / 2, H * 0.13, W * 0.09, "#f4ead9", business, display);
    else drawFlower(f, W / 2, H * 0.13, W * 0.09, "#f4ead9", "#5a1650", spec.accent);
    drawContactless(f, W / 2 + W * 0.05, H * 0.27, W * 0.16, spec.accent);
    drawStars(f, W / 2, H * 0.38, W * 0.075, spec.accent);
    f.fillStyle = spec.ink;
    f.font = `400 ${W * 0.17}px ${display}`;
    f.fillText("GOSTOU?", W / 2, H * 0.49);
    f.font = `500 ${W * 0.043}px ${sans}`;
    f.globalAlpha = 0.8;
    f.fillText("TOQUE PARA AVALIAR NO GOOGLE", W / 2, H * 0.57);
    f.globalAlpha = 1;
    drawQr(f, W * 0.32, H * 0.64, W * 0.36, "#121012", "#f4ead9", 3);
    f.font = `500 ${W * 0.03}px ${sans}`;
    f.globalAlpha = 0.55;
    f.fillText(business ? "NFC · QR" : "STEEVANZ", W / 2, H * 0.95);
    f.globalAlpha = 1;
    if (business) {
      f.fillStyle = spec.face;
      f.fillRect(W * 0.1, H * 0.06, W * 0.8, H * 0.14);
      f.fillStyle = spec.ink;
      f.font = `400 ${W * 0.085}px ${display}`;
      f.fillText(business.toUpperCase(), W / 2, H * 0.13);
    }
  } else if (kind === "plate") {
    if (business) {
      f.fillStyle = spec.ink;
      f.font = `400 ${W * 0.075}px ${display}`;
      f.fillText(business.toUpperCase(), W / 2, H * 0.17);
    } else drawFlower(f, W / 2, H * 0.17, W * 0.08, "#ffffff", "#5a1650", spec.accent);
    drawStars(f, W / 2, H * 0.33, W * 0.06, spec.accent);
    f.fillStyle = spec.ink;
    f.font = `400 ${W * 0.13}px ${display}`;
    f.fillText("DEIXE A SUA REVIEW", W / 2, H * 0.47);
    drawContactless(f, W * 0.3, H * 0.72, W * 0.16, spec.ink);
    drawQr(f, W * 0.55, H * 0.6, W * 0.26, spec.ink, spec.face, 9);
  } else if (kind === "sticker") {
    if (business) drawMonogram(f, W / 2, H * 0.3, W * 0.1, "#f6ecdc", business, display);
    else drawFlower(f, W / 2, H * 0.3, W * 0.1, "#f6ecdc", "#2a0626", spec.accent);
    drawContactless(f, W / 2 + W * 0.05, H * 0.55, W * 0.18, spec.accent);
    f.fillStyle = spec.ink;
    f.font = `400 ${W * 0.1}px ${display}`;
    f.fillText("TOQUE AQUI", W / 2, H * 0.76);
    if (business) {
      f.font = `600 ${W * 0.042}px ${sans}`;
      f.globalAlpha = 0.85;
      f.fillText(business.toUpperCase(), W / 2, H * 0.86);
      f.globalAlpha = 1;
    }
  } else {
    if (business) drawMonogram(f, W * 0.14, H * 0.24, W * 0.06, "#f6ecdc", business, display);
    else drawFlower(f, W * 0.14, H * 0.24, W * 0.06, "#f6ecdc", "#2a0626", spec.accent);
    f.textAlign = "left";
    f.fillStyle = spec.ink;
    f.font = `400 ${W * 0.11}px ${display}`;
    f.fillText((business ?? "STEEVANZ").toUpperCase(), W * 0.08, H * 0.62);
    f.font = `500 ${W * 0.032}px ${sans}`;
    f.globalAlpha = 0.7;
    f.fillText(business ? "SIGA-NOS · TOQUE AQUI" : "EMPRESA PORTUGUESA", W * 0.08, H * 0.78);
    f.globalAlpha = 1;
    drawContactless(f, W * 0.86, H * 0.24, W * 0.09, spec.accent);
  }

  // Acrylic finish on the front: soft gloss from the top-left, a fine inner edge
  // highlight and a light print grain.
  const gloss = f.createLinearGradient(0, 0, W * 0.8, H);
  gloss.addColorStop(0, "rgba(255,255,255,0.14)");
  gloss.addColorStop(0.35, "rgba(255,255,255,0.03)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  f.fillStyle = gloss;
  f.fillRect(0, 0, W, H);
  f.strokeStyle = "rgba(255,255,255,0.18)";
  f.lineWidth = W * 0.004;
  f.beginPath();
  f.roundRect(W * 0.012, H * 0.012, W * 0.976, H * 0.976, (spec.radius / spec.width) * W * 0.9);
  f.stroke();
  for (let k = 0; k < 9000; k++) {
    f.fillStyle = k % 2 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)";
    f.fillRect((k * 7919) % W, (k * 104729) % H, 2, 2);
  }

  // Back: brand colour with a centred flower mark.
  const markColor = kind === "plate" ? "#2b0a28" : "#f6ecdc";
  if (business) drawMonogram(b, W / 2, H / 2, Math.min(W, H) * 0.16, markColor, business, display);
  else drawFlower(b, W / 2, H / 2, Math.min(W, H) * 0.16, markColor, kind === "plate" ? "#d8c7b0" : "#5a1650", spec.accent);

  return {
    front: fitTexture(new THREE.CanvasTexture(front), spec),
    back: fitTexture(new THREE.CanvasTexture(back), spec),
    canvases: { front, back },
  };
}

/**
 * Card artwork for flat planes (the Grail-style spiral): the same designs, cut to
 * the card's real outline (rounded corners, or a circle for the sticker) with
 * transparency, mapped 1:1 onto the plane.
 */
export function createPlaneCardTextures(kind: CardKind, display: string, sans: string, business?: string) {
  const spec = CARD_SPECS[kind];
  const { canvases } = createCardTextures(kind, display, sans, business);
  const cut = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.globalCompositeOperation = "destination-in";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    if (kind === "sticker") ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    else ctx.roundRect(0, 0, w, h, (spec.radius / spec.width) * w);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };
  return { front: cut(canvases.front), back: cut(canvases.back), aspect: spec.width / spec.height };
}
