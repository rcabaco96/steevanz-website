"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useTheme } from "./theme";
import { WALL, bakeWall, createOliveGobo } from "./wallAssets";
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
  /** Set by the page when the loader opens; the bud only blooms after this. */
  revealed: boolean;
  /** Clock time (s) at which the reveal happened, -1 until then. */
  revealAt: number;
  /** Touch device: follow the finger exactly, no speed-driven sway. */
  touch: boolean;
  /** Flower position in world space (x, y), for the sun to follow. */
  flowerPos: { x: number; y: number };
  /** Flower top edge on screen in pixels (for the drag hint), and whether it was dragged yet. */
  flowerTop: { x: number; y: number };
  dragged: boolean;
}

interface SceneProps {
  stateRef: RefObject<ExperienceState>;
  /** Phones and weak devices: smaller shadow map, no pointer parallax. */
  lite?: boolean;
  /** Called once the scene has compiled and drawn its first frames. */
  onReady: () => void;
  onAdvance: () => void;
}

const PETAL_ANGLE = (Math.PI * 2) / PETAL_COUNT;
const TRAIL_PER_PETAL = 90;

// Scratch objects reused every frame.
const trailPivot = new THREE.Object3D();
const trailProbe = new THREE.Object3D();
const trailPoint = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const camLook = new THREE.Vector3();
const hintPoint = new THREE.Vector3();

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const nfcWeight = (p: number) => smoothstep(1.3, 1.85, p) * (1 - smoothstep(2.25, 2.7, p));
const finaleWeight = (p: number) => smoothstep(7.35, 7.95, p);

/** Camera keyframes per step: the hero shot, then one calm framing; the flower moves instead. */
const SHOTS: { pos: [number, number, number]; look: [number, number, number]; frame?: number }[] = [
  { pos: [0, 0.35, 6.4], look: [0, 0.55, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
  { pos: [0, 0.2, 7.6], look: [0, 0.2, 0] },
];

/**
 * Where the wind carries the flower at each step, as screen fractions (x from the
 * left, y from the top) and a scale. Step 0 is the hero (flower at the world origin).
 * The stops alternate sides so the flower always sits beside the centred text.
 */
const WIND_STOPS: { x: number; y: number; s: number }[] = [
  { x: 0.5, y: 0.6, s: 0.95 },
  { x: 0.85, y: 0.52, s: 0.78 },
  { x: 0.85, y: 0.52, s: 0.78 },
  { x: 0.86, y: 0.6, s: 0.74 },
  { x: 0.84, y: 0.46, s: 0.74 },
  { x: 0.86, y: 0.58, s: 0.74 },
  { x: 0.85, y: 0.48, s: 0.74 },
  { x: 0.86, y: 0.6, s: 0.74 },
  { x: 0.91, y: 0.5, s: 0.62 },
];

// Scratch objects for screen -> wall-plane projection and dragging.
const ndcPoint = new THREE.Vector3();
const rayDir = new THREE.Vector3();
const stopA = new THREE.Vector3();
const stopB = new THREE.Vector3();

/** Projects a screen point (fractions) onto the flower's plane (z = 0). */
function screenToPlane(fx: number, fy: number, camera: THREE.Camera, out: THREE.Vector3) {
  ndcPoint.set(fx * 2 - 1, -(fy * 2 - 1), 0.5).unproject(camera);
  rayDir.copy(ndcPoint).sub(camera.position).normalize();
  const t = -camera.position.z / rayDir.z;
  return out.copy(camera.position).addScaledVector(rayDir, t);
}

/** Places a petal mesh (inside its rotated pivot) at fall time t. */
function posePetal(mesh: THREE.Object3D, angle: number, i: number, t: number, hover: number, bud: number) {
  const e = easeInOut(t);
  const lift = smoothstep(0, 0.3, t);
  const fall = e * e;
  // Every petal leaves the frame the same way, whatever its place on the flower:
  // it lifts off, then drifts down-right on the breeze and towards the camera.
  // (World direction converted into the petal's rotated pivot.)
  const wx = 2.6 * fall;
  const wy = -9 * fall;
  const c = Math.cos(angle);
  const sn = Math.sin(angle);
  mesh.position.set(
    Math.sin(t * Math.PI * 2) * 0.3 * t + c * wx + sn * wy,
    0.12 * lift + e * 0.7 - sn * wx + c * wy + hover * 0.07,
    0.036 * i + lift * 0.3 + fall * 5.6,
  );
  mesh.rotation.set(
    0.9 * lift + bud - hover * 0.05,
    0.21 + t * Math.PI * 1.3 + Math.sin(t * 11) * 0.25 * t,
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
    bumpScale: 0.55,
    metalness: 0,
    roughness: 0.62,
    sheen: 0.7,
    sheenColor: new THREE.Color("#ffffff"),
    sheenRoughness: 0.45,
    envMapIntensity: 0.4,
    side: THREE.DoubleSide,
    transparent: false,
  });
  material.userData.uniforms = {
    uVein: { value: textures.veinMap },
    uPulse: { value: 0 },
    uTime: { value: 0 },
    uRim: { value: 0.22 },
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
    const aspect = size.width / size.height;
    const halfFov = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2));
    // Framed shots slide the camera sideways (it keeps looking straight at the wall)
    // so the flower sits at `frame` of the screen width. Sliding instead of turning
    // means the wall always fills the view and the ochre band stays level.
    const camX = (shot: (typeof SHOTS)[number]) => {
      if (!shot.frame || portrait) return shot.pos[0] * (portrait ? 0.4 : 1);
      return -(2 * shot.frame - 1) * halfFov * aspect * Math.abs(shot.pos[2] - WALL.z) * 0.74;
    };
    const lookX = (shot: (typeof SHOTS)[number]) => {
      if (portrait) return 0;
      return shot.frame ? camX(shot) : shot.look[0] * Math.min(1, 1.6 / aspect);
    };
    const flat = (shot: (typeof SHOTS)[number]) => (shot.frame && !portrait ? 0.25 : 1);
    camTarget.set(
      THREE.MathUtils.lerp(camX(a), camX(b), f) + state.pointer.x * 0.18,
      THREE.MathUtils.lerp(a.pos[1] * flat(a), b.pos[1] * flat(b), f) + state.pointer.y * 0.12,
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], f) * (portrait ? 1.55 : 1),
    );
    camLook.set(
      THREE.MathUtils.lerp(lookX(a), lookX(b), f),
      THREE.MathUtils.lerp(a.look[1], b.look[1], f) - (portrait && p > 0.4 && p < 7.4 ? 0.75 : 0),
      0,
    );
    const k = Math.min(1, delta * 5);
    camera.position.lerp(camTarget, k);
    look.current.lerp(camLook, k);
    camera.lookAt(look.current);
  });
  return null;
}

/** The lime-washed lilac wall behind the flower; it receives the flower's shadow. */
function Wall() {
  const gl = useThree((state) => state.gl);
  const theme = useTheme();
  // Each theme's wall is baked once and kept, so switching themes is instant.
  // Bake only the current theme at startup (keeps loading light); the other one is
  // baked the first time it's needed and then kept, so later switches are instant.
  const [cache] = useState(() => new Map<string, ReturnType<typeof bakeWall>>());
  const baked = useMemo(() => cache.get(theme) ?? bakeWall(gl, theme), [cache, gl, theme]);
  useEffect(() => {
    cache.set(theme, baked);
  }, [cache, theme, baked]);
  useEffect(() => () => cache.forEach((b) => b.dispose()), [cache]);
  return (
    <mesh position={[0, WALL.centerY, WALL.z]} receiveShadow>
      <planeGeometry args={[WALL.width, WALL.height]} />
      <meshStandardMaterial map={baked.map} normalMap={baked.normalMap} roughness={0.97} envMapIntensity={0.25} />
    </mesh>
  );
}

/**
 * The Alentejo sun as a warm spotlight: a pool of light around the flower, the
 * shadow of an olive branch drifting gently on the wall, and golden hour in the finale.
 */
function Sun({ stateRef, lite }: { stateRef: RefObject<ExperienceState>; lite: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const gobo = useMemo(() => createOliveGobo(), []);
  // Soft golden hour across the whole page (the "Vamos falar?" light, gentler and brighter).
  const golden = useMemo(() => new THREE.Color("#ffd6a6"), []);
  // The dark wall needs a stronger sun for the leaf shadows to read.
  const dark = useTheme() === "dark";
  useFrame(({ clock }) => {
    const l = light.current;
    if (!l) return;
    const f = finaleWeight(stateRef.current.progress);
    const t = clock.elapsedTime;
    l.position.set(-3.7 - f * 0.2, 1.7 - f * 0.3, 4.4);
    const fp = stateRef.current.flowerPos;
    l.target.position.set(fp.x * 0.75 + Math.sin(t * 0.35) * 0.05, fp.y * 0.6 - 0.1 + Math.sin(t * 0.27 + 1.3) * 0.035, WALL.z);
    l.target.updateMatrixWorld();
    l.color.copy(golden);
    l.intensity = (dark ? 9 : 4.7) + f * 0.2;
  });
  return (
    <spotLight
      ref={light}
      position={[-3.7, 1.7, 4.4]}
      angle={0.62}
      penumbra={0.9}
      decay={0}
      intensity={4.2}
      map={gobo}
      castShadow
      shadow-mapSize={lite ? [1024, 1024] : [2048, 2048]}
      shadow-bias={-0.0006}
      shadow-normalBias={0.045}
      shadow-radius={5}
      shadow-camera-near={0.5}
      shadow-camera-far={16}
    />
  );
}

function Flower({ stateRef, onAdvance, onReady }: { stateRef: RefObject<ExperienceState>; onAdvance: () => void; onReady: () => void }) {
  const frames = useRef(0);
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const petals = useRef<(THREE.Mesh | null)[]>([]);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const trail = useRef<THREE.Points>(null);
  const trailMaterial = useRef<THREE.ShaderMaterial>(null);
  const anthers = useRef<THREE.InstancedMesh>(null);
  const hovered = useRef(-1);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverAmount = useRef(new Array(PETAL_COUNT).fill(0));
  // Dragging: the flower follows the pointer, then springs back onto its wind path.
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, pointer: new THREE.Vector3(), offset: new THREE.Vector3(), vel: new THREE.Vector3(), base: new THREE.Vector3(), last: new THREE.Vector3(), gust: 0 });

  const geometries = useMemo(() => Array.from({ length: PETAL_COUNT }, (_, i) => createPetalGeometry(11 + i * 7)), []);
  const textures = useMemo(() => createPetalTextures(), []);
  const materials = useMemo(() => {
    const tints = ["#ffffff", "#fdfbf8", "#fffefb", "#fbf9f6", "#ffffff"];
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
    // Anthers: small oblong pollen sacs, oriented along each filament's tip.
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const scale = new THREE.Vector3();
    filaments.tips.forEach((tip, k) => {
      q.setFromUnitVectors(up, filaments.dirs[k]);
      const sz = 0.85 + ((k * 37) % 10) / 25;
      scale.set(sz, sz, sz);
      m.compose(tip, q, scale);
      mesh.setMatrixAt(k, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [filaments]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      document.body.dataset.cursor = "";
    },
    [],
  );

  useFrame(({ clock, gl, scene, camera, size }, delta) => {
    cameraRef.current = camera;
    const dt = Math.min(delta, 0.05);
    const time = clock.elapsedTime;
    const p = stateRef.current.progress;
    // Compile every shader up front (petals, shadows, trail) before the loader opens.
    if (frames.current === 2) gl.compile(scene, camera);
    if (frames.current < 8 && ++frames.current === 8) onReady();
    if (stateRef.current.revealed && stateRef.current.revealAt < 0) stateRef.current.revealAt = time;
    const revealAt = stateRef.current.revealAt;
    const open = revealAt < 0 ? 0 : smoothstep(0.15, 3.0, time - revealAt);
    const finale = finaleWeight(p);
    const nfc = nfcWeight(p);

    if (root.current) {
      // Wind path: interpolate between stops along a curved gust.
      const d = drag.current;
      const portrait = size.width < size.height;
      const q = Math.min(WIND_STOPS.length - 1, Math.max(0, p));
      const k = Math.min(WIND_STOPS.length - 2, Math.floor(q));
      // Leaving the hero, the flower reaches the side before the "O que fazemos" interlude.
      // Hero -> "O que fazemos" takes a whole step: an unhurried drift to the side.
      const f = k === 0 ? smoothstep(0.05, 0.95, q) : smoothstep(0, 1, q - k);
      const stop = (n: number, out: THREE.Vector3) => {
        const w = WIND_STOPS[n];
        if (n === 0) return out.set(0, 0, 0);
        return screenToPlane(portrait ? 0.8 : w.x, portrait ? 0.2 : w.y, camera, out);
      };
      stop(k, stopA);
      stop(k + 1, stopB);
      // Phones: once past the hero the flower rests in its corner (no arc between steps).
      const travel = stateRef.current.touch && k > 0 ? 0 : Math.sin(Math.PI * f);
      d.base.lerpVectors(stopA, stopB, f);
      // Wind comes from scroll speed: a gust pushes the flower a little to the side
      // and up, then it drifts back. Still when the page is still.
      const speed = stateRef.current.touch ? 0 : stateRef.current.target - stateRef.current.progress;
      d.gust += (Math.min(1, Math.abs(speed) * 2.2) - d.gust) * Math.min(1, dt * 3);
      const gx = Math.sin(time * 1.3) * 0.12 + Math.sin(time * 2.1 + 1.7) * 0.05;
      d.base.x += (gx + 0.1 * Math.sign(speed)) * d.gust + Math.sin(time * 0.4) * 0.03;
      d.base.y += travel * 0.12 + Math.sin(time * 1.7 + 0.6) * 0.08 * d.gust + Math.sin(time * 0.33) * 0.025;
      d.base.z = travel * 0.25 + d.gust * 0.15;

      if (d.active) {
        d.offset.lerp(d.vel.copy(d.pointer).sub(d.base).setZ(0.4), Math.min(1, dt * 14));
        d.vel.set(0, 0, 0);
      } else {
        // Damped spring back to the path.
        d.vel.addScaledVector(d.offset, -dt * 38).multiplyScalar(Math.max(0, 1 - dt * 7));
        d.offset.addScaledVector(d.vel, dt);
      }
      root.current.position.copy(d.base).add(d.offset);
      // Lean into the gust like a flower in the breeze (smoothed, never snappy).
      const motion = d.last.subVectors(root.current.position, d.last);
      const leanX = -0.16 - motion.y * 1.2 + Math.sin(time * 1.1) * 0.08 * d.gust + Math.sin(time * 0.6) * 0.02;
      const leanY = motion.x * 1.2 + Math.sin(time * 1.4 + 0.8) * 0.12 * d.gust + Math.sin(time * 0.5 + 1) * 0.03;
      root.current.rotation.x += (leanX - root.current.rotation.x) * Math.min(1, dt * 4);
      root.current.rotation.y += (leanY - root.current.rotation.y) * Math.min(1, dt * 4);
      d.last.copy(root.current.position);
      const sA = WIND_STOPS[k].s;
      const sB = WIND_STOPS[k + 1].s;
      const s = (portrait ? (k === 0 ? THREE.MathUtils.lerp(0.62, 0.36, f) : 0.36) : THREE.MathUtils.lerp(sA, sB, f)) * (d.active ? 1.06 : 1);
      root.current.scale.setScalar(root.current.scale.x + (s - root.current.scale.x) * Math.min(1, dt * 8));
      stateRef.current.flowerPos.x = root.current.position.x;
      stateRef.current.flowerPos.y = root.current.position.y;
      // Screen point just above the flower's top edge, for the drag hint.
      hintPoint.copy(root.current.position);
      hintPoint.y += root.current.scale.x * 1.05;
      hintPoint.project(camera);
      stateRef.current.flowerTop.x = (hintPoint.x * 0.5 + 0.5) * size.width;
      stateRef.current.flowerTop.y = (0.5 - hintPoint.y * 0.5) * size.height;
    }
    if (spin.current) spin.current.rotation.z = -time * 0.025 - Math.pow(1 - open, 3) * 0.45 - p * 0.35;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const mesh = petals.current[i];
      if (!mesh) continue;
      const t = 0;
      const target = hovered.current === i ? 1 : 0;
      hoverAmount.current[i] += (target - hoverAmount.current[i]) * Math.min(1, dt * 6);
      // Petals flutter in the wind: stronger while the flower travels or is dragged.
      const flutter = (Math.sin(time * 6 + i * 1.9) * 0.07 + Math.sin(time * 9.7 + i) * 0.03) * drag.current.gust;
      // Opening after the loader: petals unfold one after another, gently, like a real bloom.
      const openI = revealAt < 0 ? 0 : smoothstep(0.05 + i * 0.14, 1.9 + i * 0.14, time - revealAt);
      const bud = Math.pow(1 - openI, 2) * 0.35 + flutter + Math.sin(time * 0.7 + i * 1.3) * 0.018;
      posePetal(mesh, i * PETAL_ANGLE, i, t, hoverAmount.current[i], bud);
      // Petals grow out from the centre when the flower first opens.
      const growOut = (k: number) => 1 - Math.pow(1 - k, 3);
      mesh.scale.setScalar(Math.max(0.001, growOut(openI)));
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const u = material.userData.uniforms;
      u.uTime.value = time + i * 0.17;
      u.uPulse.value = Math.max(nfc, hoverAmount.current[i] * 0.6) * (1 - t);
      mesh.visible = true;
    }

    // Pollen glints shed by each falling petal.
    if (trailMaterial.current) trailMaterial.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    const trailGeometry = trail.current?.geometry;
    if (trailGeometry) {
      const { local, drift, spawn } = trailData;
      const pos = trailGeometry.getAttribute("position") as THREE.BufferAttribute;
      const alpha = trailGeometry.getAttribute("aAlpha") as THREE.BufferAttribute;
      for (let i = 0; i < PETAL_COUNT; i++) {
        const raw = -1;
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
    if (core.current) core.current.color.setRGB(0.92 * glow, 0.86 * glow, 0.5 * glow);
  });

  const onOver = (i: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    window.clearTimeout(hoverTimer.current);
    hovered.current = i;
    if (!drag.current.active) document.body.dataset.cursor = "grab";
  };

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      if (Math.hypot(event.clientX - d.startX, event.clientY - d.startY) > 6) d.moved = true;
      const cam = cameraRef.current;
      if (cam) screenToPlane(event.clientX / window.innerWidth, event.clientY / window.innerHeight, cam, d.pointer);
    };
    const onUp = () => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      document.body.dataset.cursor = hovered.current >= 0 ? "grab" : "";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onDown = (event: ThreeEvent<PointerEvent>) => {
    // Touch: let the finger scroll the page; dragging is a mouse feature.
    if (event.pointerType === "touch") return;
    event.stopPropagation();
    const d = drag.current;
    d.active = true;
    stateRef.current.dragged = true;
    d.moved = false;
    d.startX = event.clientX;
    d.startY = event.clientY;
    const cam = cameraRef.current;
    if (cam) screenToPlane(event.clientX / window.innerWidth, event.clientY / window.innerHeight, cam, d.pointer);
    document.body.dataset.cursor = "grabbing";
  };
  const onOut = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hovered.current = -1;
      document.body.dataset.cursor = "";
    }, 160);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!drag.current.moved) onAdvance();
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
              onPointerDown={onDown}
              onPointerOut={onOut}
              onClick={onClick}
            />
          </group>
        ))}


        {/* Filaments: fine, pale gold, matte. */}
        <mesh geometry={filaments.geometry} castShadow receiveShadow>
          <meshStandardMaterial color="#e8c35a" emissive="#5a3a06" emissiveIntensity={0.18} metalness={0} roughness={0.7} />
        </mesh>
        {/* Anthers: oblong pollen sacs, deeper gold with a powdery finish. */}
        <instancedMesh ref={anthers} args={[undefined, undefined, filaments.tips.length]} castShadow>
          <capsuleGeometry args={[0.0032, 0.0075, 3, 8]} />
          <meshStandardMaterial color="#e9a91f" emissive="#7a4806" emissiveIntensity={0.25} roughness={0.92} />
        </instancedMesh>
        {/* Pistil: pale green ovary, short style, round stigma. */}
        <mesh position={[0, 0, 0.1]} scale={[1, 1, 0.8]} castShadow>
          <sphereGeometry args={[0.034, 32, 32]} />
          <meshStandardMaterial color="#cdd087" roughness={0.75} envMapIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.135]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0028, 0.0035, 0.05, 10]} />
          <meshStandardMaterial color="#d2cf86" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.162]}>
          <sphereGeometry args={[0.008, 20, 20]} />
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

/**
 * Small life in the air: a few tiny cream petals drifting and turning in the
 * breeze, and fine golden pollen. Few, small and slow, so the scene stays clean.
 */
function Floaters({ lite }: { lite: boolean }) {
  const petalsRef = useRef<THREE.InstancedMesh>(null);
  const pollenMat = useRef<THREE.ShaderMaterial>(null);
  const PETALS = lite ? 4 : 9;
  const seeds = useMemo(() => {
    const rand = seeded(91);
    return Array.from({ length: PETALS }, (_, k) => ({
      // Kept to the left and right thirds, away from the centred text.
      x: (k % 2 ? 1 : -1) * (2.6 + rand() * 2.2),
      y: (rand() - 0.5) * 5,
      z: -0.2 + rand() * 1.6,
      speed: 0.05 + rand() * 0.07,
      spin: (rand() - 0.5) * 1.6,
      phase: rand() * Math.PI * 2,
      size: 0.04 + rand() * 0.035,
    }));
  }, [PETALS]);
  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.bezierCurveTo(0.55, -0.2, 0.5, 0.45, 0, 0.5);
    shape.bezierCurveTo(-0.5, 0.45, -0.55, -0.2, 0, -0.5);
    return new THREE.ShapeGeometry(shape, 12);
  }, []);
  const pollen = useMemo(() => {
    const rand = seeded(17);
    const n = lite ? 30 : 70;
    const pos = new Float32Array(n * 3);
    const sd = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      pos[k * 3] = (rand() - 0.5) * 10;
      pos[k * 3 + 1] = (rand() - 0.5) * 6;
      pos[k * 3 + 2] = -0.3 + rand() * 2;
      sd[k] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(sd, 1));
    return g;
  }, [lite]);
  const pollenUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, gl }) => {
    const t = clock.elapsedTime;
    const mesh = petalsRef.current;
    if (mesh) {
      seeds.forEach((sd, k) => {
        // Drift right and slightly down on the breeze, wrapping around.
        const x = sd.x + Math.sin(t * sd.speed * 2 + sd.phase) * 0.5;
        const y = sd.y + Math.sin(t * 0.4 + sd.phase) * 0.3 + Math.sin(t * 0.17 + sd.phase * 2) * 0.2;
        v.set(x, y, sd.z);
        e.set(Math.sin(t * sd.spin + sd.phase) * 1.2, Math.cos(t * sd.spin * 0.7) * 1.2, t * sd.spin * 0.5);
        q.setFromEuler(e);
        sc.setScalar(sd.size);
        m.compose(v, q, sc);
        mesh.setMatrixAt(k, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
    if (pollenMat.current) {
      pollenMat.current.uniforms.uTime.value = t;
      pollenMat.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    }
  });

  return (
    <>
      <instancedMesh ref={petalsRef} args={[petalGeo, undefined, PETALS]} frustumCulled={false}>
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={/* glsl */ `
            varying vec2 vP;
            varying vec3 vN;
            void main() {
              vP = position.xy;
              vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
              gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec2 vP;
            varying vec3 vN;
            void main() {
              // Soft translucent edge, faint vein, and a sheen as it turns to the light.
              float r = length(vP * vec2(1.25, 1.0)) * 2.0;
              float edge = smoothstep(1.0, 0.55, r);
              float vein = smoothstep(0.06, 0.0, abs(vP.x)) * 0.12;
              float sheen = pow(abs(vN.z), 3.0) * 0.25;
              vec3 col = vec3(0.97, 0.93, 0.87) * (0.82 + sheen) - vein;
              gl_FragColor = vec4(col, edge * 0.85);
            }
          `}
        />
      </instancedMesh>
      <points geometry={pollen} frustumCulled={false}>
        <shaderMaterial
          ref={pollenMat}
          uniforms={pollenUniforms}
          transparent
          depthWrite={false}
          vertexShader={/* glsl */ `
            attribute float aSeed; uniform float uTime; uniform float uPixelRatio; varying float vA;
            void main() {
              vec3 p = position;
              p.x = mod(p.x + 5.0 + uTime * (0.05 + aSeed * 0.08), 10.0) - 5.0;
              p.y += sin(uTime * 0.5 + aSeed * 30.0) * 0.25;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_PointSize = (2.0 + aSeed * 3.0) * uPixelRatio;
              vA = 0.35 + 0.45 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 20.0));
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={/* glsl */ `
            varying float vA;
            void main() {
              float d = length(gl_PointCoord - 0.5) * 2.0;
              float core = exp(-d * d * 9.0);
              float glow = exp(-d * d * 2.2) * 0.35;
              gl_FragColor = vec4(1.0, 0.82, 0.48, (core + glow) * vA * 0.8);
            }
          `}
        />
      </points>
    </>
  );
}

export function FlowerScene({ stateRef, onAdvance, onReady, lite = false }: SceneProps) {
  const dark = useTheme() === "dark";
  return (
    <>
      <CameraRig stateRef={stateRef} />
      <color attach="background" args={[dark ? "#1a0f24" : "#e9e3dc"]} />
      <Wall />

      <hemisphereLight args={dark ? ["#e9d6ec", "#3a1636", 0.4] : ["#efe6f4", "#8b72a8", 0.5]} />
      <ambientLight intensity={0.1} color="#d9cbe8" />
      <Sun stateRef={stateRef} lite={lite} />
      <directionalLight position={[3.5, 1, 3]} intensity={0.35} color="#e9eefc" />
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={2} color="#fff3e2" position={[-4, 3, 4]} scale={[5, 2.5, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#f4e4cc" position={[4, 1, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#e7c98f" position={[0, -4, 2]} scale={[8, 1, 1]} />
      </Environment>

      <Floaters lite={lite} />
      <Flower stateRef={stateRef} onAdvance={onAdvance} onReady={onReady} />

    </>
  );
}
