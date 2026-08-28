"use client";

import { PAGE_BACKGROUND, PRIMARY_TEXT } from "@/lib/colors";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "./Landing/HeroSection";
import { StepsSection } from "./Landing/StepsSection";
import { FeaturesSection } from "./Landing/FeaturesSection";
import { StatsSection } from "./Landing/StatsSection";
import { AboutSection } from "./Landing/AboutSection";
import { FAQSection } from "./Landing/FAQSection";
import { PartnersSection } from "./Landing/PartnersSection";
import Image from "next/image";
import Link from "next/link";
import { AtSign, Camera, Globe, Mail } from "lucide-react";

export default function Landing() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: PAGE_BACKGROUND, color: PRIMARY_TEXT }}
    >
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

      <footer className="border-t bg-[#16332b] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/besys-logo.jpg"
                alt="BESYS Technologies PLC logo"
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold">BESYS Support</p>
                <p className="text-xs text-white/60">BESYS Technologies PLC</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Secure support collaboration for BESYS clients, with every request
              kept organized and visible to the right team.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2fd9c4]">
              Support
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link
                href="/login"
                className="transition-colors hover:text-white"
              >
                Client login
              </Link>
              <Link href="#faq" className="transition-colors hover:text-white">
                FAQs
              </Link>
              <a
                href="mailto:support@besys.com"
                className="transition-colors hover:text-white"
              >
                Contact support
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2fd9c4]">
              Connect
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.instagram.com/besys_technologies_plc/"
                aria-label="Instagram"
                className="text-white/70 transition-colors hover:text-white"
              >
                <Camera className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/BESYS133091"
                aria-label="X"
                className="text-white/70 transition-colors hover:text-white"
              >
                <AtSign className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@besys.com"
                aria-label="Email"
                className="text-white/70 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://besys.com"
                aria-label="Website"
                className="text-white/70 transition-colors hover:text-white"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-4 text-xs text-white/50">
          © 2026 BESYS Technologies PLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
