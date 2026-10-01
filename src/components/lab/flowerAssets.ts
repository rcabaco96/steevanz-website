import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Deterministic PRNG so geometry and textures are identical on every render. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export const PETAL_LENGTH = 1;
export const PETAL_COUNT = 5;

/**
 * One petal as a parametric surface: u runs from the base (0) to the rim (1),
 * s runs across the petal (-1..1). The outline is a fan that narrows at the base
 * and has a soft, wavy rim like the Steevanz logo; z adds the cup and ruffles.
 */
export function createPetalGeometry(seed: number) {
  const rand = seeded(seed);
  const segU = 110;
  const segS = 72;
  const L = PETAL_LENGTH;
  const thetaMax = 0.67;
  const wavePhase = rand() * Math.PI * 2;
  const waveAmp = 0.035 + rand() * 0.015;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    for (let j = 0; j <= segS; j++) {
      const s = (j / segS) * 2 - 1;
      const narrow = 0.97 + 0.03 * smoothstep(0, 0.5, u);
      const phi = s * thetaMax * narrow;
      const rim = 1 - 0.2 * Math.pow(Math.abs(s), 2.6) + waveAmp * Math.sin(s * Math.PI * 2.6 + wavePhase);
      const r = (0.035 + 0.965 * u) * L * rim;
      const x = r * Math.sin(phi);
      const y = r * Math.cos(phi);
      const cup = 0.36 * Math.pow(u, 1.8) * L;
      const across = -0.09 * s * s * u * L;
      const ruffle = 0.045 * Math.sin(phi * 9 + u * 4 + wavePhase) * u * u * L;
      const crinkle = 0.004 * Math.sin(s * 34 + u * 7) * Math.sin(u * 19 + s * 5) * u * L;
      positions.push(x, y, cup + across + ruffle + crinkle);
      uvs.push(j / segS, u);
    }
  }
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segS; j++) {
      const a = i * (segS + 1) + j;
      const b = a + segS + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

interface Vein {
  sx: number;
  cx: number;
  cy: number;
  ex: number;
  ey: number;
  width: number;
  alpha: number;
  branch?: { x0: number; y0: number; x1: number; y1: number };
}

function createVeins(size: number) {
  const rand = seeded(7);
  const veins: Vein[] = [];
  const count = 130;
  for (let k = 0; k < count; k++) {
    const sx = size * (0.5 + (rand() - 0.5) * 0.06);
    const ex = size * (0.01 + (k / count) * 0.98 + (rand() - 0.5) * 0.015);
    const reach = 0.5 + rand() * 0.46;
    const ey = size * (1 - reach);
    const cx = (sx + ex) / 2 + (rand() - 0.5) * size * 0.04;
    const cy = size * (1 - reach * 0.5);
    const vein: Vein = { sx, cx, cy, ex, ey, width: 0.8 + rand() * 1.6, alpha: 0.3 + rand() * 0.5 };
    if (rand() > 0.55) {
      const x0 = (cx + ex) / 2;
      const y0 = (cy + ey) / 2;
      vein.branch = { x0, y0, x1: x0 + (rand() - 0.5) * size * 0.07, y1: y0 - size * (0.05 + rand() * 0.1) };
    }
    veins.push(vein);
  }
  return veins;
}

function strokeVeins(ctx: CanvasRenderingContext2D, veins: Vein[], size: number, style: (v: Vein) => string, extraWidth = 0) {
  for (const v of veins) {
    ctx.strokeStyle = style(v);
    ctx.lineWidth = v.width + extraWidth;
    ctx.beginPath();
    ctx.moveTo(v.sx, size);
    ctx.quadraticCurveTo(v.cx, v.cy, v.ex, v.ey);
    ctx.stroke();
    if (v.branch) {
      ctx.lineWidth = (v.width + extraWidth) * 0.6;
      ctx.beginPath();
      ctx.moveTo(v.branch.x0, v.branch.y0);
      ctx.lineTo(v.branch.x1, v.branch.y1);
      ctx.stroke();
    }
  }
}

/**
 * The aubergine blotch at the base of each petal (the logo's purple drop):
 * a feathered teardrop with fine velvet streaks, painted into the petal itself.
 */
function paintBlotch(c: CanvasRenderingContext2D, b: CanvasRenderingContext2D, size: number) {
  const rand = seeded(23);
  const cx = size * 0.5;
  const base = size * 0.9;
  const tip = size * 0.56;
  const half = size * 0.27;
  const shape = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(cx, tip);
    ctx.bezierCurveTo(cx + half * 0.55, tip + (base - tip) * 0.35, cx + half, base - half * 0.5, cx, base + half * 0.25);
    ctx.bezierCurveTo(cx - half, base - half * 0.5, cx - half * 0.55, tip + (base - tip) * 0.35, cx, tip);
    ctx.closePath();
  };

  // Soft halo of colour bleeding into the cream.
  c.save();
  c.filter = "blur(26px)";
  shape(c);
  c.fillStyle = "rgba(92,28,82,0.45)";
  c.fill();
  c.restore();

  c.save();
  c.filter = "blur(5px)";
  shape(c);
  const fill = c.createLinearGradient(0, base, 0, tip);
  fill.addColorStop(0, "#2a0626");
  fill.addColorStop(0.55, "#3f0c3a");
  fill.addColorStop(1, "#5c1a54");
  c.fillStyle = fill;
  c.fill();
  c.restore();

  // Velvet streaks running outward, clipped to the blotch.
  c.save();
  shape(c);
  c.clip();
  for (let k = 0; k < 520; k++) {
    const x = cx + (rand() - 0.5) * half * 2;
    const y = tip + rand() * (base - tip + half * 0.3);
    const len = size * (0.01 + rand() * 0.035);
    c.strokeStyle = rand() > 0.55 ? `rgba(140,60,128,${0.12 + rand() * 0.2})` : `rgba(18,2,16,${0.15 + rand() * 0.25})`;
    c.lineWidth = 0.8 + rand() * 1.8;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + (x - cx) * 0.05, y - len);
    c.stroke();
  }
  c.restore();

  // Slightly raised, finely ridged velvet in the bump map.
  b.save();
  b.filter = "blur(6px)";
  shape(b);
  b.fillStyle = "rgba(255,255,255,0.22)";
  b.fill();
  b.restore();
}

/**
 * Petal maps in UV space (x = across, y = base at the bottom, rim at the top):
 * - map: cool cream, faint golden throat, fine gold veins, darker rim for definition
 * - bumpMap: raised veins over a crinkled-tissue texture
 * - veinMap: vein mask the shader uses to send pulses of light outward
 */
export function createPetalTextures() {
  const size = 2048;
  const rand = seeded(11);
  const veins = createVeins(size);
  const make = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    return [canvas, canvas.getContext("2d")!] as const;
  };
  const [color, c] = make();
  const [bump, b] = make();
  const [veinCanvas, v] = make();

  const base = c.createLinearGradient(0, size, 0, 0);
  base.addColorStop(0, "#e8b94e");
  base.addColorStop(0.07, "#f2d995");
  base.addColorStop(0.2, "#fbf3e2");
  base.addColorStop(0.55, "#fffcf6");
  base.addColorStop(1, "#fffdf9");
  c.fillStyle = base;
  c.fillRect(0, 0, size, size);

  // Darker side edges and rim so overlapping petals separate visually.
  const sides = c.createLinearGradient(0, 0, size, 0);
  sides.addColorStop(0, "rgba(96,58,84,0.26)");
  sides.addColorStop(0.1, "rgba(120,86,92,0)");
  sides.addColorStop(0.9, "rgba(120,86,92,0)");
  sides.addColorStop(1, "rgba(96,58,84,0.26)");
  c.fillStyle = sides;
  c.fillRect(0, 0, size, size);
  const tip = c.createLinearGradient(0, 0, 0, size * 0.12);
  tip.addColorStop(0, "rgba(110,72,96,0.16)");
  tip.addColorStop(1, "rgba(150,110,100,0)");
  c.fillStyle = tip;
  c.fillRect(0, 0, size, size);

  strokeVeins(c, veins, size, (vein) => `rgba(196,150,74,${vein.alpha * 0.55})`);

  // Bump: neutral grey, crinkled tissue strokes following the veins, raised veins on top.
  b.fillStyle = "#7a7a7a";
  b.fillRect(0, 0, size, size);
  for (let k = 0; k < 1800; k++) {
    const x = rand() * size;
    const y = rand() * size;
    const len = size * (0.03 + rand() * 0.08);
    const angle = Math.atan2(-size, x - size / 2) + (rand() - 0.5) * 0.2;
    b.strokeStyle = rand() > 0.5 ? `rgba(255,255,255,${0.02 + rand() * 0.03})` : `rgba(0,0,0,${0.02 + rand() * 0.03})`;
    b.lineWidth = 8 + rand() * 14;
    b.beginPath();
    b.moveTo(x, y);
    b.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    b.stroke();
  }
  b.filter = "blur(10px)";
  b.drawImage(bump, 0, 0);
  b.filter = "none";
  strokeVeins(b, veins, size, (vein) => `rgba(255,255,255,${0.3 + vein.alpha * 0.35})`, 2.2);
  paintBlotch(c, b, size);

  v.fillStyle = "#000";
  v.fillRect(0, 0, size, size);
  strokeVeins(v, veins, size, (vein) => `rgba(255,255,255,${0.6 + vein.alpha * 0.4})`, 1.4);

  const finish = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const texture = new THREE.CanvasTexture(canvas);
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    return texture;
  };
  return { map: finish(color, true), bumpMap: finish(bump, false), veinMap: finish(veinCanvas, false) };
}

/**
 * The stamen pom: a dense dome of fine golden filaments, longer and more upright
 * towards the middle, like a real rockrose (esteva).
 */
export function createFilaments(count = 150) {
  const rand = seeded(42);
  const tubes: THREE.BufferGeometry[] = [];
  const tips: THREE.Vector3[] = [];
  for (let k = 0; k < count; k++) {
    const angle = k * 2.39996 + (rand() - 0.5) * 0.3;
    const ring = Math.sqrt((k + 0.5) / count);
    const startR = 0.018 + ring * 0.07;
    const len = 0.05 + (1 - ring) * 0.07 + rand() * 0.04;
    const rise = 0.06 + (1 - ring) * 0.09 + rand() * 0.03;
    const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const base = dir.clone().multiplyScalar(startR).setZ(0.045);
    const curve = new THREE.CatmullRomCurve3([
      base,
      base.clone().add(dir.clone().multiplyScalar(len * 0.45)).setZ(0.045 + rise * 0.75),
      base.clone().add(dir.clone().multiplyScalar(len)).setZ(0.045 + rise),
    ]);
    tubes.push(new THREE.TubeGeometry(curve, 8, 0.0011 + rand() * 0.0005, 5, false));
    tips.push(curve.getPoint(1));
  }
  return { geometry: mergeGeometries(tubes), tips };
}
