import type { Booking, BookingEvent, Payment } from "./types";

export function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Earliest event date in a booking — used for sorting/upcoming lists. */
export function earliestEventDate(booking: Booking): string {
  return booking.events.reduce((min, e) => (e.date < min ? e.date : min), booking.events[0]?.date ?? "");
}

export function allCrewIds(booking: Booking): string[] {
  return Array.from(new Set(booking.events.flatMap((e) => e.crewIds)));
}

/**
 * Checks one specific event (identified by bookingId+eventId so it can
 * exclude comparing against itself) against every event in every OTHER
 * non-cancelled booking on the same date, for each assigned crew member.
 */
export function findCrewConflictsForEvent(
  bookingId: string,
  event: Pick<BookingEvent, "id" | "date" | "crewIds">,
  allBookings: Booking[]
): { crewId: string; conflictingClient: string; conflictingEventName: string }[] {
  const conflicts: { crewId: string; conflictingClient: string; conflictingEventName: string }[] = [];

  for (const crewId of event.crewIds) {
    for (const booking of allBookings) {
      if (booking.status === "cancelled") continue;
      for (const otherEvent of booking.events) {
        const isSameEvent = booking.id === bookingId && otherEvent.id === event.id;
        if (isSameEvent) continue;
        if (otherEvent.date === event.date && otherEvent.crewIds.includes(crewId)) {
          conflicts.push({
            crewId,
            conflictingClient: booking.clientName,
            conflictingEventName: otherEvent.name,
          });
        }
      }
    }
  }

  return conflicts;
}

/** All conflicts across every event in a booking — used for dashboard warnings. */
export function findAllConflictsForBooking(booking: Booking, allBookings: Booking[]) {
  return booking.events.flatMap((event) =>
    findCrewConflictsForEvent(booking.id, event, allBookings).map((c) => ({
      ...c,
      eventName: event.name,
    }))
  );
}

export function bookingBalance(booking: Booking, payments: Payment[]) {
  const paid = payments
    .filter((p) => p.bookingId === booking.id)
    .reduce((sum, p) => sum + p.amount, 0);
  return { paid, remaining: booking.price - paid };
}

/**
 * Converts bookings saved under the old single-date shape (date/venue/
 * crewIds directly on the booking) into the new events[] shape, so
 * existing localStorage data isn't lost when this update ships. Bookings
 * already in the new shape pass through unchanged.
 */
export function migrateBooking(raw: unknown): Booking {
  const b = raw as Record<string, unknown>;
  if (Array.isArray(b.events)) return b as unknown as Booking;

  const legacyDate = (b.date as string) ?? new Date().toISOString().slice(0, 10);
  const legacyVenue = b.venue as string | undefined;
  const legacyCrewIds = (b.crewIds as string[]) ?? [];

  return {
    id: b.id as string,
    clientName: b.clientName as string,
    clientPhone: b.clientPhone as string | undefined,
    eventType: b.eventType as string,
    events: [
      {
        id: `${b.id}-event-1`,
        name: (b.eventType as string) || "Event",
        date: legacyDate,
        venue: legacyVenue,
        crewIds: legacyCrewIds,
      },
    ],
    packageDescription: b.packageDescription as string,
    price: b.price as number,
    status: b.status as Booking["status"],
    notes: b.notes as string | undefined,
    createdAt: (b.createdAt as string) ?? new Date().toISOString(),
  };
}
