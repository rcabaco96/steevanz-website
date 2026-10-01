"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createPlaneCardTextures, type CardKind } from "./cardArt";

// Clients Steevanz has worked with, shown as illustrative plate designs (names only, no logo artwork).
const DESIGNS: { kind: CardKind; name: string; note: string; business: string }[] = [
  { kind: "stand", name: "Expositor de mesa", note: "Acrílico, para mesas e balcões", business: "Sporting CP" },
  { kind: "plate", name: "Placa de balcão", note: "Quadrada e discreta, junto à caixa", business: "BMW" },
  { kind: "sticker", name: "Autocolante", note: "Para montras, menus e terminais", business: "Mesh" },
  { kind: "business", name: "Cartão NFC", note: "Redes sociais e contactos num toque", business: "Aubay" },
  { kind: "stand", name: "Expositor de mesa", note: "Acrílico, para mesas e balcões", business: "Crédito Agrícola" },
  { kind: "plate", name: "Placa de balcão", note: "Quadrada e discreta, junto à caixa", business: "Efficient Safe" },
];

// Spiral layout (after Grail's hero): cards on a squashed helix, rising as they turn.
const LAYOUT = { count: 22, angleStep: 0.65, radius: 2.6, squish: 0.7, gapX: -0.05, gapY: 0.4, edgeTwist: -0.06, height: 1.25, bend: 0.22 };

const VERTEX = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Curl the side edges back and bow it slightly: a card, not a flat plane.
    p.z -= uBend * p.x * p.x;
    p.z -= uBend * 0.35 * p.y * p.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uFront;
  uniform sampler2D uBack;
  uniform float uDim;
  uniform float uSweep;
  varying vec2 vUv;
  void main() {
    // Both faces show the plate design (read correctly from either side).
    vec4 c = texture2D(uFront, gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y));
    if (c.a < 0.02) discard;
    vec3 col = c.rgb * max(uDim, 0.55);
    // A soft reflection band glides across the acrylic as the card turns.
    float band = smoothstep(0.16, 0.0, abs(vUv.x * 0.8 + vUv.y * 0.6 - uSweep));
    col += vec3(1.0, 0.97, 0.92) * band * 0.16;
    gl_FragColor = vec4(col, c.a);
    #include <colorspace_fragment>
  }
`;

function cardMaterialParams(): THREE.ShaderMaterialParameters {
  return {
    uniforms: { uFront: { value: null }, uBack: { value: null }, uDim: { value: 1 }, uSweep: { value: 0 }, uBend: { value: LAYOUT.bend } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
  };
}

function cssFont(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function Spiral({ pointerRef, captionRef }: { pointerRef: React.RefObject<{ x: number; y: number }>; captionRef: React.RefObject<HTMLParagraphElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const position = useRef(0);
  const [fonts, setFonts] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const display = cssFont("--font-lab-display", "sans-serif");
    const sans = cssFont("--font-lab-sans", "sans-serif");
    const done = () => !cancelled && setFonts(true);
    Promise.all([document.fonts.load(`400 80px ${display}`), document.fonts.load(`500 40px ${sans}`)]).then(done, done);
    return () => {
      cancelled = true;
    };
  }, []);

  const textures = useMemo(() => {
    if (!fonts) return null;
    const display = cssFont("--font-lab-display", "sans-serif");
    const sans = cssFont("--font-lab-sans", "sans-serif");
    return DESIGNS.map((d) => createPlaneCardTextures(d.kind, display, sans, d.business));
  }, [fonts]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 24, 16), []);
  useFrame(({ clock, size }, delta) => {
    if (!textures) return;
    const dt = Math.min(delta, 0.05);
    // Scroll drives the spiral; a slow auto-turn keeps it alive when idle.
    const target = clock.elapsedTime * 0.32;
    position.current += (target - position.current) * Math.min(1, dt * 6);
    const b = position.current;
    const base = Math.round(b) - Math.floor(LAYOUT.count / 2);

    if (group.current) {
      const aspect = size.width / size.height;
      group.current.position.x = aspect > 1.1 ? Math.min(2.2, aspect * 1.05) : 0;
      group.current.scale.setScalar(aspect > 1.1 ? 0.9 : 0.75);
      group.current.rotation.x += (-pointerRef.current.y * 0.12 - group.current.rotation.x) * Math.min(1, dt * 4);
      group.current.rotation.z += (-pointerRef.current.x * 0.12 - group.current.rotation.z) * Math.min(1, dt * 4);
    }

    meshes.current.forEach((mesh, e) => {
      if (!mesh) return;
      const t = base + e;
      const n = t - b;
      const angle = n * LAYOUT.angleStep;
      const design = ((t % DESIGNS.length) + DESIGNS.length) % DESIGNS.length;
      const tex = textures[design];
      mesh.position.set(LAYOUT.radius * Math.sin(angle) + n * LAYOUT.gapX, n * LAYOUT.gapY, LAYOUT.radius * Math.cos(angle) * LAYOUT.squish);
      mesh.rotation.set(0, angle, -Math.sin(angle) * LAYOUT.edgeTwist);
      mesh.scale.set(LAYOUT.height * tex.aspect, LAYOUT.height, 1);
      mesh.renderOrder = Math.round(mesh.position.z * 100);
      const u = (mesh.material as THREE.ShaderMaterial).uniforms;
      u.uFront.value = tex.front;
      u.uBack.value = tex.back;
      u.uDim.value = Math.max(0.32, 0.5 + 0.5 * Math.cos(angle));
      u.uSweep.value = 0.7 - Math.sin(angle) * 1.1;
    });

    const front = ((Math.round(b) % DESIGNS.length) + DESIGNS.length) % DESIGNS.length;
    const el = captionRef.current;
    if (el && el.dataset.index !== String(front)) {
      el.dataset.index = String(front);
      el.innerHTML = `<b>${DESIGNS[front].name}</b><span>${DESIGNS[front].note} · exemplo: ${DESIGNS[front].business}</span>`;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: LAYOUT.count }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={geometry}
          frustumCulled={false}
        >
          <shaderMaterial args={[cardMaterialParams()]} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The NFC formats as a Grail-style spiral of cards: it turns on its own and leans
 * towards the pointer. Renders only while visible.
 */
export function NfcShowcase() {
  const section = useRef<HTMLElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(el);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section ref={section} className="nfc-show" aria-label="Os formatos das placas NFC">
      <div className="nfc-show-stage">
        <div className="nfc-show-head">
          <p className="pd-label">Os formatos</p>
          <h2>Uma placa, o seu negócio.</h2>
          <p>Um design Steevanz em quatro formatos — expositor, placa de balcão, autocolante e cartão. Personalizamos com o logótipo, o nome e o link de review do seu negócio.</p>
          <p className="nfc-show-note">Exemplos ilustrativos com marcas com quem já trabalhámos.</p>
        </div>
        <div className="nfc-show-canvas" aria-hidden="true">
          <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 8.3], fov: 38 }} gl={{ antialias: true, alpha: true }}>
            <Spiral pointerRef={pointer} captionRef={caption} />
          </Canvas>
        </div>
        <p ref={caption} className="nfc-show-caption" aria-live="polite" />
      </div>
    </section>
  );
}
