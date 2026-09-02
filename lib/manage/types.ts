export interface CrewMember {
  id: string;
  name: string;
  role: string; // Photographer, Videographer, Drone Operator, Editor, etc.
  phone?: string;
}

export type BookingStatus = "upcoming" | "completed" | "cancelled";

/**
 * One dated occasion within a booking — e.g. a wedding's Mehndi, Barat,
 * and Walima are three separate BookingEvents under one Booking, each
 * with its own date, venue, and crew assignment (crew often differs, or
 * needs checking against OTHER bookings, per individual date).
 */
export interface BookingEvent {
  id: string;
  name: string; // "Mehndi", "Barat", "Walima", "Mayo/Mangni", "Nikkah", or a custom label
  date: string; // ISO date
  venue?: string;
  crewIds: string[];
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone?: string; // needed to send WhatsApp confirmations
  eventType: string; // Wedding, Portrait, Commercial, Birthday/Event, Other
  events: BookingEvent[]; // one or more — a portrait session has one, a wedding usually has 2-4
  packageDescription: string;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string; // ISO timestamp
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  date: string; // ISO date
  method: string; // Cash, Bank Transfer, JazzCash, Easypaisa, Other
  notes?: string;
}

export interface Expense {
  id: string;
  category: string; // Equipment, Travel, Editing, Marketing, Crew Payout, Other
  amount: number;
  date: string; // ISO date
  bookingId?: string; // optional — links an expense to a specific event
  crewId?: string; // optional — links an expense to a specific crew member (e.g. a payout)
  notes?: string;
}

export const EVENT_TYPES = [
  "Wedding",
  "Portrait Session",
  "Commercial / Brand Shoot",
  "Birthday / Private Event",
  "Other",
];

// Suggested sub-event names when the event type is "Wedding" — still a
// free-text field, these are just quick-pick presets.
export const WEDDING_EVENT_PRESETS = ["Mehndi", "Barat", "Walima", "Mayo/Mangni", "Nikkah"];

export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "JazzCash", "Easypaisa", "Other"];

export const EXPENSE_CATEGORIES = [
  "Equipment",
  "Travel",
  "Editing",
  "Marketing",
  "Crew Payout",
  "Other",
];

export const BOOKING_STATUSES: BookingStatus[] = ["upcoming", "completed", "cancelled"];
