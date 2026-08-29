"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Receipt,
  FileSpreadsheet,
  DownloadCloud,
  UploadCloud,
  LogOut,
} from "lucide-react";
import { useLocalStorage } from "@/lib/manage/useLocalStorage";
import type { Booking, CrewMember, Payment, Expense } from "@/lib/manage/types";
import { exportToExcel, exportBackupJSON, importBackupJSON } from "@/lib/manage/backup";
import DashboardTab from "@/components/manage/DashboardTab";
import BookingsTab from "@/components/manage/BookingsTab";
import CrewTab from "@/components/manage/CrewTab";
import PaymentsTab from "@/components/manage/PaymentsTab";
import ExpensesTab from "@/components/manage/ExpensesTab";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "crew", label: "Crew", icon: Users },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "expenses", label: "Expenses", icon: Receipt },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ManagePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const [bookings, setBookings, bookingsHydrated] = useLocalStorage<Booking[]>(
    "kps-manage-bookings",
    []
  );
  const [crew, setCrew, crewHydrated] = useLocalStorage<CrewMember[]>("kps-manage-crew", []);
  const [payments, setPayments, paymentsHydrated] = useLocalStorage<Payment[]>(
    "kps-manage-payments",
    []
  );
  const [expenses, setExpenses, expensesHydrated] = useLocalStorage<Expense[]>(
    "kps-manage-expenses",
    []
  );

  const hydrated = bookingsHydrated && crewHydrated && paymentsHydrated && expensesHydrated;

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so selecting the same file again still fires onChange
    if (!file) return;

    if (
      !confirm(
        "Importing a backup replaces ALL current data in this browser with what's in the file. This can't be undone. Continue?"
      )
    ) {
      return;
    }

    try {
      const data = await importBackupJSON(file);
      setBookings(data.bookings);
      setCrew(data.crew);
      setPayments(data.payments);
      setExpenses(data.expenses);
      setImportMessage("Backup restored successfully.");
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : "Couldn't import this file.");
    }
    setTimeout(() => setImportMessage(null), 4000);
  }

  async function handleLogout() {
    await fetch("/api/manage-auth", { method: "DELETE" });
    router.push("/manage/login");
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold" />
      </div>
    );
  }

  const allData = { bookings, crew, payments, expenses };

  return (
    <div className="min-h-screen bg-obsidian text-offwhite">
      <header className="border-b border-line bg-charcoal/50 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Internal Tool</p>
            <h1 className="mt-1 font-display text-2xl text-offwhite">Studio Manager</h1>
            <p className="mt-1 text-xs text-slate">
              Bookings, crew, and payments — saved to this browser only.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportToExcel(allData)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-slate transition-colors hover:border-gold hover:text-gold"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export to Excel
            </button>
            <button
              onClick={() => exportBackupJSON(allData)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-slate transition-colors hover:border-gold hover:text-gold"
            >
              <DownloadCloud className="h-3.5 w-3.5" />
              Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-slate transition-colors hover:border-gold hover:text-gold"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Import Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-slate transition-colors hover:border-red-400 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        </div>
        {importMessage && (
          <p className="mx-auto mt-3 max-w-6xl text-xs text-gold">{importMessage}</p>
        )}
      </header>

      <nav className="border-b border-line bg-obsidian">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-slate hover:text-offwhite"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {activeTab === "dashboard" && (
          <DashboardTab bookings={bookings} crew={crew} payments={payments} expenses={expenses} />
        )}
        {activeTab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            setBookings={setBookings}
            crew={crew}
            payments={payments}
          />
        )}
        {activeTab === "crew" && <CrewTab crew={crew} setCrew={setCrew} />}
        {activeTab === "payments" && (
          <PaymentsTab payments={payments} setPayments={setPayments} bookings={bookings} />
        )}
        {activeTab === "expenses" && (
          <ExpensesTab
            expenses={expenses}
            setExpenses={setExpenses}
            bookings={bookings}
            crew={crew}
          />
        )}
      </main>
    </div>
  );
}