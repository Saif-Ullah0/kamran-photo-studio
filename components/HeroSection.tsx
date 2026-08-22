"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { waLink, SITE, HERO_IMAGES_LEFT, HERO_IMAGES_RIGHT } from "@/lib/data";
import HeroImageColumn from "./HeroImageColumn";

// R3F + use-sound both touch window/audio APIs, so the badge is loaded
// client-only and never rendered during SSR.
const HeroLensBadge = dynamic(() => import("./HeroLensBadge"), { ssr: false });

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative h-screen w-full overflow-hidden bg-obsidian"
    >
      {/* Mobile-only dimmed backdrop — the marquee columns are hidden below
          md, so this keeps the section from ever reading as flat black. */}
      <div className="absolute inset-0 md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGES_LEFT[0]}
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-obsidian/70" />
      </div>

      <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-[1fr_minmax(300px,620px)_1fr]">
        <HeroImageColumn
          images={HERO_IMAGES_LEFT}
          direction="down"
          className="hidden md:block"
        />

        <div className="flex flex-col items-center justify-center gap-4 px-5 py-20 text-center sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold"
          >
            Lahore, Pakistan
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: easeOut }}
            className="font-display text-[12vw] sm:text-5xl md:text-6xl leading-[0.95] tracking-tight text-offwhite text-balance"
          >
            Kamran Photo Studio
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
            className="flex flex-col items-center gap-2 py-1"
          >
            <HeroLensBadge />
            <p className="text-[10px] uppercase tracking-widest text-slate/70">
              Click the lens
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: easeOut }}
            className="max-w-md text-sm sm:text-base text-slate text-balance"
          >
            Ultra HD 4K Cinema, Aerial Drone Visuals &amp; Editorial
            Photography.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: easeOut }}
            className="max-w-sm text-xs sm:text-sm text-slate/80"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: easeOut }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
          >
            <a
              href="#showreel"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-offwhite transition-colors hover:border-gold hover:text-gold"
            >
              <Play className="h-4 w-4" strokeWidth={2.5} />
              View Showreel
            </a>
            <a
              href={waLink("Hi Kamran, I'd like to book a session.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-obsidian transition-transform hover:scale-105"
            >
              Book Session
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </a>
          </motion.div>
        </div>

        <HeroImageColumn
          images={HERO_IMAGES_RIGHT}
          direction="up"
          className="hidden md:block"
        />
      </div>

      {/* Subtle cinematic grain over the whole hero, purely decorative. */}
      <div className="pointer-events-none absolute inset-0 z-20 noise-overlay opacity-[0.05] mix-blend-overlay" />
    </section>
  );
}
