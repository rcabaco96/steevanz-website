import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const params = new URLSearchParams(location.search);
const W = +(params.get("w") || 900), H = +(params.get("h") || 1100);
const ALPHA = params.get("alpha") === "1";
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: ALPHA, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.setClearColor("#0b2416", ALPHA ? 0 : 1);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 50);
camera.position.set(0, 0, 10);
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const d1 = new THREE.DirectionalLight(0xffffff, 1.3); d1.position.set(3, 5, 6); scene.add(d1);
const d2 = new THREE.DirectionalLight("#c7f0d2", 0.4); d2.position.set(-4, -2, 3); scene.add(d2);

function buildEnvironment(gl) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#0b2416");
  const box = (color, intensity, w, h, position) => {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    mesh.position.set(...position); mesh.lookAt(0, 0, 0); studio.add(mesh);
  };
  box("#ffffff", 3, 10, 3, [0, 4, 3]);
  box("#ffffff", 2.2, 2.2, 9, [-5, 0.5, 2]);
  box("#ffffff", 1.5, 1.4, 9, [5, -0.5, 2]);
  box("#64ba4c", 1.8, 5, 2, [0, -3.5, -3]);
  box("#0b6b33", 0.7, 12, 12, [0, 0, -6]);
  const pmrem = new THREE.PMREMGenerator(gl);
  const t = pmrem.fromScene(studio, 0.035);
  pmrem.dispose();
  return t.texture;
}
const env = buildEnvironment(renderer);

// ---------- procedural (port of EmblemCanvas.tsx) ----------
const LAYERS = [
  { id: "plate", depth: 0.12, bevel: [0.04, 0.03, 3], z: -0.2, explode: -1.25, face: "plateBack", side: "silver" },
  { id: "ring", depth: 0.05, bevel: [0.02, 0.014, 2], z: -0.035, explode: -0.62, face: "enamelBase", side: "silver" },
  { id: "field", depth: 0.012, bevel: [0.006, 0.004, 1], z: -0.04, explode: -0.3, face: "porcelainBase", side: "silver" },
  { id: "leaves", depth: 0.022, bevel: [0.007, 0.004, 1], z: -0.012, explode: 0.28, face: "enamel", side: "gold" },
  { id: "year", depth: 0.02, bevel: [0.006, 0.004, 1], z: -0.012, explode: 0.95, face: "enamel", side: "silver" },
  { id: "bows", depth: 0.05, bevel: [0.016, 0.01, 2], z: -0.012, explode: 0.78, face: "enamel", side: "silver" },
  { id: "vshield", depth: 0.05, bevel: [0.016, 0.01, 2], z: -0.012, explode: 0.62, face: "blackEnamel", side: "silver" },
  { id: "vinner", depth: 0.03, bevel: [0.01, 0.006, 1], z: 0.05, explode: 1.0, face: "enamel", side: "gold" },
  { id: "yellow", depth: 0.05, bevel: [0.014, 0.008, 2], z: 0.05, explode: 1.32, face: "goldFace", side: "gold" },
];
let data;
function uvGen(meta) {
  const { minX, minY, width, height } = meta;
  return {
    generateTopUV(_g, v, a, b, c) { const uv = (i) => new THREE.Vector2((v[i * 3] - minX) / width, (v[i * 3 + 1] - minY) / height); return [uv(a), uv(b), uv(c)]; },
    generateSideWallUV() { const z = new THREE.Vector2(); return [z, z, z, z]; },
  };
}
function buildGeometry(spec) {
  const shapes = data.layers[spec.id].map((raw) => {
    const pts = (f) => { const p = []; for (let i = 0; i < f.length; i += 2) p.push(new THREE.Vector2(f[i], f[i + 1])); return p; };
    const s = new THREE.Shape(pts(raw.o)); for (const h of raw.h) s.holes.push(new THREE.Path(pts(h))); return s;
  });
  const [t, s, n] = spec.bevel;
  return new THREE.ExtrudeGeometry(shapes, { depth: spec.depth, bevelEnabled: true, bevelThickness: t, bevelSize: s, bevelSegments: n, curveSegments: 1, UVGenerator: uvGen(data.meta) });
}
const loadTex = (url) => new THREE.TextureLoader().loadAsync(url).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });

async function buildProcedural(variant) {
  data = await (await fetch("/emblem/emblem-shapes.json")).json();
  const [full, base] = await Promise.all([loadTex("/media/clients/grob/emblema-textura.webp"), loadTex("/media/clients/grob/emblema-textura-base.webp")]);
  let mats;
  if (variant === "v0") mats = defaultMaterials({ full, base, env });
  else {
    const lin = (u) => new THREE.TextureLoader().loadAsync(u).then((t) => { t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; return t; });
    const [normal, aoh] = await Promise.all([lin("/out/maps/normal.webp"), lin("/out/maps/ao-height.webp")]);
    const campo = variant === "v1" ? base : await loadTex("/media/clients/grob/emblema-textura-campo.webp");
    mats = window.improvedMaterials({ full, base, campo, env, normal, aoh, variant });
  }
  const relief = variant !== "v0" && variant !== "v1" ? await loadRelief("/out/maps/emblema-relevo.bin") : null;
  const group = new THREE.Group();
  const layers = [];
  for (const spec of LAYERS) {
    const m = new THREE.Mesh(buildGeometry(spec), [mats.faces[spec.face], mats.sides[spec.side]]);
    m.position.z = spec.z; m.userData.spec = spec; group.add(m); layers.push(m);
    if (relief && spec.id === "bows") {
      const r = new THREE.Mesh(relief, mats.relief);
      r.position.z = spec.depth + spec.bevel[0];
      m.add(r);
    }
  }
  group.userData.layers = layers;
  group.userData.height = data.meta.height;
  return group;
}
function defaultMaterials({ full, base, env }) {
  const silver = new THREE.MeshStandardMaterial({ color: "#e3e8e6", metalness: 1, roughness: 0.18, envMap: env });
  const gold = new THREE.MeshStandardMaterial({ color: "#e6bf55", metalness: 1, roughness: 0.22, envMap: env });
  return {
    faces: {
      enamel: new THREE.MeshStandardMaterial({ map: full, roughness: 0.16, metalness: 0.05, envMap: env, envMapIntensity: 0.9 }),
      enamelBase: new THREE.MeshStandardMaterial({ map: base, roughness: 0.16, metalness: 0.05, envMap: env, envMapIntensity: 0.9 }),
      porcelainBase: new THREE.MeshStandardMaterial({ map: base, roughness: 0.32, metalness: 0, envMap: env, envMapIntensity: 0.7 }),
      blackEnamel: new THREE.MeshStandardMaterial({ color: "#121311", roughness: 0.14, metalness: 0.2, envMap: env }),
      goldFace: new THREE.MeshStandardMaterial({ map: full, metalness: 0.75, roughness: 0.2, envMap: env }),
      plateBack: new THREE.MeshStandardMaterial({ color: "#c9cfcc", metalness: 1, roughness: 0.36, envMap: env }),
    },
    sides: { silver, gold },
  };
}

async function loadRelief(url) {
  const buf = await (await fetch(url)).arrayBuffer();
  const dv = new DataView(buf);
  const nv = dv.getUint32(4, true), nt = dv.getUint32(8, true), zmax = dv.getFloat32(12, true);
  const q = new Uint16Array(buf, 16, nv * 3);
  const idx = new Uint16Array(buf, 16 + nv * 6, nt * 3);
  const { minX, minY, width, height } = data.meta;
  const pos = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
  for (let i = 0; i < nv; i++) {
    const u = q[i * 3] / 65535, v = q[i * 3 + 1] / 65535;
    pos[i * 3] = minX + u * width; pos[i * 3 + 1] = minY + v * height; pos[i * 3 + 2] = (q[i * 3 + 2] / 65535) * zmax;
    uv[i * 2] = u; uv[i * 2 + 1] = v;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1));
  g.computeVertexNormals();
  return g;
}
window.improvedMaterials = ({ full, base, campo, env, normal, aoh }) => {
  const ns = new THREE.Vector2(1, 1);
  const enamel = (map, o = {}) => new THREE.MeshStandardMaterial({ map, normalMap: normal, normalScale: ns, aoMap: aoh, aoMapIntensity: 1, roughness: 0.2, metalness: 0.0, envMap: env, envMapIntensity: 1, ...o });
  const silver = new THREE.MeshStandardMaterial({ color: "#e3e8e6", metalness: 1, roughness: 0.2, envMap: env });
  const gold = new THREE.MeshStandardMaterial({ color: "#e6bf55", metalness: 1, roughness: 0.24, envMap: env });
  return {
    faces: {
      enamel: enamel(full),
      enamelBase: enamel(base),
      porcelainBase: enamel(campo, { roughness: 0.3, normalMap: null }),
      blackEnamel: new THREE.MeshStandardMaterial({ color: "#121311", roughness: 0.14, metalness: 0.2, envMap: env, normalMap: normal, aoMap: aoh }),
      goldFace: enamel(full, { roughness: 0.18 }),
      plateBack: new THREE.MeshStandardMaterial({ color: "#c9cfcc", metalness: 1, roughness: 0.36, envMap: env }),
    },
    sides: { silver, gold },
    relief: enamel(full, { normalMap: null }),
  };
};

// ---------- GLB ----------
async function buildGlb(url) {
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(url);
  const root = gltf.scene;
  let tris = 0;
  root.traverse((o) => { if (o.isMesh) { o.material.envMap = env; o.material.needsUpdate = true; tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3; } });
  const box = new THREE.Box3().setFromObject(root);
  const g = new THREE.Group(); g.add(root);
  const c = box.getCenter(new THREE.Vector3()); root.position.sub(c);
  g.userData.height = box.max.y - box.min.y;
  g.userData.info = { tris, size: box.getSize(new THREE.Vector3()).toArray() };
  return g;
}

const holder = new THREE.Group(); scene.add(holder);
const models = {};
window.load = async (name, kind, arg) => {
  models[name] = kind === "glb" ? await buildGlb(arg) : await buildProcedural(arg);
  return models[name].userData.info || { layers: LAYERS.length };
};
// view: {model, rotX, rotY, zoom, tx, ty, explode, height}
window.show = async (v) => {
  holder.clear();
  const m = models[v.model]; holder.add(m);
  const height = v.height ?? 3.7;
  m.scale.setScalar(height / m.userData.height);
  m.rotation.set(v.rotX || 0, v.rotY || 0, 0);
  if (m.userData.layers) for (const l of m.userData.layers) { l.position.z = l.userData.spec.z + l.userData.spec.explode * (v.explode || 0); const f = l.material[0]; if (l.userData.spec.id === 'field' && f.aoMap) f.aoMapIntensity = 1 - (v.explode || 0); }
  const zoom = v.zoom || 1;
  camera.fov = 30 / zoom; camera.updateProjectionMatrix();
  camera.position.set((v.tx || 0) * height / 2, (v.ty || 0) * height / 2, 10);
  camera.lookAt(camera.position.x, camera.position.y, 0);
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);
  await new Promise((r) => requestAnimationFrame(r));
  renderer.render(scene, camera);
  return true;
};
window.glInfo = () => { const gl = renderer.getContext(); const e = gl.getExtension("WEBGL_debug_renderer_info"); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : "?"; };
window.THREE = THREE;
window.ready = true;
