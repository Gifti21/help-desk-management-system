import React from "react";
import { Status, Priority } from "@/types/ticket";
import { STATUS, PRIORITY } from "@/lib/colors";

interface StatusBadgeProps {
  type: "status" | "priority";
  value: Status | Priority | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getStyles = () => {
    const val = (value || "").toString().toUpperCase();
    if (type === "status") {
      switch (val) {
        case "OPEN":
          return {
            backgroundColor: STATUS.open.background,
            color: STATUS.open.text,
            borderColor: STATUS.open.border,
          };
        case "IN_PROGRESS":
          return {
            backgroundColor: STATUS.inProgress.background,
            color: STATUS.inProgress.text,
            borderColor: STATUS.inProgress.border,
          };
        case "RESOLVED":
          return {
            backgroundColor: STATUS.resolved.background,
            color: STATUS.resolved.text,
            borderColor: STATUS.resolved.border,
          };
        case "CLOSED":
          return {
            backgroundColor: STATUS.closed.background,
            color: STATUS.closed.text,
            borderColor: STATUS.closed.border,
          };
        default:
          return {
            backgroundColor: STATUS.closed.background,
            color: STATUS.closed.text,
            borderColor: STATUS.closed.border,
          };
      }
    } else {
      switch (val) {
        case "CRITICAL":
        case "HIGH":
          return {
            backgroundColor: PRIORITY.high.background,
            color: PRIORITY.high.text,
            borderColor: PRIORITY.high.border,
          };
        case "MEDIUM":
          return {
            backgroundColor: PRIORITY.medium.background,
            color: PRIORITY.medium.text,
            borderColor: PRIORITY.medium.border,
          };
        case "LOW":
          return {
            backgroundColor: PRIORITY.low.background,
            color: PRIORITY.low.text,
            borderColor: PRIORITY.low.border,
          };
        default:
          return {
            backgroundColor: STATUS.closed.background,
            color: STATUS.closed.text,
            borderColor: STATUS.closed.border,
          };
      }
    }
  };

  const getExtraFontClass = () => {
    const val = (value || "").toString().toUpperCase();
    if (type === "priority" && val === "CRITICAL") return "font-bold";
    if (type === "priority" && val === "HIGH") return "font-semibold";
    return "";
  };

  return (
    <span
      style={getStyles()}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border uppercase tracking-wider ${getExtraFontClass()}`}
    >
      {(value || "").toString().replace("_", " ")}
    </span>
  );
};
