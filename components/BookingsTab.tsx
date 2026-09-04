"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, AlertTriangle, Check, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";
import type { Booking, BookingEvent, BookingStatus, CrewMember, Payment } from "@/lib/manage/types";
import { EVENT_TYPES, BOOKING_STATUSES, WEDDING_EVENT_PRESETS } from "@/lib/manage/types";
import { generateId } from "@/lib/manage/useLocalStorage";
import {
  findCrewConflictsForEvent,
  bookingBalance,
  formatPKR,
  formatDate,
  earliestEventDate,
  allCrewIds,
} from "@/lib/manage/utils";
import { clientConfirmationLink, crewAssignmentLink } from "@/lib/manage/notify";
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

function emptyEvent(): BookingEvent {
  return { id: generateId(), name: "", date: "", venue: "", crewIds: [] };
}

function emptyDraft(): DraftBooking {
  return {
    id: "",
    clientName: "",
    clientPhone: "",
    eventType: EVENT_TYPES[0],
    events: [emptyEvent()],
    packageDescription: "",
    price: 0,
    status: "upcoming",
    notes: "",
  };
}

export default function BookingsTab({ bookings, setBookings, crew, payments }: BookingsTabProps) {
  const [editing, setEditing] = useState<DraftBooking | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => earliestEventDate(a).localeCompare(earliestEventDate(b))),
    [bookings]
  );

  function openNew() {
    setEditing(emptyDraft());
    setShowForm(true);
  }

  function openEdit(booking: Booking) {
    setEditing(booking);
    setShowForm(true);
  }

  function updateEvent(eventId: string, patch: Partial<BookingEvent>) {
    if (!editing) return;
    setEditing({
      ...editing,
      events: editing.events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)),
    });
  }

  function addEvent() {
    if (!editing) return;
    setEditing({ ...editing, events: [...editing.events, emptyEvent()] });
  }

  function removeEvent(eventId: string) {
    if (!editing || editing.events.length <= 1) return;
    setEditing({ ...editing, events: editing.events.filter((e) => e.id !== eventId) });
  }

  function toggleCrewForEvent(eventId: string, crewId: string) {
    if (!editing) return;
    const event = editing.events.find((e) => e.id === eventId);
    if (!event) return;
    const has = event.crewIds.includes(crewId);
    updateEvent(eventId, {
      crewIds: has ? event.crewIds.filter((c) => c !== crewId) : [...event.crewIds, crewId],
    });
  }

  function save() {
    if (!editing || !editing.clientName.trim() || editing.events.some((e) => !e.date)) return;
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

  function crewName(id: string) {
    return crew.find((c) => c.id === id)?.name ?? "Unknown";
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
          No bookings yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Dates</th>
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
                const confirmLink = clientConfirmationLink(booking);
                return (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-slate">
                      {booking.events.length === 1 ? (
                        formatDate(booking.events[0].date)
                      ) : (
                        <span
                          title={booking.events
                            .map((e) => `${e.name}: ${formatDate(e.date)}`)
                            .join(", ")}
                        >
                          {booking.events.length} dates
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-offwhite">{booking.clientName}</td>
                    <td className="px-4 py-3 text-slate">{booking.eventType}</td>
                    <td className="px-4 py-3 text-slate">
                      {allCrewIds(booking).map(crewName).join(", ") || "—"}
                    </td>
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
                        <Link
                          href={`/manage/agreement/${booking.id}`}
                          aria-label="Print agreement"
                          className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-gold hover:text-gold"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Link>
                        {confirmLink && (
                          <a
                            href={confirmLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Notify client on WhatsApp"
                            className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-emerald-400 hover:text-emerald-400"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        )}
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
          <div className="w-full max-w-2xl rounded-2xl border border-line bg-charcoal p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-offwhite">
                {editing.id ? "Edit booking" : "New booking"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
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
                    Client WhatsApp (optional)
                  </label>
                  <input
                    value={editing.clientPhone}
                    onChange={(e) => setEditing({ ...editing, clientPhone: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                    placeholder="03XX XXXXXXX"
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
                    Status
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as BookingStatus })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm capitalize text-offwhite outline-none focus:border-gold"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Package / what&apos;s booked
                  </label>
                  <input
                    value={editing.packageDescription}
                    onChange={(e) => setEditing({ ...editing, packageDescription: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                    placeholder="e.g. 3-Day Wedding Package"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Total price (PKR)
                  </label>
                  <input
                    type="number"
                    value={editing.price || ""}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-slate">
                    Events {editing.eventType === "Wedding" && "(Mehndi, Barat, Walima...)"}
                  </label>
                  <button
                    onClick={addEvent}
                    className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-soft"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add event
                  </button>
                </div>

                <div className="space-y-3">
                  {editing.events.map((event, i) => {
                    const conflicts = event.date
                      ? findCrewConflictsForEvent(editing.id, event, bookings)
                      : [];
                    return (
                      <div key={event.id} className="rounded-xl border border-line bg-obsidian p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate">Event {i + 1}</span>
                          {editing.events.length > 1 && (
                            <button
                              onClick={() => removeEvent(event.id)}
                              className="text-slate hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <input
                              value={event.name}
                              onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                              placeholder="Event name — e.g. Barat"
                              list={`event-presets-${event.id}`}
                              className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-sm text-offwhite outline-none focus:border-gold"
                            />
                            {editing.eventType === "Wedding" && (
                              <datalist id={`event-presets-${event.id}`}>
                                {WEDDING_EVENT_PRESETS.map((p) => (
                                  <option key={p} value={p} />
                                ))}
                              </datalist>
                            )}
                          </div>
                          <div>
                            <input
                              type="date"
                              value={event.date}
                              onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                              className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-sm text-offwhite outline-none focus:border-gold [color-scheme:dark]"
                            />
                          </div>
                          <div>
                            <input
                              value={event.venue ?? ""}
                              onChange={(e) => updateEvent(event.id, { venue: e.target.value })}
                              placeholder="Venue (optional)"
                              className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-sm text-offwhite outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        {crew.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {crew.map((member) => {
                              const active = event.crewIds.includes(member.id);
                              const conflicted = conflicts.some((c) => c.crewId === member.id);
                              return (
                                <button
                                  key={member.id}
                                  onClick={() => toggleCrewForEvent(event.id, member.id)}
                                  className={cn(
                                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                                    conflicted
                                      ? "border-red-400 bg-red-400/10 text-red-400"
                                      : active
                                        ? "border-gold bg-gold text-obsidian font-medium"
                                        : "border-line text-slate hover:border-gold/50 hover:text-offwhite"
                                  )}
                                >
                                  {active && !conflicted && <Check className="h-2.5 w-2.5" />}
                                  {conflicted && <AlertTriangle className="h-2.5 w-2.5" />}
                                  {member.name}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {conflicts.length > 0 && (
                          <div className="mt-2 space-y-1 rounded-lg border border-red-400/40 bg-red-400/10 p-2.5">
                            {conflicts.map((c, ci) => (
                              <p key={ci} className="flex items-start gap-1.5 text-[11px] text-red-300">
                                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                                {crewName(c.crewId)} is already booked for {c.conflictingClient} (
                                {c.conflictingEventName}) on this date.
                              </p>
                            ))}
                          </div>
                        )}

                        {editing.id &&
                          event.crewIds.map((crewId) => {
                            const member = crew.find((c) => c.id === crewId);
                            if (!member) return null;
                            const link = crewAssignmentLink(
                              editing as Booking,
                              event.name || editing.eventType,
                              event.date,
                              event.venue,
                              member
                            );
                            if (!link) return null;
                            return (
                              <a
                                key={crewId}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300"
                              >
                                <MessageCircle className="h-3 w-3" />
                                Notify {member.name} on WhatsApp
                              </a>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
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
              disabled={!editing.clientName.trim() || editing.events.some((e) => !e.date)}
              className="mt-6 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              Save booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
