import type { Booking, CrewMember } from "./types";
import { formatDate, formatPKR } from "./utils";

function waLink(phone: string, message: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Message + link to confirm a booking with the client, listing every event/date. */
export function clientConfirmationLink(booking: Booking): string | null {
  if (!booking.clientPhone) return null;

  const eventLines = booking.events
    .map((e) => `- ${e.name}: ${formatDate(e.date)}${e.venue ? ` at ${e.venue}` : ""}`)
    .join("\n");

  const message = [
    `Hi ${booking.clientName}, your booking with Kamran Photo Studio is confirmed!`,
    eventLines,
    `Package: ${booking.packageDescription}`,
    `Total: ${formatPKR(booking.price)}`,
    "We're looking forward to it!",
  ].join("\n\n");

  return waLink(booking.clientPhone, message);
}

/** Message + link to notify one crew member they're assigned to a specific event. */
export function crewAssignmentLink(
  booking: Booking,
  eventName: string,
  eventDate: string,
  eventVenue: string | undefined,
  crew: CrewMember
): string | null {
  if (!crew.phone) return null;

  const message = [
    `Hi ${crew.name}, you're assigned to an event:`,
    `${eventName} — ${booking.clientName}`,
    `Date: ${formatDate(eventDate)}`,
    eventVenue ? `Venue: ${eventVenue}` : "",
    `Event type: ${booking.eventType}`,
  ]
    .filter(Boolean)
    .join("\n");

  return waLink(crew.phone, message);
}
