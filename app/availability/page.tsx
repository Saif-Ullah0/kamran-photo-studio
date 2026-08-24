import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageHero from "@/components/PageHero";
import HowItWorks from "@/components/HowItWorks";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Check Availability — Kamran Photo Studio",
  description:
    "See open dates and request your event date directly — photography and videography availability for Lahore and beyond.",
};

const STEPS = [
  {
    icon: "pointer" as const,
    title: "Select your dates",
    description: "Click one or more open dates across either month.",
  },
  {
    icon: "calendar" as const,
    title: "Describe your event",
    description: "Add the event type, service needed, and any details.",
  },
  {
    icon: "message" as const,
    title: "Send your request",
    description: "We'll confirm availability and get back to you on WhatsApp.",
  },
];

export default function AvailabilityPage() {
  return (
    <main className="relative bg-obsidian">
      <ScrollProgress />
      <Navbar />
      <PageHero
        icon="calendar"
        eyebrow="Booking"
        title="Check availability"
        description="Browse open dates below, select the ones you need, and tell us about your event — we'll take it from there."
      />
      <HowItWorks steps={STEPS} />
      <SectionDivider />
      <AvailabilityCalendar />
      <SectionDivider />
      <ContactFooter />
    </main>
  );
}