import type { Comment } from '@/types/comment';
import type { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';

type ApiUser = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
};

type ApiTicket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: { id: string; name: string };
  department: { id: string; name: string };
  requester: ApiUser;
  assignee?: ApiUser | null;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  comments?: Array<{
    id: string;
    content: string;
    ticketId: string;
    authorId: string;
    author: ApiUser;
    createdAt: string;
  }>;
};

export function mapApiTicket(raw: ApiTicket): Ticket {
  return {
    id: raw.id,
    ticketNumber: raw.id.startsWith('TICK-') ? raw.id : `TICK-${raw.id}`,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    priority: raw.priority,
    category: raw.category,
    department: raw.department,
    requester: raw.requester,
    creatorName: raw.requester ? `${raw.requester.firstName} ${raw.requester.lastName}`.trim() : 'Employee',
    creatorEmail: raw.requester?.email,
    assignee: raw.assignee ?? null,
    assigneeId: raw.assigneeId ?? raw.assignee?.id ?? null,
    assigneeName: raw.assignee ? `${raw.assignee.firstName} ${raw.assignee.lastName}`.trim() : undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    closedAt: raw.closedAt ?? null,
    comments: raw.comments?.map((c) => ({
      id: c.id,
      authorName: `${c.author.firstName} ${c.author.lastName}`.trim(),
      authorRole: 'EMPLOYEE',
      timestamp: c.createdAt,
      content: c.content,
    })) ?? [],
    commentCount: raw.comments?.length ?? 0,
  };
}

export function mapApiComment(raw: {
  id: string;
  content: string;
  ticketId: string;
  authorId: string;
  author: ApiUser;
  createdAt: string;
}): Comment {
  return {
    id: raw.id,
    content: raw.content,
    ticketId: raw.ticketId,
    authorId: raw.authorId,
    author: raw.author,
    createdAt: raw.createdAt,
  };
}

export function getUserDisplayName(user?: { firstName: string; lastName: string } | null): string {
  if (!user) return 'Unknown';
  return `${user.firstName} ${user.lastName}`.trim();
}
