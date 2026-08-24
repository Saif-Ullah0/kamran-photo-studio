"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CalendarDays,
  Package,
  Clock,
  Wallet,
  MapPin,
  Sparkles,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { FAQS, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";
import AmbientGlow from "./AmbientGlow";

const FAQ_ICONS: Record<string, LucideIcon> = {
  f1: CalendarDays,
  f2: Package,
  f3: Clock,
  f4: Wallet,
  f5: MapPin,
  f6: Sparkles,
};

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section id="faq" ref={ref} className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <AmbientGlow className="left-1/2 top-0 -translate-x-1/2" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Common questions
          </h2>
        </motion.div>

        <div className="divide-y divide-line rounded-2xl border border-line bg-charcoal">
          {FAQS.map((faq, i) => {
            const open = openId === faq.id;
            const Icon = FAQ_ICONS[faq.id] ?? Sparkles;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={cn("transition-colors duration-300", open && "bg-gold/[0.04]")}
              >
                <button
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                      open ? "border-gold bg-gold/10" : "border-line"
                    )}
                  >
                    <Icon className="h-4 w-4 text-gold" strokeWidth={2} />
                  </span>
                  <span className="flex-1 text-sm sm:text-base font-medium text-offwhite">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-gold transition-transform duration-300",
                      open && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-slate sm:px-6 sm:pl-[4.5rem]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-sm text-slate">Still have a question?</p>
          <a
            href={waLink("Hi Kamran, I have a question that wasn't covered in your FAQ.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:border-gold hover:text-gold"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Ask us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
