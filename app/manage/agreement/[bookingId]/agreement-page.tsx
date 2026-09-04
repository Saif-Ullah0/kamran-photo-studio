"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Printer, ArrowLeft } from "lucide-react";
import { useLocalStorage } from "@/lib/manage/useLocalStorage";
import type { Booking, Payment } from "@/lib/manage/types";
import { migrateBooking, bookingBalance, formatPKR, formatDate } from "@/lib/manage/utils";
import { SITE } from "@/lib/data";

export default function AgreementPage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();

  const [bookingsRaw, , bookingsHydrated] = useLocalStorage<Booking[]>("kps-manage-bookings", []);
  const [payments, , paymentsHydrated] = useLocalStorage<Payment[]>("kps-manage-payments", []);

  if (!bookingsHydrated || !paymentsHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  const bookings = bookingsRaw.map(migrateBooking);
  const booking = bookings.find((b) => b.id === params.bookingId);

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-800">
        <p>Booking not found.</p>
        <button onClick={() => router.push("/manage")} className="text-sm underline">
          Back to Studio Manager
        </button>
      </div>
    );
  }

  const { paid, remaining } = bookingBalance(booking, payments);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Screen-only controls, hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <button
          onClick={() => router.push("/manage")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* The document itself */}
      <div className="mx-auto max-w-2xl px-8 py-12 print:px-0 print:py-6">
        <div className="mb-8 flex items-center justify-between border-b-2 border-gray-900 pb-6">
          <div className="relative h-12 w-40">
            <Image src="/logo.jpeg" alt={SITE.name} fill className="object-contain object-left" />
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>{SITE.address}</p>
            <p>{SITE.phoneDisplay}</p>
            <p>{SITE.email}</p>
          </div>
        </div>

        <h1 className="mb-1 text-2xl font-semibold">Booking Agreement</h1>
        <p className="mb-8 text-sm text-gray-500">Generated {today}</p>

        <section className="mb-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Client
          </h2>
          <p className="text-sm">{booking.clientName}</p>
          {booking.clientPhone && <p className="text-sm text-gray-600">{booking.clientPhone}</p>}
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Event Details — {booking.eventType}
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs uppercase text-gray-500">
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2">Venue</th>
              </tr>
            </thead>
            <tbody>
              {booking.events.map((e) => (
                <tr key={e.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{e.name || booking.eventType}</td>
                  <td className="py-2 pr-4">{formatDate(e.date)}</td>
                  <td className="py-2">{e.venue || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Package &amp; Payment
          </h2>
          <p className="mb-3 text-sm">{booking.packageDescription}</p>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="py-1.5 text-gray-500">Total Price</td>
                <td className="py-1.5 text-right font-medium">{formatPKR(booking.price)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-gray-500">Amount Paid</td>
                <td className="py-1.5 text-right">{formatPKR(paid)}</td>
              </tr>
              <tr className="border-t border-gray-300">
                <td className="py-1.5 font-medium">Balance Due</td>
                <td className="py-1.5 text-right font-semibold">{formatPKR(remaining)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {booking.notes && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Notes
            </h2>
            <p className="text-sm text-gray-600">{booking.notes}</p>
          </section>
        )}

        <p className="mb-12 text-xs leading-relaxed text-gray-500">
          This document confirms the booking details listed above, as agreed between{" "}
          {SITE.name} and the client named above. Please review all details carefully before
          signing.
        </p>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="mb-2 h-16 border-b border-gray-400" />
            <p className="text-xs text-gray-500">Client Signature</p>
            <p className="mt-1 text-xs text-gray-400">Date: _______________</p>
          </div>
          <div>
            <div className="mb-2 h-16 border-b border-gray-400" />
            <p className="text-xs text-gray-500">{SITE.name} Signature</p>
            <p className="mt-1 text-xs text-gray-400">Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
