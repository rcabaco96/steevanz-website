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
      const ruffle = 0.058 * Math.sin(phi * 9 + u * 4 + wavePhase) * u * u * L;
      const pleats = 0.006 * Math.sin(phi * 26 + Math.sin(u * 9 + wavePhase) * 1.4) * smoothstep(0.15, 0.9, u);
      const crinkle =
        (0.006 * Math.sin(s * 31 + u * 11 + wavePhase) * Math.sin(u * 23 - s * 7) +
          0.003 * Math.sin(s * 67 + u * 41) * Math.sin(u * 53 + s * 13)) *
        u * L;
      positions.push(x, y, cup + across + ruffle + pleats + crinkle);
      uvs.push(j / segS, u);
    }
  }
  return thickenSurface(positions, uvs, segU, segS, PETAL_THICKNESS);
}

const PETAL_THICKNESS = 0.011;

/**
 * Turns a (segU+1) x (segS+1) surface grid into a solid petal: an upper and lower
 * skin offset along the surface normal, joined by a rounded rim that catches light.
 */
function thickenSurface(positions: number[], uvs: number[], segU: number, segS: number, thickness: number) {
  const cols = segS + 1;
  const grid = new THREE.BufferGeometry();
  grid.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const gridIndex: number[] = [];
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segS; j++) {
      const a = i * cols + j;
      const b = a + cols;
      gridIndex.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  grid.setIndex(gridIndex);
  grid.computeVertexNormals();
  const n = grid.getAttribute("normal") as THREE.BufferAttribute;
  const count = positions.length / 3;
  const h0 = thickness / 2;
  // Real petals thin out towards their edges: full thickness in the middle,
  // almost paper-thin at the rim, so the edge never reads as a dark band.
  const halfThickness = (k: number) => {
    const across = Math.abs(uvs[k * 2] * 2 - 1);
    const along = uvs[k * 2 + 1];
    return h0 * (0.12 + 0.88 * (1 - smoothstep(0.55, 1, across)) * (1 - smoothstep(0.7, 1, along)));
  };
  const P = (k: number) => new THREE.Vector3(positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]);
  const N = (k: number) => new THREE.Vector3(n.getX(k), n.getY(k), n.getZ(k));

  const outPos: number[] = [];
  const outNor: number[] = [];
  const outUv: number[] = [];
  const outIdx: number[] = [];

  // Upper and lower skins.
  for (const side of [1, -1]) {
    for (let k = 0; k < count; k++) {
      const p = P(k).addScaledVector(N(k), halfThickness(k) * side);
      const nn = N(k).multiplyScalar(side);
      outPos.push(p.x, p.y, p.z);
      outNor.push(nn.x, nn.y, nn.z);
      outUv.push(uvs[k * 2], uvs[k * 2 + 1]);
    }
  }
  for (let t = 0; t < gridIndex.length; t += 3) {
    outIdx.push(gridIndex[t], gridIndex[t + 1], gridIndex[t + 2]);
    outIdx.push(count + gridIndex[t], count + gridIndex[t + 2], count + gridIndex[t + 1]);
  }

  // Boundary loop: left edge, rim, right edge, base.
  const loop: { k: number; inward: number }[] = [];
  for (let i = 0; i <= segU; i++) loop.push({ k: i * cols, inward: i * cols + 1 });
  for (let j = 1; j <= segS; j++) loop.push({ k: segU * cols + j, inward: (segU - 1) * cols + j });
  for (let i = segU - 1; i >= 0; i--) loop.push({ k: i * cols + segS, inward: i * cols + segS - 1 });
  for (let j = segS - 1; j >= 1; j--) loop.push({ k: j, inward: cols + j });

  const ringSteps = 6;
  const base = outPos.length / 3;
  for (const { k, inward } of loop) {
    const p = P(k);
    const nn = N(k);
    const out = p.clone().sub(P(inward));
    out.addScaledVector(nn, -out.dot(nn)).normalize();
    for (let r = 0; r <= ringSteps; r++) {
      const a = (r / ringSteps) * Math.PI;
      const dir = nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(out, Math.sin(a));
      const q = p.clone().addScaledVector(dir, halfThickness(k));
      outPos.push(q.x, q.y, q.z);
      const lit = nn.clone().multiplyScalar(Math.cos(a) >= 0 ? 1 : -1).lerp(dir, 0.3).normalize();
      outNor.push(lit.x, lit.y, lit.z);
      outUv.push(uvs[inward * 2], uvs[inward * 2 + 1]);
    }
  }
  const ring = ringSteps + 1;
  for (let a = 0; a < loop.length; a++) {
    const b = (a + 1) % loop.length;
    for (let r = 0; r < ringSteps; r++) {
      const v0 = base + a * ring + r;
      const v1 = base + b * ring + r;
      outIdx.push(v0, v1, v0 + 1, v1, v1 + 1, v0 + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(outPos, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(outNor, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(outUv, 2));
  geometry.setIndex(outIdx);
  grid.dispose();
  return geometry;
}

interface Vein {
  sx: number;
  sy: number;
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
  const count = 96;
  for (let k = 0; k < count; k++) {
    const sx = size * (0.5 + (rand() - 0.5) * 0.06);
    const ex = size * (0.01 + (k / count) * 0.98 + (rand() - 0.5) * 0.015);
    const reach = 0.5 + rand() * 0.46;
    const ey = size * (1 - reach);
    const cx = (sx + ex) / 2 + (rand() - 0.5) * size * 0.04;
    const cy = size * (1 - reach * 0.5);
    const sy = size * (1 - (0.08 + rand() * 0.07));
    const vein: Vein = { sx, sy, cx, cy, ex, ey, width: 0.8 + rand() * 1.6, alpha: 0.3 + rand() * 0.5 };
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
    ctx.moveTo(v.sx, v.sy);
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
  c.filter = "blur(8px)";
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
  base.addColorStop(0, "#efc24a");
  base.addColorStop(0.06, "#f6e2a0");
  base.addColorStop(0.14, "#fcf8f0");
  base.addColorStop(0.4, "#ffffff");
  base.addColorStop(1, "#ffffff");
  c.fillStyle = base;
  c.fillRect(0, 0, size, size);

  // Edges a touch lighter, as thin tissue lets more light through.
  const sides = c.createLinearGradient(0, 0, size, 0);
  sides.addColorStop(0, "rgba(255,253,249,0.55)");
  sides.addColorStop(0.08, "rgba(255,253,249,0)");
  sides.addColorStop(0.92, "rgba(255,253,249,0)");
  sides.addColorStop(1, "rgba(255,253,249,0.55)");
  c.fillStyle = sides;
  c.fillRect(0, 0, size, size);
  const tip = c.createLinearGradient(0, 0, 0, size * 0.1);
  tip.addColorStop(0, "rgba(255,253,249,0.5)");
  tip.addColorStop(1, "rgba(255,253,249,0)");
  c.fillStyle = tip;
  c.fillRect(0, 0, size, size);

  strokeVeins(c, veins, size, (vein) => `rgba(196,178,150,${0.1 + vein.alpha * 0.18})`);

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
  strokeVeins(b, veins, size, (vein) => `rgba(0,0,0,${0.35 + vein.alpha * 0.35})`, 1.8);
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
export function createFilaments(count = 230) {
  const rand = seeded(42);
  const tubes: THREE.BufferGeometry[] = [];
  const tips: THREE.Vector3[] = [];
  for (let k = 0; k < count; k++) {
    const angle = k * 2.39996 + (rand() - 0.5) * 0.3;
    const ring = Math.sqrt((k + 0.5) / count);
    const startR = 0.018 + ring * 0.07;
    const len = 0.07 + (1 - ring) * 0.08 + rand() * 0.05;
    const rise = 0.06 + (1 - ring) * 0.09 + rand() * 0.03;
    const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const base = dir.clone().multiplyScalar(startR).setZ(0.085);
    const curve = new THREE.CatmullRomCurve3([
      base,
      base.clone().add(dir.clone().multiplyScalar(len * 0.45)).setZ(0.085 + rise * 0.75),
      base.clone().add(dir.clone().multiplyScalar(len)).setZ(0.085 + rise),
    ]);
    tubes.push(new THREE.TubeGeometry(curve, 8, 0.0011 + rand() * 0.0005, 5, false));
    tips.push(curve.getPoint(1));
  }
  return { geometry: mergeGeometries(tubes), tips };
}
