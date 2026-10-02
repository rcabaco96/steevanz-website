"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { about } from "./chapters";

const R = 1;
const LISBON: [number, number] = [38.72, -9.14];

function toVec(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Turns the globe so Portugal sits on the visible crest of the horizon. */
const FACE_PT = (() => {
  const q = new THREE.Quaternion().setFromUnitVectors(toVec(LISBON[0], LISBON[1]).normalize(), new THREE.Vector3(0.12, 0.78, 0.62).normalize());
  return new THREE.Euler().setFromQuaternion(q);
})();

const TEX = "/media/globe/";

/**
 * Textured Earth in the brand mood: natural day side gently graded towards violet,
 * the night side lit by real city lights in gold, a thin atmosphere line on the
 * limb, and the sun placed so Portugal sits near dusk.
 */
function Planet({ light }: { light: boolean }) {
  const [day, night, spec] = useLoader(THREE.TextureLoader, [TEX + "earth_atmos_2048.jpg", TEX + "earth_lights_2048.png", TEX + "earth_specular_2048.jpg"]);
  // Textures are sampled as sRGB and converted in the shader (no mutation of loader results).
  const uniforms = useMemo(() => {
    return {
      uDay: { value: day },
      uNight: { value: night },
      uSpec: { value: spec },
      uSun: { value: new THREE.Vector3(-0.55, 0.45, 0.7).normalize() },
      uTint: { value: new THREE.Color("#8b6bb8") },
      uRim: { value: new THREE.Color("#e9e2f2") },
      uLight: { value: light ? 1 : 0 },
    };
  }, [day, night, spec, light]);
  return (
    <mesh renderOrder={0}>
      <sphereGeometry args={[R, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv; varying vec3 vN; varying vec3 vView;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vN = normalize(mat3(modelMatrix) * normal);
            vView = normalize(cameraPosition - wp.xyz);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uSpec;
          uniform vec3 uSun; uniform vec3 uTint; uniform vec3 uRim; uniform float uLight;
          varying vec2 vUv; varying vec3 vN; varying vec3 vView;
          void main() {
            vec3 n = normalize(vN);
            float sun = dot(n, uSun);
            float dayMix = smoothstep(-0.12, 0.28, sun);
            vec3 dayCol = pow(texture2D(uDay, vUv).rgb, vec3(2.2));
            // Gentle grade towards the brand violet, mostly in the shadows.
            float lum = dot(dayCol, vec3(0.299, 0.587, 0.114));
            dayCol = mix(dayCol, uTint * (lum * 1.6), 0.28);
            dayCol *= 0.35 + 0.75 * max(sun, 0.0);
            // Ocean glint.
            float water = texture2D(uSpec, vUv).r;
            vec3 h = normalize(uSun + vView);
            dayCol += vec3(1.0, 0.92, 0.85) * pow(max(dot(n, h), 0.0), 40.0) * water * 0.35;
            vec3 lights = pow(texture2D(uNight, vUv).rgb, vec3(2.2));
            vec3 nightCol = vec3(1.0, 0.72, 0.32) * lights * 1.6 + vec3(0.04, 0.025, 0.07);
            vec3 col = mix(nightCol, dayCol, dayMix);
            // Thin atmosphere line on the limb (no halo).
            float rim = pow(1.0 - max(dot(n, vView), 0.0), 3.0);
            col = mix(col, uRim, rim * mix(0.12, 0.3, dayMix));
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  );
}

/** A deep, slow starfield with gentle twinkle and an occasional shooting star. */
function Stars() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const shoot = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const n = 700;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    let a = 7;
    const rand = () => ((a = (a * 16807) % 2147483647) - 1) / 2147483646;
    for (let k = 0; k < n; k++) {
      pos[k * 3] = (rand() - 0.5) * 14;
      pos[k * 3 + 1] = (rand() - 0.15) * 8;
      pos[k * 3 + 2] = -3 - rand() * 4;
      seed[k] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);
  useFrame(({ clock, gl }) => {
    const t = clock.elapsedTime;
    if (material.current) {
      material.current.uniforms.uTime.value = t;
      material.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    }
    // Shooting star every ~7 s, across the upper sky.
    const m = shoot.current;
    if (m) {
      const k = (t % 7) / 1.1;
      m.visible = k < 1;
      m.position.set(-3 + k * 4.5, 2.6 - k * 1.3, -2.5);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(Math.min(1, k) * Math.PI) * 0.8;
    }
  });
  return (
    <>
      <points geometry={geometry} renderOrder={-1}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          vertexShader={/* glsl */ `
            attribute float aSeed; uniform float uTime; uniform float uPixelRatio; varying float vA;
            void main() {
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = (0.8 + aSeed * aSeed * 2.4) * uPixelRatio;
              vA = (0.25 + 0.75 * aSeed) * (0.6 + 0.4 * sin(uTime * (0.5 + aSeed * 1.5) + aSeed * 40.0));
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={/* glsl */ `
            varying float vA;
            void main() {
              float d = length(gl_PointCoord - 0.5) * 2.0;
              gl_FragColor = vec4(0.93, 0.9, 1.0, exp(-d * d * 5.0) * vA);
            }
          `}
        />
      </points>
      <mesh ref={shoot} rotation={[0, 0, -0.28]}>
        <planeGeometry args={[0.9, 0.012]} />
        <meshBasicMaterial color="#f3ecff" transparent depthWrite={false} />
      </mesh>
    </>
  );
}

/** Clouds: a slightly larger shell, drifting a touch faster than the surface. */
function Clouds() {
  const tex = useLoader(THREE.TextureLoader, TEX + "earth_clouds_1024.png");
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += Math.min(delta, 0.05) * 0.01;
  });
  return (
    <mesh ref={mesh} renderOrder={1}>
      <sphereGeometry args={[R * 1.008, 96, 96]} />
      <meshLambertMaterial map={tex} transparent opacity={0.32} depthWrite={false} />
    </mesh>
  );
}

/**
 * Light arcs leaving Lisboa: thin curves over the surface with a bright head
 * travelling along each one, staggered so there's always one in flight.
 */
const ARC_TARGETS: [number, number][] = [
  [51.5, -0.1],
  [48.9, 2.3],
  [40.4, -3.7],
  [52.5, 13.4],
  [41.9, 12.5],
  [-23.5, -46.6],
  [40.7, -74],
  [-8.8, 13.2],
];

function Arcs() {
  const lines = useMemo(
    () =>
      ARC_TARGETS.map(([lat, lon], k) => {
        const a = toVec(LISBON[0], LISBON[1]);
        const b = toVec(lat, lon);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const lift = 1 + Math.min(0.55, a.distanceTo(b) * 0.35);
        mid.normalize().multiplyScalar(R * lift);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const pts = curve.getPoints(80);
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const t = new Float32Array(pts.length).map((_, i) => i / (pts.length - 1));
        g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
        const material = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          uniforms: { uHead: { value: 0 }, uColor: { value: new THREE.Color("#f0b84f") } },
          vertexShader: /* glsl */ `attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
          fragmentShader: /* glsl */ `
            uniform float uHead; uniform vec3 uColor; varying float vT;
            void main() {
              float trail = smoothstep(uHead - 0.35, uHead, vT) * step(vT, uHead);
              float base = 0.12;
              gl_FragColor = vec4(uColor, max(base, trail * 0.9));
            }
          `,
        });
        return { line: new THREE.Line(g, material), offset: k / ARC_TARGETS.length };
      }),
    [],
  );
  useFrame(({ clock }) => {
    lines.forEach(({ line, offset }) => {
      const t = (clock.elapsedTime * 0.22 + offset) % 1;
      (line.material as THREE.ShaderMaterial).uniforms.uHead.value = Math.min(1.35, t * 1.6);
    });
  });
  return (
    <>
      {lines.map(({ line }, k) => (
        <primitive key={k} object={line} renderOrder={2} />
      ))}
    </>
  );
}

/** Signal rings expanding from Lisboa across the globe's surface. */
function Pulse() {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const pos = useMemo(() => toVec(LISBON[0], LISBON[1], R * 1.004), []);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame(({ clock }) => {
    rings.current.forEach((ring, k) => {
      if (!ring) return;
      const t = (clock.elapsedTime * 0.35 + k / 3) % 1;
      ring.scale.setScalar(0.01 + t * 0.14);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (1 - t) * 0.7;
    });
  });
  return (
    <group ref={group} position={pos} quaternion={quat}>
      {[0, 1, 2].map((k) => (
        <mesh
          key={k}
          ref={(m) => {
            rings.current[k] = m;
          }}
        >
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial color="#f0b84f" transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh>
        <circleGeometry args={[0.009, 24]} />
        <meshBasicMaterial color="#ffe2a6" />
      </mesh>
    </group>
  );
}

/** Globe body: spins slowly, can be dragged, eases back towards Portugal. */
function Earth({ light }: { light: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const { gl, size } = useThree();
  const portrait = size.width < size.height;
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      drag.current.active = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      document.body.dataset.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.vy = (e.clientX - d.x) * 0.006;
      d.vx = (e.clientY - d.y) * 0.004;
      d.ry += d.vy;
      d.rx = Math.max(-0.6, Math.min(0.6, d.rx + d.vx));
      d.x = e.clientX;
      d.y = e.clientY;
    };
    const up = () => {
      drag.current.active = false;
      document.body.dataset.cursor = "";
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const d = drag.current;
    const dt = Math.min(delta, 0.05);
    if (!d.active) {
      // Inertia, then a slow drift; the tilt eases back to level.
      d.ry += d.vy;
      d.vy *= 0.94;
      d.vx = 0;
      // Sway gently around Portugal instead of drifting away from it.
      d.ry += (Math.sin(performance.now() / 9000) * 0.18 - d.ry) * dt * 0.6;
      d.rx += (0 - d.rx) * dt * 1.5;
    }
    if (spin.current) spin.current.rotation.set(d.rx, d.ry, 0);
  });

  return (
    <group position={[0, portrait ? -0.55 : -1.45, 0]} scale={portrait ? 1.05 : 1.78} rotation={[0.1, 0, 0]}>
      <group ref={spin}>
        <group rotation={FACE_PT}>
          <Planet light={light} />
          <Clouds />
          <Arcs />
          <Pulse />
        </group>
      </group>
      <directionalLight position={[-0.55, 0.45, 0.7]} intensity={2.2} />
      <ambientLight intensity={0.15} />
    </group>
  );
}

/**
 * "Em crescimento": a textured Earth (day, night lights, clouds) facing Portugal,
 * turning slowly and draggable. Loads its textures and renders only when near.
 */
const TEXTURES = [TEX + "earth_atmos_2048.jpg", TEX + "earth_lights_2048.png", TEX + "earth_specular_2048.jpg", TEX + "earth_clouds_1024.png"];

export function GlobeSection({ light }: { light: boolean }) {
  // Download the Earth images in the background once the page is idle, so the
  // globe is ready long before the visitor reaches it.
  useEffect(() => {
    const start = () => TEXTURES.forEach((url) => useLoader.preload(THREE.TextureLoader, url));
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start);
    else window.setTimeout(start, 1500);
  }, []);
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    // Mount (and compile) the globe well before it scrolls into view…
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: "250% 0px" });
    // …but only animate while it is actually on screen.
    const vis = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    vis.observe(el);
    io.observe(el);
    return () => {
      io.disconnect();
      vis.disconnect();
    };
  }, []);


  return (
    <section ref={section} className="globe" aria-labelledby="globe-title">
      <div className="globe-canvas" aria-hidden="true">
        {near ? (
          <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 3.3], fov: 38 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <Stars />
              <Earth light={light} />
            </Suspense>
          </Canvas>
        ) : null}
      </div>
      <div className="globe-copy">
        <p className="lab-kicker">Em crescimento</p>
        <h2 id="globe-title">De Portugal para o mundo.</h2>
        <p>
          Nascemos no Alentejo, trabalhamos a partir de Lisboa e já criámos software para marcas como Sporting CP, BMW e Crédito
          Agrícola. Hoje, chegamos a negócios em qualquer parte do mundo.
        </p>
        <dl className="globe-facts">
          {about.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.value}</dt>
              <dd>{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
