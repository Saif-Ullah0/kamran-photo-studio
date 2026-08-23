"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ABOUT_IMAGE, STATS } from "@/lib/data";
import AnimatedCounter from "./AnimatedCounter";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ABOUT_IMAGE}
            alt="Kamran with cinema gear on location"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 text-xs uppercase tracking-[0.3em] text-gold"
          >
            About the Studio
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-offwhite text-balance"
          >
            A decade behind the lens, shaping how Lahore is remembered on
            screen.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-slate"
          >
            Kamran Photo Studio pairs cinema-grade camera bodies with a
            fully licensed aerial drone fleet, delivering an entirely 4K
            workflow from first frame to final grade. Every project — a
            wedding, a brand film, a portrait sitting — is shot and edited
            with the same discipline you&apos;d expect on a feature set.
          </motion.p>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="font-display text-3xl sm:text-4xl text-offwhite">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
