import { Ticket, TicketTableRow, Comment } from "@/lib/types/ticket";

export const mockTicketRows: TicketTableRow[] = [
  { id: "TKT-001", title: "Laptop battery not charging", category: "Hardware", priority: "High", status: "Open", lastUpdated: "2 hours ago" },
  { id: "TKT-002", title: "Cannot access shared drive", category: "Network", priority: "Medium", status: "In Progress", lastUpdated: "5 hours ago" },
  { id: "TKT-003", title: "Adobe license expired", category: "Software", priority: "Low", status: "Resolved", lastUpdated: "1 day ago" },
  { id: "TKT-004", title: "VPN connection drops frequently", category: "Network", priority: "High", status: "Open", lastUpdated: "3 hours ago" },
  { id: "TKT-005", title: "Need new email account setup", category: "Account Access", priority: "Medium", status: "In Progress", lastUpdated: "6 hours ago" },
  { id: "TKT-006", title: "Monitor display flickering", category: "Hardware", priority: "Medium", status: "Closed", lastUpdated: "2 days ago" },
  { id: "TKT-007", title: "Excel crashing on save", category: "Software", priority: "High", status: "Open", lastUpdated: "1 hour ago" },
  { id: "TKT-008", title: "Printer not responding", category: "Hardware", priority: "Low", status: "Resolved", lastUpdated: "3 days ago" },
  { id: "TKT-009", title: "Password reset request", category: "Account Access", priority: "Medium", status: "Closed", lastUpdated: "4 days ago" },
  { id: "TKT-010", title: "Slow internet connection", category: "Network", priority: "High", status: "In Progress", lastUpdated: "4 hours ago" },
  { id: "TKT-011", title: "Zoom audio not working", category: "Software", priority: "Medium", status: "Open", lastUpdated: "30 minutes ago" },
  { id: "TKT-012", title: "Keyboard keys stuck", category: "Hardware", priority: "Low", status: "Resolved", lastUpdated: "5 days ago" },
];

const mockComments: Record<string, Comment[]> = {
  "TKT-001": [
    {
      id: "1",
      author: "Support Agent",
      initials: "SA",
      role: "Support Team",
      timestamp: "1 hour ago",
      message: "Thank you for reporting this issue. Have you noticed if the charging indicator LED is lit when you plug in the adapter?",
    },
  ],
  "TKT-002": [
    {
      id: "1",
      author: "IT Admin",
      initials: "IA",
      role: "IT Team",
      timestamp: "4 hours ago",
      message: "We&apos;re investigating the permissions issue. Can you confirm if you can access other network resources?",
    },
    {
      id: "2",
      author: "Jamie Smith",
      initials: "JS",
      role: "Employee",
      timestamp: "3 hours ago",
      message: "Yes, I can access the internet and other shared folders. It&apos;s specifically the main company drive that&apos;s inaccessible.",
    },
  ],
};

export const mockTickets: Record<string, Ticket> = {
  "TKT-001": {
    id: "TKT-001",
    title: "Laptop battery not charging",
    category: "Hardware",
    priority: "High",
    status: "Open",
    description: "My laptop battery is not charging when plugged in. I&apos;ve tried different power outlets and cables but the issue persists. The battery percentage stays at 15% and doesn&apos;t increase.",
    createdAt: "2 hours ago",
    comments: mockComments["TKT-001"] || [],
  },
  "TKT-002": {
    id: "TKT-002",
    title: "Cannot access shared drive",
    category: "Network",
    priority: "Medium",
    status: "In Progress",
    description: "I&apos;m unable to access the company shared drive. I get an &apos;Access Denied&apos; error when trying to connect. This started happening this morning.",
    createdAt: "5 hours ago",
    comments: mockComments["TKT-002"] || [],
  },
};
