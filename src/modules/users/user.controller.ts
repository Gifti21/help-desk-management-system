import { NextRequest, NextResponse } from "next/server";
import { UserService } from "./user.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";
import { validateBody, parseQueryParams } from "@/src/shared/validation/validation-helpers";
import { createUserSchema, updateUserSchema } from "./user.validation";
import { ForbiddenError } from "@/src/shared/errors/AppError";

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    async getAll(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const { filters } = parseQueryParams(request.url);
            const users = await this.service.getAllUsers({
                role: filters.role,
                departmentId: filters.departmentId,
                isActive: filters.isActive === "true" ? true : filters.isActive === "false" ? false : undefined,
            });

            return successResponse(users);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async getById(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const foundUser = await this.service.getUserById(id);
            return successResponse(foundUser);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async create(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const dto = await validateBody(request, createUserSchema);
            const newUser = await this.service.createUser(dto);

            return successResponse(newUser, 201);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async update(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const dto = await validateBody(request, updateUserSchema);
            const updatedUser = await this.service.updateUser(id, dto);

            return successResponse(updatedUser);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async delete(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            await this.service.deleteUser(id);
            return successResponse({ message: "User deleted" });
        } catch (error) {
            return handleApiError(error);
        }
    }
}
