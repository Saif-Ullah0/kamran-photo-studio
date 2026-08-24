"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Calculator, CalendarDays, HelpCircle, ArrowRight, type LucideIcon } from "lucide-react";
import AmbientGlow from "./AmbientGlow";

interface QuickLinkItem {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

const ITEMS: QuickLinkItem[] = [
  {
    href: "/quote",
    icon: Calculator,
    eyebrow: "Custom Pricing",
    title: "Build a custom quote",
    description: "Pick your days, crew, and equipment — get an instant estimate.",
    cta: "Build your quote",
  },
  {
    href: "/availability",
    icon: CalendarDays,
    eyebrow: "Booking",
    title: "Check availability",
    description: "See open dates and request your event date directly.",
    cta: "Check dates",
  },
  {
    href: "/faq",
    icon: HelpCircle,
    eyebrow: "Questions",
    title: "Common questions",
    description: "Booking, pricing, turnaround time, and what's included.",
    cta: "Read FAQ",
  },
];

export default function QuickLinks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-obsidian py-20 sm:py-28">
      <AmbientGlow className="left-1/2 top-0 -translate-x-1/2" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-charcoal p-7 transition-shadow duration-300 hover:gold-glow"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                  <item.icon className="h-5 w-5 text-gold" strokeWidth={2} />
                </span>
                <p className="mb-1.5 text-xs uppercase tracking-[0.25em] text-gold">
                  {item.eyebrow}
                </p>
                <h3 className="mb-2 font-display text-xl text-offwhite">{item.title}</h3>
                <p className="flex-1 text-sm text-slate">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-offwhite">
                  {item.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
