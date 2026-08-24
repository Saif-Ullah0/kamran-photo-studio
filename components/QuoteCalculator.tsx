"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Minus, Plus, MessageCircle } from "lucide-react";
import { RESOURCE_RATES, ADD_ONS, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

interface StepperProps {
  label: string;
  description?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

function Stepper({ label, description, value, onChange, min = 0, max = 10 }: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
      <div>
        <p className="text-sm font-medium text-offwhite">{label}</p>
        {description && <p className="text-xs text-slate">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-slate transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-line disabled:hover:text-slate"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-medium text-offwhite">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-slate transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-line disabled:hover:text-slate"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function QuoteCalculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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

  const crewTotal = RESOURCE_RATES.reduce(
    (sum, r) => sum + (counts[r.id] ?? 0) * r.pricePerDay,
    0
  );
  const dayTotal = days * crewTotal;
  const addOnTotal = ADD_ONS.filter((a) => selectedAddOns.has(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );
  const total = dayTotal + addOnTotal;
  const hasCrew = RESOURCE_RATES.some((r) => (counts[r.id] ?? 0) > 0);

  const message = useMemo(() => {
    const crewLines = RESOURCE_RATES.filter((r) => (counts[r.id] ?? 0) > 0)
      .map((r) => `- ${counts[r.id]} × ${r.label} (${formatPKR(r.pricePerDay)}/day)`)
      .join("\n");
    const addOnLines = ADD_ONS.filter((a) => selectedAddOns.has(a.id))
      .map((a) => `- ${a.label}`)
      .join("\n");
    return [
      `Hi Kamran, I'd like a custom quote for:`,
      `${days} day${days > 1 ? "s" : ""}`,
      crewLines,
      addOnLines ? `Add-ons:\n${addOnLines}` : "",
      `Estimated total: ${formatPKR(total)}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [days, counts, selectedAddOns, total]);

  return (
    <section ref={ref} className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
            Build a Custom Quote
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Not a standard package? Build your own
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate">
            Pick your days, crew, and equipment — see the price update live.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-line bg-charcoal p-6 sm:p-10"
        >
          {/* Days */}
          <div className="mb-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate">Duration</p>
            <Stepper
              label="Days"
              description="Number of shoot days"
              value={days}
              onChange={setDays}
              min={1}
              max={14}
            />
          </div>

          {/* Crew & equipment */}
          <div className="mb-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate">
              Crew &amp; Equipment (per day)
            </p>
            <div className="space-y-2">
              {RESOURCE_RATES.map((resource) => (
                <Stepper
                  key={resource.id}
                  label={resource.label}
                  description={`${resource.description} — ${formatPKR(resource.pricePerDay)}/day`}
                  value={counts[resource.id] ?? 0}
                  onChange={(v) => setCount(resource.id, v)}
                />
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate">
              Add-ons (one-time)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ADD_ONS.map((addOn) => {
                const active = selectedAddOns.has(addOn.id);
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      active ? "border-gold bg-gold/10" : "border-line hover:border-gold/40"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          active ? "border-gold bg-gold" : "border-line"
                        )}
                      >
                        {active && <Check className="h-3 w-3 text-obsidian" strokeWidth={3} />}
                      </span>
                      <span className="text-sm text-offwhite">{addOn.label}</span>
                    </span>
                    <span className="shrink-0 text-xs text-slate">
                      +{formatPKR(addOn.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Breakdown */}
          {hasCrew && (
            <div className="mb-6 space-y-1.5 border-t border-line pt-6 text-sm text-slate">
              {RESOURCE_RATES.filter((r) => (counts[r.id] ?? 0) > 0).map((r) => (
                <div key={r.id} className="flex justify-between">
                  <span>
                    {counts[r.id]} × {r.label} × {days} day{days > 1 ? "s" : ""}
                  </span>
                  <span>{formatPKR(counts[r.id] * r.pricePerDay * days)}</span>
                </div>
              ))}
              {ADD_ONS.filter((a) => selectedAddOns.has(a.id)).map((a) => (
                <div key={a.id} className="flex justify-between">
                  <span>{a.label}</span>
                  <span>{formatPKR(a.price)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total + CTA */}
          <div
            className={cn(
              "flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-between",
              !hasCrew && "border-t border-line"
            )}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate">Estimated total</p>
              <p className="font-display text-3xl text-offwhite">{formatPKR(total)}</p>
              {hasCrew && days > 1 && (
                <p className="mt-0.5 text-xs text-slate">
                  ≈ {formatPKR(Math.round(total / days))} per day
                </p>
              )}
            </div>
            {hasCrew ? (
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-obsidian transition-transform hover:scale-105 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                Send this quote on WhatsApp
              </a>
            ) : (
              <p className="text-xs text-slate/70">
                Add at least one photographer, videographer, or drone above.
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-slate/70 sm:text-left">
            This is a starting point, not a final number — most quotes flex once we talk
            through what you actually need.
          </p>

          {hasCrew && (
            <div className="mt-6 flex flex-col items-center gap-3 border-t border-line pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-xs text-slate">
                A bit more than you expected?{" "}
                <a
                  href={waLink(
                    `Hi Kamran, I built a custom quote (${formatPKR(
                      total
                    )}) but it's a bit more than I was expecting. Can we talk about options that might fit my budget better?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-2 hover:text-gold-soft"
                >
                  Let&apos;s talk about your budget
                </a>
              </p>
              <a
                href="#packages"
                className="text-xs text-slate underline underline-offset-2 hover:text-offwhite"
              >
                Or see our fixed packages →
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}