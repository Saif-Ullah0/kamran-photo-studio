"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { CrewMember } from "@/lib/manage/types";
import { generateId } from "@/lib/manage/useLocalStorage";

interface CrewTabProps {
  crew: CrewMember[];
  setCrew: (crew: CrewMember[]) => void;
}

const ROLE_OPTIONS = ["Photographer", "Videographer", "Drone Operator", "Editor", "Assistant"];

export default function CrewTab({ crew, setCrew }: CrewTabProps) {
  const [editing, setEditing] = useState<CrewMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing({ id: "", name: "", role: ROLE_OPTIONS[0], phone: "" });
    setShowForm(true);
  }

  function openEdit(member: CrewMember) {
    setEditing(member);
    setShowForm(true);
  }

  function save() {
    if (!editing || !editing.name.trim()) return;
    if (editing.id) {
      setCrew(crew.map((c) => (c.id === editing.id ? editing : c)));
    } else {
      setCrew([...crew, { ...editing, id: generateId() }]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Remove this crew member? Existing bookings will keep their name on file.")) return;
    setCrew(crew.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-offwhite">Crew</h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-obsidian transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add crew member
        </button>
      </div>

      {crew.length === 0 ? (
        <p className="rounded-xl border border-line bg-charcoal p-8 text-center text-sm text-slate">
          No crew members yet. Add your photographers and videographers so you can assign them
          to bookings.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-obsidian">
              {crew.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-medium text-offwhite">{member.name}</td>
                  <td className="px-4 py-3 text-slate">{member.role}</td>
                  <td className="px-4 py-3 text-slate">{member.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(member)}
                        aria-label="Edit"
                        className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-gold hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(member.id)}
                        aria-label="Remove"
                        className="rounded-full border border-line p-1.5 text-slate transition-colors hover:border-red-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-charcoal p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-offwhite">
                {editing.id ? "Edit crew member" : "Add crew member"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Name
                </label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  placeholder="e.g. Mian Naveed Ahmad"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Role
                </label>
                <select
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate">
                  Phone (optional)
                </label>
                <input
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className="w-full rounded-lg border border-line bg-obsidian px-3 py-2.5 text-sm text-offwhite outline-none focus:border-gold"
                  placeholder="03XX XXXXXXX"
                />
              </div>
            </div>

            <button
              onClick={save}
              disabled={!editing.name.trim()}
              className="mt-6 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
