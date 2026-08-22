"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";
import { NAV_LINKS, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-md bg-obsidian/80 border-b border-line"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="relative h-9 w-36 shrink-0 sm:h-10 sm:w-44"
          aria-label="Kamran Photo Studio — home"
        >
          <Image
            src="/logo.jpeg"
            alt="Kamran Photo Studio"
            fill
            sizes="180px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-10 text-sm text-slate">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative inline-block py-1 transition-colors hover:text-offwhite"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={waLink("Hi Kamran, I'd like to know more about your services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs md:text-sm font-medium text-obsidian transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            WhatsApp Chat
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-offwhite p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-obsidian/95 backdrop-blur-md border-b border-line"
        >
          <ul className="flex flex-col px-5 py-4 gap-4 text-sm text-slate">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 hover:text-offwhite transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={waLink("Hi Kamran, I'd like to know more about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-medium text-obsidian"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                WhatsApp Chat
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
