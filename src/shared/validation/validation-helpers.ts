import { ZodSchema } from "zod";
import { ValidationError } from "../errors/AppError";

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(
    request: Request,
    schema: ZodSchema<T>,
): Promise<T> {
    try {
        const body = await request.json();
        return schema.parse(body);
    } catch (error: any) {
        throw new ValidationError("Invalid request body", error.issues);
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
    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");

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
            role,
            isActive,
        },
    };
}
