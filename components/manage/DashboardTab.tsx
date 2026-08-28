"use client";

import { useMemo } from "react";
import { CalendarDays, Wallet, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { Booking, CrewMember, Payment, Expense } from "@/lib/manage/types";
import { formatPKR, formatDate, bookingBalance, findCrewConflicts } from "@/lib/manage/utils";

interface DashboardTabProps {
  bookings: Booking[];
  crew: CrewMember[];
  payments: Payment[];
  expenses: Expense[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-line bg-charcoal p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
        <Icon className="h-4 w-4 text-gold" strokeWidth={2} />
      </div>
      <p className="text-xs uppercase tracking-widest text-slate">{label}</p>
      <p
        className={
          "mt-1 font-display text-2xl " +
          (tone === "positive"
            ? "text-emerald-400"
            : tone === "negative"
              ? "text-red-300"
              : "text-offwhite")
        }
      >
        {value}
      </p>
    </div>
  );
}

export default function DashboardTab({ bookings, crew, payments, expenses }: DashboardTabProps) {
  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "upcoming")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [bookings]
  );

  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0),
    [bookings]
  );
  const totalCollected = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const outstanding = totalRevenue - totalCollected;
  const net = totalCollected - totalExpenses;

  // Any active booking whose crew currently clashes with another active booking.
  const conflictedBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.status !== "cancelled" &&
        findCrewConflicts({ id: b.id, date: b.date, crewIds: b.crewIds }, bookings).length > 0
    );
  }, [bookings]);

  function crewNames(ids: string[]) {
    return (
      ids
        .map((id) => crew.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "No crew assigned"
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-offwhite">Dashboard</h2>

      {conflictedBookings.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-red-300">
            <AlertTriangle className="h-4 w-4" />
            {conflictedBookings.length} booking{conflictedBookings.length > 1 ? "s have" : " has"}{" "}
            a crew double-booking
          </p>
          <p className="text-xs text-red-300/80">
            Check the Bookings tab and reassign crew for:{" "}
            {conflictedBookings.map((b) => b.clientName).join(", ")}
          </p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={CalendarDays} label="Upcoming" value={String(upcoming.length)} />
        <StatCard icon={Wallet} label="Total Revenue" value={formatPKR(totalRevenue)} />
        <StatCard icon={TrendingUp} label="Collected" value={formatPKR(totalCollected)} tone="positive" />
        <StatCard
          icon={AlertTriangle}
          label="Outstanding"
          value={formatPKR(outstanding)}
          tone={outstanding > 0 ? "negative" : "default"}
        />
        <StatCard
          icon={TrendingDown}
          label="Net (after expenses)"
          value={formatPKR(net)}
          tone={net >= 0 ? "positive" : "negative"}
        />
      </div>

      <h3 className="mb-4 font-display text-lg text-offwhite">Upcoming bookings</h3>
      {upcoming.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-6 text-center text-sm text-slate">
          No upcoming bookings.
        </p>
      ) : (
        <div className="space-y-2">
          {upcoming.slice(0, 6).map((booking) => {
            const { remaining } = bookingBalance(booking, payments);
            return (
              <div
                key={booking.id}
                className="flex flex-col gap-1 rounded-xl border border-line bg-charcoal p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-offwhite">
                    {booking.clientName} — {booking.eventType}
                  </p>
                  <p className="text-xs text-slate">
                    {formatDate(booking.date)} · {crewNames(booking.crewIds)}
                  </p>
                </div>
                <span className={"text-xs " + (remaining > 0 ? "text-gold" : "text-emerald-400")}>
                  {remaining > 0 ? formatPKR(remaining) + " due" : "Paid in full"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
