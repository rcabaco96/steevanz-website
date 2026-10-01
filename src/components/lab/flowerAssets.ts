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
 * s runs across the petal (-1..1). The outline is obovate, like a real rockrose
 * petal: a narrow claw at the base, sides that widen in a curve to rounded
 * shoulders, and a broad, softly wavy top edge. z adds the cup, ruffles and the
 * fine tissue-paper crumple.
 */
export function createPetalGeometry(seed: number) {
  const rand = seeded(seed);
  const segU = 120;
  const segS = 80;
  const L = PETAL_LENGTH;
  const wavePhase = rand() * Math.PI * 2;
  const sidePhase = rand() * Math.PI * 2;
  const waveAmp = 0.03 + rand() * 0.015;
  const positions: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    // Half-width along the petal: narrow claw, curved widening, rounded shoulders.
    const grow = Math.pow(Math.sin(Math.min(1, u / 0.78) * (Math.PI / 2)), 0.85);
    const shoulder = 1 - 0.1 * smoothstep(0.8, 1, u);
    const sideWave = 1 + 0.03 * Math.sin(u * 8 + sidePhase) * smoothstep(0.2, 0.7, u);
    const halfWidth = L * (0.07 + 0.6 * grow) * shoulder * sideWave;
    for (let j = 0; j <= segS; j++) {
      const s = (j / segS) * 2 - 1;
      const x = s * halfWidth;
      // Rounded, slightly wavy top edge (only shapes the upper part of the petal).
      const top = 1 - 0.18 * Math.pow(Math.abs(s), 2.2) * smoothstep(0.5, 1, u);
      const wave = waveAmp * Math.sin(s * Math.PI * 2.4 + wavePhase) * smoothstep(0.7, 1, u);
      const y = L * ((0.035 + 0.965 * u) * top + wave);
      const phi = Math.atan2(x, Math.max(y, 1e-4));
      const cup = 0.36 * Math.pow(u, 1.8) * L;
      const across = -0.09 * s * s * u * L;
      const ruffle = 0.055 * Math.sin(phi * 9 + u * 4 + wavePhase) * u * u * L;
      const pleats = 0.004 * Math.sin(phi * 26 + Math.sin(u * 9 + wavePhase) * 1.4) * smoothstep(0.15, 0.9, u);
      const crinkle =
        (0.005 * Math.sin(s * 31 + u * 11 + wavePhase) * Math.sin(u * 23 - s * 7) +
          0.0025 * Math.sin(s * 67 + u * 41) * Math.sin(u * 53 + s * 13)) *
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
    return h0 * (0.03 + 0.97 * (1 - smoothstep(0.5, 1, across)) * (1 - smoothstep(0.65, 1, along)));
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
  const count = 150;
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
 * The aubergine blotch of the rockrose: a rounded spot low on the petal, just above
 * the yellow base, with a dark core and an upper edge that feathers out into fine
 * streaks running along the veins — painted into the petal, never a hard shape.
 */
function paintBlotch(c: CanvasRenderingContext2D, b: CanvasRenderingContext2D, size: number) {
  const rand = seeded(23);
  const cx = size * 0.5;
  const cy = size * 0.79;
  const rx = size * 0.17;
  const ry = size * 0.1;

  // Wide, soft colour bleed.
  c.save();
  c.filter = `blur(${size * 0.02}px)`;
  c.fillStyle = "rgba(96,24,80,0.35)";
  c.beginPath();
  c.ellipse(cx, cy, rx * 1.25, ry * 1.35, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // Core: deep aubergine, darkest towards the base.
  c.save();
  c.filter = `blur(${size * 0.008}px)`;
  const core = c.createRadialGradient(cx, cy + ry * 0.4, 0, cx, cy, rx);
  core.addColorStop(0, "#2b0626");
  core.addColorStop(0.55, "#45103f");
  core.addColorStop(1, "rgba(92,26,82,0.75)");
  c.fillStyle = core;
  c.beginPath();
  c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // Feathered streaks running up the veins from the blotch's upper edge.
  c.save();
  c.lineCap = "round";
  for (let k = 0; k < 260; k++) {
    const a = -Math.PI / 2 + (rand() - 0.5) * 1.7;
    const sx = cx + Math.cos(a) * rx * 0.8 * rand();
    const sy = cy + Math.sin(a) * ry * 0.6;
    const len = size * (0.02 + rand() * 0.07);
    const ex = sx + Math.cos(a) * len * 0.35 + (sx - cx) * 0.25;
    const ey = sy - len;
    c.strokeStyle = `rgba(${70 + rand() * 40},${14 + rand() * 16},${62 + rand() * 30},${0.12 + rand() * 0.35})`;
    c.lineWidth = 0.8 + rand() * 2.2;
    c.beginPath();
    c.moveTo(sx, sy);
    c.quadraticCurveTo((sx + ex) / 2 + (rand() - 0.5) * 6, (sy + ey) / 2, ex, ey);
    c.stroke();
  }
  c.restore();

  // Velvet: very slight raised texture inside the blotch.
  b.save();
  b.filter = `blur(${size * 0.006}px)`;
  b.fillStyle = "rgba(255,255,255,0.12)";
  b.beginPath();
  b.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
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
  base.addColorStop(0, "#e8b52e");
  base.addColorStop(0.07, "#f3d77c");
  base.addColorStop(0.13, "#fdf7ec");
  base.addColorStop(0.35, "#ffffff");
  base.addColorStop(1, "#fefdfb");
  c.fillStyle = base;
  c.fillRect(0, 0, size, size);

  // Edges a touch lighter, as thin tissue lets more light through.
  const sides = c.createLinearGradient(0, 0, size, 0);
  // Soft, wide shading towards the side edges (the petal curves away from the light),
  // so overlapping petals read as separate sheets. No hard line at the very edge.
  sides.addColorStop(0, "rgba(176,160,168,0.2)");
  sides.addColorStop(0.16, "rgba(176,160,168,0)");
  sides.addColorStop(0.84, "rgba(176,160,168,0)");
  sides.addColorStop(1, "rgba(176,160,168,0.2)");
  c.fillStyle = sides;
  c.fillRect(0, 0, size, size);
  const tip = c.createLinearGradient(0, 0, 0, size * 0.1);
  tip.addColorStop(0, "rgba(255,253,249,0.5)");
  tip.addColorStop(1, "rgba(255,253,249,0)");
  c.fillStyle = tip;
  c.fillRect(0, 0, size, size);

  strokeVeins(c, veins, size, (vein) => `rgba(206,196,184,${0.16 + vein.alpha * 0.22})`);

  // Bump: neutral grey, crinkled tissue strokes following the veins, raised veins on top.
  b.fillStyle = "#7a7a7a";
  b.fillRect(0, 0, size, size);
  for (let k = 0; k < 1800; k++) {
    const x = rand() * size;
    const y = rand() * size;
    const len = size * (0.03 + rand() * 0.08);
    const angle = Math.atan2(-size, x - size / 2) + (rand() - 0.5) * 0.2;
    b.strokeStyle = rand() > 0.5 ? `rgba(255,255,255,${0.012 + rand() * 0.018})` : `rgba(0,0,0,${0.012 + rand() * 0.018})`;
    b.lineWidth = 8 + rand() * 14;
    b.beginPath();
    b.moveTo(x, y);
    b.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    b.stroke();
  }
  b.filter = "blur(16px)";
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
export function createFilaments(count = 260) {
  const rand = seeded(42);
  const tubes: THREE.BufferGeometry[] = [];
  const tips: THREE.Vector3[] = [];
  const dirs: THREE.Vector3[] = [];
  for (let k = 0; k < count; k++) {
    // Dense, irregular tuft: golden-angle spread with jitter, varied lengths,
    // each filament arching outward with its own bend and a little droop.
    const angle = k * 2.39996 + (rand() - 0.5) * 0.6;
    const ring = Math.sqrt((k + 0.5) / count);
    const startR = 0.02 + ring * 0.065 + (rand() - 0.5) * 0.01;
    const len = 0.06 + (1 - ring) * 0.07 + rand() * 0.07;
    const rise = 0.05 + (1 - ring) * 0.1 + rand() * 0.05;
    const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const side = new THREE.Vector3(-dir.y, dir.x, 0).multiplyScalar((rand() - 0.5) * 0.04);
    const base = dir.clone().multiplyScalar(startR).setZ(0.085);
    const droop = rand() * 0.025;
    const curve = new THREE.CatmullRomCurve3([
      base,
      base.clone().add(dir.clone().multiplyScalar(len * 0.3)).add(side.clone().multiplyScalar(0.5)).setZ(0.085 + rise * 0.6),
      base.clone().add(dir.clone().multiplyScalar(len * 0.7)).add(side).setZ(0.085 + rise * 0.98),
      base.clone().add(dir.clone().multiplyScalar(len)).add(side.clone().multiplyScalar(1.3)).setZ(0.085 + rise - droop),
    ]);
    tubes.push(new THREE.TubeGeometry(curve, 10, 0.0007 + rand() * 0.0005, 4, false));
    tips.push(curve.getPoint(1));
    dirs.push(curve.getTangent(1));
  }
  return { geometry: mergeGeometries(tubes), tips, dirs };
}
