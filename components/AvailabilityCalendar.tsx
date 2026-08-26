"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  Calendar as CalendarIcon,
  Clock,
  Camera,
  MapPin,
} from "lucide-react";
import { BOOKED_DATES, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_TYPES = [
  "Wedding / Reception",
  "Portrait & Fashion Session",
  "Commercial / Brand Campaign",
  "Product & Studio Shoot",
  "Birthday / Private Event",
  "Other Custom Project",
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning / Golden Hour (6 AM - 11 AM)" },
  { id: "afternoon", label: "Afternoon / Studio (12 PM - 4 PM)" },
  { id: "sunset", label: "Sunset / Evening (5 PM - 10 PM)" },
  { id: "full_day", label: "Full Day Coverage" },
];

const SERVICES = [
  { id: "photography", label: "Photography" },
  { id: "videography", label: "Videography / Cinema" },
  { id: "drone", label: "Aerial / Drone Footage" },
  { id: "studio_rental", label: "Studio Space Rental" },
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
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const cells: (number | null)[] = useMemo(
    () => [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ],
    [firstWeekday, daysInMonth]
  );

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1">
      <p className="mb-4 text-center font-serif text-lg font-medium text-white tracking-wide">
        {monthLabel}
      </p>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="pb-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
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
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(iso)}
                title={formatDateLabel(iso)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl border text-xs font-mono font-medium transition-all duration-200 sm:text-sm",
                  isSelected
                    ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                    : "border-amber-400/20 bg-black/40 text-slate-200 hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-white"
                )}
              >
                {day}
              </motion.button>
            );
          }

          return (
            <div
              key={i}
              title={isBooked ? `${formatDateLabel(iso)} — reserved` : "Past date"}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl text-xs sm:text-sm font-mono",
                isPast
                  ? "text-slate-600/40 cursor-not-allowed"
                  : "bg-white/[0.02] text-slate-500 line-through decoration-amber-500/50 cursor-not-allowed border border-white/5"
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[3].id);
  const [services, setServices] = useState<Set<string>>(new Set(["photography"]));
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

  // --- Dynamic WhatsApp Payload ---
  const message = useMemo(() => {
    const dateLines = sortedDates.map(formatDateLabel).join(", ");
    const serviceLines = SERVICES.filter((s) => services.has(s.id))
      .map((s) => s.label)
      .join(", ");
    const slotLabel = TIME_SLOTS.find((t) => t.id === selectedTimeSlot)?.label;

    return [
      `📸 *Studio Date Request*`,
      `🗓️ Requested Dates: ${dateLines || "None selected"}`,
      `⏰ Preferred Time: ${slotLabel || "Flexible"}`,
      `🎉 Event Type: ${eventType}`,
      `⚙️ Services Needed: ${serviceLines || "General shoot"}`,
      details ? `📝 Shoot Notes: ${details}` : "",
      `Hi Kamran! I checked your calendar and would like to confirm availability for these dates.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [sortedDates, eventType, services, selectedTimeSlot, details]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#070709] py-24 sm:py-32">
      {/* Background Illuminating Glow Effects */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-amber-700/10 blur-[140px]"
      />
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <CalendarIcon className="h-3.5 w-3.5" /> Real-time Availability
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-white sm:text-5xl">
            Reserve Your Dates
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400 sm:text-base">
            Select one or more available shoot dates, configure time slot preferences, and send your request straight to WhatsApp.
          </p>
        </motion.div>

        {/* Main Glass Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:p-10"
        >
          {/* Calendar Header Navigation */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
              disabled={monthOffset === 0}
              aria-label="Previous month"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300 disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </motion.button>

            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-amber-400/80 bg-amber-400/20" /> Open
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/20" /> Booked
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMonthOffset((v) => v + 1)}
              aria-label="Next month"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
            >
              Next <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Dual Month Calendar Grid */}
          <div className="grid gap-8 sm:grid-cols-2">
            <MonthGrid year={year} month={month} selectedDates={selectedDates} onToggle={toggleDate} />
            <MonthGrid
              year={nextYear}
              month={nextMonth}
              selectedDates={selectedDates}
              onToggle={toggleDate}
            />
          </div>

          {/* Selected Dates Display */}
          <AnimatePresence>
            {sortedDates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 border-t border-white/10 pt-6"
              >
                <p className="mb-3 text-xs uppercase tracking-widest text-amber-400/80 font-bold">
                  Selected Shoot Dates ({sortedDates.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortedDates.map((iso) => (
                    <motion.button
                      key={iso}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDate(iso)}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs text-amber-200 transition-colors hover:border-amber-400 hover:bg-amber-400/20"
                    >
                      {formatDateLabel(iso)}
                      <X className="h-3 w-3 text-amber-400" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Details Form */}
          <div className="mt-8 space-y-6 border-t border-white/10 pt-6">
            {/* Event Type & Slot Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="event-type" className="mb-2 block text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Event Category
                </label>
                <select
                  id="event-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-[#0f0f14] text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="time-slot" className="mb-2 block text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Time Slot Preference
                </label>
                <select
                  id="time-slot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id} className="bg-[#0f0f14] text-white">
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Toggles */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-amber-400" /> Studio Coverage Required
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SERVICES.map((service) => {
                  const active = services.has(service.id);
                  return (
                    <motion.button
                      key={service.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleService(service.id)}
                      className={cn(
                        "rounded-xl border px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                        active
                          ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                          : "border-white/10 bg-black/40 text-slate-300 hover:border-amber-400/40 hover:text-white"
                      )}
                    >
                      {service.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> Venue & Creative Notes
              </label>
              <textarea
                id="details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Mention studio venue preference, outdoor location details, guest count, or moodboard references..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* WhatsApp Submit Action */}
          <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
            {canSubmit ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.5)]"
              >
                <MessageCircle className="h-4 w-4 fill-black" />
                Send Request on WhatsApp
              </motion.a>
            ) : (
              <p className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                Select at least one available calendar date above to proceed.
              </p>
            )}
            <p className="text-xs text-slate-500">
              Reserved dates are updated regularly. We will verify shoot availability upon receiving your request.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}