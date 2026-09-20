import { NextRequest } from "next/server";
import { CategoryController } from "@/src/modules/categories/category.controller";

const controller = new CategoryController();

/**
 * GET /api/admin/categories - Get all categories (Admin only)
 */
export async function GET(request: NextRequest) {
    return controller.getAll(request);
}

/**
 * POST /api/admin/categories - Create a new category (Admin only)
 */
export async function POST(request: NextRequest) {
    return controller.create(request);
}
