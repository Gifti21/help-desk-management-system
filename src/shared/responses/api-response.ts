import { NextResponse } from "next/server";

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * Paginated response helper
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
