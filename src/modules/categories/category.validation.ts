import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100).trim(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100).trim().optional(),
});
