import * as THREE from "three";

/** The wall plane in world units, and where the ochre band starts. */
export const WALL = { width: 14, height: 8, centerY: -1, z: -0.75, bandTop: -1.3 };

const PX_W = 2048;
const PX_H = 1170;

const BAKE_FRAGMENT = /* glsl */ `
precision highp float;
uniform int uMode;          // 0 = albedo, 1 = normal
uniform vec2 uSize;         // wall size in world units
uniform float uBottom;      // world y of the wall's bottom edge
uniform float uBandTop;     // world y where the ochre barra starts
uniform vec2 uTexel;        // one texel in world units
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
  vec3 col = toLinear(vec3(0.8, 0.74, 0.83)) * (0.94 + 0.12 * fbm(p * 0.35 + 5.0));
  col *= 1.0 - cavity * 0.06;
  // Grit and dust caught in the pits.
  float grit = step(0.83, noise(p * 220.0)) * cavity;
  col = mix(col, col * 0.55, grit * 0.7);

  // The ochre barra: hand-brushed top edge, horizontal brush streaks.
  float edge = uBandTop + (fbm(vec2(p.x * 2.5, 0.5)) - 0.5) * 0.05 + (noise(vec2(p.x * 45.0, 1.0)) - 0.5) * 0.012;
  float band = 1.0 - smoothstep(edge - 0.003, edge + 0.003, wy);
  vec3 ochre = toLinear(vec3(0.86, 0.63, 0.21)) * (0.9 + 0.2 * fbm(vec2(p.x * 1.6, p.y * 26.0)));
  ochre *= 1.0 - cavity * 0.14;
  col = mix(col, ochre, band);

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Bakes the plaster colour and normal maps on the GPU once (a few milliseconds),
 * so the wall gets real relief without any per-frame cost.
 */
export function bakeWall(gl: THREE.WebGLRenderer) {
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
