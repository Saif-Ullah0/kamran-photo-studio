"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  SlidersHorizontal,
  Calculator,
  Send,
  MousePointerClick,
  CalendarDays,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  sliders: SlidersHorizontal,
  calculator: Calculator,
  send: Send,
  pointer: MousePointerClick,
  calendar: CalendarDays,
  message: MessageSquareText,
};

interface Step {
  icon: keyof typeof ICONS;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative bg-obsidian pb-8 sm:pb-12">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 rounded-xl border border-line bg-charcoal p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs font-medium text-gold">
                  {i + 1}
                </span>
                <div>
                  <p className="mb-1 flex items-center gap-2 text-sm font-medium text-offwhite">
                    <Icon className="h-4 w-4 text-gold" strokeWidth={2} />
                    {step.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
