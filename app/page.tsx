import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGallery from "@/components/PortfolioGallery";
import WhyChooseMe from "@/components/WhyChooseMe";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import BookingFlow from "@/components/BookingFlow";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioGallery />
      <WhyChooseMe />
      <PricingSection />
      <TestimonialsSection />
      <BookingFlow />
      <ContactSection />
    </>
  );
}
