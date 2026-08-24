"use client";

import { motion } from "framer-motion";
import { Calculator, CalendarDays, HelpCircle, type LucideIcon } from "lucide-react";
import BackButton from "./BackButton";

const ICONS: Record<string, LucideIcon> = {
  calculator: Calculator,
  calendar: CalendarDays,
  help: HelpCircle,
};

interface PageHeroProps {
  icon: keyof typeof ICONS;
  eyebrow: string;
  title: string;
  description: string;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function PageHero({ icon, eyebrow, title, description }: PageHeroProps) {
  const Icon = ICONS[icon];

  return (
    <section className="relative overflow-hidden bg-obsidian pb-8 pt-32 sm:pb-12 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-[0.04] mix-blend-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <div className="mb-8 flex justify-center">
            <BackButton fallbackHref="/" />
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10"
        >
          <Icon className="h-6 w-6 text-gold" strokeWidth={2} />
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: easeOut }}
          className="mb-3 text-xs uppercase tracking-[0.3em] text-gold"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: easeOut }}
          className="mb-4 font-display text-4xl text-offwhite sm:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
          className="mx-auto max-w-xl text-sm text-slate sm:text-base"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}