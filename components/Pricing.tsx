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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [category, setCategory] = useState<PackageCategoryId>("photography");
  const tiers = PACKAGES[category];
  const categoryLabel =
    PACKAGE_CATEGORIES.find((c) => c.id === category)?.label ?? "";

  return (
    <section id="packages" ref={ref} className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <AmbientGlow className="right-0 top-1/4 translate-x-1/3" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Packages</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Built for how you want it captured
          </h2>
        </motion.div>

        {/* Category switch — sliding gold pill tracks the active tab */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 flex w-fit items-center gap-1 rounded-full border border-line bg-charcoal p-1"
        >
          {PACKAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
                category === cat.id ? "text-obsidian" : "text-slate hover:text-offwhite"
              )}
            >
              {category === cat.id && (
                <motion.span
                  layoutId="package-category-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-gold"
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
                className={cn(
                  "group relative flex flex-col rounded-2xl border p-8 transition-shadow duration-300 hover:gold-glow",
                  tier.featured
                    ? "border-gold/50 bg-charcoal"
                    : "border-line bg-charcoal/60"
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-obsidian">
                    Most Booked
                  </span>
                )}

                <span className="text-xs uppercase tracking-widest text-gold">
                  {tier.duration}
                </span>
                <h3 className="mt-2 font-display text-2xl text-offwhite">
                  {categoryLabel}
                </h3>
                <p className="mt-2 text-sm text-slate">{tier.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-3xl text-offwhite">{tier.price}</span>
                  <span className="text-xs text-slate">{tier.cadence}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(
                    `Hi Kamran, I'm interested in the ${tier.duration} ${categoryLabel} package.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02]",
                    tier.featured
                      ? "bg-gold text-obsidian"
                      : "border border-line text-offwhite hover:border-gold hover:text-gold"
                  )}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                  Book via WhatsApp
                </a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
