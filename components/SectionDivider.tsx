"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative mx-auto w-full max-w-7xl px-5 sm:px-8 py-8 sm:py-12", className)}
    >
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line/80 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-3.5 w-3.5 rotate-45 rounded-sm bg-gold/20 blur-[3px]" />
          <div className="absolute h-1.5 w-1.5 rotate-45 bg-gold/90 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
        </div>
      </motion.div>
    </div>
  );
}