"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";
import CameraLensModel from "./CameraLensModel";
import { MEDIA } from "@/lib/data";

export default function HeroLensBadge() {
  const [flash, setFlash] = useState(false);
  const [play] = useSound(MEDIA.shutterSound, { volume: 0.55 });

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
      <div className="relative h-44 w-44 sm:h-56 sm:w-56 overflow-hidden rounded-full border-2 border-gold/60 bg-charcoal/60 shadow-[0_0_70px_-8px_rgba(212,175,55,0.45)] backdrop-blur-sm">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 4.8], fov: 40 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[3, 4, 5]} intensity={1.6} color="#f4f4f5" />
            <directionalLight position={[-3, -1, -4]} intensity={0.9} color="#d4af37" />
            <pointLight position={[-3, -2, 2]} intensity={1.8} color="#d4af37" />
            <pointLight position={[2, -3, -2]} intensity={0.8} color="#f4f4f5" />
            <CameraLensModel onTrigger={trigger} scale={0.92} />
          </Canvas>
        </Suspense>
      </div>

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
