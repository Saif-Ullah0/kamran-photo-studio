"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { SITE, waLink } from "@/lib/data";

export default function ContactFooter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const details = formData.get("details") as string;

    const body = `Name: ${name}\nEmail: ${email}\n\nProject Details:\n${details}`;
    
    // Fallback mailto trigger for static site setups
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      "New project inquiry — " + name
    )}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      setStatus("sent");
      form.reset();
    }, 600);
  };

  const handleCopy = (text: string, field: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" ref={ref} className="relative bg-[#070709] pt-24 sm:pt-32">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Get in Touch
          </p>
          <h2 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            Let&apos;s plan your next shoot
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Have a project in mind? Fill out the form or reach out directly on WhatsApp.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Inquiry Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-slate-400">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-slate-400">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-slate-400">
                  Project Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={4}
                  placeholder="Tell us about your shoot — estimated date, preferred location, package type..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-shadow hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? "Preparing Mail..." : "Send Message"}
              </motion.button>

              <AnimatePresence>
                {status === "sent" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Opening your mail client to dispatch message...
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="text-emerald-400 hover:underline"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Right Column - Map & Quick Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Interactive Embedded Map */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <iframe
                title="Studio location"
                src={SITE.mapsEmbedSrc}
                width="100%"
                height="240"
                style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.85)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-60" />
              <a
                href={SITE.mapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-xs text-amber-300 backdrop-blur-md transition-colors hover:border-amber-400 hover:bg-black"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> Get Directions
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>

            {/* Quick Contact Details */}
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-slate-300 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <p className="font-semibold text-white">{SITE.address}</p>
                  <p className="text-xs text-slate-400">Available by appointment for studio visits</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                  <span className="text-slate-200">{SITE.phoneDisplay}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(SITE.phoneDisplay, "phone")}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "phone" ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                  <span className="text-slate-200">{SITE.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(SITE.email, "email")}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-white/10 bg-black/40 p-3 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full border border-white/10 bg-black/40 p-3 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={waLink("Hi Kamran, I'd like to know more about your studio services.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-white/10 bg-black/40 p-3 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Navigation & Copyright */}
      <div className="mt-16 border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <Link href="/#portfolio" className="transition-colors hover:text-amber-400">
              Portfolio
            </Link>
            <Link href="/#packages" className="transition-colors hover:text-amber-400">
              Packages
            </Link>
            <Link href="/quote" className="transition-colors hover:text-amber-400">
              Get a Quote
            </Link>
            <Link href="/availability" className="transition-colors hover:text-amber-400">
              Availability
            </Link>
            <Link href="/#about" className="transition-colors hover:text-amber-400">
              About
            </Link>
            <Link href="/#team" className="transition-colors hover:text-amber-400">
              Team
            </Link>
            <Link href="/faq" className="transition-colors hover:text-amber-400">
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-serif text-lg text-white">Kamran Photo Studio</p>
            <p className="text-xs text-slate-500">
              © 2026 Kamran Photo Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}