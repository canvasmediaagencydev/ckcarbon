import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutUsSection from "@/components/AboutUsSection";
import VisionCommitmentSection from "@/components/VisionCommitmentSection";
import OEMServiceSection from "@/components/OEMServiceSection";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactWidget from "@/components/ContactWidget";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      <AboutUsSection />
      <VisionCommitmentSection />
      <OEMServiceSection />
      <ProductsSection />
      <TestimonialsSection />
      <ContactWidget />
    </div>
  );
}
