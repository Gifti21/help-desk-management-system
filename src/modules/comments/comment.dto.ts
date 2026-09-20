export interface CreateCommentDto {
    content: string;
    ticketId: string;
    authorId: string;
}

export interface UpdateCommentDto {
    content?: string;
}
