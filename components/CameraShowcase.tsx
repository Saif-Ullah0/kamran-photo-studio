"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Camera as CameraIcon, RotateCcw } from "lucide-react";
import AmbientGlow from "./AmbientGlow";
import { GEAR, MEDIA } from "@/lib/data";
import { cn } from "@/lib/utils";

// Tune these to taste:
const PLAYBACK_RATE = 0.6; // 1 = normal speed, lower = slower. 0.4 stretches a 6s clip to ~15s.
const START_DELAY_MS = 1500; // pause after the section enters view, before playback starts

export default function CameraShowcase() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!inView || hasStarted) return;
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      video.playbackRate = PLAYBACK_RATE;
      video.play().catch(() => {
        // Autoplay can be blocked before any user interaction on some
        // browsers — clicking the video (see replay handler) still works.
      });
      setHasStarted(true);
    }, START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [inView, hasStarted]);

  function handleReplay() {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = PLAYBACK_RATE;
    video.currentTime = 0;
    video.play();
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <AmbientGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">The Kit</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Built piece by piece
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate">
            Every shot on this site starts with gear like this.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-charcoal"
        >
          <video
            ref={videoRef}
            src={MEDIA.cameraExplodeVideo}
            muted
            loop
            playsInline
            preload="metadata"
            onClick={handleReplay}
            className="h-full w-full cursor-pointer object-contain"
          />
          <button
            onClick={handleReplay}
            aria-label="Replay"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-line bg-obsidian/70 px-3 py-1.5 text-[11px] text-slate opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:border-gold hover:text-gold"
          >
            <RotateCcw className="h-3 w-3" />
            Replay
          </button>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {GEAR.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-charcoal transition-shadow duration-300 hover:gold-glow"
            >
              {item.image ? (
                <>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-obsidian">
                  <div className="absolute inset-0 noise-overlay opacity-[0.06] mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] transition-transform duration-300 group-hover:scale-110">
                      <CameraIcon className="h-6 w-6 text-gold/80" strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              )}

              <span className="absolute left-2.5 top-2.5 rounded-full border border-line/80 bg-obsidian/70 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate backdrop-blur-sm">
                {item.category}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    item.image ? "text-offwhite" : "text-offwhite/90"
                  )}
                >
                  {item.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate/60">
          Two of six shown with reference photos — the rest will get real photos of our own
          gear soon.
        </p>
      </div>
    </section>
  );
}
