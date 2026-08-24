import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageHero from "@/components/PageHero";
import FAQ from "@/components/FAQ";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "FAQ — Kamran Photo Studio",
  description:
    "Answers to common questions about booking, pricing, turnaround time, and what's included in our photography and videography packages.",
};

export default function FAQPage() {
  return (
    <main className="relative bg-obsidian">
      <ScrollProgress />
      <Navbar />
      <PageHero
        icon="help"
        eyebrow="Questions"
        title="Common questions"
        description="Everything we get asked most often — booking, pricing, turnaround time, and what's included."
      />
      <SectionDivider />
      <FAQ />
      <ContactFooter />
    </main>
  );
}