export interface CrewMember {
  id: string;
  name: string;
  role: string; // Photographer, Videographer, Drone Operator, Editor, etc.
  phone?: string;
}

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface Booking {
  id: string;
  clientName: string;
  eventType: string; // Wedding, Portrait, Commercial, Birthday/Event, Other
  date: string; // ISO date, e.g. "2026-09-14"
  venue?: string;
  packageDescription: string;
  price: number;
  crewIds: string[];
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
