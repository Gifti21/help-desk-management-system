export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type UserRole = 'EMPLOYEE' | 'AGENT' | 'ADMIN' | 'REQUESTER' | 'USER';

// Type Aliases for Backward Compatibility across legacy components
export type TicketPriority = Priority;
export type TicketStatus = Status;
export type TicketSortField = 'createdAt' | 'priority' | 'status' | 'title' | 'id';

export interface TimelineEntry {
  id: string;
  timestamp: string;
  title?: string;
  description: string;
  type?: 'CREATED' | 'STATUS' | 'PRIORITY' | 'COMMENT' | 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'ASSIGNMENT' | string;
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
  
  // Supports both object references (from API mappers) and string fallbacks
  category: string | TicketReferenceObj;
  department?: string | TicketReferenceObj;
  
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

// ==========================================
// Notifications Types
// ==========================================

export type NotificationType = 'ASSIGNMENT' | 'COMMENT' | 'STATUS_CHANGE' | 'PRIORITY_CHANGE';

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