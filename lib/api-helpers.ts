import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

/**
 * API Helper Utilities
 * Common patterns for API route handlers
 */

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(
    request: Request,
    schema: ZodSchema<T>,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { data, error: null };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                data: null,
                error: NextResponse.json(
                    {
                        error: "Validation failed",
                        details: error.issues.map((e) => ({
                            path: e.path.join("."),
                            message: e.message,
                        })),
                    },
                    { status: 400 },
                ),
            };
        }
        return {
            data: null,
            error: NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 },
            ),
        };
    }
}

/**
 * Parse query parameters with pagination support
 */
export function parseQueryParams(url: string) {
    const { searchParams } = new URL(url);

    // Pagination
    const requestedPage = Number(searchParams.get("page"));
    const requestedPageSize = Number(searchParams.get("pageSize"));
    const paginated = Number.isFinite(requestedPage) && requestedPage > 0;
    const page = paginated ? Math.floor(requestedPage) : 1;
    const pageSize = paginated
        ? Math.min(Math.max(Math.floor(requestedPageSize) || 25, 1), 100)
        : undefined;

    // Filters
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const departmentId = searchParams.get("departmentId");
    const categoryId = searchParams.get("categoryId");
    const assigneeId = searchParams.get("assigneeId");

    return {
        page,
        pageSize,
        paginated,
        filters: {
            status,
            priority,
            search,
            departmentId,
            categoryId,
            assigneeId,
        },
    };
}

/**
 * Build pagination response
 */
export function paginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
) {
    return NextResponse.json({
        success: true,
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    });
}

/**
 * Success response
 */
export function successResponse<T>(data: T, status: number = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Error response
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * Build Prisma where clause for ticket filtering
 */
export function buildTicketWhereClause(filters: {
    status?: string | null;
    priority?: string | null;
    search?: string | null;
    departmentId?: string | null;
    categoryId?: string | null;
    assigneeId?: string | null;
    requesterId?: string; // For role-based filtering
}) {
    const where: any = {};

    // Role-based filter (must be set by caller)
    if (filters.requesterId) {
        where.requesterId = filters.requesterId;
    }
    if (filters.assigneeId) {
        where.assigneeId = filters.assigneeId;
    }

    // Status filter
    if (
        filters.status &&
        filters.status !== "all" &&
        ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(
            filters.status.toUpperCase(),
        )
    ) {
        where.status = filters.status.toUpperCase();
    }

    // Priority filter
    if (
        filters.priority &&
        ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(filters.priority.toUpperCase())
    ) {
        where.priority = filters.priority.toUpperCase();
    }

    // Department filter
    if (filters.departmentId) {
        where.departmentId = filters.departmentId;
    }

    // Category filter
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    // Search filter (title, ID, or category name)
    if (filters.search?.trim()) {
        where.OR = [
            { title: { contains: filters.search.trim(), mode: "insensitive" } },
            { id: { contains: filters.search.trim(), mode: "insensitive" } },
            {
                category: {
                    name: { contains: filters.search.trim(), mode: "insensitive" },
                },
            },
        ];
    }

    return where;
}

/**
 * Standard ticket include clause
 */
export const standardTicketInclude = {
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
    assignee: {
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
};
