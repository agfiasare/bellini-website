import HeroVideo from "@/components/HeroVideo";
import ProductScroll from "@/components/ProductScroll";
import ProductLineup from "@/components/ProductLineup";
import SpecsSection from "@/components/SpecsSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

/**
 * Landing premium: experiencia industrial, cinematográfica y técnica.
 * Narrativa: producto visual → explicativo → línea → especificaciones → proceso → testimonios → CTA.
 */
export default function Home() {
  return (
    <main className="relative">
      <HeroVideo />
      <ProductScroll />
      <ProductLineup />
      <SpecsSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
