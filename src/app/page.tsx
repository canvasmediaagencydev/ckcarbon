import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutUsSection from "@/components/AboutUsSection";
import VisionCommitmentSection from "@/components/VisionCommitmentSection";
import ContactWidget from "@/components/ContactWidget";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      <AboutUsSection />
      <VisionCommitmentSection />
      <ContactWidget />
    </div>
  );
}
