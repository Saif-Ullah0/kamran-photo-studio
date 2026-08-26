"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { PORTFOLIO_ITEMS, PORTFOLIO_FILTERS, type PortfolioCategory } from "@/lib/data";
import { cn, ASPECT_DIMENSIONS } from "@/lib/utils";
import Lightbox from "./Lightbox";

export default function PortfolioGrid() {
  const [active, setActive] = useState<"All" | PortfolioCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = useMemo(
    () =>
      active === "All"
        ? PORTFOLIO_ITEMS
        : PORTFOLIO_ITEMS.filter((item) => item.category === active),
    [active]
  );

  return (
    <section id="portfolio" ref={ref} className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col items-start gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Selected Work</p>
            <h2 className="font-display text-3xl text-offwhite sm:text-4xl md:text-5xl">
              A frame from every story
            </h2>
          </div>

          {/* Filter Bar with Horizontal Scroll on Mobile */}
          <div className="no-scrollbar -mx-5 flex w-[calc(100%+2.5rem)] items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0">
            {PORTFOLIO_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                className={cn(
                  "relative shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors sm:text-sm",
                  active === filter
                    ? "border-gold font-medium text-obsidian"
                    : "border-line text-slate hover:border-gold/50 hover:text-offwhite"
                )}
              >
                {active === filter && (
                  <motion.span
                    layoutId="portfolio-filter-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gold"
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Columns Layout */}
        <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.button
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxIndex(PORTFOLIO_ITEMS.indexOf(item))}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line bg-charcoal text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={ASPECT_DIMENSIONS[item.aspect].width}
                  height={ASPECT_DIMENSIONS[item.aspect].height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Card Hover Caption Overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-obsidian/95 via-obsidian/60 to-transparent p-4 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  <p className="text-sm font-medium text-offwhite">{item.title}</p>
                  <p className="mt-1 text-xs tracking-wide text-gold">{item.exif}</p>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 rounded-full bg-obsidian/60 px-3 py-1 text-[10px] uppercase tracking-widest text-offwhite backdrop-blur-sm">
                  {item.category}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Lightbox
        items={PORTFOLIO_ITEMS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}