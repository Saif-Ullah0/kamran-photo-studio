"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, MessageCircle, HelpCircle, ArrowRight, Camera, Video, Film, Aperture } from "lucide-react";
import { RESOURCE_RATES, ADD_ONS, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

// --- Helpers ---
function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

// Map icons to crew types for studio context
const CREW_ICONS: Record<string, React.ReactNode> = {
  photographer: <Camera className="h-4 w-4 text-amber-400" />,
  videographer: <Video className="h-4 w-4 text-amber-400" />,
  drone: <Film className="h-4 w-4 text-amber-400" />,
};

// --- Animated Price Number ---
function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="inline-block"
    >
      {formatPKR(value)}
    </motion.span>
  );
}

// --- Stepper Sub-Component ---
interface StepperProps {
  id?: string;
  label: string;
  description?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  unitPrice?: number;
}

function Stepper({
  id,
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 10,
  unitPrice,
}: StepperProps) {
  return (
    <div className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(251,191,36,0.05)] sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        {id && CREW_ICONS[id] && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
            {CREW_ICONS[id]}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold tracking-wide text-white">{label}</p>
            {unitPrice !== undefined && unitPrice > 0 && (
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                {formatPKR(unitPrice)}/day
              </span>
            )}
          </div>
          {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 p-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            aria-label={`Decrease ${label}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-slate-300 transition-colors hover:bg-amber-400/20 hover:text-amber-300 disabled:pointer-events-none disabled:opacity-25"
          >
            <Minus className="h-3.5 w-3.5" />
          </motion.button>

          <span className="w-8 text-center text-sm font-bold font-mono text-white">
            {value}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            aria-label={`Increase ${label}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-slate-300 transition-colors hover:bg-amber-400/20 hover:text-amber-300 disabled:pointer-events-none disabled:opacity-25"
          >
            <Plus className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// --- Main Calculator Component ---
export default function QuoteCalculator() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  const [days, setDays] = useState(1);
  const [counts, setCounts] = useState<Record<string, number>>({
    photographer: 1,
    videographer: 0,
    drone: 0,
  });
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  function setCount(id: string, value: number) {
    setCounts((prev) => ({ ...prev, [id]: value }));
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // --- Calculations ---
  const crewTotalPerDay = useMemo(() => {
    return RESOURCE_RATES.reduce((sum, r) => sum + (counts[r.id] ?? 0) * r.pricePerDay, 0);
  }, [counts]);

  const totalCrewCost = days * crewTotalPerDay;

  const totalAddOnCost = useMemo(() => {
    return ADD_ONS.filter((a) => selectedAddOns.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddOns]);

  const total = totalCrewCost + totalAddOnCost;
  const hasCrew = useMemo(() => RESOURCE_RATES.some((r) => (counts[r.id] ?? 0) > 0), [counts]);

  // --- Dynamic WhatsApp Payload ---
  const message = useMemo(() => {
    const crewLines = RESOURCE_RATES.filter((r) => (counts[r.id] ?? 0) > 0)
      .map((r) => `• ${counts[r.id]}x ${r.label} (${formatPKR(r.pricePerDay)}/day)`)
      .join("\n");

    const addOnLines = ADD_ONS.filter((a) => selectedAddOns.has(a.id))
      .map((a) => `• ${a.label} (${formatPKR(a.price)})`)
      .join("\n");

    return [
      `📸 *Photo Studio Quote Inquiry*`,
      `⏱️ Duration: ${days} Day${days > 1 ? "s" : ""}`,
      `🎥 Crew & Gear:\n${crewLines || "None selected"}`,
      addOnLines ? `✨ Add-ons:\n${addOnLines}` : "",
      `💰 Total Estimated Quote: ${formatPKR(total)}`,
      `Hi! I configured this custom shoot package. Can we discuss date availability?`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [days, counts, selectedAddOns, total]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-[#070709] py-24 sm:py-32">
      {/* Dynamic Background Illuminating Glow Effects */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-purple-600/10 blur-[130px]"
      />
      <div className="pointer-events-none absolute -left-20 bottom-10 -z-10 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <Aperture className="h-3.5 w-3.5 animate-spin-slow" /> Studio Pricing Estimator
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-white sm:text-5xl">
            Estimate Your Shoot
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
            Select crew size, multi-day coverage, and post-production upgrades to generate an instant shoot estimate.
          </p>
        </motion.div>

        {/* Main Glass Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:p-10"
        >
          {/* Section 1: Shoot Duration */}
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400/80">
              01. Shoot Duration
            </h3>
            <Stepper
              label="Total Shoot Days"
              description="Number of continuous production days required"
              value={days}
              onChange={setDays}
              min={1}
              max={14}
            />
          </div>

          {/* Section 2: Crew & Hardware */}
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400/80">
              02. Studio Crew & Gear (Per Day)
            </h3>
            <div className="space-y-3">
              {RESOURCE_RATES.map((resource) => (
                <Stepper
                  key={resource.id}
                  id={resource.id}
                  label={resource.label}
                  description={resource.description}
                  unitPrice={resource.pricePerDay}
                  value={counts[resource.id] ?? 0}
                  onChange={(v) => setCount(resource.id, v)}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Add-ons */}
          <div className="mb-10">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400/80">
              03. Post-Production & Upgrades
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADD_ONS.map((addOn) => {
                const active = selectedAddOns.has(addOn.id);
                return (
                  <motion.button
                    key={addOn.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleAddOn(addOn.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-300",
                      active
                        ? "border-amber-400 bg-amber-400/10 shadow-[0_0_25px_rgba(251,191,36,0.15)]"
                        : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.03]"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          active
                            ? "border-amber-400 bg-amber-400 text-black"
                            : "border-white/20 bg-black/60"
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </span>
                      <span className="text-sm font-medium text-white">{addOn.label}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-semibold text-slate-300">
                      +{formatPKR(addOn.price)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Itemized Calculation Summary */}
          <AnimatePresence>
            {hasCrew && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-white/10 pt-6"
              >
                <div className="space-y-2 font-mono text-xs text-slate-400">
                  {RESOURCE_RATES.filter((r) => (counts[r.id] ?? 0) > 0).map((r) => (
                    <div key={r.id} className="flex items-center justify-between">
                      <span>
                        {counts[r.id]}x {r.label} ({days} day{days > 1 ? "s" : ""})
                      </span>
                      <span className="text-slate-200">
                        {formatPKR(counts[r.id] * r.pricePerDay * days)}
                      </span>
                    </div>
                  ))}
                  {ADD_ONS.filter((a) => selectedAddOns.has(a.id)).map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-amber-300/90">
                      <span>Upgrade: {a.label}</span>
                      <span>{formatPKR(a.price)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grand Total & CTA */}
          <div
            className={cn(
              "mt-6 flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between",
              hasCrew ? "border-t border-white/10" : ""
            )}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Estimated Total</p>
              <div className="flex items-baseline gap-2 font-serif text-3xl font-medium text-white sm:text-4xl">
                <AnimatedNumber value={total} />
              </div>
              {hasCrew && days > 1 && (
                <p className="mt-1 text-xs text-slate-400 font-mono">
                  Avg. {formatPKR(Math.round(total / days))} per day
                </p>
              )}
            </div>

            {hasCrew ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.5)]"
              >
                <MessageCircle className="h-4 w-4 fill-black" />
                Reserve Quote on WhatsApp
              </motion.a>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                <HelpCircle className="h-4 w-4 shrink-0" />
                Select at least one photographer or crew member above to calculate quote.
              </div>
            )}
          </div>

          {/* Footer Action Links */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="text-center sm:text-left">
              Need custom terms or budget adjustments?{" "}
              <a
                href={waLink(
                  `Hi! I created a quote estimate of ${formatPKR(
                    total
                  )}, but I would like to discuss bespoke pricing for my target budget.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline underline-offset-4 hover:text-amber-300"
              >
                Discuss tailored budgets
              </a>
            </p>
            <a
              href="#packages"
              className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white"
            >
              Explore fixed studio packages <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}