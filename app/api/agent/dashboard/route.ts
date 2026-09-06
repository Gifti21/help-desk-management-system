import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole, handleApiError } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/agent/dashboard - Get agent dashboard data (Agent only)
 * Shows ONLY tickets assigned to the current agent
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        // Get agent's assigned tickets and statistics
        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            recentTickets,
        ] = await Promise.all([
            // Total tickets assigned to this agent
            prisma.ticket.count({
                where: { assigneeId: user.id },
            }),

            // Open tickets assigned to this agent
            prisma.ticket.count({
                where: {
                    assigneeId: user.id,
                    status: "OPEN",
                },
            }),

            // In progress tickets assigned to this agent
            prisma.ticket.count({
                where: {
                    assigneeId: user.id,
                    status: "IN_PROGRESS",
                },
            }),

            // Resolved tickets assigned to this agent
            prisma.ticket.count({
                where: {
                    assigneeId: user.id,
                    status: "RESOLVED",
                },
            }),

            // Closed tickets assigned to this agent
            prisma.ticket.count({
                where: {
                    assigneeId: user.id,
                    status: "CLOSED",
                },
            }),

            // Recent 10 tickets assigned to this agent
            prisma.ticket.findMany({
                where: { assigneeId: user.id },
                take: 10,
                orderBy: { updatedAt: "desc" },
                include: {
                    category: { select: { id: true, name: true } },
                    department: { select: { id: true, name: true } },
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { comments: true },
                    },
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    total: totalTickets,
                    open: openTickets,
                    inProgress: inProgressTickets,
                    resolved: resolvedTickets,
                    closed: closedTickets,
                },
                recentTickets,
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
