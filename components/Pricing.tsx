"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import {
  PACKAGE_CATEGORIES,
  PACKAGES,
  waLink,
  type PackageCategoryId,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import AmbientGlow from "./AmbientGlow";

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [category, setCategory] = useState<PackageCategoryId>("photography");

  const tiers = PACKAGES[category] ?? [];
  const categoryLabel =
    PACKAGE_CATEGORIES.find((c) => c.id === category)?.label ?? "Package";

  return (
    <section id="packages" ref={ref} className="relative overflow-hidden bg-obsidian py-20 sm:py-28 md:py-32">
      <AmbientGlow className="right-0 top-1/4 translate-x-1/3" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Packages
          </p>
          <h2 className="font-display text-3xl font-light text-offwhite sm:text-4xl md:text-5xl">
            Built for how you want it captured
          </h2>
        </motion.div>

        {/* Responsive Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="no-scrollbar -mx-4 mb-12 flex items-center justify-start overflow-x-auto px-4 sm:mx-auto sm:mb-16 sm:w-fit sm:justify-center sm:px-0"
        >
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-charcoal/80 p-1.5 backdrop-blur-md">
            {PACKAGE_CATEGORIES.map((cat) => {
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                    isActive ? "text-obsidian" : "text-slate hover:text-offwhite"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="package-category-pill"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gold"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {tiers.map((tier, i) => {
              const isFeatured = Boolean(tier.featured);

              return (
                <motion.div
                  key={tier.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 sm:p-8",
                    isFeatured
                      ? "border-gold/60 bg-charcoal shadow-[0_0_30px_rgba(251,191,36,0.08)] sm:hover:-translate-y-2"
                      : "border-line bg-charcoal/60 hover:border-gold/40 sm:hover:-translate-y-2"
                  )}
                >
                  <div>
                    {/* Featured Badge */}
                    {isFeatured && (
                      <span className="absolute -top-3 left-6 rounded-full bg-gold px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-obsidian shadow-md">
                        Most Booked
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                        {tier.duration}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-normal text-offwhite">
                      {(tier as { name?: string }).name || categoryLabel}
                    </h3>
                    
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {tier.description}
                    </p>

                    {/* Price Display */}
                    <div className="mt-6 flex items-baseline gap-2 border-b border-line/60 pb-6">
                      <span className="font-display text-3xl font-light text-offwhite sm:text-4xl">
                        {tier.price}
                      </span>
                      {tier.cadence && (
                        <span className="text-xs text-slate">{tier.cadence}</span>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking CTA Button */}
                  <a
                    href={waLink(
                      `Hi Kamran, I'm interested in the ${tier.duration} ${categoryLabel} package.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "mt-8 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:text-sm",
                      isFeatured
                        ? "bg-gold text-obsidian shadow-lg hover:bg-gold/90 hover:shadow-gold/20"
                        : "border border-line bg-obsidian/40 text-offwhite hover:border-gold hover:bg-gold hover:text-obsidian"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                    Book via WhatsApp
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}