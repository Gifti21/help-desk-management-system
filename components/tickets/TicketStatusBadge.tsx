"use client";

import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Status, Priority } from "@/types/ticket";
import { STATUS, PRIORITY } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY } from "@/lib/fonts";

interface TicketStatusBadgeProps {
  type: "status" | "priority";
  value: Status | Priority | string;
  size?: "sm" | "md";
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ type, value }) => {
  const normalizedValue = String(value).toLowerCase().replace(/\s+/g, "");

  let customStyle = {
    fontFamily: FONT_FAMILY.primary,
    fontSize: BODY_SM.size,
    fontWeight: BODY_SM.weight,
  };

  if (type === "status") {
    const statusMap: Record<string, keyof typeof STATUS> = {
      open: "open",
      inprogress: "inProgress",
      resolved: "resolved",
      closed: "closed",
    };
    const matchedKey = statusMap[normalizedValue] || "open";
    const token = STATUS[matchedKey];
    customStyle = {
      ...customStyle,
      backgroundColor: token.background,
      color: token.text,
      borderColor: token.border,
    } as any;
  } else if (type === "priority") {
    const priorityMap: Record<string, keyof typeof PRIORITY> = {
      low: "low",
      medium: "medium",
      high: "high",
    };
    const matchedKey = priorityMap[normalizedValue] || "low";
    const token = PRIORITY[matchedKey];
    customStyle = {
      ...customStyle,
      backgroundColor: token.background,
      color: token.text,
      borderColor: token.border,
    } as any;
  }

  return (
    <span style={customStyle} className="inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs">
      <StatusBadge type={type} value={value} />
    </span>
  );
};