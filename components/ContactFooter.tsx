"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Youtube, MessageCircle, Send } from "lucide-react";
import { SITE, waLink } from "@/lib/data";

export default function ContactFooter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  // No backend wired yet — this opens the visitor's mail client with the
  // message prefilled. Swap for a POST to an API route / email service
  // (e.g. Resend, Formspree) when you're ready to collect leads server-side.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const details = form.get("details");
    const body = `Name: ${name}\nEmail: ${email}\n\n${details}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      "New project inquiry — " + name
    )}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <section id="contact" ref={ref} className="relative bg-obsidian pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Get in Touch</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Let&apos;s plan your next shoot
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-charcoal p-6 sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-slate">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite placeholder:text-slate/50 outline-none transition-colors focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-slate">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite placeholder:text-slate/50 outline-none transition-colors focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-slate">
                  Project Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={4}
                  placeholder="Tell us about your shoot — date, location, package..."
                  className="w-full resize-none rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite placeholder:text-slate/50 outline-none transition-colors focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-obsidian transition-transform hover:scale-[1.01]"
              >
                <Send className="h-4 w-4" strokeWidth={2.5} />
                Send Message
              </button>
              {status === "sent" && (
                <p className="text-center text-xs text-slate">
                  Opening your mail client — thanks for reaching out.
                </p>
              )}
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Studio location"
                src={SITE.mapsEmbedSrc}
                width="100%"
                height="260"
                style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.85)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-2xl border border-line bg-charcoal p-6 text-sm text-slate">
              <p className="text-offwhite">{SITE.address}</p>
              <p className="mt-2">{SITE.phoneDisplay}</p>
              <p>{SITE.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-line p-3 text-slate transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full border border-line p-3 text-slate transition-colors hover:border-gold hover:text-gold"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={waLink("Hi Kamran, I'd like to know more about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-line p-3 text-slate transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 border-t border-line py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 text-center sm:px-8">
          <p className="font-display text-lg text-offwhite">Kamran Photo Studio</p>
          <p className="text-xs text-slate">
            © 2026 Kamran Photo Studio. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
