"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, User } from "lucide-react";
import type { Booking, CrewMember } from "@/lib/manage/types";

interface CalendarTabProps {
  bookings: Booking[];
  crew: CrewMember[];
}

export default function CalendarTab({ bookings, crew }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Array<{ booking: Booking; eventName: string; venue?: string; crewIds: string[] }>>();

    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      for (const e of b.events) {
        if (!e.date) continue;
        const list = map.get(e.date) ?? [];
        list.push({
          booking: b,
          eventName: e.name || b.eventType,
          venue: e.venue,
          crewIds: e.crewIds,
        });
        map.set(e.date, list);
      }
    }
    return map;
  }, [bookings]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function crewName(id: string) {
    return crew.find((c) => c.id === id)?.name ?? "Unknown";
  }

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-gold" />
          <h2 className="font-display text-2xl text-offwhite">
            {monthName} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="rounded-full border border-line p-2 text-slate hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-full border border-line p-2 text-slate hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-charcoal">
        <div className="grid grid-cols-7 border-b border-line bg-obsidian text-center text-xs font-semibold uppercase tracking-wider text-slate py-3">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-line">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-[100px] bg-obsidian/40" />;
            }

            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateKey = `${year}-${monthStr}-${dayStr}`;

            const dayEvents = eventsByDate.get(dateKey) ?? [];

            return (
              <div key={day} className="min-h-[100px] bg-obsidian p-2 transition-colors hover:bg-charcoal/50">
                <span className="text-xs font-medium text-slate">{day}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((item, eIdx) => (
                    <div
                      key={eIdx}
                      className="group relative rounded border border-gold/30 bg-gold/10 p-1.5 text-xs text-gold"
                    >
                      <p className="font-medium truncate">{item.booking.clientName}</p>
                      <p className="text-[10px] text-gold/80 truncate">{item.eventName}</p>

                      {/* Tooltip on hover */}
                      <div className="absolute left-0 top-full z-20 mt-1 hidden w-48 rounded-lg border border-line bg-charcoal p-3 text-xs text-offwhite shadow-xl group-hover:block">
                        <p className="font-semibold text-gold">{item.booking.clientName}</p>
                        <p className="text-slate mb-2">{item.eventName}</p>
                        {item.venue && (
                          <p className="flex items-center gap-1 text-slate mb-1">
                            <MapPin className="h-3 w-3 text-gold" /> {item.venue}
                          </p>
                        )}
                        {item.crewIds.length > 0 && (
                          <p className="flex items-center gap-1 text-slate">
                            <User className="h-3 w-3 text-gold" /> {item.crewIds.map(crewName).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
