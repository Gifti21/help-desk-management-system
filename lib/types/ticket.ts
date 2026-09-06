export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "Open" | "In Progress" | "Resolved" | "Closed";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "Low" | "Medium" | "High";
export type TicketCategory = "Hardware" | "Software" | "Network" | "Account Access" | "Other" | string;

export interface Comment {
  id: string;
  author: string;
  initials: string;
  role: string;
  timestamp: string;
  message: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  createdAt: string;
  comments: Comment[];
}

export interface TicketTableRow {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  lastUpdated: string;
}
