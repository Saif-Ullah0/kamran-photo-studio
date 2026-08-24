import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageHero from "@/components/PageHero";
import HowItWorks from "@/components/HowItWorks";
import QuoteCalculator from "@/components/QuoteCalculator";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Get an Instant Quote — Kamran Photo Studio",
  description:
    "Build a custom photography or videography quote — pick your days, crew, and equipment, and get an instant price estimate.",
};

const STEPS = [
  {
    icon: "sliders" as const,
    title: "Configure your shoot",
    description: "Pick your days, photographers, videographers, and drone coverage.",
  },
  {
    icon: "calculator" as const,
    title: "Watch the price update live",
    description: "Every change recalculates your total instantly — no waiting.",
  },
  {
    icon: "send" as const,
    title: "Send it on WhatsApp",
    description: "One tap sends your full breakdown straight to Kamran.",
  },
];

export default function QuotePage() {
  return (
    <main className="relative bg-obsidian">
      <ScrollProgress />
      <Navbar />
      <PageHero
        icon="calculator"
        eyebrow="Custom Pricing"
        title="Build your own quote"
        description="No fixed package fits every shoot. Configure exactly what you need — days, crew, and equipment — and watch the price update as you go."
      />
      <HowItWorks steps={STEPS} />
      <SectionDivider />
      <QuoteCalculator />
      <SectionDivider />
      <ContactFooter />
    </main>
  );
}