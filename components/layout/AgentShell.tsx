"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PAGE_BACKGROUND } from "@/lib/colors";

export function AgentShell({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
