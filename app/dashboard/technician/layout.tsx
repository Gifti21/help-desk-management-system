"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { TicketProvider } from "@/context/TicketContext";
import { PAGE_BACKGROUND } from "@/lib/colors";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TicketProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <Sidebar role="TECHNICIAN" />

        <div className="flex-1 lg:pl-64 flex flex-col pb-[52px]">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40">
          <Footer />
        </div>
      </div>
    </TicketProvider>
  );
}
