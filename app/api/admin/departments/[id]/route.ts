import { NextRequest } from "next/server";
import { DepartmentController } from "@/src/modules/departments/department.controller";

const controller = new DepartmentController();

/**
 * GET /api/admin/departments/[id] - Get a specific department (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return controller.getById(request, id);
}

/**
 * PATCH /api/admin/departments/[id] - Update a department (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return controller.update(request, id);
}

/**
 * DELETE /api/admin/departments/[id] - Delete a department (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return controller.delete(request, id);
}
