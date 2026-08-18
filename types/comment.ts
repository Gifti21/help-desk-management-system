import type { TicketUser } from '@/types/ticket';

export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  author: TicketUser;
  authorId: string;
  createdAt: string;
}

export interface CreateCommentPayload {
  content: string;
}
