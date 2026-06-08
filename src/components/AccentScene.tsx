import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Variant = "sphere" | "spiral" | "field";

function layerPositions(variant: Variant, count: number, layer: number) {
  const arr = new Float32Array(count * 3);
  const spread = 1.6 + layer * 0.9;

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;

    if (variant === "sphere") {
      const r = spread * (0.55 + Math.random() * 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    } else if (variant === "spiral") {
      const t = Math.random();
      const angle = t * Math.PI * 6 + layer * 1.4;
      const r = spread * (0.25 + t * 0.85);
      x = Math.cos(angle) * r;
      y = (Math.random() - 0.5) * 0.6 * spread;
      z = Math.sin(angle) * r;
    } else {
      x = (Math.random() - 0.5) * spread * 2.4;
      y = (Math.random() - 0.5) * spread * 2.4;
      z = (Math.random() - 0.5) * spread * 2.4;
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

function ParticleLayer({
  variant,
  color,
  count,
  layer,
  speed,
  size,
  opacity,
}: {
  variant: Variant;
  color: string;
  count: number;
  layer: number;
  speed: number;
  size: number;
  opacity: number;
}) {
  const positions = useMemo(() => layerPositions(variant, count, layer), [variant, count, layer]);
  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.12 + layer) * 0.18;
    const { x, y } = state.pointer;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.22 * (layer + 1), 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.16 * (layer + 1), 0.04);
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

function CoreGlow({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const s = 0.62 + Math.sin(t * 1.1) * 0.05;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
    </mesh>
  );
}

export default function AccentScene({
  variant = "sphere",
  color = "#cfa563",
  className = "",
}: {
  variant?: Variant;
  color?: string;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <CoreGlow color={color} />
          <ParticleLayer variant={variant} color={color} count={520} layer={0} speed={0.05} size={0.045} opacity={0.85} />
          <ParticleLayer variant={variant} color="#f1e6d4" count={340} layer={1} speed={-0.035} size={0.032} opacity={0.45} />
          <ParticleLayer variant={variant} color={color} count={220} layer={2} speed={0.02} size={0.022} opacity={0.28} />
        </Suspense>
      </Canvas>
    </div>
  );
}
