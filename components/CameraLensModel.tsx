"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FastCameraModelProps {
  onTrigger?: () => void;
  scale?: number;
}

export default function FastCameraModel({ onTrigger, scale }: FastCameraModelProps) {
  const group = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Pre-generate static aperture blade positions to eliminate render-loop allocations
  const apertureBlades = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const angle = (i / 9) * Math.PI * 2;
      return {
        id: i,
        position: [Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0] as [number, number, number],
        rotation: [0, 0, angle] as [number, number, number],
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Fast, lightweight damping for smooth mouse rotation
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.22;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetX,
      5,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -targetY,
      5,
      delta
    );

    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;

    if (irisRef.current) {
      irisRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onTrigger?.();
  };

  return (
    <group
      ref={group}
      scale={scale ?? (viewport.width < 6 ? 0.72 : 1)}
      position={[0, -0.05, 0.85]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* ── CAMERA BODY — Tan leather base ── */}
      <RoundedBox args={[2.0, 1.25, 0.85]} radius={0.09} smoothness={3} position={[0, 0, -1.75]}>
        <meshStandardMaterial color="#7a4b2e" roughness={0.75} metalness={0.05} />
      </RoundedBox>

      {/* Darker leather grip panel */}
      <mesh position={[0.72, -0.02, -1.325]}>
        <boxGeometry args={[0.42, 1.05, 0.03]} />
        <meshStandardMaterial color="#4a2c19" roughness={0.9} metalness={0} />
      </mesh>

      {/* Chrome top plate */}
      <RoundedBox args={[2.04, 0.2, 0.85]} radius={0.04} smoothness={3} position={[0, 0.62, -1.75]}>
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </RoundedBox>

      {/* Viewfinder hump */}
      <RoundedBox args={[0.48, 0.26, 0.46]} radius={0.05} smoothness={3} position={[0, 0.88, -1.82]}>
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </RoundedBox>

      {/* Gold shutter button */}
      <mesh position={[0.82, 0.76, -1.55]}>
        <cylinderGeometry args={[0.07, 0.07, 0.09, 20]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.25}
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Film-advance lever */}
      <mesh position={[-0.86, 0.73, -1.5]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.16]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Red tally light */}
      <mesh position={[-0.55, 0.63, -1.325]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#c23b3b"
          emissive="#c23b3b"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Strap lugs */}
      {[-1.03, 1.03].map((x) => (
        <mesh key={x} position={[x, 0.1, -1.75]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.065, 0.02, 8, 16]} />
          <meshStandardMaterial color="#a8a9ae" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* ── LENS ASSEMBLY ── */}
      <group>
        {/* Rear mount plate */}
        <mesh position={[0, 0, -1.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.53, 0.58, 0.16, 32]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Short pancake barrel */}
        <mesh position={[0, 0, -0.99]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.53, 0.42, 32]} />
          <meshStandardMaterial color="#333338" metalness={0.85} roughness={0.32} />
        </mesh>

        {/* Grip texture rings */}
        {[-1.14, -1.04, -0.94, -0.84].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.495, 0.012, 8, 32]} />
            <meshStandardMaterial color="#0a0a0b" metalness={0.6} roughness={0.6} />
          </mesh>
        ))}

        {/* Champagne gold accent ring */}
        <mesh position={[0, 0, -0.76]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.025, 12, 32]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.25}
            emissive="#d4af37"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Front housing */}
        <mesh position={[0, 0, -0.64]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.49, 0.24, 32]} />
          <meshStandardMaterial color="#38383d" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Aperture blades */}
        <group ref={irisRef} position={[0, 0, -0.5]}>
          {apertureBlades.map((blade) => (
            <mesh key={blade.id} position={blade.position} rotation={blade.rotation}>
              <boxGeometry args={[0.34, 0.09, 0.02]} />
              <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Optimized Glass (standard material with transparency for zero-delay loading) */}
        <mesh position={[0, 0, -0.49]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial
            color="#0d1117"
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Gold lens glare ring */}
        <mesh position={[0, 0, -0.46]}>
          <circleGeometry args={[0.15, 24]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.15}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Front bezel ring */}
        <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.43, 0.03, 12, 32]} />
          <meshStandardMaterial color="#0a0a0b" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}