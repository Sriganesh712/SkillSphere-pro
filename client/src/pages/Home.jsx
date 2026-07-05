import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CourseShowcase from "../components/CourseShowcase";
import Testimonials from "../components/Testimonials";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";
import CTABanner from "../components/CTABanner";
import FAQSection from "../components/FaqSection";
import AboutSection from "../components/AboutSection";
import aboutImg from "../assets/Mehra.jpg"; // or .png, .webp
import PartnersSection from "../components/PartnersSection";
import IntegrationsSection from "../components/IntegrationsSection";
import { motion } from "framer-motion";



export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >

        <HeroSection />
        <FeaturesSection />
        <CourseShowcase />
        <PricingSection />
        <CTABanner />
        <FAQSection />
        <IntegrationsSection />
        <AboutSection />
        <PartnersSection />
        <Testimonials />

        <Footer />

    </motion.div>
  );
}
