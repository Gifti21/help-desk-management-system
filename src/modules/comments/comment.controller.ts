import { NextRequest, NextResponse } from "next/server";
import { CommentService } from "./comment.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";
import { validateBody } from "@/src/shared/validation/validation-helpers";
import { createCommentSchema } from "./comment.validation";

export class CommentController {
    private service: CommentService;

    constructor() {
        this.service = new CommentService();
    }

    async getByTicketId(
        request: NextRequest,
        ticketId: string,
    ): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const comments = await this.service.getCommentsByTicketId(ticketId, user);

            return successResponse(comments);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async create(
        request: NextRequest,
        ticketId: string,
    ): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const body = await validateBody(request, createCommentSchema);

            const comment = await this.service.createComment(
                {
                    content: body.content,
                    ticketId,
                    authorId: user.id,
                },
                user,
            );

            return successResponse(comment, 201);
        } catch (error) {
            return handleApiError(error);
        }
    }
}
