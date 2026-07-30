"use client";

import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Status, Priority } from "@/types/ticket";

interface TicketStatusBadgeProps {
  type: "status" | "priority";
  value: Status | Priority | string;
  size?: "sm" | "md";
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ type, value }) => {
  return <StatusBadge type={type} value={value} />;
};