"use client";

import { PAGE_BACKGROUND, PRIMARY_TEXT } from "@/lib/colors";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "./Landing/HeroSection";
import { StepsSection } from "./Landing/StepsSection";
import { FeaturesSection } from "./Landing/FeaturesSection";
import { StatsSection } from "./Landing/StatsSection";
import { AboutSection } from "./Landing/AboutSection";
import { FAQSection } from "./Landing/FAQSection";
import { PartnersSection } from "./Landing/PartnersSection";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND, color: PRIMARY_TEXT }}>
      <Navbar />

      <main>
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <StatsSection />
        <AboutSection />
        <FAQSection />
        <PartnersSection />
      </main>

      <Footer />
    </div>
  );
}
