"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Booking, CrewMember, Expense } from "@/lib/manage/types";
import { EXPENSE_CATEGORIES } from "@/lib/manage/types";
import { generateId } from "@/lib/manage/useLocalStorage";
import { formatPKR, formatDate } from "@/lib/manage/utils";

interface ExpensesTabProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  bookings: Booking[];
  crew: CrewMember[];
}

export default function ExpensesTab({ expenses, setExpenses, bookings, crew }: ExpensesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    category: EXPENSE_CATEGORIES[0],
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    bookingId: "",
    crewId: "",
    notes: "",
  });

  const sorted = useMemo(() => [...expenses].sort((a, b) => b.date.localeCompare(a.date)), [
    expenses,
  ]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const byCrew = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      if (!e.crewId) continue;
      map.set(e.crewId, (map.get(e.crewId) ?? 0) + e.amount);
    }
    return Array.from(map.entries())
      .map(([crewId, amount]) => ({
        name: crew.find((c) => c.id === crewId)?.name ?? "Unknown",
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, crew]);

  function openNew() {
    setDraft({
      category: EXPENSE_CATEGORIES[0],
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      bookingId: "",
      crewId: "",
      notes: "",
    });
    setShowForm(true);
  }

  function save() {
    if (draft.amount <= 0) return;
    const { bookingId, crewId, ...rest } = draft;
    setExpenses([
      ...expenses,
      { ...rest, bookingId: bookingId || undefined, crewId: crewId || undefined, id: generateId() },
    ]);
    setShowForm(false);
  }

  function remove(id: string) {
    if (!confirm("Delete this expense?")) return;
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  function clientFor(bookingId?: string) {
    if (!bookingId) return "—";
    return bookings.find((b) => b.id === bookingId)?.clientName ?? "—";
  }

  function crewNameFor(crewId?: string) {
    if (!crewId) return "—";
    return crew.find((c) => c.id === crewId)?.name ?? "—";
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-offwhite">Expenses</h2>
          <p className="mt-1 text-sm text-slate">Total: {formatPKR(totalExpenses)}</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-obsidian transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add expense
        </button>
      </div>

      {byCategory.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {byCategory.map(([cat, amount]) => (
            <span
              key={cat}
              className="rounded-full border border-line bg-charcoal px-3 py-1.5 text-xs text-slate"
            >
              {cat}: <span className="text-offwhite">{formatPKR(amount)}</span>
            </span>
          ))}
        </div>
      )}

      {byCrew.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {byCrew.map(({ name, amount }) => (
            <span
              key={name}
              className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-slate"
            >
              {name}: <span className="text-gold">{formatPKR(amount)}</span>
            </span>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-8 text-center text-sm text-slate">
          No expenses logged yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Crew</th>
                <th className="px-4 py-3">Linked booking</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-obsidian">
              {sorted.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 py-3 text-offwhite">{expense.category}</td>
                  <td className="px-4 py-3 text-red-300">{formatPKR(expense.amount)}</td>
                  <td className="px-4 py-3 text-slate">{crewNameFor(expense.crewId)}</td>
                  <td className="px-4 py-3 text-slate">{clientFor(expense.bookingId)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(expense.id)}
                      aria-label="Delete"
                      className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-charcoal p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-offwhite">Add expense</h3>
              <button onClick={() => setShowForm(false)} className="text-slate hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                    Category
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
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
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Link to a booking (optional)
                </label>
                <select
                  value={draft.bookingId}
                  onChange={(e) => setDraft({ ...draft, bookingId: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                >
                  <option value="">None — general expense</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.clientName} — {formatDate(b.date)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Crew member (optional)
                </label>
                <select
                  value={draft.crewId}
                  onChange={(e) => setDraft({ ...draft, crewId: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                >
                  <option value="">None</option>
                  {crew.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate/90">
                  Useful for Crew Payout expenses — records who was paid.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Notes (optional)
                </label>
                <input
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              onClick={save}
              disabled={draft.amount <= 0}
              className="mt-6 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              Save expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
}