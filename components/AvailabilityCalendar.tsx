"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { BOOKED_DATES, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const EVENT_TYPES = [
  "Wedding",
  "Portrait Session",
  "Commercial / Brand Shoot",
  "Birthday / Private Event",
  "Other",
];

const SERVICES = [
  { id: "photography", label: "Photography" },
  { id: "videography", label: "Videography" },
  { id: "drone", label: "Drone Coverage" },
];

function toISODate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function formatDateLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface MonthGridProps {
  year: number;
  month: number;
  selectedDates: Set<string>;
  onToggle: (iso: string) => void;
}

function MonthGrid({ year, month, selectedDates, onToggle }: MonthGridProps) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1">
      <p className="mb-4 text-center font-display text-lg text-offwhite">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="pb-1 text-[10px] uppercase tracking-widest text-slate/60">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = toISODate(year, month, day);
          const cellDate = new Date(year, month, day);
          const isPast = cellDate < today;
          const isBooked = BOOKED_DATES.includes(iso);
          const isOpen = !isPast && !isBooked;
          const isSelected = selectedDates.has(iso);

          if (isOpen) {
            return (
              <button
                key={i}
                onClick={() => onToggle(iso)}
                title={formatDateLabel(iso)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg border text-xs transition-all duration-150 sm:text-sm",
                  isSelected
                    ? "border-gold bg-gold font-medium text-obsidian"
                    : "border-gold/30 text-offwhite hover:scale-110 hover:border-gold hover:bg-gold/10"
                )}
              >
                {day}
              </button>
            );
          }

          return (
            <div
              key={i}
              title={isBooked ? `${formatDateLabel(iso)} — already booked` : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs sm:text-sm",
                isPast
                  ? "text-slate/30"
                  : "bg-obsidian text-slate/50 line-through decoration-slate/40"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [services, setServices] = useState<Set<string>>(new Set());
  const [details, setDetails] = useState("");

  const { year, month, nextYear, nextMonth } = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    const next = new Date(base);
    next.setMonth(next.getMonth() + 1);
    return {
      year: base.getFullYear(),
      month: base.getMonth(),
      nextYear: next.getFullYear(),
      nextMonth: next.getMonth(),
    };
  }, [monthOffset]);

  function toggleDate(iso: string) {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) next.delete(iso);
      else next.add(iso);
      return next;
    });
  }

  function toggleService(id: string) {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const sortedDates = useMemo(() => Array.from(selectedDates).sort(), [selectedDates]);
  const canSubmit = sortedDates.length > 0;

  const message = useMemo(() => {
    const dateLines = sortedDates.map(formatDateLabel).join(", ");
    const serviceLines = SERVICES.filter((s) => services.has(s.id))
      .map((s) => s.label)
      .join(", ");
    return [
      "Hi Kamran, I'd like to request availability for:",
      dateLines ? `Dates: ${dateLines}` : "",
      `Event type: ${eventType}`,
      serviceLines ? `Service needed: ${serviceLines}` : "",
      details ? `Details: ${details}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [sortedDates, eventType, services, details]);

  return (
    <section ref={ref} className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Availability</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-offwhite">
            Request your dates
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate">
            Select one or more open dates, tell us about the event, and send it straight to
            WhatsApp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-line bg-charcoal p-6 sm:p-10"
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
              disabled={monthOffset === 0}
              aria-label="Previous month"
              className="rounded-full border border-line p-2 text-slate transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-line disabled:hover:text-slate"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-slate">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-gold/60" /> Open
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gold" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-obsidian ring-1 ring-slate/40" /> Booked
              </span>
            </div>
            <button
              onClick={() => setMonthOffset((v) => v + 1)}
              aria-label="Next month"
              className="rounded-full border border-line p-2 text-slate transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <MonthGrid year={year} month={month} selectedDates={selectedDates} onToggle={toggleDate} />
            <MonthGrid
              year={nextYear}
              month={nextMonth}
              selectedDates={selectedDates}
              onToggle={toggleDate}
            />
          </div>

          {/* Selected dates */}
          {sortedDates.length > 0 && (
            <div className="mt-8 border-t border-line pt-6">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate">
                Selected dates ({sortedDates.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedDates.map((iso) => (
                  <button
                    key={iso}
                    onClick={() => toggleDate(iso)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-offwhite transition-colors hover:border-gold"
                  >
                    {formatDateLabel(iso)}
                    <X className="h-3 w-3 text-gold" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event details form */}
          <div className="mt-8 space-y-5 border-t border-line pt-6">
            <div>
              <label htmlFor="event-type" className="mb-2 block text-xs uppercase tracking-widest text-slate">
                Event type
              </label>
              <select
                id="event-type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-gold"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-slate">Service needed</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((service) => {
                  const active = services.has(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs sm:text-sm transition-colors",
                        active
                          ? "border-gold bg-gold text-obsidian font-medium"
                          : "border-line text-slate hover:border-gold/50 hover:text-offwhite"
                      )}
                    >
                      {service.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-slate">
                Tell us more (optional)
              </label>
              <textarea
                id="details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Venue, guest count, timing, anything else that helps us prepare..."
                className="w-full resize-none rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite placeholder:text-slate/50 outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-line pt-6 text-center">
            {canSubmit ? (
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-obsidian transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                Send request on WhatsApp
              </a>
            ) : (
              <p className="text-xs text-slate/70">Select at least one date above to continue.</p>
            )}
            <p className="text-xs text-slate/70">
              Dates shown as booked are updated by hand, not live-synced — we&apos;ll confirm
              everything when we reply.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}