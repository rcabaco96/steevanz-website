"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import shapesData from "./emblem-shapes.json";
import { emblemColorUrls, emblemNormalUrl, emblemReliefUrl, type EmblemState } from "./state";

// O emblema do GROB em 3D, construído a partir do contorno vetorizado do logótipo oficial (o PDF vetorial que o
// clube publica na página Símbolo). Cada camada do escudo é uma forma extrudida com bisel: a placa de prata por
// trás, o rebordo verde em esmalte, o campo branco, os ramos, os laços, o «V» (escudo preto, verde, banda dourada)
// e o ano. As faces da frente levam a textura do próprio logótipo; os biséis são metal. Luz de estúdio feita aqui
// (caixas de luz numa cena pequena, passada uma vez pelo PMREM), sem HDR nem bibliotecas extra.
//
// Fluidez (2026-11-02, depois de medir): só desenha quando alguma coisa mexe (frameloop «demand»: o scroll, o rato
// ou o amortecimento ainda a correr acordam-no); os shaders compilam-se em paralelo antes do primeiro fotograma
// (compileAsync, sem congelar a página); materiais Standard (shaders mais pequenos que os Physical); a resolução
// desce sozinha se os fotogramas ficarem lentos.
//
// Relevo (2026-11-02): o volume esculpido veio de um modelo feito por IA (imagem→3D, 34 MB), cozido para cá em
// vez de o carregar: um mapa de normais no espaço das texturas do logótipo (emblema-relevo-normal.webp) e o laço
// esculpido como malha própria (emblema-relevo.bin, ~15k triângulos), por cima da camada dos laços. As formas, as
// cores e o desmontar continuam a vir do vetor; o relevo nunca muda as cores (ver logoFace). Como se faz:
// docs/3d-emblem-playbook.md.

type RawShape = { o: number[]; h: number[][] };
type LayerId = "plate" | "ring" | "field" | "leaves" | "bows" | "year" | "vshield" | "vinner" | "yellow";

const data = shapesData as unknown as {
  meta: { width: number; height: number; minX: number; minY: number };
  layers: Record<LayerId, RawShape[]>;
};

/** Que imagem do logótipo cobre a face da frente (a placa de trás é só metal). */
type FaceKind = "enamel" | "enamelBase" | "porcelainBase" | "black" | "plateBack";
type SideKind = "silver" | "gold";

interface LayerSpec {
  id: LayerId;
  depth: number;
  bevel: [thickness: number, size: number, segments: number];
  z: number;
  explode: number;
  face: FaceKind;
  side: SideKind;
}

const LAYERS: LayerSpec[] = [
  { id: "plate", depth: 0.12, bevel: [0.04, 0.03, 3], z: -0.2, explode: -1.25, face: "plateBack", side: "silver" },
  { id: "ring", depth: 0.05, bevel: [0.02, 0.014, 2], z: -0.035, explode: -0.62, face: "enamelBase", side: "silver" },
  { id: "field", depth: 0.012, bevel: [0.006, 0.004, 1], z: -0.04, explode: -0.3, face: "porcelainBase", side: "silver" },
  { id: "leaves", depth: 0.022, bevel: [0.007, 0.004, 1], z: -0.012, explode: 0.28, face: "enamel", side: "gold" },
  { id: "year", depth: 0.02, bevel: [0.006, 0.004, 1], z: -0.012, explode: 0.95, face: "enamel", side: "silver" },
  { id: "bows", depth: 0.05, bevel: [0.016, 0.01, 2], z: -0.012, explode: 0.78, face: "enamel", side: "silver" },
  { id: "vshield", depth: 0.05, bevel: [0.016, 0.01, 2], z: -0.012, explode: 0.62, face: "black", side: "silver" },
  { id: "vinner", depth: 0.03, bevel: [0.01, 0.006, 1], z: 0.05, explode: 1.0, face: "enamel", side: "gold" },
  { id: "yellow", depth: 0.05, bevel: [0.014, 0.008, 2], z: 0.05, explode: 1.32, face: "enamel", side: "gold" },
];

const { minX, minY, width, height } = data.meta;

const uvGenerator = {
  generateTopUV(_geometry: THREE.ExtrudeGeometry, vertices: number[], a: number, b: number, c: number) {
    const uv = (i: number) => new THREE.Vector2((vertices[i * 3] - minX) / width, (vertices[i * 3 + 1] - minY) / height);
    return [uv(a), uv(b), uv(c)];
  },
  // Os biséis também levam a posição no logótipo: a parte virada para a frente mostra a cor do próprio logótipo.
  generateSideWallUV(_geometry: THREE.ExtrudeGeometry, vertices: number[], a: number, b: number, c: number, d: number) {
    const uv = (i: number) => new THREE.Vector2((vertices[i * 3] - minX) / width, (vertices[i * 3 + 1] - minY) / height);
    return [uv(a), uv(b), uv(c), uv(d)];
  },
};

function toPoints(flat: number[]) {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i < flat.length; i += 2) points.push(new THREE.Vector2(flat[i], flat[i + 1]));
  return points;
}

function buildGeometry(spec: LayerSpec, light: boolean) {
  const shapes = data.layers[spec.id].map((raw) => {
    const shape = new THREE.Shape(toPoints(raw.o));
    for (const hole of raw.h) shape.holes.push(new THREE.Path(toPoints(hole)));
    return shape;
  });
  const [thickness, size, segments] = spec.bevel;
  return new THREE.ExtrudeGeometry(shapes, {
    depth: spec.depth,
    bevelEnabled: true,
    bevelThickness: thickness,
    bevelSize: size,
    // O bisel fica por dentro do contorno do vetor: de frente, a silhueta de cada peça é a do logótipo, sem filetes.
    bevelOffset: -size,
    bevelSegments: light ? Math.min(2, segments) : segments,
    curveSegments: 1,
    UVGenerator: uvGenerator,
  });
}

/** O estúdio: caixas de luz brancas e um recorte verde, numa cena minúscula, passada uma vez pelo PMREM. */
function buildEnvironment(gl: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#0b2416");
  const box = (color: string, intensity: number, w: number, h: number, position: [number, number, number]) => {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  };
  box("#ffffff", 3, 10, 3, [0, 4, 3]);
  box("#ffffff", 2.2, 2.2, 9, [-5, 0.5, 2]);
  box("#ffffff", 1.5, 1.4, 9, [5, -0.5, 2]);
  box("#64ba4c", 1.8, 5, 2, [0, -3.5, -3]);
  box("#0b6b33", 0.7, 12, 12, [0, 0, -6]);
  const pmrem = new THREE.PMREMGenerator(gl);
  const target = pmrem.fromScene(studio, 0.035);
  pmrem.dispose();
  studio.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    }
  });
  return target;
}

/** Cor: o logótipo inteiro; o anel sem o interior; o campo branco só com os caules dos ramos (o resto está nas camadas). */
const colorUrls = emblemColorUrls;
/** Relevo cozido do modelo de IA: só as normais (dados, não cor), para um sombreado subtil que não muda as cores. */
const normalUrl = emblemNormalUrl;
const reliefUrl = emblemReliefUrl;

interface EmblemAssets {
  full: THREE.Texture;
  base: THREE.Texture;
  field: THREE.Texture;
  normal: THREE.Texture;
  relief: THREE.BufferGeometry;
}

/** O laço esculpido: posições quantizadas (uint16) no quadro do logótipo e índices uint16. Ver relief.py no playbook. */
function parseRelief(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const vertexCount = view.getUint32(4, true);
  const triangleCount = view.getUint32(8, true);
  const zMax = view.getFloat32(12, true);
  const q = new Uint16Array(buffer, 16, vertexCount * 3);
  const index = new Uint16Array(buffer.slice(16 + vertexCount * 6, 16 + vertexCount * 6 + triangleCount * 6));
  const position = new Float32Array(vertexCount * 3);
  const uv = new Float32Array(vertexCount * 2);
  for (let i = 0; i < vertexCount; i++) {
    const u = q[i * 3] / 65535;
    const v = q[i * 3 + 1] / 65535;
    position[i * 3] = minX + u * width;
    position[i * 3 + 1] = minY + v * height;
    position[i * 3 + 2] = (q[i * 3 + 2] / 65535) * zMax;
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  geometry.computeVertexNormals();
  return geometry;
}

function useAssets(gl: THREE.WebGLRenderer) {
  const [assets, setAssets] = useState<EmblemAssets | null>(null);
  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    void Promise.all([
      Promise.all(colorUrls.map((url) => loader.loadAsync(url))),
      loader.loadAsync(normalUrl),
      fetch(reliefUrl).then((response) => response.arrayBuffer()),
    ]).then(([[full, base, field], normal, reliefBuffer]) => {
      for (const texture of [full, base, field]) texture.colorSpace = THREE.SRGBColorSpace;
      for (const texture of [full, base, field, normal]) texture.anisotropy = anisotropy;
      const loaded: EmblemAssets = { full, base, field, normal, relief: parseRelief(reliefBuffer) };
      if (alive) setAssets(loaded);
      else {
        for (const texture of [full, base, field, normal]) texture.dispose();
        loaded.relief.dispose();
      }
    });
    return () => {
      alive = false;
    };
  }, [gl]);
  return assets;
}

// Fidelidade à marca (pedido do dono, 2026-11-02): de frente, o emblema tem de ler-se exatamente como o logótipo.
// As faces são a imagem do logótipo sem luz nem reflexos (sem tone mapping): o branco é branco, o verde é verde. O
// relevo esculpido só entra como um sombreado de ±6% que é zero em superfície plana (não muda a cor das zonas lisas),
// com a luz presa ao emblema (não varre as cores quando ele roda). O brilho metálico fica nos biséis e na placa.
const RELIEF_LIGHT = new THREE.Vector3(-0.42, 0.62, 0.66).normalize();
const RELIEF_STRENGTH = 0.06;

function logoFace(map: THREE.Texture, normalMap: THREE.Texture | null) {
  const material = new THREE.MeshBasicMaterial({ map, toneMapped: false });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.reliefLight = { value: RELIEF_LIGHT };
    shader.uniforms.reliefStrength = { value: RELIEF_STRENGTH };
    shader.uniforms.reliefMap = { value: normalMap };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjectNormal;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjectNormal = normal;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vObjectNormal;\nuniform vec3 reliefLight;\nuniform float reliefStrength;\n${normalMap ? "uniform sampler2D reliefMap;" : ""}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec3 reliefN = normalize(vObjectNormal);
        if (reliefN.z > 0.2) {
          ${normalMap ? "reliefN = normalize(texture2D(reliefMap, vMapUv).xyz * 2.0 - 1.0);" : ""}
          diffuseColor.rgb *= 1.0 + reliefStrength * (dot(reliefN, reliefLight) - reliefLight.z);
        }`,
      );
  };
  material.customProgramCacheKey = () => (normalMap ? "grob-logo-relief" : "grob-logo");
  return material;
}

/** Bisel de metal; a parte virada para a frente mostra a cor do logótipo, sem luz (a silhueta não ganha filetes). */
function metalEdge(params: THREE.MeshStandardMaterialParameters, logo: THREE.Texture | null) {
  const material = new THREE.MeshStandardMaterial(params);
  if (!logo) return material;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.logoMap = { value: logo };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vLogoUv;\nvarying float vFacing;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLogoUv = uv;\nvFacing = normal.z;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vLogoUv;\nvarying float vFacing;\nuniform sampler2D logoMap;")
      .replace(
        "#include <tonemapping_fragment>",
        "#include <tonemapping_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, texture2D(logoMap, vLogoUv).rgb, smoothstep(0.3, 0.62, vFacing));",
      );
  };
  material.customProgramCacheKey = () => "grob-metal-edge";
  return material;
}

const damp = THREE.MathUtils.damp;
const EPS = 0.0005;

function Emblem({
  stateRef,
  light,
  assets,
  onReady,
}: {
  stateRef: RefObject<EmblemState>;
  light: boolean;
  assets: EmblemAssets;
  onReady: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const viewport = useThree((s) => s.viewport);
  const setDpr = useThree((s) => s.setDpr);

  const environment = useMemo(() => buildEnvironment(gl), [gl]);
  const materials = useMemo(() => {
    const { full, base, field, normal } = assets;
    const env = environment.texture;
    const logo: Record<Exclude<FaceKind, "plateBack">, THREE.Texture> = { enamel: full, enamelBase: base, porcelainBase: field, black: full };
    const faces: Record<FaceKind, THREE.Material> = {
      enamel: logoFace(full, normal),
      enamelBase: logoFace(base, normal),
      porcelainBase: logoFace(field, null),
      // O escudo do V é o preto do logótipo (#231F20) e nada mais: o V verde e a banda amarela são camadas por cima,
      // e não ficam desenhados duas vezes quando o emblema se desmonta.
      black: new THREE.MeshBasicMaterial({ color: "#231f20", toneMapped: false }),
      plateBack: new THREE.MeshStandardMaterial({ color: "#c9cfcc", metalness: 1, roughness: 0.36, envMap: env }),
    };
    const metal: Record<SideKind, THREE.MeshStandardMaterialParameters> = {
      silver: { color: "#e3e8e6", metalness: 1, roughness: 0.2, envMap: env },
      gold: { color: "#e6bf55", metalness: 1, roughness: 0.24, envMap: env },
    };
    const sides = new Map<string, THREE.Material>();
    for (const spec of LAYERS) {
      const key = `${spec.side}:${spec.face}`;
      if (!sides.has(key)) sides.set(key, metalEdge(metal[spec.side], spec.face === "plateBack" ? null : logo[spec.face]));
    }
    // O laço esculpido: a mesma imagem, com o sombreado suave da própria forma (sem mapa de normais).
    const relief = logoFace(full, null);
    return { faces, sides, relief };
  }, [assets, environment]);
  const geometries = useMemo(() => LAYERS.map((spec) => buildGeometry(spec, light)), [light]);

  // Libertar a memória da GPU só quando estes objetos deixam mesmo de ser usados. O React (modo estrito, em dev)
  // desmonta e volta a montar logo a seguir com os mesmos objetos: libertá-los aí apagava o estúdio do PMREM (metal
  // negro) e os programas que o compileAsync ainda estava a consultar.
  const live = useRef<{ geometries?: unknown; materials?: unknown }>({});
  useEffect(() => {
    const slot = live.current;
    slot.geometries = geometries;
    return () => {
      slot.geometries = undefined;
      window.setTimeout(() => {
        if (slot.geometries !== geometries) geometries.forEach((g) => g.dispose());
      }, 0);
    };
  }, [geometries]);
  useEffect(() => {
    const slot = live.current;
    slot.materials = materials;
    return () => {
      slot.materials = undefined;
      window.setTimeout(() => {
        if (slot.materials === materials) return;
        Object.values(materials.faces).forEach((m) => m.dispose());
        materials.sides.forEach((m) => m.dispose());
        materials.relief.dispose();
        environment.dispose();
      }, 0);
    };
  }, [materials, environment]);

  const root = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const frames = useRef({ sum: 0, n: 0, dpr: startDpr(light) });
  // O primeiro fotograma visível já está na pose final (a mesma da imagem parada): sem entrada própria do 3D, que
  // aparecia a seguir à imagem e parecia entrar duas vezes (dono, 2026-11-02).
  const placed = useRef(false);

  // Os shaders compilam-se em paralelo antes do primeiro fotograma; só depois o emblema aparece e acorda.
  useEffect(() => {
    const group = root.current;
    if (!group) return;
    let alive = true;
    group.visible = true;
    const compiling = gl.compileAsync(group, camera, scene);
    group.visible = false;
    void compiling.then(() => {
      if (!alive) return;
      group.visible = true;
      invalidate();
      requestAnimationFrame(() => onReady());
    });
    return () => {
      alive = false;
    };
  }, [gl, camera, scene, invalidate, onReady]);

  // A cena dorme até alguém a acordar: a timeline GSAP, o rato, ou o próprio amortecimento ainda a correr.
  useEffect(() => {
    const state = stateRef.current;
    state.wake = invalidate;
    // Para gravar vídeos e conferir a fidelidade ao logótipo por guião (window.__grobEmblem: o estado da cena).
    const handle = window as Window & { __grobEmblem?: EmblemState };
    handle.__grobEmblem = state;
    return () => {
      state.wake = undefined;
      if (handle.__grobEmblem === state) delete handle.__grobEmblem;
    };
  }, [stateRef, invalidate]);

  useFrame((_, delta) => {
    const g = root.current;
    const s = spinner.current;
    if (!g || !s || !g.visible) return;
    const state = stateRef.current;
    const dt = Math.min(delta, 1 / 20);
    let moving = false;
    const snap = !placed.current;
    placed.current = true;
    const step = (current: number, target: number, lambda: number) => {
      if (snap) return target;
      const next = damp(current, target, lambda, dt);
      if (Math.abs(next - target) > EPS) {
        moving = true;
        return next;
      }
      return target;
    };
    g.position.x = step(g.position.x, (state.x * viewport.width) / 2, 7);
    g.position.y = step(g.position.y, (state.y * viewport.height) / 2, 7);
    g.rotation.x = step(g.rotation.x, state.rotX - state.pointerY * 0.12, 6);
    g.rotation.y = step(g.rotation.y, state.rotY + state.pointerX * 0.2, 6);
    s.rotation.y = step(s.rotation.y, state.spin, 6);
    g.scale.setScalar(step(g.scale.x, (viewport.height * state.fit) / height, 7));
    LAYERS.forEach((spec, i) => {
      const mesh = layerRefs.current[i];
      if (mesh) mesh.position.z = step(mesh.position.z, spec.z + spec.explode * state.explode, 8);
    });
    // Resolução adaptativa: desce se os fotogramas ficarem lentos, sobe devagar se houver folga.
    const f = frames.current;
    if (delta < 0.25) {
      f.sum += delta;
      f.n += 1;
    }
    if (f.n >= 24) {
      const avg = f.sum / f.n;
      // No toque, nunca acima de 1,5 (o telemóvel médio não aguenta mais a fazer scroll).
      const max = Math.min(window.devicePixelRatio, window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2);
      const next = avg > 0.024 ? Math.max(0.85, f.dpr - 0.25) : avg < 0.0145 ? Math.min(max, f.dpr + 0.125) : f.dpr;
      if (next !== f.dpr) {
        f.dpr = next;
        setDpr(next);
      }
      f.sum = 0;
      f.n = 0;
    }
    if (moving) invalidate();
  });

  return (
    <group
      ref={(group) => {
        root.current = group;
        if (group && !group.userData.ready) {
          group.userData.ready = true;
          group.visible = false;
        }
      }}
    >
      <group ref={spinner}>
        {LAYERS.map((spec, i) => (
          <mesh
            key={spec.id}
            ref={(mesh) => {
              layerRefs.current[i] = mesh;
            }}
            geometry={geometries[i]}
            material={[materials.faces[spec.face], materials.sides.get(`${spec.side}:${spec.face}`)!]}
            position={[0, 0, spec.z]}
          >
            {spec.id === "bows" ? (
              <mesh geometry={assets.relief} material={materials.relief} position={[0, 0, spec.depth + spec.bevel[0]]} />
            ) : null}
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Scene({ stateRef, light, onReady }: { stateRef: RefObject<EmblemState>; light: boolean; onReady: () => void }) {
  const gl = useThree((s) => s.gl);
  const assets = useAssets(gl);
  return assets ? <Emblem stateRef={stateRef} light={light} assets={assets} onReady={onReady} /> : null;
}

export interface EmblemCanvasProps {
  stateRef: RefObject<EmblemState>;
  onReady: () => void;
  /** Fora do ecrã a cena para por completo (frameloop «never»); no ecrã só desenha quando há movimento. */
  active?: boolean;
}

/** Resolução inicial: nítida também no telemóvel (a marca não pode sair esborratada); a resolução adaptativa desce
 *  sozinha se os fotogramas ficarem lentos. */
function startDpr(light: boolean) {
  return Math.min(window.devicePixelRatio, light ? 1.5 : 1.75);
}

/** Telemóvel ou máquina modesta: biséis mais simples. */
function isLight() {
  const cores = navigator.hardwareConcurrency ?? 8;
  return window.matchMedia("(max-width: 767px)").matches || cores <= 4;
}

// Só existe no browser (carregado com next/dynamic, ssr: false, e só depois da primeira pintura).
export default function EmblemCanvas({ stateRef, onReady, active = true }: EmblemCanvasProps) {
  const [light] = useState(isLight);
  const [dpr] = useState(() => startDpr(light));
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "demand" : "never"}
      camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 50 }}
      // Antialiasing sempre ligado: os contornos da marca não podem sair serrilhados no telemóvel. O MSAA é quase
      // grátis nas GPUs dos telemóveis (resolve dentro do chip); um FXAA seria mais uma passagem e esborratava o texto.
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 6]} intensity={1.3} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#c7f0d2" />
      <Scene stateRef={stateRef} light={light} onReady={onReady} />
    </Canvas>
  );
}
