"use client";

import React, { useMemo } from "react";
import { Ticket } from "@/types/ticket";
import { Inbox, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FONT_FAMILY } from "@/lib/fonts";

interface AgentStatsCardsProps {
  tickets: Ticket[];
}

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
  tickets,
}) => {
  const metrics = useMemo(() => {
    const total = tickets.length;

    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;

    const critical = tickets.filter(
      (t) =>
        t.priority === "CRITICAL" &&
        t.status !== "RESOLVED" &&
        t.status !== "CLOSED",
    ).length;

    const completed = tickets.filter(
      (t) => t.status === "RESOLVED" || t.status === "CLOSED",
    ).length;

    return {
      total,
      inProgress,
      critical,
      completed,
    };
  }, [tickets]);

  const cardClass =
    "rounded-xl p-4 border transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Assigned Tickets */}
      <div
        className={`${cardClass} hover:border-cyan-500/40`}
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          fontFamily: FONT_FAMILY.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Assigned Tickets
            </p>

            <h2
              className="mt-1 text-2xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              {metrics.total}
            </h2>
          </div>

          <div className="rounded-xl border border-cyan-900/30 bg-cyan-950/20 p-3 text-cyan-400">
            <Inbox className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div
        className={`${cardClass} hover:border-amber-500/40`}
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          fontFamily: FONT_FAMILY.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              In Progress
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-amber-400">
              {metrics.inProgress}
            </h2>
          </div>

          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-3 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Critical Escalations */}
      <div
        className={`${cardClass} hover:border-rose-500/40`}
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          fontFamily: FONT_FAMILY.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Critical Escalations
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-rose-400">
              {metrics.critical}
            </h2>
          </div>

          <div className="rounded-xl border border-rose-900/30 bg-rose-950/20 p-3 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Closed / Resolved */}
      <div
        className={`${cardClass} hover:border-emerald-500/40`}
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          fontFamily: FONT_FAMILY.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Closed / Resolved
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-emerald-400">
              {metrics.completed}
            </h2>
          </div>

          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-3 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
