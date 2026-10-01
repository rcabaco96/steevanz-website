"use client";

import { Environment, Lightformer, SoftShadows } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { WALL, createWallTextures } from "./wallAssets";
import {
  PETAL_COUNT,
  createFilaments,
  createPetalGeometry,
  createPetalTextures,
  seeded,
  smoothstep,
} from "./flowerAssets";

export interface ExperienceState {
  /** Smoothed scroll progress, 0 (intro) to CHAPTER_SPAN (finale). */
  progress: number;
  /** Raw scroll progress from Lenis. */
  target: number;
  /** Pointer in normalised device coordinates (-1..1). */
  pointer: { x: number; y: number };
}

interface SceneProps {
  stateRef: RefObject<ExperienceState>;
  onAdvance: () => void;
  wordmark: string;
  fontFamily: string;
  sansFamily: string;
}

const PETAL_ANGLE = (Math.PI * 2) / PETAL_COUNT;
const TRAIL_PER_PETAL = 90;

// Scratch objects reused every frame.
const trailPivot = new THREE.Object3D();
const trailProbe = new THREE.Object3D();
const trailPoint = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const camLook = new THREE.Vector3();

/** How far petal `i` has fallen (0 attached, 1 gone) at scroll progress p. Unclamped. */
const petalTime = (i: number, p: number) => (p - i - 0.05) / 0.85;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const nfcWeight = (p: number) => smoothstep(0.3, 0.85, p) * (1 - smoothstep(1.25, 1.7, p));
const finaleWeight = (p: number) => smoothstep(5.35, 5.95, p);

/**
 * Camera keyframes, one per chapter (intro, five petals, finale).
 * `look` is where the camera aims; offsetting it pushes the flower to one side
 * of the frame so the chapter text has room on the other.
 */
const SHOTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 0.35, 6.4], look: [0, 0.55, 0] },
  { pos: [-1.3, -0.9, 4.3], look: [-0.95, 0.05, 0] },
  { pos: [1.5, 0.9, 4.5], look: [0.95, 0, 0] },
  { pos: [-1.1, 1.2, 3.9], look: [-0.85, -0.05, 0] },
  { pos: [1.3, -1.0, 4.2], look: [0.85, 0.05, 0] },
  { pos: [-0.8, 0.4, 4.6], look: [-0.95, 0, 0] },
  { pos: [0, -0.25, 5.6], look: [0, -0.95, 0] },
];

/** Places a petal mesh (inside its rotated pivot) at fall time t. */
function posePetal(mesh: THREE.Object3D, angle: number, i: number, t: number, hover: number, bud: number) {
  const e = easeInOut(t);
  const lift = smoothstep(0, 0.3, t);
  const fall = e * e * 2.2;
  const gx = -Math.sin(angle);
  const gy = -Math.cos(angle);
  mesh.position.set(
    Math.sin(t * Math.PI * 2) * 0.35 * t + gx * fall,
    0.12 * lift + e * 1.3 + gy * fall + hover * 0.07,
    0.005 * i + lift * 0.3 + e * e * 2.6,
  );
  mesh.rotation.set(
    0.9 * lift + bud - hover * 0.05,
    0.12 + t * Math.PI * 1.3 + Math.sin(t * 11) * 0.25 * t,
    t * 0.9,
  );
}

/**
 * Petal material: physical velvet (sheen) plus a fresnel rim that reads as light
 * passing through thin tissue, and a faint gold pulse travelling up the veins.
 */
function createPetalMaterial(textures: ReturnType<typeof createPetalTextures>, tint: string) {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(tint),
    map: textures.map,
    bumpMap: textures.bumpMap,
    bumpScale: 1.8,
    roughness: 0.64,
    sheen: 0.85,
    sheenColor: new THREE.Color("#f3e6d2"),
    sheenRoughness: 0.45,
    envMapIntensity: 0.4,
    side: THREE.DoubleSide,
    transparent: true,
  });
  material.userData.uniforms = {
    uVein: { value: textures.veinMap },
    uPulse: { value: 0 },
    uTime: { value: 0 },
    uRim: { value: 0.32 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, material.userData.uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform sampler2D uVein; uniform float uPulse; uniform float uTime; uniform float uRim;`,
      )
      .replace(
        "#include <aomap_fragment>",
        `#include <aomap_fragment>
        {
          float vein = texture2D(uVein, vMapUv).r;
          float head = fract(uTime * 0.3) * 1.3 - 0.15;
          float wave = smoothstep(0.22, 0.0, abs(vMapUv.y - head)) * smoothstep(1.15, 0.7, head);
          totalEmissiveRadiance += vec3(1.0, 0.66, 0.28) * vein * wave * uPulse * 1.6;
          float facing = abs(dot(normal, normalize(vViewPosition)));
          totalEmissiveRadiance += vec3(1.0, 0.85, 0.7) * pow(1.0 - facing, 3.0) * uRim * diffuseColor.rgb;
        }`,
      );
  };
  material.customProgramCacheKey = () => "steevanz-petal-v2";
  return material;
}

/** Drives the camera between chapter shots, with a touch of pointer parallax. */
function CameraRig({ stateRef }: { stateRef: RefObject<ExperienceState> }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.55, 0));
  useFrame((_, delta) => {
    const state = stateRef.current;
    const p = Math.min(SHOTS.length - 1, Math.max(0, state.progress));
    const i = Math.min(SHOTS.length - 2, Math.floor(p));
    const f = smoothstep(0, 1, p - i);
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    const portrait = size.width < size.height;
    camTarget.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], f) * (portrait ? 0.4 : 1) + state.pointer.x * 0.18,
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], f) + state.pointer.y * 0.12,
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], f) * (portrait ? 1.55 : 1),
    );
    camLook.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], f) * (portrait ? 0 : 1),
      THREE.MathUtils.lerp(a.look[1], b.look[1], f) - (portrait && p > 0.4 && p < 5.4 ? 0.75 : 0),
      0,
    );
    const k = Math.min(1, delta * 3.2);
    camera.position.lerp(camTarget, k);
    look.current.lerp(camLook, k);
    camera.lookAt(look.current);
  });
  return null;
}

/** The lime-washed lilac wall behind the flower; it receives the flower's shadow. */
function Wall() {
  const textures = useMemo(() => createWallTextures(), []);
  return (
    <mesh position={[0, WALL.centerY, WALL.z]} receiveShadow>
      <planeGeometry args={[WALL.width, WALL.height]} />
      <meshStandardMaterial map={textures.map} bumpMap={textures.bumpMap} bumpScale={1.6} roughness={0.96} envMapIntensity={0.3} />
    </mesh>
  );
}

const WORD_W = 4096;
const WORD_H = 1100;

/** The STEEVANZ title: crisp brand-plum Bebas lettering floating in front of the flower. */
function Wordmark({ stateRef, text, fontFamily }: { stateRef: RefObject<ExperienceState>; text: string; fontFamily: string }) {
  const { camera, viewport } = useThree();
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = WORD_W;
    canvas.height = WORD_H;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, WORD_W, WORD_H);
      let size = 1000;
      ctx.font = `400 ${size}px ${fontFamily}`;
      size *= (WORD_W * 0.98) / ctx.measureText(text).width;
      ctx.font = `400 ${size}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const baseline = WORD_H * 0.5 + size * 0.36;
      const fill = ctx.createLinearGradient(0, baseline - size * 0.72, 0, baseline);
      fill.addColorStop(0, "#64305e");
      fill.addColorStop(1, "#4a1d45");
      ctx.fillStyle = fill;
      ctx.fillText(text, WORD_W / 2, baseline);
      texture.needsUpdate = true;
    };
    document.fonts.load(`400 200px ${fontFamily}`).then(draw, draw);
    return () => {
      cancelled = true;
    };
  }, [fontFamily, text, texture]);

  const z = 1.1;
  const vp = viewport.getCurrentViewport(camera, [0, 0, z]);
  const width = Math.min(vp.width * 0.86, 6.6);

  useFrame(() => {
    const out = smoothstep(0.02, 0.42, stateRef.current.progress);
    if (material.current) material.current.opacity = 1 - out;
    if (group.current) {
      group.current.position.y = 1.05 + out * 0.9;
      group.current.visible = out < 0.999;
    }
  });

  return (
    <group ref={group} position={[0, 1.05, z]}>
      <mesh scale={[width, width * (WORD_H / WORD_W), 1]} renderOrder={5}>
        <planeGeometry />
        <meshBasicMaterial ref={material} map={texture} transparent depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Low, raking Alentejo sun; it drops and warms towards golden hour in the finale. */
function Sun({ stateRef }: { stateRef: RefObject<ExperienceState> }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const day = useMemo(() => new THREE.Color("#ffe8c8"), []);
  const dusk = useMemo(() => new THREE.Color("#ffb766"), []);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    const f = finaleWeight(stateRef.current.progress);
    l.position.set(-4.6 - f * 0.8, 2.7 - f * 1.3, 3.4);
    l.color.copy(day).lerp(dusk, f);
    l.intensity = 3.1 + f * 0.4;
  });
  return (
    <directionalLight
      ref={light}
      position={[-4.6, 2.7, 3.4]}
      intensity={3.1}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0003}
      shadow-normalBias={0.02}
      shadow-camera-left={-3.4}
      shadow-camera-right={3.4}
      shadow-camera-top={3.4}
      shadow-camera-bottom={-3.4}
      shadow-camera-near={0.5}
      shadow-camera-far={16}
    />
  );
}

function Flower({ stateRef, onAdvance }: { stateRef: RefObject<ExperienceState>; onAdvance: () => void }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const petals = useRef<(THREE.Mesh | null)[]>([]);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const trail = useRef<THREE.Points>(null);
  const trailMaterial = useRef<THREE.ShaderMaterial>(null);
  const anthers = useRef<THREE.InstancedMesh>(null);
  const hovered = useRef(-1);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverAmount = useRef(new Array(PETAL_COUNT).fill(0));

  const geometries = useMemo(() => Array.from({ length: PETAL_COUNT }, (_, i) => createPetalGeometry(11 + i * 7)), []);
  const textures = useMemo(() => createPetalTextures(), []);
  const materials = useMemo(() => {
    const tints = ["#fffaf2", "#fdf4ea", "#fff8f0", "#fbf2e8", "#fffbf5"];
    return geometries.map((_, i) => createPetalMaterial(textures, tints[i]));
  }, [geometries, textures]);
  const filaments = useMemo(() => createFilaments(), []);
  const trailUniforms = useMemo(() => ({ uPixelRatio: { value: 1 } }), []);

  const trailData = useMemo(() => {
    const rand = seeded(99);
    const n = PETAL_COUNT * TRAIL_PER_PETAL;
    const local = new Float32Array(n * 3);
    const drift = new Float32Array(n * 3);
    const spawn = new Float32Array(n);
    const size = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      local[k * 3] = (rand() - 0.5) * 0.6;
      local[k * 3 + 1] = 0.1 + rand() * 0.8;
      local[k * 3 + 2] = 0.05;
      drift[k * 3] = (rand() - 0.5) * 0.5;
      drift[k * 3 + 1] = (rand() - 0.5) * 0.5 - 0.15;
      drift[k * 3 + 2] = (rand() - 0.5) * 0.4;
      spawn[k] = ((k % TRAIL_PER_PETAL) / TRAIL_PER_PETAL) * 0.75;
      size[k] = 0.5 + Math.pow(rand(), 4) * 2.2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return { local, drift, spawn, geometry };
  }, []);

  useEffect(() => {
    const mesh = anthers.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    filaments.tips.forEach((tip, k) => {
      m.makeTranslation(tip.x, tip.y, tip.z);
      mesh.setMatrixAt(k, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [filaments]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame(({ clock, gl }, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = clock.elapsedTime;
    stateRef.current.progress += (stateRef.current.target - stateRef.current.progress) * Math.min(1, dt * 4.5);
    const p = stateRef.current.progress;
    const open = smoothstep(0.2, 3.4, time);
    const finale = finaleWeight(p);
    const nfc = nfcWeight(p);

    if (root.current) {
      root.current.rotation.x = -0.16;
      root.current.scale.setScalar(0.95 - finale * 0.12);
    }
    if (spin.current) spin.current.rotation.z = -time * 0.025 - Math.pow(1 - open, 2) * 0.8;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const mesh = petals.current[i];
      if (!mesh) continue;
      const regrow = smoothstep(5.3 + i * 0.05, 5.85 + i * 0.03, p);
      const fallen = Math.min(1, Math.max(0, petalTime(i, p)));
      const t = regrow > 0 ? 0 : fallen;
      const target = hovered.current === i && t < 0.02 && regrow === 0 ? 1 : 0;
      hoverAmount.current[i] += (target - hoverAmount.current[i]) * Math.min(1, dt * 6);
      const reopen = regrow > 0 ? Math.pow(1 - regrow, 2) * 1.5 : 0;
      const bud = Math.pow(1 - open, 2) * 1.4 + reopen + Math.sin(time * 0.7 + i * 1.3) * 0.018;
      posePetal(mesh, i * PETAL_ANGLE, i, t, hoverAmount.current[i], bud);
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.opacity = regrow > 0 ? regrow : 1 - smoothstep(0.72, 1, t);
      const u = material.userData.uniforms;
      u.uTime.value = time + i * 0.17;
      u.uPulse.value = Math.max(nfc, hoverAmount.current[i] * 0.6) * (1 - t);
      mesh.visible = regrow > 0.001 || t < 0.999;
    }

    // Pollen glints shed by each falling petal.
    if (trailMaterial.current) trailMaterial.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    const trailGeometry = trail.current?.geometry;
    if (trailGeometry) {
      const { local, drift, spawn } = trailData;
      const pos = trailGeometry.getAttribute("position") as THREE.BufferAttribute;
      const alpha = trailGeometry.getAttribute("aAlpha") as THREE.BufferAttribute;
      for (let i = 0; i < PETAL_COUNT; i++) {
        const raw = petalTime(i, p);
        const active = raw > 0 && raw < 1.6;
        trailPivot.rotation.set(0, 0, i * PETAL_ANGLE);
        trailPivot.updateMatrix();
        for (let k = 0; k < TRAIL_PER_PETAL; k++) {
          const idx = i * TRAIL_PER_PETAL + k;
          const age = raw - spawn[idx];
          if (!active || age <= 0) {
            alpha.setX(idx, 0);
            continue;
          }
          posePetal(trailProbe, i * PETAL_ANGLE, i, spawn[idx], 0, 0);
          trailProbe.updateMatrix();
          trailPoint
            .set(local[idx * 3], local[idx * 3 + 1], local[idx * 3 + 2])
            .applyMatrix4(trailProbe.matrix)
            .applyMatrix4(trailPivot.matrix);
          const sway = Math.sin(time * 1.3 + idx * 1.7) * 0.012;
          pos.setXYZ(
            idx,
            trailPoint.x + drift[idx * 3] * age + sway,
            trailPoint.y + drift[idx * 3 + 1] * age - age * age * 0.3,
            trailPoint.z + drift[idx * 3 + 2] * age,
          );
          const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * 4 + idx * 7.3));
          alpha.setX(idx, Math.max(0, 1 - age / 0.7) * twinkle);
        }
      }
      pos.needsUpdate = true;
      alpha.needsUpdate = true;
    }

    const glow = 1 + nfc * 0.5 + finale * 1.2 + Math.sin(time * 1.6) * 0.05;
    if (core.current) core.current.color.setRGB(1.1 * glow, 0.85 * glow, 0.4 * glow);
  });

  const onOver = (i: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    window.clearTimeout(hoverTimer.current);
    if (petalTime(i, stateRef.current.progress) > 0.02) return;
    hovered.current = i;
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hovered.current = -1;
      document.body.style.cursor = "";
    }, 160);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onAdvance();
  };

  return (
    <group ref={root}>
      <group ref={spin}>
        {geometries.map((geometry, i) => (
          <group key={i} rotation={[0, 0, i * PETAL_ANGLE]}>
            <mesh
              ref={(m) => {
                petals.current[i] = m;
              }}
              geometry={geometry}
              material={materials[i]}
              castShadow
              receiveShadow
              onPointerOver={onOver(i)}
              onPointerOut={onOut}
              onClick={onClick}
            />
          </group>
        ))}


        <mesh geometry={filaments.geometry} castShadow receiveShadow>
          <meshStandardMaterial color="#e3b23c" emissive="#6b3d08" emissiveIntensity={0.35} metalness={0.25} roughness={0.42} />
        </mesh>
        <instancedMesh ref={anthers} args={[undefined, undefined, filaments.tips.length]} castShadow>
          <icosahedronGeometry args={[0.0062, 2]} />
          <meshStandardMaterial color="#f3be2e" emissive="#a8650c" emissiveIntensity={0.55} roughness={0.55} />
        </instancedMesh>
        <mesh position={[0, 0, 0.05]} scale={[1, 1, 0.75]} castShadow>
          <sphereGeometry args={[0.034, 48, 48]} />
          <meshStandardMaterial color="#b9a24a" roughness={0.5} envMapIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.078]}>
          <sphereGeometry args={[0.012, 24, 24]} />
          <meshBasicMaterial ref={core} toneMapped={false} />
        </mesh>

        <points ref={trail} geometry={trailData.geometry} frustumCulled={false}>
          <shaderMaterial
            ref={trailMaterial}
            transparent
            depthWrite={false}
            uniforms={trailUniforms}
            vertexShader={/* glsl */ `
              attribute float aAlpha; attribute float aSize; uniform float uPixelRatio; varying float vAlpha;
              void main() {
                vAlpha = aAlpha;
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 3.0 * aSize * (5.0 / -mv.z) * uPixelRatio;
                gl_Position = projectionMatrix * mv;
              }
            `}
            fragmentShader={/* glsl */ `
              varying float vAlpha;
              void main() {
                vec2 c = gl_PointCoord - 0.5;
                float d = length(c) * 2.0;
                float core = exp(-d * d * 18.0);
                float halo = exp(-d * d * 3.5) * 0.25;
                float star = max(exp(-abs(c.x) * 40.0) * exp(-abs(c.y) * 7.0), exp(-abs(c.y) * 40.0) * exp(-abs(c.x) * 7.0)) * 0.35;
                gl_FragColor = vec4(0.86, 0.6, 0.2, min(1.0, core + halo + star) * vAlpha);
              }
            `}
          />
        </points>
      </group>
    </group>
  );
}

export function FlowerScene({ stateRef, onAdvance, wordmark, fontFamily }: SceneProps) {
  return (
    <>
      <CameraRig stateRef={stateRef} />
      <color attach="background" args={["#cdb7cb"]} />
      <SoftShadows size={22} samples={12} focus={0.55} />
      <Wall />
      <Wordmark stateRef={stateRef} text={wordmark} fontFamily={fontFamily} />

      <hemisphereLight args={["#fff8f2", "#b48fb0", 0.85]} />
      <ambientLight intensity={0.2} />
      <Sun stateRef={stateRef} />
      <directionalLight position={[3.5, 1, 3]} intensity={0.35} color="#e9eefc" />
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={2} color="#fff3e2" position={[-4, 3, 4]} scale={[5, 2.5, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#f4e4cc" position={[4, 1, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#e7c98f" position={[0, -4, 2]} scale={[8, 1, 1]} />
      </Environment>

      <Flower stateRef={stateRef} onAdvance={onAdvance} />

      <EffectComposer multisampling={0}>
        <N8AO halfRes aoRadius={0.22} intensity={1.6} distanceFalloff={0.5} quality="medium" />
        <Bloom mipmapBlur luminanceThreshold={1.25} luminanceSmoothing={0.1} intensity={0.25} radius={0.45} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.06} />
        <Vignette offset={0.38} darkness={0.32} />
      </EffectComposer>
    </>
  );
}
