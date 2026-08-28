"use client";

import { useState } from "react";
import { LayoutDashboard, CalendarDays, Users, Wallet, Receipt } from "lucide-react";
import { useLocalStorage } from "@/lib/manage/useLocalStorage";
import type { Booking, CrewMember, Payment, Expense } from "@/lib/manage/types";
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
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

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

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-offwhite">
      <header className="border-b border-line bg-charcoal/50 px-5 py-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Internal Tool</p>
          <h1 className="mt-1 font-display text-2xl text-offwhite">Studio Manager</h1>
          <p className="mt-1 text-xs text-slate">
            Bookings, crew, and payments — saved to this browser only.
          </p>
        </div>
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
          <ExpensesTab expenses={expenses} setExpenses={setExpenses} bookings={bookings} />
        )}
      </main>
    </div>
  );
}
