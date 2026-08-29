"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function ManageLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/manage-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push("/manage");
      router.refresh();
    } catch {
      setError("Couldn't reach the server — try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-charcoal p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <Lock className="h-5 w-5 text-gold" strokeWidth={2} />
          </span>
          <h1 className="font-display text-xl text-offwhite">Studio Manager</h1>
          <p className="mt-1 text-xs text-slate">Enter the password to continue.</p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm text-offwhite outline-none focus:border-gold"
          placeholder="Password"
        />

        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}