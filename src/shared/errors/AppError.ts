/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Authentication required") {
        super(message, 401, "UNAUTHORIZED");
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access denied") {
        super(message, 403, "FORBIDDEN");
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export class ValidationError extends AppError {
    constructor(message: string = "Validation failed", public details?: any) {
        super(message, 400, "VALIDATION_ERROR");
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "Resource conflict") {
        super(message, 409, "CONFLICT");
    }
}
