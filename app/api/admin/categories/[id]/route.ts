import { NextRequest } from "next/server";
import { CategoryController } from "@/src/modules/categories/category.controller";

const controller = new CategoryController();

/**
 * GET /api/admin/categories/[id] - Get single category (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return controller.getById(request, id);
}

/**
 * PATCH /api/admin/categories/[id] - Update category (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return controller.update(request, id);
}

/**
 * DELETE /api/admin/categories/[id] - Delete category (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return controller.delete(request, id);
}
