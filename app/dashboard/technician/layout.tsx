import React from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { TicketProvider } from "@/context/TicketContext";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { getSessionUser } from "@/lib/session";

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== "AGENT") {
    redirect("/login");
  }

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
