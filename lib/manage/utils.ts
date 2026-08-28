import type { Booking, Payment } from "./types";

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

/**
 * Returns the crew IDs that are double-booked: assigned to `booking` AND to
 * some other non-cancelled booking on the same date. Excludes `booking`
 * itself from the comparison (so editing an existing booking doesn't flag
 * against its own prior save).
 */
export function findCrewConflicts(
  booking: { id?: string; date: string; crewIds: string[] },
  allBookings: Booking[]
): { crewId: string; conflictingBookingClient: string }[] {
  const conflicts: { crewId: string; conflictingBookingClient: string }[] = [];

  for (const crewId of booking.crewIds) {
    const clash = allBookings.find(
      (b) =>
        b.id !== booking.id &&
        b.date === booking.date &&
        b.status !== "cancelled" &&
        b.crewIds.includes(crewId)
    );
    if (clash) {
      conflicts.push({ crewId, conflictingBookingClient: clash.clientName });
    }
  }

  return conflicts;
}

export function bookingBalance(booking: Booking, payments: Payment[]) {
  const paid = payments
    .filter((p) => p.bookingId === booking.id)
    .reduce((sum, p) => sum + p.amount, 0);
  return { paid, remaining: booking.price - paid };
}
