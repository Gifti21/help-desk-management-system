"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
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

        <div className="flex-1 lg:pl-64 flex flex-col">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </TicketProvider>
  );
}
