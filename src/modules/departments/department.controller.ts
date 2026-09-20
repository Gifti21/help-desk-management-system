import { NextRequest, NextResponse } from "next/server";
import { DepartmentService } from "./department.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";
import { validateBody } from "@/src/shared/validation/validation-helpers";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation";
import { ForbiddenError } from "@/src/shared/errors/AppError";

export class DepartmentController {
    private service: DepartmentService;

    constructor() {
        this.service = new DepartmentService();
    }

    async getAll(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const departments = await this.service.getAllDepartments();
            return successResponse(departments);
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

            const department = await this.service.getDepartmentById(id);
            return successResponse(department);
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

            const dto = await validateBody(request, createDepartmentSchema);
            const department = await this.service.createDepartment(dto);

            return successResponse(department, 201);
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

            const dto = await validateBody(request, updateDepartmentSchema);
            const department = await this.service.updateDepartment(id, dto);

            return successResponse(department);
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

            await this.service.deleteDepartment(id);
            return successResponse({ message: "Department deleted" });
        } catch (error) {
            return handleApiError(error);
        }
    }
}
