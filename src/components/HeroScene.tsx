import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = ["#cfa563", "#f1e6d4", "#ad5fb0", "#d97bb0"];

function shellPositions(count: number, radius: number, thickness: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius + (Math.random() - 0.5) * thickness;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function fieldPositions(count: number, spread: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * spread;
    arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
    arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return arr;
}

function DepthLayer({
  positions,
  color,
  size,
  opacity,
  spinSpeed,
  driftAmount,
  parallax,
  depthIndex,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  opacity: number;
  spinSpeed: number;
  driftAmount: number;
  parallax: number;
  depthIndex: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const base = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y += delta * spinSpeed;
    ref.current.rotation.x = Math.sin(t * 0.08 + depthIndex) * 0.12;

    const { x, y } = state.pointer;
    const targetX = base.current.x + x * parallax;
    const targetY = base.current.y + y * parallax * 0.7 + Math.sin(t * 0.3 + depthIndex) * driftAmount;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.03);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.03);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CoreBloom() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.scale.setScalar(1.05 + Math.sin(t * 0.6) * 0.08);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 48, 48]} />
      <meshBasicMaterial color="#cfa563" transparent opacity={0.05} depthWrite={false} />
    </mesh>
  );
}

export default function HeroScene({ className = "" }: { className?: string }) {
  const layers = useMemo(
    () => [
      { positions: shellPositions(420, 2.4, 0.5), color: COLORS[0], size: 0.05, opacity: 0.8, spinSpeed: 0.045, driftAmount: 0.12, parallax: 0.35, depthIndex: 0 },
      { positions: shellPositions(360, 4.0, 0.9), color: COLORS[1], size: 0.038, opacity: 0.5, spinSpeed: -0.03, driftAmount: 0.18, parallax: 0.55, depthIndex: 1 },
      { positions: fieldPositions(300, 11), color: COLORS[2], size: 0.03, opacity: 0.4, spinSpeed: 0.018, driftAmount: 0.24, parallax: 0.85, depthIndex: 2 },
      { positions: fieldPositions(220, 15), color: COLORS[3], size: 0.024, opacity: 0.28, spinSpeed: -0.012, driftAmount: 0.3, parallax: 1.15, depthIndex: 3 },
    ],
    []
  );

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 44 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CoreBloom />
          {layers.map((l, i) => (
            <DepthLayer key={i} {...l} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
