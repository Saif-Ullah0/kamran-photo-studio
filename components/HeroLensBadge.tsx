"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";
import StaticCameraModel from "./StaticCameraModel";
import { MEDIA } from "@/lib/data";

// Dynamically load desktop-only 3D canvas dependencies
const CameraLensModel = dynamic(() => import("./CameraLensModel"), { ssr: false });
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpointPx]);

  return isMobile;
}

export default function HeroLensBadge() {
  const [flash, setFlash] = useState(false);
  const [play] = useSound(MEDIA.shutterSound, { volume: 0.55 });
  const isMobile = useIsMobile();

  const trigger = useCallback(() => {
    setFlash(true);
    try {
      play();
    } catch {
      // Sound file missing/unsupported — fail silently, flash still plays.
    }
    window.setTimeout(() => setFlash(false), 300);
  }, [play]);

  return (
    <>
      <div
        onClick={trigger}
        className="relative h-44 w-44 sm:h-56 sm:w-56 cursor-pointer overflow-hidden rounded-full border-2 border-gold/60 bg-charcoal/60 shadow-[0_0_70px_-8px_rgba(212,175,55,0.45)] backdrop-blur-sm active:scale-95 transition-transform duration-150 flex items-center justify-center group"
      >
        {isMobile === null ? (
          <div className="w-full h-full rounded-full bg-neutral-900/10 animate-pulse" />
        ) : isMobile ? (
          <StaticCameraModel className="transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4.8], fov: 40 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true }}
              className="pointer-events-none"
            >
              <ambientLight intensity={0.65} />
              <directionalLight position={[3, 4, 5]} intensity={1.6} color="#f4f4f5" />
              <directionalLight position={[-3, -1, -4]} intensity={0.9} color="#d4af37" />
              <pointLight position={[-3, -2, 2]} intensity={1.8} color="#d4af37" />
              <pointLight position={[2, -3, -2]} intensity={0.8} color="#f4f4f5" />
              <CameraLensModel scale={0.92} />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Whole-screen camera flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.4, 1], ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-[100] bg-white"
          />
        )}
      </AnimatePresence>
    </>
  );
}