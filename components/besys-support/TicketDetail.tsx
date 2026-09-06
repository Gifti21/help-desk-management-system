"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ToastProvider } from "@/components/ui/toast";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import { TicketNotFound } from "./TicketDetail/TicketNotFound";
import { BackLink } from "./TicketDetail/BackLink";
import { TicketHeader } from "./TicketDetail/TicketHeader";
import { TicketDescription } from "./TicketDetail/TicketDescription";
import { TicketComments } from "./TicketDetail/TicketComments";
import type { Ticket, Comment } from "@/lib/types/ticket";

export function TicketDetail() {
  const params = useParams();
  const ticketId = params.id as string;
  const { profile } = useEmployeeProfile();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        const comments: Comment[] = (data.comments || []).map(
          (comment: any) => ({
            id: comment.id,
            author: comment.author
              ? `${comment.author.firstName} ${comment.author.lastName}`
              : "User",
            initials: comment.author
              ? `${comment.author.firstName[0]}${comment.author.lastName[0]}`.toUpperCase()
              : "U",
            role: comment.author?.role || "User",
            timestamp: new Date(comment.createdAt).toLocaleString(),
            message: comment.content,
          }),
        );
        setTicket({
          id: data.id,
          title: data.title,
          category: data.category?.name || "Uncategorized",
          priority: data.priority,
          status: data.status,
          description: data.description,
          createdAt: new Date(data.createdAt).toLocaleString(),
          comments,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadTicket();
  }, [ticketId]);

  if (isLoading || !ticket) {
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
            userName={profile.fullName}
            userInitials={profile.initials}
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
