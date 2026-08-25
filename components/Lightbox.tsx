"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PortfolioItem } from "@/lib/data";
import { ASPECT_DIMENSIONS } from "@/lib/utils";

interface LightboxProps {
  items: PortfolioItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export default function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const current = index !== null ? items[index] : null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-obsidian/97 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute top-6 right-6 rounded-full border border-line p-2 text-offwhite transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-8 rounded-full border border-line p-2 text-offwhite transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-8 rounded-full border border-line p-2 text-offwhite transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <motion.figure
            key={current.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-4xl"
          >
            <Image
              src={current.image}
              alt={current.title}
              width={ASPECT_DIMENSIONS[current.aspect].width}
              height={ASPECT_DIMENSIONS[current.aspect].height}
              sizes="(max-width: 1024px) 90vw, 900px"
              className="max-h-[75vh] w-auto rounded-lg border border-line object-contain"
            />
            <figcaption className="mt-4 flex flex-col items-center gap-1 text-center">
              <span className="font-display text-lg text-offwhite">{current.title}</span>
              <span className="text-xs uppercase tracking-widest text-gold">
                {current.exif}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
