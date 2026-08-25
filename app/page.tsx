import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import ShowreelSection from "@/components/ShowreelSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import Pricing from "@/components/Pricing";
import QuickLinks from "@/components/QuickLinks";
import About from "@/components/About";
import CameraShowcase from "@/components/CameraShowcase";
import TeamMarquee from "@/components/TeamMarquee";
import Testimonials from "@/components/Testimonials";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <ShowreelSection />
      <SectionDivider />
      <PortfolioGrid />
      <SectionDivider />
      <Pricing />
      <SectionDivider />
      <QuickLinks />
      <SectionDivider />
      <About />
      <SectionDivider />
      <CameraShowcase />
      <SectionDivider />
      <TeamMarquee />
      <SectionDivider />
      <Testimonials />
      <ContactFooter />
    </main>
  );
}