"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS, GOOGLE_RATING, SITE } from "@/lib/data";
import AmbientGlow from "./AmbientGlow";

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const RatingBadge = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-charcoal px-4 py-1.5 text-xs text-slate">
      <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
      <span className="font-medium text-offwhite">{GOOGLE_RATING.average}</span>
      <span>·</span>
      <span>{GOOGLE_RATING.count} Google Reviews</span>
    </span>
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <AmbientGlow className="left-0 bottom-0 -translate-x-1/3" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Client Words</p>
          <h2 className="mb-4 font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            What clients say
          </h2>
          {SITE.googleMapsListing ? (
            <a
              href={SITE.googleMapsListing}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              {RatingBadge}
            </a>
          ) : (
            RatingBadge
          )}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-charcoal p-7 transition-shadow duration-300 hover:gold-glow"
            >
              <Quote
                className="absolute -top-2 right-5 h-16 w-16 text-gold/[0.07] transition-colors duration-300 group-hover:text-gold/[0.12]"
                fill="currentColor"
                strokeWidth={0}
              />

              <div className="relative mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-gold"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="relative flex-1 font-display text-lg italic leading-relaxed text-offwhite">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="relative mt-6 border-t border-line pt-4">
                <p className="text-sm font-medium text-offwhite">{t.name}</p>
                <p className="text-xs text-slate">{t.context}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
