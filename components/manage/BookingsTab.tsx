"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, AlertTriangle, Check } from "lucide-react";
import type { Booking, BookingStatus, CrewMember, Payment } from "@/lib/manage/types";
import { EVENT_TYPES, BOOKING_STATUSES } from "@/lib/manage/types";
import { generateId } from "@/lib/manage/useLocalStorage";
import { findCrewConflicts, bookingBalance, formatPKR, formatDate } from "@/lib/manage/utils";
import { cn } from "@/lib/utils";

interface BookingsTabProps {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  crew: CrewMember[];
  payments: Payment[];
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  upcoming: "border-gold/40 bg-gold/10 text-gold",
  completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  cancelled: "border-slate/40 bg-slate/10 text-slate",
};

type DraftBooking = Omit<Booking, "createdAt"> & { createdAt?: string };

function emptyDraft(): DraftBooking {
  return {
    id: "",
    clientName: "",
    eventType: EVENT_TYPES[0],
    date: "",
    venue: "",
    packageDescription: "",
    price: 0,
    crewIds: [],
    status: "upcoming",
    notes: "",
  };
}

export default function BookingsTab({ bookings, setBookings, crew, payments }: BookingsTabProps) {
  const [editing, setEditing] = useState<DraftBooking | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => a.date.localeCompare(b.date)),
    [bookings]
  );

  const conflicts = useMemo(() => {
    if (!editing || !editing.date || editing.crewIds.length === 0) return [];
    return findCrewConflicts(
      { id: editing.id || undefined, date: editing.date, crewIds: editing.crewIds },
      bookings
    );
  }, [editing, bookings]);

  function openNew() {
    setEditing(emptyDraft());
    setShowForm(true);
  }

  function openEdit(booking: Booking) {
    setEditing(booking);
    setShowForm(true);
  }

  function toggleCrew(id: string) {
    if (!editing) return;
    const has = editing.crewIds.includes(id);
    setEditing({
      ...editing,
      crewIds: has ? editing.crewIds.filter((c) => c !== id) : [...editing.crewIds, id],
    });
  }

  function save() {
    if (!editing || !editing.clientName.trim() || !editing.date) return;
    if (editing.id) {
      setBookings(
        bookings.map((b) => (b.id === editing.id ? { ...b, ...editing, createdAt: b.createdAt } : b))
      );
    } else {
      setBookings([
        ...bookings,
        { ...editing, id: generateId(), createdAt: new Date().toISOString() },
      ]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Delete this booking? This can't be undone.")) return;
    setBookings(bookings.filter((b) => b.id !== id));
  }

  function crewNames(ids: string[]) {
    return ids
      .map((id) => crew.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "—";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-offwhite">Bookings</h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-obsidian transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New booking
        </button>
      </div>

      {sortedBookings.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-8 text-center text-sm text-slate">
          No bookings yet. Add your first one to start tracking events, crew, and payments.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Crew</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-obsidian">
              {sortedBookings.map((booking) => {
                const { remaining } = bookingBalance(booking, payments);
                return (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-slate">
                      {formatDate(booking.date)}
                    </td>
                    <td className="px-4 py-3 font-medium text-offwhite">{booking.clientName}</td>
                    <td className="px-4 py-3 text-slate">{booking.eventType}</td>
                    <td className="px-4 py-3 text-slate">{crewNames(booking.crewIds)}</td>
                    <td className="px-4 py-3">
                      <span className={remaining > 0 ? "text-gold" : "text-emerald-400"}>
                        {remaining > 0 ? formatPKR(remaining) + " due" : "Paid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs capitalize",
                          STATUS_STYLES[booking.status]
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(booking)}
                          aria-label="Edit"
                          className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-gold hover:text-gold"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(booking.id)}
                          aria-label="Delete"
                          className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-red-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-obsidian/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-charcoal p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-offwhite">
                {editing.id ? "Edit booking" : "New booking"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Client name
                  </label>
                  <input
                    value={editing.clientName}
                    onChange={(e) => setEditing({ ...editing, clientName: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                    placeholder="e.g. Ahmed & Sara"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Event type
                  </label>
                  <select
                    value={editing.eventType}
                    onChange={(e) => setEditing({ ...editing, eventType: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold [color-scheme:dark]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Venue (optional)
                  </label>
                  <input
                    value={editing.venue}
                    onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Package / what&apos;s booked
                  </label>
                  <input
                    value={editing.packageDescription}
                    onChange={(e) =>
                      setEditing({ ...editing, packageDescription: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                    placeholder="e.g. 2-Day Videography Package"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={editing.price || ""}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Status
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value as BookingStatus })
                    }
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm capitalize text-offwhite outline-none focus:border-gold"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Assign crew
                </label>
                {crew.length === 0 ? (
                  <p className="text-xs text-slate">
                    No crew added yet — add crew members in the Crew tab first.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {crew.map((member) => {
                      const active = editing.crewIds.includes(member.id);
                      const conflicted = conflicts.some((c) => c.crewId === member.id);
                      return (
                        <button
                          key={member.id}
                          onClick={() => toggleCrew(member.id)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                            conflicted
                              ? "border-red-400 bg-red-400/10 text-red-400"
                              : active
                                ? "border-gold bg-gold text-obsidian font-medium"
                                : "border-line text-slate hover:border-gold/50 hover:text-offwhite"
                          )}
                        >
                          {active && !conflicted && <Check className="h-3 w-3" />}
                          {conflicted && <AlertTriangle className="h-3 w-3" />}
                          {member.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {conflicts.length > 0 && (
                  <div className="mt-3 space-y-1 rounded-lg border border-red-400/40 bg-red-400/10 p-3">
                    {conflicts.map((c) => {
                      const name = crew.find((m) => m.id === c.crewId)?.name ?? "This person";
                      return (
                        <p key={c.crewId} className="flex items-start gap-2 text-xs text-red-300">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {name} is already booked for {c.conflictingBookingClient} on this date.
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  className="w-full resize-none rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              onClick={save}
              disabled={!editing.clientName.trim() || !editing.date}
              className="mt-6 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {conflicts.length > 0 ? "Save anyway" : "Save booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
