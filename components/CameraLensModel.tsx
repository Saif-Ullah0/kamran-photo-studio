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

    // Mouse-follow: normalized pointer drives a gentle look-at rotation.
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

    // Constant slow ambient rotation, layered under the mouse-follow.
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;

    if (irisRef.current) {
      irisRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  // NOTE ON ORIENTATION:
  // Three.js CylinderGeometry's axis runs along Y by default — so every
  // cylinder below that's meant to act as a forward-facing barrel/disc
  // (rear mount, main barrel, front housing, front glass) needs
  // rotation={[Math.PI / 2, 0, 0]} to turn that axis to face Z (the
  // viewer). Without it, those pieces lie flat like a plate instead of
  // standing up as a tube — that was the "black disc lying down" bug.
  // TorusGeometry's default axis is already Z, so the ring elements
  // (grip rings, gold accent ring, bezel ring) need NO rotation to face
  // the viewer correctly.
  //
  // NOTE ON CLICK HANDLING: this model has no onClick of its own anymore.
  // The click-to-flash trigger lives on the circular HTML div in
  // HeroLensBadge.tsx instead, so the whole badge is clickable — not just
  // the pixels where a mesh happens to be. Adding a click handler back
  // here would double-fire the flash when someone clicks directly on the
  // model (once via the mesh raycast, once via the div underneath it).
  return (
    <group
      ref={group}
      scale={scale ?? (viewport.width < 6 ? 0.72 : 1)}
      position={[0, -0.05, 0.85]}
    >
      {/* ── CAMERA BODY — tan leather, reads as a body rather than a bare lens ── */}
      <mesh position={[0, 0, -1.75]}>
        <boxGeometry args={[2.0, 1.25, 0.85]} />
        <meshStandardMaterial color="#7a4b2e" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Darker leather grip panel, front-right */}
      <mesh position={[0.72, -0.02, -1.325]}>
        <boxGeometry args={[0.42, 1.05, 0.03]} />
        <meshStandardMaterial color="#4a2c19" roughness={0.9} metalness={0} />
      </mesh>

      {/* Chrome top plate */}
      <mesh position={[0, 0.62, -1.75]}>
        <boxGeometry args={[2.04, 0.2, 0.85]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Viewfinder hump */}
      <mesh position={[0, 0.88, -1.82]}>
        <boxGeometry args={[0.48, 0.26, 0.46]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Shutter button — gold, doubles as a visual "press here" cue.
          A cylinder standing UP (unrotated) is correct here — a real
          shutter button faces up, not forward. */}
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

      {/* Film-advance lever hint */}
      <mesh position={[-0.86, 0.73, -1.5]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.16]} />
        <meshStandardMaterial color="#cfd0d4" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Small red tally light — a spot of color, classic camera detail */}
      <mesh position={[-0.55, 0.63, -1.325]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#c23b3b"
          emissive="#c23b3b"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Strap lugs — small rings on the left/right sides. Rotated around
          Y (not X) so the ring's hole faces sideways, like a real lug
          you'd loop a strap through. */}
      {[-1.03, 1.03].map((x) => (
        <mesh key={x} position={[x, 0.1, -1.75]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.065, 0.02, 8, 16]} />
          <meshStandardMaterial color="#a8a9ae" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* ── LENS ASSEMBLY — black metal, protrudes from the body front ── */}

      {/* Rear mount plate */}
      <mesh position={[0, 0, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.78, 0.9, 0.22, 48]} />
        <meshStandardMaterial color="#2c2c30" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Main barrel */}
      <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.9, 64]} />
        <meshStandardMaterial color="#333338" metalness={0.85} roughness={0.32} />
      </mesh>

      {/* Grip texture rings on the barrel — torus already faces forward
          by default, so no rotation needed. */}
      {[-0.85, -0.7, -0.55, -0.4, -0.25].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.735, 0.012, 8, 64]} />
          <meshStandardMaterial color="#0a0a0b" metalness={0.6} roughness={0.6} />
        </mesh>
      ))}

      {/* Champagne gold accent ring */}
      <mesh position={[0, 0, -0.08]}>
        <torusGeometry args={[0.74, 0.028, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.25}
          emissive="#d4af37"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Front housing */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.72, 0.45, 64]} />
        <meshStandardMaterial color="#38383d" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Iris / aperture blades — rotating group for subtle life */}
      <group ref={irisRef} position={[0, 0, 0.44]}>
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (i / 9) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.34, 0.09, 0.02]} />
              <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* Front glass element — this was the disc "lying down". Now
          rotated so its flat face points at the viewer (+Z), not up (+Y). */}
      <mesh position={[0, 0, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#0d1117"
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.4}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Inner reflective glint — CircleGeometry already faces +Z by
          default, so this one was always correctly oriented. */}
      <mesh position={[0, 0, 0.48]}>
        <circleGeometry args={[0.22, 48]} />
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
      <mesh position={[0, 0, 0.44]}>
        <torusGeometry args={[0.68, 0.035, 16, 64]} />
        <meshStandardMaterial color="#0a0a0b" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
}