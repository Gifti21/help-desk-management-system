import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "./category.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";
import { validateBody } from "@/src/shared/validation/validation-helpers";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { ForbiddenError } from "@/src/shared/errors/AppError";

export class CategoryController {
    private service: CategoryService;

    constructor() {
        this.service = new CategoryService();
    }

    async getAll(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();

            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required");
            }

            const categories = await this.service.getAllCategories();
            return successResponse(categories);
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

            const category = await this.service.getCategoryById(id);
            return successResponse(category);
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

            const dto = await validateBody(request, createCategorySchema);
            const category = await this.service.createCategory(dto);

            return successResponse(category, 201);
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

            const dto = await validateBody(request, updateCategorySchema);
            const category = await this.service.updateCategory(id, dto);

            return successResponse(category);
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

            await this.service.deleteCategory(id);
            return successResponse({ message: "Category deleted" });
        } catch (error) {
            return handleApiError(error);
        }
    }
}
