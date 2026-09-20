type ApiUser = {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
};

export function mapCommentToResponse(comment: any) {
    return {
        id: comment.id,
        content: comment.content,
        ticketId: comment.ticketId,
        authorId: comment.authorId,
        author: comment.author,
        createdAt: comment.createdAt,
    };
}

export function getUserDisplayName(
    user?: { firstName: string; lastName: string } | null,
): string {
    if (!user) return "Unknown";
    return `${user.firstName} ${user.lastName}`.trim();
}
