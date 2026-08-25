"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export default function BackButton({ fallbackHref = "/", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    // If there's real browser history to go back to, use it — this returns
    // to the exact scroll position the visitor came from, not just the
    // homepage top. Only falls back to a fixed URL if this page was opened
    // directly (e.g. a bookmark or a fresh tab) with nothing to go back to.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-gold"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
