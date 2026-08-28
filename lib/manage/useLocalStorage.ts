"use client";

import { useEffect, useState } from "react";

/**
 * Persists state to the browser's localStorage under `key`. Reads the
 * stored value on mount (client-only — SSR always starts from
 * `initialValue`, then syncs once mounted, to avoid hydration mismatches).
 * Writes back to localStorage on every change.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {
      // Corrupted or inaccessible storage — fall back to initialValue.
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return; // don't overwrite stored data with initialValue on first render
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (private browsing, etc.) — fail silently.
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
