import { NextRequest } from "next/server";
import { requireAuth, requireRole, handleApiError } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import {
    parseQueryParams,
    buildTicketWhereClause,
    standardTicketInclude,
    paginatedResponse,
    successResponse,
} from "@/lib/api-helpers";

/**
 * GET /api/agent/tickets - Get agent's assigned tickets (Agent only)
 * Shows ONLY tickets where assigneeId == currentUserId
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        const { page, pageSize, paginated, filters } = parseQueryParams(
            request.url,
        );

        // Build where clause - AGENT FILTER: assigneeId == currentUserId
        const where = buildTicketWhereClause({
            ...filters,
            assigneeId: user.id, // Override with current user's ID
        });

        // Fetch agent's assigned tickets
        const [tickets, total] = await Promise.all([
            prisma.ticket.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                include: standardTicketInclude,
                ...(pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
            }),
            pageSize ? prisma.ticket.count({ where }) : Promise.resolve(0),
        ]);

        return paginated
            ? paginatedResponse(tickets, total, page, pageSize!)
            : successResponse(tickets);
    } catch (error) {
        return handleApiError(error);
    }
}
