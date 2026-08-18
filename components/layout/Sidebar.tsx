"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Ticket, Plus, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { DARK_GREEN, TEAL_PRIMARY, LIGHT_TEAL_BG, MUTED_GREY_GREEN } from "@/lib/colors";
import { BODY_REGULAR, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import Image from "next/image";

const navItems = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/tickets", label: "My Tickets", icon: Ticket },
  { href: "/employee/tickets/new", label: "Create Ticket", icon: Plus },
  { href: "/employee/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    // TODO: connect to real logout endpoint
    // Clear local auth state
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAuthenticated');
    
    // Navigate to landing page
    router.push('/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: DARK_GREEN, color: TEAL_PRIMARY }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "280px",
          backgroundColor: DARK_GREEN,
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo section */}
          <div className="flex flex-col items-center p-6 border-b" style={{ borderColor: "rgba(47, 217, 196, 0.2)" }}>
            <Image
              src="/besys-logo.jpg"
              alt="BESYS Technologies PLC logo"
              width={48}
              height={48}
              className="mb-2"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
              className="text-center"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: TEAL_PRIMARY,
              }}
            >
              BESYS Support
            </span>
            <span
              className="text-center"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_SM.size,
                lineHeight: BODY_SM.lineHeight,
                fontWeight: BODY_SM.weight,
                letterSpacing: BODY_SM.letterSpacing,
                color: MUTED_GREY_GREEN,
              }}
            >
              Employee Portal
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 transition"
                  style={{
                    backgroundColor: isActive ? LIGHT_TEAL_BG : "transparent",
                    color: isActive ? DARK_GREEN : MUTED_GREY_GREEN,
                  }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span
                    style={{
                      fontFamily: FONT_FAMILY.primary,
                      fontSize: BODY_REGULAR.size,
                      lineHeight: BODY_REGULAR.lineHeight,
                      fontWeight: isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
                      letterSpacing: BODY_REGULAR.letterSpacing,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(47, 217, 196, 0.2)" }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-4 py-3 w-full transition cursor-pointer focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: MUTED_GREY_GREEN,
                backgroundColor: 'rgba(47, 217, 196, 0.08)',
                '--tw-ring-color': TEAL_PRIMARY,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.08)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.25)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.08)';
              }}
            >
              <LogOut className="h-5 w-5" />
              <span
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: FONT_WEIGHT.medium,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                }}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
