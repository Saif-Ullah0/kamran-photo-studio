"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/data";

export default function TeamMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Doubled so the horizontal loop is seamless at -50%.
  const doubled = [...TEAM_MEMBERS, ...TEAM_MEMBERS];

  return (
    <section
      id="team"
      ref={ref}
      className="relative overflow-hidden bg-obsidian py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">The People</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Meet the studio
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate">
            Click a face to read their story.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max flex-nowrap gap-5 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((member, i) => (
            <Link
              key={`${member.id}-${i}`}
              href={`/team/${member.id}`}
              className="group relative w-56 sm:w-64 shrink-0 overflow-hidden rounded-2xl border border-line bg-charcoal transition-colors hover:border-gold/50"
            >
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-lg text-offwhite">{member.name}</p>
                <p className="text-xs uppercase tracking-widest text-gold">
                  {member.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
