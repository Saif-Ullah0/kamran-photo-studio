"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Booking, Payment } from "@/lib/manage/types";
import { PAYMENT_METHODS } from "@/lib/manage/types";
import { generateId } from "@/lib/manage/useLocalStorage";
import { formatPKR, formatDate, bookingBalance } from "@/lib/manage/utils";

interface PaymentsTabProps {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  bookings: Booking[];
}

export default function PaymentsTab({ payments, setPayments, bookings }: PaymentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    bookingId: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    method: PAYMENT_METHODS[0],
    notes: "",
  });

  const sorted = useMemo(() => [...payments].sort((a, b) => b.date.localeCompare(a.date)), [
    payments,
  ]);

  const totalCollected = useMemo(
    () => payments.reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  function clientFor(bookingId: string) {
    return bookings.find((b) => b.id === bookingId)?.clientName ?? "Unknown booking";
  }

  function openNew() {
    setDraft({
      bookingId: bookings[0]?.id ?? "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      method: PAYMENT_METHODS[0],
      notes: "",
    });
    setShowForm(true);
  }

  function save() {
    if (!draft.bookingId || draft.amount <= 0) return;
    setPayments([...payments, { ...draft, id: generateId() }]);
    setShowForm(false);
  }

  function remove(id: string) {
    if (!confirm("Delete this payment record?")) return;
    setPayments(payments.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-offwhite">Payments</h2>
          <p className="mt-1 text-sm text-slate">Total collected: {formatPKR(totalCollected)}</p>
        </div>
        <button
          onClick={openNew}
          disabled={bookings.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-obsidian transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Log payment
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-8 text-center text-sm text-slate">
          Add a booking first, then you can log payments against it.
        </p>
      ) : sorted.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-8 text-center text-sm text-slate">
          No payments logged yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Booking balance</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-obsidian">
              {sorted.map((payment) => {
                const booking = bookings.find((b) => b.id === payment.bookingId);
                const remaining = booking ? bookingBalance(booking, payments).remaining : null;
                return (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-slate">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-4 py-3 font-medium text-offwhite">
                      {clientFor(payment.bookingId)}
                    </td>
                    <td className="px-4 py-3 text-emerald-400">{formatPKR(payment.amount)}</td>
                    <td className="px-4 py-3 text-slate">{payment.method}</td>
                    <td className="px-4 py-3">
                      {remaining !== null ? (
                        <span className={remaining > 0 ? "text-gold" : "text-emerald-400"}>
                          {remaining > 0 ? formatPKR(remaining) + " due" : "Paid in full"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => remove(payment.id)}
                        aria-label="Delete"
                        className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-red-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-charcoal p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-offwhite">Log payment</h3>
              <button onClick={() => setShowForm(false)} className="text-slate hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Booking
                </label>
                <select
                  value={draft.bookingId}
                  onChange={(e) => setDraft({ ...draft, bookingId: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.clientName} — {formatDate(b.date)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    value={draft.amount || ""}
                    onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Date
                  </label>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Method
                </label>
                <select
                  value={draft.method}
                  onChange={(e) => setDraft({ ...draft, method: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={save}
              disabled={!draft.bookingId || draft.amount <= 0}
              className="mt-6 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              Save payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
