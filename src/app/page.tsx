import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContactWidget from "@/components/ContactWidget";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      <ContactWidget />
    </div>
  );
}
