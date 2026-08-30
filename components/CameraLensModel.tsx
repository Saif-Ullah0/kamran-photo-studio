"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraLensModelProps {
  scale?: number;
}

export default function CameraLensModel({ scale }: CameraLensModelProps) {
  const group = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;

    target.current.x = state.pointer.x * 0.35;
    target.current.y = state.pointer.y * 0.22;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.current.x,
      1 - Math.pow(0.001, delta)
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -target.current.y,
      1 - Math.pow(0.001, delta)
    );

    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;

    if (irisRef.current) {
      irisRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group
      ref={group}
      scale={scale ?? (viewport.width < 6 ? 0.72 : 1)}
      position={[0, -0.05, 0.85]}
    >
      {/* ── CAMERA BODY ── */}
      {/* Slightly lowered top edge & pushed back slightly to prevent Z-fighting */}
      <mesh position={[0, -0.08, -1.755]}>
        <boxGeometry args={[2.0, 1.10, 0.84]} />
        <meshStandardMaterial color="#7a4b2e" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Grip panel */}
      <mesh position={[0.72, -0.02, -1.32]}>
        <boxGeometry args={[0.42, 1.05, 0.03]} />
        <meshStandardMaterial color="#4a2c19" roughness={0.9} metalness={0} />
      </mesh>

      {/* Chrome top plate — shifted slightly forward (+Z) to completely eliminate Z-fighting */}
      <mesh position={[0, 0.61, -1.745]}>
        <boxGeometry args={[2.04, 0.22, 0.86]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Viewfinder hump */}
      <mesh position={[0, 0.88, -1.82]}>
        <boxGeometry args={[0.48, 0.26, 0.46]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

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

      {/* Tally light */}
      <mesh position={[-0.55, 0.63, -1.32]}>
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
        <mesh key={x} position={[x, 0.1, -1.75]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.065, 0.02, 8, 16]} />
          <meshStandardMaterial color="#a8a9ae" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* ── REALISTIC TAPERED LENS ASSEMBLY ── */}

      {/* Rear chrome mount ring */}
      <mesh position={[0, 0, -1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.54, 0.58, 0.12, 48]} />
        <meshStandardMaterial color="#b5b6ba" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Main barrel section */}
      <mesh position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.53, 0.34, 64]} />
        <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Focus grip ridges */}
      {[-1.12, -1.06, -1.00, -0.94].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.50, 0.009, 8, 64]} />
          <meshStandardMaterial color="#09090b" metalness={0.4} roughness={0.7} />
        </mesh>
      ))}

      {/* Gold brass trim ring */}
      <mesh position={[0, 0, -0.83]}>
        <torusGeometry args={[0.47, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.2}
          emissive="#d4af37"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Tapered front cone section */}
      <mesh position={[0, 0, -0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.46, 0.32, 64]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Iris / aperture blades */}
      <group ref={irisRef} position={[0, 0, -0.53]}>
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (i / 9) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.11, Math.sin(angle) * 0.11, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.22, 0.06, 0.015]} />
              <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Front glass element */}
      <mesh position={[0, 0, -0.51]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 64]} />
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.1}
          roughness={0.05}
          transmission={0.92}
          thickness={0.25}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.95}
        />
      </mesh>

      {/* Optical lens coating glint */}
      <mesh position={[0, 0, -0.49]}>
        <circleGeometry args={[0.13, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d4af37"
          emissiveIntensity={0.45}
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Front bezel ring */}
      <mesh position={[0, 0, -0.50]}>
        <torusGeometry args={[0.36, 0.022, 16, 64]} />
        <meshStandardMaterial color="#09090b" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}