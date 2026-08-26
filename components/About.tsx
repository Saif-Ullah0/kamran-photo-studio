"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ABOUT_IMAGE, STATS } from "@/lib/data";
import AnimatedCounter from "./AnimatedCounter";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-obsidian py-20 sm:py-28 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        
        {/* Featured Portrait Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-charcoal transition-colors duration-500 hover:border-gold/40"
        >
          <Image
            src={ABOUT_IMAGE}
            alt="Kamran with cinema gear on location"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
        </motion.div>

        {/* Studio Details Content */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
          >
            About the Studio
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl font-light leading-[1.1] text-offwhite text-balance sm:text-4xl md:text-5xl"
          >
            A decade behind the lens, shaping how Lahore is remembered on screen.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-slate sm:text-base"
          >
            Kamran Photo Studio pairs cinema-grade camera bodies with a fully
            licensed aerial drone fleet, delivering an entirely 4K workflow from
            first frame to final grade. Every project — a wedding, a brand film,
            a portrait sitting — is shot and edited with the same discipline
            you&apos;d expect on a feature set.
          </motion.p>

          {/* Key Metrics & Statistics Grid */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line/60 pt-8 sm:mt-12 sm:gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="font-display text-2xl font-light text-offwhite sm:text-3xl md:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-[11px] font-medium leading-tight text-slate sm:text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}