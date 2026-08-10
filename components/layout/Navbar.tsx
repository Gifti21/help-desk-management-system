"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DARK_GREEN, BUTTONS, TEAL_PRIMARY } from "@/lib/colors";
import { Button } from "@/components/ui/Button";
import { BODY_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface NavbarProps {
  showLoginButton?: boolean;
}

export function Navbar({ showLoginButton = true }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b text-white shadow-sm transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-out ${
        isScrolled ? "border-white/10 backdrop-blur-xl" : "border-transparent"
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(22, 51, 43, 0.75)' : DARK_GREEN,
        backdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="#"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2"
          style={{ '--tw-ring-color': TEAL_PRIMARY, '--tw-ring-offset-color': DARK_GREEN } as React.CSSProperties}
        >
          <Image
            src="/besys-logo.jpg"
            alt="BESYS Technologies PLC logo"
            width={48}
            height={48}
            priority
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <span
            className="text-lg sm:text-xl"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_LG.size,
              lineHeight: BODY_LG.lineHeight,
              fontWeight: FONT_WEIGHT.semibold,
              letterSpacing: BODY_LG.letterSpacing,
              color: 'white',
            }}
          >
            BESYS Support
          </span>
        </Link>

        {showLoginButton && (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="primary" size="md">
                Log in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
