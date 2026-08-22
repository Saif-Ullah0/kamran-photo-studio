import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import ShowreelSection from "@/components/ShowreelSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import TeamMarquee from "@/components/TeamMarquee";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <ShowreelSection />
      <PortfolioGrid />
      <Pricing />
      <About />
      <TeamMarquee />
      <ContactFooter />
    </main>
  );
}
