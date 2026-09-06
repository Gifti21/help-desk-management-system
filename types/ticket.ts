export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type UserRole = "EMPLOYEE" | "AGENT" | "ADMIN" | "REQUESTER" | "USER";

// Standardization Constants for Departments and Categories
export const DEPARTMENTS = [
  "IT Support",
  "Human Resources",
  "Finance",
  "Operations",
  "Legal & Compliance",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const CATEGORIES = [
  "Software",
  "Hardware Failure",
  "Network / Connectivity",
  "Access & Credentials",
  "Billing & Finance",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Type Aliases for Backward Compatibility across legacy components
export type TicketPriority = Priority;
export type TicketStatus = Status;
export type TicketSortField =
  | "createdAt"
  | "priority"
  | "status"
  | "title"
  | "id";

export interface TimelineEntry {
  id: string;
  timestamp: string;
  title?: string;
  description: string;
  type?:
    | "CREATED"
    | "STATUS"
    | "PRIORITY"
    | "COMMENT"
    | "STATUS_CHANGE"
    | "PRIORITY_CHANGE"
    | "ASSIGNMENT"
    | string;
  actor?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: UserRole | string;
  timestamp: string;
  content: string;
  ticketId?: string;
  authorId?: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface TicketReferenceObj {
  id: string;
  name: string;
}

export interface UserRef {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export type TicketUser = UserRef;

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;

  // Supports both exact string dynamic definitions, standard category objects, and generic string fallbacks
  category: Category | string | TicketReferenceObj;
  department?: Department | string | TicketReferenceObj;

  priority: Priority;
  status: Status;

  creatorName: string;
  creatorEmail?: string;

  assigneeId?: string | null;
  assigneeName?: string;
  assignee?: UserRef | null;
  requester?: UserRef;

  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  dueAt?: string | null;

  comments: Comment[];
  commentCount?: number;
  history?: TimelineEntry[];
}

// Helper utility to safely extract plain strings from flexible fields
export function getReferenceName(
  field?: string | TicketReferenceObj | null,
): string {
  if (!field) return "";
  return typeof field === "string" ? field : field.name;
}

// Known lists for validation check
const TECHNICAL_CATEGORIES = [
  "Software",
  "Hardware",
  "Hardware Failure",
  "Network",
  "Network / Connectivity",
  "Infrastructure",
  "Access & Credentials",
  "Billing & Finance",
];

const KNOWN_DEPARTMENTS = [
  "IT Support",
  "Human Resources",
  "Finance",
  "Operations",
  "Legal & Compliance",
];

/**
 * Intelligently maps ticket context (raw fields and title) to a valid Department.
 */
function deriveDepartment(
  rawDept: string,
  rawCat: string,
  title: string = "",
): Department {
  // Check if rawDept directly matches a known department first
  const directMatch = KNOWN_DEPARTMENTS.find(
    (d) => d.toLowerCase() === rawDept.toLowerCase(),
  );
  if (
    directMatch &&
    !TECHNICAL_CATEGORIES.some(
      (cat) => cat.toLowerCase() === rawDept.toLowerCase(),
    )
  ) {
    return directMatch as Department;
  }

  const text = `${rawDept} ${rawCat} ${title}`.toLowerCase();

  if (
    text.includes("hr") ||
    text.includes("human resource") ||
    text.includes("onboarding") ||
    text.includes("payroll")
  ) {
    return "Human Resources";
  }
  if (
    text.includes("billing") ||
    text.includes("finance") ||
    text.includes("invoice") ||
    text.includes("payment") ||
    text.includes("license")
  ) {
    return "Finance";
  }
  if (
    text.includes("operation") ||
    text.includes("logistics") ||
    text.includes("facility") ||
    text.includes("printer") ||
    text.includes("monitor") ||
    text.includes("setup")
  ) {
    return "Operations";
  }
  if (
    text.includes("legal") ||
    text.includes("compliance") ||
    text.includes("policy") ||
    text.includes("contract")
  ) {
    return "Legal & Compliance";
  }

  return "IT Support";
}

/**
 * Normalizes legacy or misaligned ticket data so categories and departments stay strictly separated.
 */
export function formatTicketData(ticket: Ticket): Ticket {
  const rawDept = getReferenceName(ticket.department);
  const rawCat = getReferenceName(ticket.category);

  // 1. Check if a technical category was accidentally saved in the department field
  const isCategoryInDeptField = TECHNICAL_CATEGORIES.some(
    (cat) => cat.toLowerCase() === rawDept.toLowerCase(),
  );

  // 2. Check if a department name (e.g. "IT Support") was saved in the category field
  const isDeptInCategoryField = KNOWN_DEPARTMENTS.some(
    (dept) => dept.toLowerCase() === rawCat.toLowerCase(),
  );

  let cleanCategory = rawCat;

  if (isCategoryInDeptField) {
    cleanCategory = rawDept;
  } else if (isDeptInCategoryField || !rawCat) {
    cleanCategory = "Software";
  }

  const cleanDepartment = deriveDepartment(
    rawDept,
    cleanCategory,
    ticket.title,
  );

  return {
    ...ticket,
    department: cleanDepartment,
    category: cleanCategory || "Software",
  };
}

// ==========================================
// Notifications Types
// ==========================================

export type NotificationType =
  | "ASSIGNMENT"
  | "COMMENT"
  | "STATUS_CHANGE"
  | "PRIORITY_CHANGE";

export interface NotificationItem {
  id: string;
  ticketId: string;
  ticketNumber: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
}
