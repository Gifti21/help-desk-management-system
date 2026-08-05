"use client";

import { useParams } from "next/navigation";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
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
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar />
      
      <div className="flex-1 lg:ml-[280px]">
        <DashboardHeader userName="Jamie Smith" userInitials="JS" />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <BackLink />
            <TicketHeader ticket={ticket} />
            <TicketDescription ticket={ticket} />
            <TicketComments ticket={ticket} />
          </div>
        </main>
      </div>
    </div>
  );
}
