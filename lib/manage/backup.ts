import * as XLSX from "xlsx";
import type { Booking, CrewMember, Payment, Expense } from "./types";
import { formatDate, bookingBalance } from "./utils";

interface AllData {
  bookings: Booking[];
  crew: CrewMember[];
  payments: Payment[];
  expenses: Expense[];
}

const BACKUP_VERSION = 1;

function crewName(crew: CrewMember[], id: string) {
  return crew.find((c) => c.id === id)?.name ?? "Unknown";
}

function bookingClient(bookings: Booking[], id?: string) {
  if (!id) return "";
  return bookings.find((b) => b.id === id)?.clientName ?? "";
}

/**
 * Downloads a human-readable .xlsx with one sheet per data type — this is
 * the "proper record" file: viewable, printable, shareable outside the
 * browser entirely. Not intended to be re-imported.
 */
export function exportToExcel({ bookings, crew, payments, expenses }: AllData) {
  const wb = XLSX.utils.book_new();

  const bookingsRows = bookings.map((b) => {
    const { paid, remaining } = bookingBalance(b, payments);
    return {
      Client: b.clientName,
      "Event Type": b.eventType,
      Date: formatDate(b.date),
      Venue: b.venue ?? "",
      Package: b.packageDescription,
      "Price (PKR)": b.price,
      "Paid (PKR)": paid,
      "Balance (PKR)": remaining,
      Crew: b.crewIds.map((id) => crewName(crew, id)).join(", "),
      Status: b.status,
      Notes: b.notes ?? "",
    };
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bookingsRows), "Bookings");

  const crewRows = crew.map((c) => ({ Name: c.name, Role: c.role, Phone: c.phone ?? "" }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(crewRows), "Crew");

  const paymentsRows = payments.map((p) => ({
    Date: formatDate(p.date),
    Client: bookingClient(bookings, p.bookingId),
    "Amount (PKR)": p.amount,
    Method: p.method,
    Notes: p.notes ?? "",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paymentsRows), "Payments");

  const expensesRows = expenses.map((e) => ({
    Date: formatDate(e.date),
    Category: e.category,
    "Amount (PKR)": e.amount,
    Crew: e.crewId ? crewName(crew, e.crewId) : "",
    "Linked Booking": bookingClient(bookings, e.bookingId),
    Notes: e.notes ?? "",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expensesRows), "Expenses");

  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `kamran-studio-records-${dateStamp}.xlsx`);
}

/**
 * Downloads a lossless .json backup of everything — the real safety net.
 * Re-importable via importBackupJSON, including into a different browser.
 */
export function exportBackupJSON({ bookings, crew, payments, expenses }: AllData) {
  const payload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    bookings,
    crew,
    payments,
    expenses,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kamran-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads a previously-exported backup file and returns the parsed data.
 * Throws if the file isn't a recognizable backup — caller should catch
 * and show an error rather than silently corrupting existing data.
 */
export function importBackupJSON(file: File): Promise<AllData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed || !Array.isArray(parsed.bookings) || !Array.isArray(parsed.crew)) {
          throw new Error("This doesn't look like a Studio Manager backup file.");
        }
        resolve({
          bookings: parsed.bookings ?? [],
          crew: parsed.crew ?? [],
          payments: parsed.payments ?? [],
          expenses: parsed.expenses ?? [],
        });
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Couldn't read this file."));
      }
    };
    reader.onerror = () => reject(new Error("Couldn't read this file."));
    reader.readAsText(file);
  });
}
