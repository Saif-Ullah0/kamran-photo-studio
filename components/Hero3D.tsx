"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";
import CameraLensModel from "./CameraLensModel";
import { MEDIA } from "@/lib/data";

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-line border-t-gold animate-spin" />
    </div>
  );
}

export default function Hero3D() {
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
    <div className="absolute inset-0">
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.28} />
          <directionalLight position={[3, 4, 5]} intensity={0.9} color="#f4f4f5" />
          <pointLight position={[-2.5, -1.5, 2.5]} intensity={0.8} color="#d4af37" />
          <pointLight position={[1.8, -2.4, -1.8]} intensity={0.4} color="#8a8a93" />
          <CameraLensModel onTrigger={trigger} />
        </Canvas>
      </Suspense>

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
    </div>
  );
}
