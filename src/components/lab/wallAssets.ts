import * as THREE from "three";

/** The wall plane in world units, and where the ochre band starts. */
export const WALL = { width: 14, height: 8, centerY: -1, z: -0.5, bandTop: -1.3 };

const PX_W = 2048;
const PX_H = 1170;

const BAKE_FRAGMENT = /* glsl */ `
precision highp float;
uniform int uMode;          // 0 = albedo, 1 = normal
uniform vec2 uSize;         // wall size in world units
uniform float uBottom;      // world y of the wall's bottom edge
uniform float uBandTop;     // world y where the ochre barra starts
uniform vec2 uTexel;        // one texel in world units
uniform vec3 uWash;         // lime-wash colour (sRGB)
uniform vec3 uOchre;        // barra colour (sRGB)
uniform float uGrit;        // how dark the grit in the pits gets
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++) { v += a * noise(p); p = p * 2.02 + 17.3; a *= 0.5; }
  return v;
}

// Knockdown plaster: broad undulation, flat trowelled plateaus with sharp-edged
// pits between them at two scales, and fine sand on top.
float plateaus(vec2 p, out float cavity) {
  vec2 w = vec2(fbm(p * 0.8 + 3.1), fbm(p * 0.8 - 7.4));
  float a = smoothstep(0.47, 0.53, fbm(p * 3.4 + w * 1.4));
  float b = smoothstep(0.52, 0.58, fbm(p * 8.5 + w * 2.0 + 11.0));
  cavity = 1.0 - (a * 0.7 + b * 0.3);
  return a * 0.32 + b * 0.16;
}
float height(vec2 p) {
  float cav;
  float h = fbm(p * 0.55) * 0.35 + plateaus(p, cav);
  h += (noise(p * 95.0) * 0.6 + noise(p * 190.0) * 0.4) * 0.05;
  return h;
}

vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec2 p = vUv * uSize;
  float wy = uBottom + p.y;

  if (uMode == 1) {
    float hx = height(p + vec2(uTexel.x, 0.0)) - height(p - vec2(uTexel.x, 0.0));
    float hy = height(p + vec2(0.0, uTexel.y)) - height(p - vec2(0.0, uTexel.y));
    float strength = 0.0065 / max(uTexel.x, 1e-5);
    vec3 n = normalize(vec3(-hx * strength, -hy * strength, 1.0));
    gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
    return;
  }

  float cavity;
  plateaus(p, cavity);
  // Fresh lilac lime wash, slightly uneven in tone.
  vec3 col = toLinear(uWash) * (0.94 + 0.12 * fbm(p * 0.35 + 5.0));
  col *= 1.0 - cavity * 0.06;
  // Grit and dust caught in the pits.
  float grit = step(0.9, noise(p * 220.0)) * cavity;
  col = mix(col, col * uGrit, grit * 0.7);

  // The ochre barra: hand-brushed top edge, horizontal brush streaks.
  float edge = uBandTop + (fbm(vec2(p.x * 2.5, 0.5)) - 0.5) * 0.05 + (noise(vec2(p.x * 45.0, 1.0)) - 0.5) * 0.012;
  float band = 1.0 - smoothstep(edge - 0.003, edge + 0.003, wy);
  vec3 ochre = toLinear(uOchre) * (0.9 + 0.2 * fbm(vec2(p.x * 1.6, p.y * 26.0)));
  ochre *= 1.0 - cavity * 0.14;
  col = mix(col, ochre, band);

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Bakes the plaster colour and normal maps on the GPU once (a few milliseconds),
 * so the wall gets real relief without any per-frame cost.
 */
/** Fresh white lime wash, as on a real Alentejo house, with the ochre barra. */
const WALL_COLORS = { wash: [0.91, 0.86, 0.79] as const, ochre: [0.86, 0.63, 0.21] as const, grit: 0.82 };

export function bakeWall(gl: THREE.WebGLRenderer) {
  const colors = WALL_COLORS;
  const makeTarget = () =>
    new THREE.WebGLRenderTarget(PX_W, PX_H, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
  const albedo = makeTarget();
  const normal = makeTarget();
  albedo.texture.anisotropy = normal.texture.anisotropy = 8;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMode: { value: 0 },
      uWash: { value: new THREE.Vector3(...colors.wash) },
      uOchre: { value: new THREE.Vector3(...colors.ochre) },
      uGrit: { value: colors.grit },
      uSize: { value: new THREE.Vector2(WALL.width, WALL.height) },
      uBottom: { value: WALL.centerY - WALL.height / 2 },
      uBandTop: { value: WALL.bandTop },
      uTexel: { value: new THREE.Vector2(WALL.width / PX_W, WALL.height / PX_H) },
    },
    vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: BAKE_FRAGMENT,
  });
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const previous = gl.getRenderTarget();
  material.uniforms.uMode.value = 0;
  gl.setRenderTarget(albedo);
  gl.render(scene, camera);
  material.uniforms.uMode.value = 1;
  gl.setRenderTarget(normal);
  gl.render(scene, camera);
  gl.setRenderTarget(previous);

  material.dispose();
  return { map: albedo.texture, normalMap: normal.texture, dispose: () => (albedo.dispose(), normal.dispose()) };
}

/**
 * Light "gobo" for the sun: the shadow of an olive branch, as if the light came
 * through a tree in front of the house, plus a gentle falloff towards the edges
 * so the flower sits in a pool of warm light. White lets light through.
 */
export function createOliveGobo() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = (() => {
    let a = 77;
    return () => {
      a = (a * 16807) % 2147483647;
      return (a - 1) / 2147483646;
    };
  })();

  const pool = ctx.createRadialGradient(size * 0.48, size * 0.52, size * 0.08, size * 0.5, size * 0.5, size * 0.55);
  pool.addColorStop(0, "#ffffff");
  pool.addColorStop(0.45, "#e4e4e4");
  pool.addColorStop(1, "#5e5e5e");
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, size, size);

  const leaf = (x: number, y: number, angle: number, length: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(length * 0.5, -length * 0.13, length, 0);
    ctx.quadraticCurveTo(length * 0.5, length * 0.13, 0, 0);
    ctx.fill();
    ctx.restore();
  };
  const branch = (x0: number, y0: number, x1: number, y1: number, bend: number, leaves: number) => {
    ctx.strokeStyle = "rgba(40,36,44,0.85)";
    ctx.fillStyle = "rgba(40,36,44,0.82)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    const cx = (x0 + x1) / 2 + bend;
    const cy = (y0 + y1) / 2 - bend * 0.4;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
    for (let k = 0; k < leaves; k++) {
      const t = 0.08 + (k / leaves) * 0.9;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      const dir = Math.atan2(y1 - y0, x1 - x0);
      const side = k % 2 === 0 ? 1 : -1;
      leaf(x, y, dir + side * (0.5 + rand() * 0.5), 60 + rand() * 50);
    }
  };

  // Main branch reaching in from the top-right, a smaller one at the lower left.
  ctx.filter = "blur(7px)";
  branch(size * 1.05, size * -0.05, size * 0.66, size * 0.34, -60, 26);
  branch(size * 0.9, size * 0.08, size * 1.02, size * 0.42, 40, 14);
  branch(size * -0.05, size * 0.98, size * 0.22, size * 0.78, 30, 16);
  ctx.filter = "none";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
