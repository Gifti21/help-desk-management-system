"use client";

import { useEffect, useState } from "react";
import type { Ticket } from "@/types/ticket";
import type { User, UserRole } from "@/types/user";

type UseAuthResult = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAgent: boolean;
  isAssignedAgent: (ticket: Pick<Ticket, "assigneeId">) => boolean;
  canManageTicket: (ticket: Pick<Ticket, "assigneeId" | "status">) => boolean;
};

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json();
        const sessionUser = result.user;
        return sessionUser
          ? {
              id: sessionUser.id,
              name: `${sessionUser.firstName} ${sessionUser.lastName}`,
              email: sessionUser.email,
              role: sessionUser.role,
              departmentId: sessionUser.departmentId,
            }
          : null;
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const isAssignedAgent = (ticket: Pick<Ticket, "assigneeId">) => {
    if (!user?.id || !ticket.assigneeId) return false;
    return ticket.assigneeId === user.id;
  };

  const canManageTicket = (ticket: Pick<Ticket, "assigneeId" | "status">) => {
    return isAssignedAgent(ticket) && ticket.status !== "CLOSED";
  };

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    role: user?.role ?? null,
    isAgent: user?.role === "AGENT",
    isAssignedAgent,
    canManageTicket,
  };
}
