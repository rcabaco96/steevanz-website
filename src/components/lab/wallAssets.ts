import * as THREE from "three";
import { seeded } from "./flowerAssets";

/** The wall plane in world units, and where the ochre band starts. */
export const WALL = { width: 14, height: 8, centerY: -1, z: -0.75, bandTop: -1.3 };

const PX_W = 2048;
const PX_H = 1170;

/** World y -> canvas y on the wall textures. */
const toCanvasY = (y: number) => ((WALL.centerY + WALL.height / 2 - y) / WALL.height) * PX_H;

/**
 * Lime-washed lilac wall (the brand purple, #562650, as a pale Alentejo wash):
 * uneven wash and trowel marks in the colour map, lumpy plaster relief and fine
 * grit in the bump map, and the ochre barra brushed along the bottom.
 * Kept at 2K so it builds quickly and stays light on the GPU.
 */
export function createWallTextures() {
  const rand = seeded(2026);
  const make = () => {
    const canvas = document.createElement("canvas");
    canvas.width = PX_W;
    canvas.height = PX_H;
    return [canvas, canvas.getContext("2d")!] as const;
  };
  const [color, c] = make();
  const [bump, b] = make();

  c.fillStyle = "#cdb7cb";
  c.fillRect(0, 0, PX_W, PX_H);
  b.fillStyle = "#808080";
  b.fillRect(0, 0, PX_W, PX_H);

  // Uneven wash: soft patches where the lime took more or less pigment.
  for (let k = 0; k < 220; k++) {
    const x = rand() * PX_W;
    const y = rand() * PX_H;
    const r = 40 + rand() * 300;
    const tone = rand();
    const rgb = tone < 0.45 ? "222,206,220" : tone < 0.8 ? "184,160,182" : "205,180,196";
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${0.08 + rand() * 0.1})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Lumpy plaster relief.
  for (let k = 0; k < 5200; k++) {
    const x = rand() * PX_W;
    const y = rand() * PX_H;
    const r = 3 + Math.pow(rand(), 2) * 40;
    const up = rand() > 0.5;
    const g = b.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, up ? `rgba(255,255,255,${0.1 + rand() * 0.2})` : `rgba(0,0,0,${0.1 + rand() * 0.2})`);
    g.addColorStop(1, "rgba(128,128,128,0)");
    b.fillStyle = g;
    b.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Trowel strokes: long shallow arcs in relief, with a faint tone shift.
  for (let k = 0; k < 900; k++) {
    const x = rand() * PX_W;
    const y = rand() * PX_H;
    const r = 40 + rand() * 200;
    const a = rand() * Math.PI * 2;
    const sweep = 0.3 + rand() * 0.7;
    const light = rand() > 0.5;
    b.strokeStyle = light ? `rgba(255,255,255,${0.05 + rand() * 0.08})` : `rgba(0,0,0,${0.05 + rand() * 0.08})`;
    b.lineWidth = 3 + rand() * 14;
    b.beginPath();
    b.arc(x, y, r, a, a + sweep);
    b.stroke();
    c.strokeStyle = light ? `rgba(232,220,232,${0.04 + rand() * 0.05})` : `rgba(170,146,170,${0.03 + rand() * 0.04})`;
    c.lineWidth = b.lineWidth;
    c.beginPath();
    c.arc(x, y, r, a, a + sweep);
    c.stroke();
  }

  // Fine grit: mostly relief, barely any colour.
  for (let k = 0; k < 26000; k++) {
    const x = rand() * PX_W;
    const y = rand() * PX_H;
    const s = 0.7 + rand() * 1.3;
    const up = rand() > 0.5;
    b.fillStyle = up ? `rgba(255,255,255,${0.15 + rand() * 0.25})` : `rgba(0,0,0,${0.15 + rand() * 0.25})`;
    b.fillRect(x, y, s, s);
    if (rand() > 0.85) {
      c.fillStyle = up ? "rgba(240,232,240,0.18)" : "rgba(120,92,118,0.12)";
      c.fillRect(x, y, s, s);
    }
  }

  // The ochre barra, brushed by hand along its top edge.
  const top = toCanvasY(WALL.bandTop);
  const edge = (x: number) => top + Math.sin(x * 0.018) * 1.6 + Math.sin(x * 0.0035) * 4;
  c.save();
  c.beginPath();
  c.moveTo(0, PX_H);
  for (let x = 0; x <= PX_W; x += 3) c.lineTo(x, edge(x) + (rand() - 0.5) * 1.2);
  c.lineTo(PX_W, PX_H);
  c.closePath();
  c.fillStyle = "#d9a238";
  c.fill();
  c.clip();
  for (let k = 0; k < 1300; k++) {
    const x = rand() * PX_W;
    const y = top + rand() * (PX_H - top);
    c.strokeStyle = rand() > 0.5 ? `rgba(240,190,92,${0.08 + rand() * 0.1})` : `rgba(164,108,34,${0.05 + rand() * 0.09})`;
    c.lineWidth = 2 + rand() * 7;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 20 + rand() * 90, y + (rand() - 0.5) * 4);
    c.stroke();
  }
  c.restore();
  b.strokeStyle = "rgba(255,255,255,0.35)";
  b.lineWidth = 3;
  b.beginPath();
  for (let x = 0; x <= PX_W; x += 3) b.lineTo(x, edge(x));
  b.stroke();

  b.filter = "blur(0.8px)";
  b.drawImage(bump, 0, 0);
  b.filter = "none";

  const finish = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const texture = new THREE.CanvasTexture(canvas);
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };
  return { map: finish(color, true), bumpMap: finish(bump, false) };
}
