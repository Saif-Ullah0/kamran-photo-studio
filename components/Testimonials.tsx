"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";
import { TESTIMONIALS, GOOGLE_RATING, SITE } from "@/lib/data";
import AmbientGlow from "./AmbientGlow";

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  // Infinite marquee scroll logic
  const baseX = useMotionValue(0);
  const speed = 0.003; // Adjust speed here

  useAnimationFrame((_, delta) => {
    if (!isHovered) {
      const moveBy = speed * delta;
      baseX.set(baseX.get() - moveBy);
    }
  });

  // Loop infinite width threshold (percentage wrapper)
  const x = useTransform(baseX, (v) => `${(v % 50)}%`);

  const googleLink = SITE.googleMapsListing || SITE.mapsUrl;

  const RatingBadge = (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-charcoal/80 px-4 py-2 text-xs text-slate backdrop-blur-md transition-colors hover:border-gold/40">
      <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
      <span className="font-semibold text-offwhite">{GOOGLE_RATING.average}</span>
      <span className="text-slate/60">·</span>
      <span>{GOOGLE_RATING.count} Google Reviews</span>
      <ExternalLink className="h-3 w-3 text-gold/60" />
    </span>
  );

  // Tripled items array to ensure seamless infinite looping on all screen widths
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" ref={ref} className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <AmbientGlow className="left-0 bottom-0 -translate-x-1/3" />

      {/* Header Container */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Client Words
          </p>
          <h2 className="mb-4 font-display text-3xl font-light text-offwhite sm:text-4xl md:text-5xl">
            What clients say
          </h2>

          {googleLink ? (
            <a
              href={googleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
            >
              {RatingBadge}
            </a>
          ) : (
            RatingBadge
          )}
        </motion.div>
      </div>

      {/* Marquee Track Wrapper */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        aria-label="Testimonials Carousel"
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Left/Right Edge Fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-obsidian to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-obsidian to-transparent sm:w-32" />

        <motion.div style={{ x }} className="flex w-max gap-6 py-4 pl-4">
          {marqueeItems.map((t, index) => (
            <figure
              key={`${t.id}-${index}`}
              className="group relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-charcoal p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.12)] sm:w-[380px] sm:p-8"
            >
              <Quote
                className="absolute -top-2 right-4 h-16 w-16 text-gold/[0.06] transition-colors duration-300 group-hover:text-gold/[0.12]"
                fill="currentColor"
                strokeWidth={0}
              />

              {/* Star Rating */}
              <div className="relative mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-4 w-4 text-gold"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Quote Content */}
              <blockquote className="relative flex-1 font-display text-base italic leading-relaxed text-offwhite sm:text-lg">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author Attribution */}
              <figcaption className="relative mt-6 border-t border-line/60 pt-4">
                <p className="text-sm font-semibold text-offwhite">{t.name}</p>
                <p className="text-xs text-slate">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}