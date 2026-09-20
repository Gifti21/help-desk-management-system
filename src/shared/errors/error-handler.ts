import { NextResponse } from "next/server";
import { AppError, UnauthorizedError, ForbiddenError } from "./AppError";
import { ZodError } from "zod";

/**
 * Handle API errors and return appropriate responses
 */
export function handleApiError(error: unknown): NextResponse {
    console.error("API Error:", error);

    // Handle custom AppError
    if (error instanceof AppError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode },
        );
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: "Validation failed",
                details: error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            },
            { status: 400 },
        );
    }

    // Handle standard Error
    if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message.includes("Forbidden") || error.message.includes("Access denied")) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        if (error.message.includes("not found")) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
    }

    // Default to 500
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
    );
}
