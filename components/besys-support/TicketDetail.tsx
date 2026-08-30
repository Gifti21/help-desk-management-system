"use client";

import { useParams } from "next/navigation";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ToastProvider } from "@/components/ui/toast";
import { TicketNotFound } from "./TicketDetail/TicketNotFound";
import { BackLink } from "./TicketDetail/BackLink";
import { TicketHeader } from "./TicketDetail/TicketHeader";
import { TicketDescription } from "./TicketDetail/TicketDescription";
import { TicketComments } from "./TicketDetail/TicketComments";
import { mockTickets } from "@/lib/mock-data/tickets";

export function TicketDetail() {
  const params = useParams();
  const ticketId = params.id as string;

  const ticket = mockTickets[ticketId];

  if (!ticket) {
    return <TicketNotFound />;
  }

  return (
    <ToastProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <Sidebar role="EMPLOYEE" />

        <div className="flex-1 lg:pl-[280px] flex flex-col">
          <DashboardHeader
            userName="Jamie Smith"
            userInitials="JS"
            role="EMPLOYEE"
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <BackLink />
              <TicketHeader ticket={ticket} />
              <TicketDescription ticket={ticket} />
              <TicketComments ticket={ticket} />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
