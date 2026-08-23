"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";
import { MEDIA } from "@/lib/data";

export default function ShowreelSection() {
  const [open, setOpen] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="showreel"
      ref={ref}
      className="relative h-[75vh] w-full overflow-hidden bg-obsidian"
    >
      {/* Fallback photo, always present underneath — if the video is
          missing/broken (wrong path, unsupported format, still loading)
          this shows instead of a flat black box. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MEDIA.showreelFallbackImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {!videoFailed && (
        <video
          src={MEDIA.showreelBackground}
          poster={MEDIA.showreelBackgroundPoster || undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/30 to-obsidian/80" />
      <div className="absolute inset-0 noise-overlay opacity-[0.08] mix-blend-overlay pointer-events-none" />

      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group absolute inset-0 flex flex-col items-center justify-center gap-6 text-center"
      >
        <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-gold/50"
          />
          <span className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/60 bg-obsidian/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold/10">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 text-gold" fill="currentColor" strokeWidth={0} />
          </span>
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-offwhite">
          Elevate Your Story
        </h2>
        <p className="max-w-md px-6 text-sm sm:text-base text-slate">
          A full showreel of our 4K cinema and aerial drone work — watch it in
          full screen.
        </p>
      </motion.button>

      <VideoModal open={open} onClose={() => setOpen(false)} src={MEDIA.showreelFull} />
    </section>
  );
}